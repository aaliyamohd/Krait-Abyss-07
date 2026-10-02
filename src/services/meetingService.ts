import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "./authService";

export type MeetingType =
  | "Discovery Call"
  | "Quick Discovery Call"
  | "Project Discussion"
  | "Technical Consultation"
  | "General Enquiry"
  | "DISCOVERY CALL"
  | "PROJECT DISCUSSION"
  | "TECHNICAL CONSULTATION"
  | "GENERAL ENQUIRY";

export type MeetingStatus = "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type CallDuration =
  | "5 min"
  | "15 min"
  | "30 min"
  | "45 min"
  | "60 min"
  | "15 Minutes"
  | "30 Minutes"
  | "45 Minutes"
  | "60 Minutes";

export interface MeetingBooking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  meetingType: MeetingType;
  preferredDate: string;
  preferredTime: string;
  callDuration: CallDuration;
  description: string;
  status: MeetingStatus;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  topic?: string;
  scheduledDate?: string;
  timeSlot?: string;
}

// Clean legacy localStorage meeting keys
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("krait_user_meetings_v1");
    localStorage.removeItem("krait_user_meetings_v2");
    localStorage.removeItem("krait_user_meetings");
  } catch {
    // Ignore
  }
}

let inMemoryMeetings: MeetingBooking[] = [];

export const meetingService = {
  /**
   * Async retrieval of user meetings from Supabase database.
   * RLS policies ensure user can only query their own user_id (or all if DB admin).
   */
  async getUserMeetingsAsync(user: UserProfile): Promise<MeetingBooking[]> {
    if (!user || !user.id) return [];

    try {
      let query = supabase.from("meetings").select("*").order("created_at", { ascending: false });

      if (user.role !== "ADMIN") {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (error || !data) {
        return inMemoryMeetings.filter((m) => user.role === "ADMIN" || m.userId === user.id);
      }

      const mapped: MeetingBooking[] = data.map((item: any) => ({
        id: item.id,
        userId: item.user_id || user.id,
        userEmail: item.user_email || user.email,
        userName: item.user_name || user.fullName,
        meetingType: (item.meeting_type as MeetingType) || "Discovery Call",
        preferredDate: item.preferred_date || new Date().toISOString().split("T")[0],
        preferredTime: item.preferred_time || "10:00 AM",
        callDuration: (item.call_duration as CallDuration) || "15 min",
        description: item.description || "",
        status: (item.status as MeetingStatus) || "REQUESTED",
        meetingLink: item.meeting_link || "",
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
        topic: item.meeting_type || "Discovery Call",
        scheduledDate: item.preferred_date || new Date().toISOString().split("T")[0],
        timeSlot: item.preferred_time || "10:00 AM",
      }));

      inMemoryMeetings = mapped;
      return mapped;
    } catch {
      return inMemoryMeetings.filter((m) => user.role === "ADMIN" || m.userId === user.id);
    }
  },

  /**
   * Synchronous accessor for UI components
   */
  getUserMeetings(user: UserProfile): MeetingBooking[] {
    if (!user) return [];
    if (user.role === "ADMIN") return inMemoryMeetings;
    return inMemoryMeetings.filter((m) => m.userId === user.id || m.userEmail === user.email);
  },

  /**
   * Book a new meeting / call in Supabase database.
   */
  async createMeeting(
    user: UserProfile,
    input: {
      meetingType: MeetingType;
      preferredDate: string;
      preferredTime: string;
      callDuration?: CallDuration;
      description?: string;
    },
  ): Promise<MeetingBooking> {
    const newId = `mtg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const duration = input.callDuration || "15 min";
    const desc =
      input.description || `${input.meetingType} (${duration}) scheduled via Krait Abyss Portal.`;

    const newMeeting: MeetingBooking = {
      id: newId,
      userId: user.id, // Strictly derived from session
      userEmail: user.email,
      userName: user.fullName,
      meetingType: input.meetingType,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      callDuration: duration,
      description: desc,
      status: "REQUESTED",
      meetingLink: "",
      createdAt: now,
      updatedAt: now,
    };

    try {
      const { data } = await supabase
        .from("meetings")
        .insert({
          user_id: user.id,
          user_email: user.email,
          user_name: user.fullName,
          meeting_type: input.meetingType,
          preferred_date: input.preferredDate,
          preferred_time: input.preferredTime,
          call_duration: duration,
          description: desc,
          status: "REQUESTED",
          meeting_link: "",
        })
        .select()
        .single();

      if (data) {
        newMeeting.id = data.id;
      }
    } catch (err) {
      console.warn("Failed to insert meeting into Supabase database:", err);
    }

    inMemoryMeetings.unshift(newMeeting);
    return newMeeting;
  },

  /**
   * Admin-only meeting update
   */
  async updateMeeting(
    user: UserProfile,
    meetingId: string,
    newStatus: MeetingStatus,
    meetingLink?: string,
  ): Promise<boolean> {
    if (user.role !== "ADMIN") {
      console.error(
        `[SECURITY ERROR] Unauthorized meeting update attempt by non-admin ${user.email}`,
      );
      return false;
    }

    try {
      const updatePayload: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (meetingLink !== undefined) updatePayload.meeting_link = meetingLink;

      const { error } = await supabase.from("meetings").update(updatePayload).eq("id", meetingId);

      if (error) return false;

      const m = inMemoryMeetings.find((mtg) => mtg.id === meetingId);
      if (m) {
        m.status = newStatus;
        if (meetingLink !== undefined) m.meetingLink = meetingLink;
        m.updatedAt = new Date().toISOString();
      }
      return true;
    } catch {
      return false;
    }
  },
};
