import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import '../src/styles/storybook.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: { disable: true },
    viewport: {
      options: {
        mobileS: {
          name: 'Mobile S (320)',
          styles: { width: '320px', height: '640px' },
          type: 'mobile'
        },
        mobile: {
          name: 'Mobile (390)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile'
        },
        tablet: {
          name: 'Tablet (768)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet'
        },
        laptop: {
          name: 'Small window (1024)',
          styles: { width: '1024px', height: '700px' },
          type: 'desktop'
        },
        desktop: {
          name: 'Desktop (1440)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop'
        },
        wide: { name: '3xl (1920)', styles: { width: '1920px', height: '1080px' }, type: 'desktop' }
      }
    }
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html'
    }),
    (Story) => (
      <div className="font-plus-jakarta text-gray-900 dark:text-gray-100">
        <Story />
      </div>
    )
  ]
}

export default preview
