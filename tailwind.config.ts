import type { Config } from 'tailwindcss';

export default {
  content: ['./{app,components}/**/*.{ts,tsx}'],
  theme: {extend: {}},
  plugins: [],
} as Config;