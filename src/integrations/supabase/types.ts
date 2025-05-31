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
      advertisements: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          people_range: string | null
          price: string | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          people_range?: string | null
          price?: string | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          people_range?: string | null
          price?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          additional_services: Json | null
          adults: number
          arrival_airport: string | null
          arrival_date: string
          budget: number | null
          car_type: string | null
          children: Json | null
          created_at: string | null
          currency: string | null
          customer_name: string
          departure_airport: string | null
          departure_date: string
          discount_amount: number | null
          discount_coupon: string | null
          id: string
          phone_number: string | null
          reference_number: string
          room_types: Json | null
          rooms: number
          selected_cities: Json | null
          status: string | null
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          additional_services?: Json | null
          adults?: number
          arrival_airport?: string | null
          arrival_date: string
          budget?: number | null
          car_type?: string | null
          children?: Json | null
          created_at?: string | null
          currency?: string | null
          customer_name: string
          departure_airport?: string | null
          departure_date: string
          discount_amount?: number | null
          discount_coupon?: string | null
          id?: string
          phone_number?: string | null
          reference_number: string
          room_types?: Json | null
          rooms?: number
          selected_cities?: Json | null
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_services?: Json | null
          adults?: number
          arrival_airport?: string | null
          arrival_date?: string
          budget?: number | null
          car_type?: string | null
          children?: Json | null
          created_at?: string | null
          currency?: string | null
          customer_name?: string
          departure_airport?: string | null
          departure_date?: string
          discount_amount?: number | null
          discount_coupon?: string | null
          id?: string
          phone_number?: string | null
          reference_number?: string
          room_types?: Json | null
          rooms?: number
          selected_cities?: Json | null
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          available_tours: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tour_prices: Json | null
        }
        Insert: {
          available_tours?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tour_prices?: Json | null
        }
        Update: {
          available_tours?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tour_prices?: Json | null
        }
        Relationships: []
      }
      hotels: {
        Row: {
          amenities: Json | null
          city: string
          created_at: string | null
          distance_from_center: number | null
          double_view_price: number | null
          double_without_view_price: number | null
          id: string
          is_active: boolean | null
          name: string
          rating: number | null
          single_price: number | null
          single_view_price: number | null
          triple_view_price: number | null
          triple_without_view_price: number | null
        }
        Insert: {
          amenities?: Json | null
          city: string
          created_at?: string | null
          distance_from_center?: number | null
          double_view_price?: number | null
          double_without_view_price?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          rating?: number | null
          single_price?: number | null
          single_view_price?: number | null
          triple_view_price?: number | null
          triple_without_view_price?: number | null
        }
        Update: {
          amenities?: Json | null
          city?: string
          created_at?: string | null
          distance_from_center?: number | null
          double_view_price?: number | null
          double_without_view_price?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          rating?: number | null
          single_price?: number | null
          single_view_price?: number | null
          triple_view_price?: number | null
          triple_without_view_price?: number | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          type: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          type: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          type?: string
          unit?: string | null
        }
        Relationships: []
      }
      transport: {
        Row: {
          capacity: string | null
          created_at: string | null
          daily_price: number
          farewell_different_city_price: number | null
          farewell_same_city_price: number | null
          id: string
          is_active: boolean | null
          reception_different_city_price: number | null
          reception_same_city_price: number | null
          type: string
        }
        Insert: {
          capacity?: string | null
          created_at?: string | null
          daily_price: number
          farewell_different_city_price?: number | null
          farewell_same_city_price?: number | null
          id?: string
          is_active?: boolean | null
          reception_different_city_price?: number | null
          reception_same_city_price?: number | null
          type: string
        }
        Update: {
          capacity?: string | null
          created_at?: string | null
          daily_price?: number
          farewell_different_city_price?: number | null
          farewell_same_city_price?: number | null
          id?: string
          is_active?: boolean | null
          reception_different_city_price?: number | null
          reception_same_city_price?: number | null
          type?: string
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
