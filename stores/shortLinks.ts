import { defineStore } from 'pinia'
import type { Database } from '~/types/supabase'

type ShortLink = Database['public']['Tables']['short_links']['Row']

export const useShortLinkStore = defineStore('shortLinks', {
  state: () => ({
    links: [] as ShortLink[]
  }),

  actions: {
    async createShortLink(longUrl: string) {
      const client = useSupabaseClient<Database>()
      const shortId = Math.random().toString(36).substring(2, 8) // 6 character random string

      try {
        const { data, error } = await client
          .from('short_links')
          .insert({
            id: shortId,
            long_url: longUrl
          })
          .select()
          .single()

        if (error) throw error
        
        return shortId
      } catch (error) {
        console.error('Error creating short link:', error)
        return null
      }
    },

    async getLongUrl(shortId: string) {
      const client = useSupabaseClient<Database>()

      try {
        const { data, error } = await client
          .from('short_links')
          .select('long_url')
          .eq('id', shortId)
          .single()

        if (error) throw error
        
        return data?.long_url
      } catch (error) {
        console.error('Error getting long URL:', error)
        return null
      }
    }
  }
}) 