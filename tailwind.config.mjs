/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        sport: {
          primary: 'var(--sport-primary, #0F4C81)',
          secondary: 'var(--sport-secondary, #F4B400)',
          accent: 'var(--sport-accent, #34A853)',
          dark: 'var(--sport-dark, #0A1929)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
