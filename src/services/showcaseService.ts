import { supabase } from "@/integrations/supabase/client";
import { INITIAL_WORK_PROJECTS } from "@/data/work";

export interface WorkShowcaseItem {
  id: string;
  title: string;
  clientName: string;
  category: string;
  description: string;
  problem?: string;
  whatWasBuilt?: string;
  keyFeatures?: string[];
  frontendTech?: string[];
  backendTech?: string[];
  databaseTech?: string[];
  apiIntegrations?: string[];
  aiAutomation?: string[];
  deploymentPlatform?: string[];
  mainFunctionality?: string;
  fullDetails?: string;
  imageUrl?: string;
  liveUrl?: string;
  techStack: string[];
  completedDate: string;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  metrics?: Array<{ label: string; val: string }>;
  highlights?: string[];
}

// Clean legacy localStorage keys
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("krait_work_showcase_v1");
  } catch {
    // Ignore
  }
}

let inMemoryShowcase: WorkShowcaseItem[] = (INITIAL_WORK_PROJECTS as any[]).map((item) => ({
  ...item,
  updatedAt: item.createdAt || new Date().toISOString(),
}));

export const showcaseService = {
  async getShowcaseItemsAsync(): Promise<WorkShowcaseItem[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error || !data) {
        return inMemoryShowcase;
      }

      const mapped: WorkShowcaseItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.name || "Project Showcase",
        clientName: item.client_name || "Confidential Client",
        category: item.category || "Development",
        description: item.description || "",
        fullDetails: item.what_we_did || item.description || "",
        imageUrl: item.image_url || "",
        liveUrl: item.project_link || "",
        techStack: Array.isArray(item.technologies) ? item.technologies : [],
        completedDate: item.completion_date || item.created_at || new Date().toISOString(),
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
        isFeatured: item.published,
      }));

      inMemoryShowcase = mapped;
      return mapped;
    } catch {
      return inMemoryShowcase;
    }
  },

  getShowcaseItems(): WorkShowcaseItem[] {
    return [...inMemoryShowcase].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async addShowcaseItem(
    item: Omit<WorkShowcaseItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<WorkShowcaseItem> {
    const now = new Date().toISOString();
    const newItem: WorkShowcaseItem = {
      ...item,
      id: `showcase-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const payload: any = {
        name: item.title,
        client_name: item.clientName,
        category: item.category,
        description: item.description,
        what_we_did: item.fullDetails || item.description,
        technologies: item.techStack,
        image_url: item.imageUrl || null,
        project_link: item.liveUrl || null,
        completion_date: item.completedDate ? new Date(item.completedDate).toISOString() : now,
        status: "completed",
        published: true,
        sort_order: 0,
      };

      const { data } = await supabase
        .from("projects")
        .insert(payload as any)
        .select()
        .single();

      if (data) {
        newItem.id = data.id;
      }
    } catch (err) {
      console.warn("Failed to insert showcase item into Supabase:", err);
    }

    inMemoryShowcase.unshift(newItem);
    return newItem;
  },

  async updateShowcaseItem(
    id: string,
    updates: Partial<WorkShowcaseItem>,
  ): Promise<WorkShowcaseItem | null> {
    const idx = inMemoryShowcase.findIndex((i) => i.id === id);
    const now = new Date().toISOString();

    try {
      const payload: any = { updated_at: now };
      if (updates.title !== undefined) payload.name = updates.title;
      if (updates.clientName !== undefined) payload.client_name = updates.clientName;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.fullDetails !== undefined) payload.what_we_did = updates.fullDetails;
      if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
      if (updates.liveUrl !== undefined) payload.project_link = updates.liveUrl;
      if (updates.techStack !== undefined) payload.technologies = updates.techStack;

      await supabase
        .from("projects")
        .update(payload as any)
        .eq("id", id);
    } catch (err) {
      console.warn("Failed to update showcase item in Supabase:", err);
    }

    if (idx !== -1 && inMemoryShowcase[idx]) {
      const existing = inMemoryShowcase[idx]!;
      const updatedItem: WorkShowcaseItem = {
        id: existing.id,
        title: updates.title ?? existing.title,
        clientName: updates.clientName ?? existing.clientName,
        category: updates.category ?? existing.category,
        description: updates.description ?? existing.description,
        fullDetails: updates.fullDetails ?? existing.fullDetails ?? "",
        imageUrl: updates.imageUrl ?? existing.imageUrl ?? "",
        liveUrl: updates.liveUrl ?? existing.liveUrl ?? "",
        techStack: updates.techStack ?? existing.techStack,
        completedDate: updates.completedDate ?? existing.completedDate,
        createdAt: existing.createdAt,
        updatedAt: now,
        isFeatured: updates.isFeatured ?? existing.isFeatured ?? false,
      };
      inMemoryShowcase[idx] = updatedItem;
      return updatedItem;
    }
    return null;
  },

  async deleteShowcaseItem(id: string): Promise<boolean> {
    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch {
      // Ignore
    }

    const filtered = inMemoryShowcase.filter((i) => i.id !== id);
    const changed = filtered.length !== inMemoryShowcase.length;
    inMemoryShowcase = filtered;
    return changed;
  },
};
