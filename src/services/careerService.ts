import { supabase } from "@/integrations/supabase/client";

export interface CareerApplication {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  role_applied: string;
  portfolio_url?: string | null;
  cover_note?: string | null;
  resume_url?: string | null;
  created_at: string;
}

const STORAGE_KEY = "krait_career_applications";

// Initial mock application for admin dashboard demonstration if list is empty
const INITIAL_APPLICATIONS: CareerApplication[] = [
  {
    id: "app-889102",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    location: "Hyderabad, India",
    role_applied: "AI / ML & Agent Engineer",
    portfolio_url: "https://github.com/rahulsharma-ai",
    cover_note: "Skills: Python, LangChain, RAG, n8n\nExperience: 2 years building multi-agent systems\nWhy Krait Abyss: Passionate about production agent pipelines.",
    resume_url: "Rahul_Sharma_Resume.pdf",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

let memoryStore: CareerApplication[] = [...INITIAL_APPLICATIONS];

export const careerService = {
  getApplications(): CareerApplication[] {
    if (typeof window === "undefined") {
      return memoryStore;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
        return INITIAL_APPLICATIONS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  async getApplicationsAsync(): Promise<CareerApplication[]> {
    try {
      const { data, error } = await supabase
        .from("career_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: CareerApplication[] = data.map((item: any) => ({
          id: item.id || `app-${Date.now()}`,
          full_name: item.full_name,
          email: item.email,
          phone: item.phone,
          location: item.location,
          role_applied: item.role_applied,
          portfolio_url: item.portfolio_url,
          cover_note: item.cover_note,
          resume_url: item.resume_url,
          created_at: item.created_at || new Date().toISOString(),
        }));
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch {
      // Fallback to local storage
    }
    return this.getApplications();
  },

  async submitApplication(appData: Omit<CareerApplication, "id" | "created_at">): Promise<{ success: boolean; id?: string; message?: string }> {
    const id = `app-${Date.now()}`;
    const newApp: CareerApplication = {
      ...appData,
      id,
      created_at: new Date().toISOString(),
    };

    // 1. Save to local storage & memory store
    const current = this.getApplications();
    const updated = [newApp, ...current];
    memoryStore = updated;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    // 2. Save to Supabase (if available)
    try {
      await supabase.from("career_applications").insert({
        full_name: newApp.full_name,
        email: newApp.email,
        phone: newApp.phone || null,
        location: newApp.location || null,
        role_applied: newApp.role_applied,
        portfolio_url: newApp.portfolio_url || null,
        cover_note: newApp.cover_note || null,
        resume_url: newApp.resume_url || null,
      });
    } catch {
      // Ignore Supabase network errors for fallback
    }

    // 3. Sync memory state
    return { success: true, id };

    return { success: true, id };
  },
};
