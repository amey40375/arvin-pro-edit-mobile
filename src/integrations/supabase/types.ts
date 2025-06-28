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
      app_settings: {
        Row: {
          id: number
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: number
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: number
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: number
          is_admin: boolean
          message: string
          reply_to: string | null
          sender: string | null
          sender_email: string | null
          timestamp: string | null
          user_email: string | null
          user_id: number | null
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_admin?: boolean
          message: string
          reply_to?: string | null
          sender?: string | null
          sender_email?: string | null
          timestamp?: string | null
          user_email?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_admin?: boolean
          message?: string
          reply_to?: string | null
          sender?: string | null
          sender_email?: string | null
          timestamp?: string | null
          user_email?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          order_id: number | null
          status: string
          user_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          order_id?: number | null
          status?: string
          user_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          order_id?: number | null
          status?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          description: string
          file_name: string | null
          id: number
          price: number | null
          service: string
          status: string
          updated_at: string | null
          user_email: string
          user_id: number | null
          user_name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          file_name?: string | null
          id?: number
          price?: number | null
          service: string
          status?: string
          updated_at?: string | null
          user_email: string
          user_id?: number | null
          user_name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          file_name?: string | null
          id?: number
          price?: number | null
          service?: string
          status?: string
          updated_at?: string | null
          user_email?: string
          user_id?: number | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          id: number
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          id?: number
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          id?: number
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: number
          password: string
          profile_photo: string | null
          registration_date: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: number
          password: string
          profile_photo?: string | null
          registration_date?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: number
          password?: string
          profile_photo?: string | null
          registration_date?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
