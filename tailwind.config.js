/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#fbfbfd',
          dark: '#000000',
        },
        apple: {
          gray: '#f5f5f7',
          border: '#e5e5ea',
          darkBorder: '#27272a',
          textMuted: '#86868b',
          textDark: '#1d1d1f',
          blue: '#0071e3',
          blueHover: '#0077ed',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          'system-ui',
          'sans-serif'
        ],
        brand: [
          '"Montserrat"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        tight: '-0.015em',
      }
    },
  },
  plugins: [],
}
