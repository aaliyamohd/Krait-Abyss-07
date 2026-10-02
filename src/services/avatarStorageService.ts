import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "avatars";

// In-memory RAM cache for synchronous UI updates
const avatarMemoryCache = new Map<string, string>();

export const avatarStorageService = {
  /**
   * Process uploaded image file into a crystal-clear 200x200 JPEG base64 string (~15KB).
   * Validates MIME types and file size (max 2MB).
   */
  async compressImage(file: File, maxDim = 200, quality = 0.85): Promise<string> {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.");
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File size exceeds 2MB limit.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawBase64 = e.target?.result as string;
        if (!rawBase64) {
          resolve("");
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const width = img.width || maxDim;
            const height = img.height || maxDim;

            const minDim = Math.min(width, height);
            const cropX = (width - minDim) / 2;
            const cropY = (height - minDim) / 2;

            canvas.width = maxDim;
            canvas.height = maxDim;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(rawBase64);
              return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(img, cropX, cropY, minDim, minDim, 0, 0, maxDim, maxDim);

            const compressed = canvas.toDataURL("image/jpeg", quality);
            resolve(compressed || rawBase64);
          } catch (err) {
            resolve(rawBase64);
          }
        };
        img.onerror = () => reject(new Error("Failed to process avatar image."));
        img.src = rawBase64;
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Save avatar to Supabase Storage bucket 'avatars' under path `{userId}/avatar.jpg`
   * and update `avatar_url` in the Supabase `profiles` table.
   */
  async saveAvatar(userId: string, imageDataUrl: string): Promise<boolean> {
    if (!userId) return false;

    if (!imageDataUrl) {
      avatarMemoryCache.delete(userId);
      try {
        await supabase.storage.from(BUCKET_NAME).remove([`${userId}/avatar.jpg`]);
        await supabase
          .from("profiles")
          .update({ avatar_url: "", updated_at: new Date().toISOString() })
          .eq("id", userId);
      } catch {
        // Ignore
      }
      return true;
    }

    avatarMemoryCache.set(userId, imageDataUrl);

    try {
      // Convert base64 data URL to Blob for Supabase Storage upload
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const filePath = `${userId}/avatar.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.warn("Supabase Storage upload warning:", uploadError);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl || imageDataUrl;

      // Update user profile record with avatar URL
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("avatar_changed", { detail: { userId, avatarUrl: publicUrl } }),
        );
      }
      return true;
    } catch (err) {
      console.warn("Error uploading avatar to Supabase Storage:", err);
      return false;
    }
  },

  /**
   * Fetch avatar URL from RAM cache or Supabase Storage / Profile URL.
   */
  async getAvatar(userId: string): Promise<string | null> {
    if (!userId) return null;

    if (avatarMemoryCache.has(userId)) {
      return avatarMemoryCache.get(userId) || null;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (profile?.avatar_url) {
        avatarMemoryCache.set(userId, profile.avatar_url);
        return profile.avatar_url;
      }

      // Check public URL in avatars storage bucket
      const filePath = `${userId}/avatar.jpg`;
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        avatarMemoryCache.set(userId, publicUrlData.publicUrl);
        return publicUrlData.publicUrl;
      }

      return null;
    } catch {
      return null;
    }
  },

  /**
   * Delete stored avatar for userId.
   */
  async deleteAvatar(userId: string): Promise<boolean> {
    return this.saveAvatar(userId, "");
  },
};
