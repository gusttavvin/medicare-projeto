export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      care_connections: {
        Row: {
          caregiver_id: string
          created_at: string
          id: string
          invite_id: string | null
          patient_id: string
        }
        Insert: {
          caregiver_id: string
          created_at?: string
          id?: string
          invite_id?: string | null
          patient_id: string
        }
        Update: {
          caregiver_id?: string
          created_at?: string
          id?: string
          invite_id?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_connections_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_connections_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "care_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_connections_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          code: string
          created_at: string
          expires_at: string
          id: string
          patient_id: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          patient_id: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_invites_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dose_logs: {
        Row: {
          created_at: string
          dosage: string
          id: string
          medication_id: string | null
          medication_name: string
          notes: string
          schedule_id: string | null
          scheduled_for: string
          status: Database["public"]["Enums"]["dose_status"]
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string
          id?: string
          medication_id?: string | null
          medication_name: string
          notes?: string
          schedule_id?: string | null
          scheduled_for: string
          status: Database["public"]["Enums"]["dose_status"]
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          id?: string
          medication_id?: string | null
          medication_name?: string
          notes?: string
          schedule_id?: string | null
          scheduled_for?: string
          status?: Database["public"]["Enums"]["dose_status"]
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dose_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dose_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "medication_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dose_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_schedules: {
        Row: {
          active: boolean
          created_at: string
          id: string
          label: string
          medication_id: string
          time_of_day: string
          timezone: string
          updated_at: string
          user_id: string
          weekdays: number[]
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          label?: string
          medication_id: string
          time_of_day: string
          timezone?: string
          updated_at?: string
          user_id: string
          weekdays?: number[]
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          label?: string
          medication_id?: string
          time_of_day?: string
          timezone?: string
          updated_at?: string
          user_id?: string
          weekdays?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "medication_schedules_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean
          color: string
          created_at: string
          dosage: string
          form: string
          id: string
          instructions: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          dosage: string
          form?: string
          id?: string
          instructions?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          dosage?: string
          form?: string
          id?: string
          instructions?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_color: string
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_color?: string
          created_at?: string
          display_name: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_color?: string
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_care_invite: { Args: { invite_code: string }; Returns: string }
    }
    Enums: {
      dose_status: "taken" | "missed" | "skipped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      dose_status: ["taken", "missed", "skipped"],
    },
  },
} as const

