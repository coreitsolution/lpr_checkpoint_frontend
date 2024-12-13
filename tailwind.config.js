/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			screens: {
				'lt1008': { max: '1008px' },
				'lt1443': { max: '1443px' },
        'lt1440': { max: '1440px' },
				'lt1535': { max: '1535px' },
        'lt1832': { max: '1832px' },
        'lt1932': { max: '1932px' },
      },
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
				emerald: '#4ECB71', 
				nobel2: '#9E9E9E',
				coralRed: '#EF4444',
				gainsboro: '#D9D9D9',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

