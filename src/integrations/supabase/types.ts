export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      career_applications: {
        Row: {
          cover_note: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          location: string | null;
          phone: string | null;
          portfolio_url: string | null;
          resume_url: string | null;
          role_applied: string;
          status: string;
        };
        Insert: {
          cover_note?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          location?: string | null;
          phone?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          role_applied: string;
          status?: string;
        };
        Update: {
          cover_note?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          location?: string | null;
          phone?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          role_applied?: string;
          status?: string;
        };
        Relationships: [];
      };
      contact_requests: {
        Row: {
          budget: string | null;
          company: string | null;
          created_at: string;
          email: string;
          handled: boolean;
          id: string;
          message: string;
          name: string;
          preferred_time: string | null;
          service: string | null;
        };
        Insert: {
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          email: string;
          handled?: boolean;
          id?: string;
          message: string;
          name: string;
          preferred_time?: string | null;
          service?: string | null;
        };
        Update: {
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string;
          handled?: boolean;
          id?: string;
          message?: string;
          name?: string;
          preferred_time?: string | null;
          service?: string | null;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string;
          user_id: string;
          user_email: string;
          user_name: string;
          meeting_type: string;
          preferred_date: string;
          preferred_time: string;
          call_duration: string;
          description: string | null;
          status: string;
          meeting_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_email: string;
          user_name: string;
          meeting_type: string;
          preferred_date: string;
          preferred_time: string;
          call_duration?: string;
          description?: string | null;
          status?: string;
          meeting_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_email?: string;
          user_name?: string;
          meeting_type?: string;
          preferred_date?: string;
          preferred_time?: string;
          call_duration?: string;
          description?: string | null;
          status?: string;
          meeting_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          active: boolean;
          created_at: string;
          cta_link: string | null;
          cta_text: string | null;
          description: string | null;
          discount: string | null;
          end_date: string | null;
          id: string;
          image_url: string | null;
          start_date: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          description?: string | null;
          discount?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          start_date?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          description?: string | null;
          discount?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          start_date?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          company: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: string | null;
          two_factor_enabled: boolean | null;
          updated_at: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          company?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          two_factor_enabled?: boolean | null;
          updated_at?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          company?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          two_factor_enabled?: boolean | null;
          updated_at?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          category: string | null;
          client_name: string | null;
          company: string | null;
          phone: string | null;
          completion_date: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          project_link: string | null;
          published: boolean;
          sort_order: number;
          status: string;
          technologies: string[];
          updated_at: string;
          what_we_did: string | null;
          user_id: string | null;
          user_email: string | null;
          user_name: string | null;
          service_type: string | null;
          project_description: string | null;
          budget_range: string | null;
          timeline: string | null;
          relevant_links: string | null;
          additional_requirements: string | null;
          assigned_team_member: string | null;
        };
        Insert: {
          category?: string | null;
          client_name?: string | null;
          company?: string | null;
          phone?: string | null;
          completion_date?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          project_link?: string | null;
          published?: boolean;
          sort_order?: number;
          status?: string;
          technologies?: string[];
          updated_at?: string;
          what_we_did?: string | null;
          user_id?: string | null;
          user_email?: string | null;
          user_name?: string | null;
          service_type?: string | null;
          project_description?: string | null;
          budget_range?: string | null;
          timeline?: string | null;
          relevant_links?: string | null;
          additional_requirements?: string | null;
          assigned_team_member?: string | null;
        };
        Update: {
          category?: string | null;
          client_name?: string | null;
          company?: string | null;
          phone?: string | null;
          completion_date?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          project_link?: string | null;
          published?: boolean;
          sort_order?: number;
          status?: string;
          technologies?: string[];
          updated_at?: string;
          what_we_did?: string | null;
          user_id?: string | null;
          user_email?: string | null;
          user_name?: string | null;
          service_type?: string | null;
          project_description?: string | null;
          budget_range?: string | null;
          timeline?: string | null;
          relevant_links?: string | null;
          additional_requirements?: string | null;
          assigned_team_member?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          id: string;
          items: string[];
          published: boolean;
          slug: string;
          sort_order: number;
          summary: string | null;
          tagline: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          items?: string[];
          published?: boolean;
          slug: string;
          sort_order?: number;
          summary?: string | null;
          tagline?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          items?: string[];
          published?: boolean;
          slug?: string;
          sort_order?: number;
          summary?: string | null;
          tagline?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          created_at: string;
          id: string;
          key: string;
          label: string | null;
          updated_at: string;
          value: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          key: string;
          label?: string | null;
          updated_at?: string;
          value?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          key?: string;
          label?: string | null;
          updated_at?: string;
          value?: string | null;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          linkedin_url: string | null;
          name: string;
          photo_url: string | null;
          published: boolean;
          responsibilities: string[];
          role: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          linkedin_url?: string | null;
          name: string;
          photo_url?: string | null;
          published?: boolean;
          responsibilities?: string[];
          role: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          linkedin_url?: string | null;
          name?: string;
          photo_url?: string | null;
          published?: boolean;
          responsibilities?: string[];
          role?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          client_name: string;
          company: string | null;
          created_at: string;
          id: string;
          published: boolean;
          quote: string;
          rating: number | null;
          updated_at: string;
        };
        Insert: {
          client_name: string;
          company?: string | null;
          created_at?: string;
          id?: string;
          published?: boolean;
          quote: string;
          rating?: number | null;
          updated_at?: string;
        };
        Update: {
          client_name?: string;
          company?: string;
          created_at?: string;
          id?: string;
          published?: boolean;
          quote?: string;
          rating?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: {
          _user_id: string;
        };
        Returns: string;
      };
      has_role: {
        Args: {
          _user_id: string;
          _role: Database["public"]["Enums"]["app_role"];
        };
        Returns: boolean;
      };
      is_admin: {
        Args: {
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "super_admin" | "content_admin" | "marketing_admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    keyof (Database["public"]["Tables"] & Database["public"]["Views"]) | { schema: keyof Database },
  TableName extends (PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    : never) = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database["public"]["Tables"] & Database["public"]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends (PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database["public"]["Tables"]
    : never) = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database["public"]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends (PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database["public"]["Tables"]
    : never) = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database["public"]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends (PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database["public"]["Enums"]
    : never) = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database["public"]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
