import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "./authService";

export type ProjectStatus =
  | "REQUESTED"
  | "UNDER REVIEW"
  | "APPROVED"
  | "IN PROGRESS"
  | "IN REVIEW"
  | "COMPLETED"
  | "CANCELLED";

export interface ProjectRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  serviceType: string;
  projectDescription: string;
  company?: string;
  phone?: string;
  budgetRange?: string;
  timeline?: string;
  relevantLinks?: string;
  additionalRequirements?: string;
  assignedTeamMember?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// Clean legacy localStorage project keys
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("krait_user_projects_v1");
    localStorage.removeItem("krait_user_projects_v2");
    localStorage.removeItem("krait_user_projects");
  } catch {
    // Ignore
  }
}

let inMemoryProjects: ProjectRequest[] = [];

export const projectService = {
  async getUserProjectsAsync(user: UserProfile): Promise<ProjectRequest[]> {
    if (!user || !user.id) return [];

    try {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });

      if (user.role !== "ADMIN") {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (error || !data) {
        return inMemoryProjects.filter((p) => user.role === "ADMIN" || p.userId === user.id);
      }

      const mapped: ProjectRequest[] = data.map((item: any) => ({
        id: item.id,
        userId: item.user_id || user.id,
        userEmail: item.user_email || user.email,
        userName: item.user_name || user.fullName,
        serviceType: item.service_type || item.category || "Custom Project",
        projectDescription: item.project_description || item.description || "",
        company: item.company || item.client_name || "",
        phone: item.phone || "",
        budgetRange: item.budget_range || "Negotiable",
        timeline: item.timeline || "Flexible",
        relevantLinks: item.relevant_links || item.project_link || "",
        additionalRequirements: item.additional_requirements || item.what_we_did || "",
        assignedTeamMember: item.assigned_team_member || "",
        status: (item.status as ProjectStatus) || "REQUESTED",
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));

      inMemoryProjects = mapped;
      return mapped;
    } catch {
      return inMemoryProjects.filter((p) => user.role === "ADMIN" || p.userId === user.id);
    }
  },

  getUserProjects(user: UserProfile): ProjectRequest[] {
    if (!user) return [];
    if (user.role === "ADMIN") return inMemoryProjects;
    return inMemoryProjects.filter((p) => p.userId === user.id || p.userEmail === user.email);
  },

  async getProjectById(projectId: string, user: UserProfile): Promise<ProjectRequest | null> {
    if (!user || !projectId) return null;

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      if (error || !data) return null;

      const item = data as any;

      if (user.role !== "ADMIN" && item.user_id !== user.id) {
        console.warn(
          `[SECURITY ALERT] Unauthorized access attempt on project ${projectId} by user ${user.id}`,
        );
        return null;
      }

      return {
        id: item.id,
        userId: item.user_id || user.id,
        userEmail: item.user_email || user.email,
        userName: item.user_name || user.fullName,
        serviceType: item.service_type || "Custom Project",
        projectDescription: item.project_description || item.description || "",
        company: item.company || "",
        phone: item.phone || "",
        budgetRange: item.budget_range || "Negotiable",
        timeline: item.timeline || "Flexible",
        relevantLinks: item.relevant_links || "",
        additionalRequirements: item.additional_requirements || "",
        assignedTeamMember: item.assigned_team_member || "",
        status: (item.status as ProjectStatus) || "REQUESTED",
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  async createProjectRequest(
    user: UserProfile,
    input: {
      serviceType: string;
      projectDescription: string;
      company?: string;
      phone?: string;
      budgetRange?: string;
      timeline?: string;
      relevantLinks?: string;
      additionalRequirements?: string;
    },
  ): Promise<ProjectRequest> {
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newProject: ProjectRequest = {
      id: newId,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      serviceType: input.serviceType,
      projectDescription: input.projectDescription,
      company: input.company || user.company || "",
      phone: input.phone || user.phone || "",
      budgetRange: input.budgetRange || "Negotiable",
      timeline: input.timeline || "Flexible",
      relevantLinks: input.relevantLinks || "",
      additionalRequirements: input.additionalRequirements || "",
      status: "REQUESTED",
      createdAt: now,
      updatedAt: now,
    };

    try {
      const payload: any = {
        name: `${input.serviceType} Project`,
        user_id: user.id,
        user_email: user.email,
        user_name: user.fullName,
        service_type: input.serviceType,
        project_description: input.projectDescription,
        company: input.company || user.company || null,
        phone: input.phone || user.phone || null,
        budget_range: input.budgetRange || "Negotiable",
        timeline: input.timeline || "Flexible",
        relevant_links: input.relevantLinks || null,
        additional_requirements: input.additionalRequirements || null,
        status: "REQUESTED",
        published: false,
      };

      const { data } = await supabase
        .from("projects")
        .insert(payload as any)
        .select()
        .single();

      if (data) {
        newProject.id = data.id;
      }
    } catch (err) {
      console.warn("Failed to insert project into Supabase database:", err);
    }

    inMemoryProjects.unshift(newProject);
    return newProject;
  },

  async updateProjectStatus(
    user: UserProfile,
    projectId: string,
    newStatus: ProjectStatus,
    assignedMember?: string,
  ): Promise<boolean> {
    if (user.role !== "ADMIN") {
      console.error(`[SECURITY ERROR] Unauthorized project status change attempt by ${user.email}`);
      return false;
    }

    try {
      const updatePayload: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (assignedMember) updatePayload.assigned_team_member = assignedMember;

      const { error } = await supabase
        .from("projects")
        .update(updatePayload as any)
        .eq("id", projectId);

      if (error) return false;

      const p = inMemoryProjects.find((proj) => proj.id === projectId);
      if (p) {
        p.status = newStatus;
        if (assignedMember) p.assignedTeamMember = assignedMember;
        p.updatedAt = new Date().toISOString();
      }
      return true;
    } catch {
      return false;
    }
  },
};
