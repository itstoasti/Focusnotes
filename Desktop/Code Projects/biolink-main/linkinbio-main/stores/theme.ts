import { defineStore } from 'pinia'

export interface Theme {
  colors: {
    primary: string
    background: string
    text: string
    accent: string
    button: {
      background: string
      text: string
    }
  }
  font: {
    heading: string
    body: string
  }
  layout: 'default' | 'centered' | 'minimal'
  animation: 'none' | 'gradient'
  showBranding: boolean
}

export const defaultTheme: Theme = {
  colors: {
    primary: '#6366F1',
    background: '#ffffff',
    text: '#1F2937',
    accent: '#818CF8',
    button: {
      background: '#6366F1',
      text: '#ffffff'
    }
  },
  font: {
    heading: 'Inter',
    body: 'Inter'
  },
  layout: 'default',
  animation: 'none',
  showBranding: true
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    current: { ...defaultTheme } as Theme,
    presets: [
      {
        id: 'default',
        name: 'Default',
        theme: { ...defaultTheme }
      },
      {
        id: 'dark',
        name: 'Dark Mode',
        theme: {
          ...defaultTheme,
          colors: {
            primary: '#818CF8',
            background: '#1F2937',
            text: '#374151',
            accent: '#6366F1',
            button: {
              background: '#818CF8',
              text: '#FFFFFF'
            }
          }
        }
      },
      {
        id: 'nature',
        name: 'Nature',
        theme: {
          ...defaultTheme,
          colors: {
            primary: '#059669',
            background: '#ECFDF5',
            text: '#065F46',
            accent: '#34D399',
            button: {
              background: '#059669',
              text: '#ffffff'
            }
          }
        }
      },
      {
        id: 'sunset',
        name: 'Sunset',
        theme: {
          ...defaultTheme,
          colors: {
            primary: '#F59E0B',
            background: '#FFFBEB',
            text: '#92400E',
            accent: '#FCD34D',
            button: {
              background: '#F59E0B',
              text: '#ffffff'
            }
          }
        }
      }
    ]
  }),

  actions: {
    setTheme(theme?: Partial<Theme>) {
      // If no theme provided or theme is empty, use default theme
      if (!theme) {
        this.current = { ...defaultTheme }
      } else {
        // Merge the provided theme with default theme to ensure all properties exist
        this.current = {
          colors: {
            ...defaultTheme.colors,
            ...theme.colors,
            button: {
              ...defaultTheme.colors.button,
              ...theme.colors?.button
            }
          },
          font: {
            ...defaultTheme.font,
            ...theme.font
          },
          layout: theme.layout || defaultTheme.layout,
          animation: theme.animation || defaultTheme.animation,
          showBranding: theme.showBranding ?? defaultTheme.showBranding
        }
      }
      this.applyTheme()
    },

    setPreset(presetId: string) {
      const preset = this.presets.find(p => p.id === presetId)
      if (preset) {
        this.setTheme(preset.theme)
      }
    },

    setCustomColors(colors: Partial<Theme['colors']>) {
      if ('button' in colors) {
        this.current.colors.button = {
          ...this.current.colors.button,
          ...colors.button
        }
        delete colors.button
      }
      this.current.colors = {
        ...this.current.colors,
        ...colors
      }
      this.applyTheme()
    },

    setFont(font: Partial<Theme['font']>) {
      this.current.font = {
        ...this.current.font,
        ...font
      }
      this.applyTheme()
    },

    setLayout(layout: Theme['layout']) {
      this.current.layout = layout
      this.applyTheme()
    },

    setAnimation(animation: Theme['animation']) {
      this.current.animation = animation
      this.applyTheme()
    },

    toggleBranding() {
      this.current.showBranding = !this.current.showBranding
      this.applyTheme()
    },

    applyTheme() {
      const root = document.documentElement
      // Safely apply theme properties with fallbacks to default theme
      root.style.setProperty('--primary', this.current.colors.primary || defaultTheme.colors.primary)
      root.style.setProperty('--background', this.current.colors.background || defaultTheme.colors.background)
      root.style.setProperty('--text', this.current.colors.text || defaultTheme.colors.text)
      root.style.setProperty('--accent', this.current.colors.accent || defaultTheme.colors.accent)
      root.style.setProperty('--button-bg', this.current.colors.button.background || defaultTheme.colors.button.background)
      root.style.setProperty('--button-text', this.current.colors.button.text || defaultTheme.colors.button.text)
      root.style.setProperty('--heading-font', this.current.font.heading || defaultTheme.font.heading)
      root.style.setProperty('--body-font', this.current.font.body || defaultTheme.font.body)
    }
  }
}) 