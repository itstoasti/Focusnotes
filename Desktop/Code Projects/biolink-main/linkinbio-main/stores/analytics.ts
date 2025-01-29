import { defineStore } from 'pinia'
import type { Database, PageView, LinkClick, UniqueVisitor } from '~/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    views: [] as PageView[],
    clicks: [] as LinkClick[],
    uniqueVisitors: [] as UniqueVisitor[],
  }),

  getters: {
    totalViews: (state) => state.views.length,
    totalClicks: (state) => state.clicks.length,
    totalUniqueVisitors: (state) => new Set(state.uniqueVisitors.map(v => v.visitor_id)).size,
    
    viewsByDay: (state) => {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
      }).reverse()

      return last7Days.map(date => ({
        date,
        count: state.views.filter(v => v.created_at.startsWith(date)).length
      }))
    },

    topLinks: (state) => {
      // Debug log
      console.log('All clicks:', state.clicks)

      const linkCounts = state.clicks.reduce((acc, click) => {
        if (!click.link_id) return acc
        
        // Clean the URL if needed
        const cleanLinkId = click.link_id.trim()
        if (!cleanLinkId) return acc

        acc[cleanLinkId] = (acc[cleanLinkId] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Debug log
      console.log('Link counts:', linkCounts)

      const sortedLinks = Object.entries(linkCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([linkId, count]) => ({ linkId, count }))

      // Debug log
      console.log('Sorted top links:', sortedLinks)

      return sortedLinks
    },

    viewsByCountry: (state) => {
      const countryCounts = state.views.reduce((acc, view) => {
        const country = view.country || 'Unknown'
        acc[country] = (acc[country] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(countryCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([country, count]) => ({ country, count }))
    },

    viewsByReferrer: (state) => {
      const referrerCounts = state.views.reduce((acc, view) => {
        const referrer = view.referrer || 'Direct'
        acc[referrer] = (acc[referrer] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(referrerCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([referrer, count]) => ({ referrer, count }))
    }
  },

  actions: {
    async fetchAnalytics() {
      const client = useSupabaseClient<Database>()
      
      // Fetch views
      const { data: views, error: viewsError } = await client
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!viewsError && views) this.views = views

      // Fetch clicks
      const { data: clicks, error: clicksError } = await client
        .from('link_clicks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!clicksError && clicks) this.clicks = clicks

      // Fetch unique visitors
      const { data: visitors, error: visitorsError } = await client
        .from('unique_visitors')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!visitorsError && visitors) this.uniqueVisitors = visitors
    },

    async trackPageView(pageId: string) {
      const client = useSupabaseClient<Database>()
      let country = 'Unknown'
      
      try {
        // Use ipdata.co API (more reliable)
        const response = await fetch('https://api.ipdata.co/?api-key=c6e76c1c2c2ab5bed9c7f4c9362f7392b7950c8b4d3f7d9f6bf0f722')
        if (response.ok) {
          const data = await response.json()
          country = data.country_name
          console.log('Country detected:', country) // Debug log
        }

        const { data: pageView, error } = await client.from('page_views').insert({
          page_id: pageId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'Direct',
          country: country
        }).select()

        if (error) {
          console.error('Error inserting page view:', error)
        } else {
          console.log('Page view tracked:', pageView) // Debug log
        }

        await this.fetchAnalytics()
      } catch (error) {
        console.error('Error tracking page view:', error)
        // Still track the page view even if country detection fails
        await client.from('page_views').insert({
          page_id: pageId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'Direct',
          country: 'Unknown'
        })
      }
    },

    async trackLinkClick(linkId: string) {
      const client = useSupabaseClient<Database>()
      
      try {
        // Clean the URL if needed
        const cleanLinkId = linkId.trim()
        
        await client.from('link_clicks').insert({
          link_id: cleanLinkId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'Direct'
        })

        // Immediately fetch updated analytics to reflect the new click
        await this.fetchAnalytics()
      } catch (error) {
        console.error('Error tracking link click:', error)
      }
    }
  }
}) 