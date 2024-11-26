/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: '#23EDFA',
        curiousBlue: '#227CBE',
        lightSkyBlue: '#93c5fd',
        blackPearl: '#11212D',
        swamp: '#242727',
        celtic: '#393B3A',
        tuna: '#48494B',
        darkGray: '#ADADAD',
        fruitSalad: '#4CB64C',
        nobel: '#999999',
        dodgerBlue: '#2B9BED',
        linkWater: '#CBD3D9',
        greyChateau: '#A0A6AA',
        linkWater2: '#C5C8CB',
        geyser: '#CCD0CF',
        celti: '#383A39',
        whiteSmoke: '#F5F5F5',
        cornflower: '#8FC7F0',
        bahamaBlue: '#185887',
        sunglow: '#FFD233',
        cinnabar: '#E53935',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        'lt1440': { max: '1440px' },
        'lt1832': { max: '1832px' },
        'lt1932': { max: '1932px' },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}

