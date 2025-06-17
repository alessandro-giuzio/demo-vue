export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          attachments: Json
          content: string
          created_at: string | null
          id: number
          project_id: string | null
          task_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachments?: Json
          content: string
          created_at?: string | null
          id?: never
          project_id?: string | null
          task_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachments?: Json
          content?: string
          created_at?: string | null
          id?: never
          project_id?: string | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_status: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          assigned_to: string | null
          collaborators: string[]
          description: string
          id: string
          name: string
          owner_id: string
          slug: string
          status: Database["public"]["Enums"]["current_status"]
          status_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          collaborators?: string[]
          description?: string
          id?: string
          name: string
          owner_id: string
          slug: string
          status?: Database["public"]["Enums"]["current_status"]
          status_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          collaborators?: string[]
          description?: string
          id?: string
          name?: string
          owner_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["current_status"]
          status_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string
          id: string
          key: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          key: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      task_status: {
        Row: {
          color: string | null
          id: string
          name: string
          order_index: number | null
        }
        Insert: {
          color?: string | null
          id?: string
          name: string
          order_index?: number | null
        }
        Update: {
          color?: string | null
          id?: string
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string
          collaborators: string[]
          created_at: string | null
          description: string
          id: string
          name: string
          owner_id: string
          project_id: string
          status: Database["public"]["Enums"]["current_status"]
          status_id: string
          tags: string[]
        }
        Insert: {
          assigned_to: string
          collaborators?: string[]
          created_at?: string | null
          description: string
          id?: string
          name: string
          owner_id: string
          project_id: string
          status?: Database["public"]["Enums"]["current_status"]
          status_id: string
          tags: string[]
        }
        Update: {
          assigned_to?: string
          collaborators?: string[]
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          owner_id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["current_status"]
          status_id?: string
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "task_status"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          password: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          password: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      projects_with_status: {
        Row: {
          assigned_to: string | null
          collaborators: string[] | null
          description: string | null
          id: string | null
          name: string | null
          owner_id: string | null
          slug: string | null
          status: Database["public"]["Enums"]["current_status"] | null
          status_color: string | null
          status_id: string | null
          status_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      current_status: "in-progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      current_status: ["in-progress", "completed"],
    },
  },
} as const
