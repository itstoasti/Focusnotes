export interface PageView {
  id: string
  page_id: string
  user_agent: string | null
  referrer: string | null
  country: string | null
  created_at: string
}

export interface LinkClick {
  id: string
  link_id: string
  user_agent: string | null
  referrer: string | null
  created_at: string
}

export interface UniqueVisitor {
  id: string
  visitor_id: string
  user_agent: string | null
  created_at: string
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      page_views: {
        Row: PageView
        Insert: Omit<PageView, 'id' | 'created_at'>
        Update: Partial<Omit<PageView, 'id' | 'created_at'>>
      }
      link_clicks: {
        Row: LinkClick
        Insert: Omit<LinkClick, 'id' | 'created_at'>
        Update: Partial<Omit<LinkClick, 'id' | 'created_at'>>
      }
      unique_visitors: {
        Row: UniqueVisitor
        Insert: Omit<UniqueVisitor, 'id' | 'created_at'>
        Update: Partial<Omit<UniqueVisitor, 'id' | 'created_at'>>
      }
      short_links: {
        Row: {
          id: string
          long_url: string
          created_at: string
        }
        Insert: {
          id: string
          long_url: string
          created_at?: string
        }
        Update: {
          id?: string
          long_url?: string
          created_at?: string
        }
      }
    }
  }
} 