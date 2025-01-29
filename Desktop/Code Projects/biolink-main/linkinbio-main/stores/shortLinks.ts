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
            long_url: longUrl,
            clicks: 0
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

    async updateNickname(linkId: string, nickname: string) {
      const client = useSupabaseClient<Database>()

      try {
        const { data, error } = await client
          .from('short_links')
          .update({ nickname: nickname.trim() })
          .eq('id', linkId)
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error('Error updating nickname:', error)
        throw error
      }
    },

    async getLongUrl(shortId: string) {
      const client = useSupabaseClient<Database>()

      try {
        // First get the long URL
        const { data, error } = await client
          .from('short_links')
          .select('long_url')
          .eq('id', shortId)
          .single()

        if (error) throw error

        // Then increment the click count using RPC
        const { error: updateError } = await client
          .rpc('increment_clicks', { link_id: shortId })

        if (updateError) {
          console.error('Error incrementing clicks:', updateError)
        }
        
        return data?.long_url
      } catch (error) {
        console.error('Error getting long URL:', error)
        return null
      }
    }
  }
}) 