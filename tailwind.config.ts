// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class', 'class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#e6f7ff',
  				'100': '#bae7ff',
  				'200': '#91d5ff',
  				'300': '#69c0ff',
  				'400': '#40a9ff',
  				'500': '#1890ff',
  				'600': '#096dd9',
  				'700': '#0050b3',
  				'800': '#003a8c',
  				'900': '#002766',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#f0f5ff',
  				'100': '#d6e4ff',
  				'200': '#adc6ff',
  				'300': '#85a5ff',
  				'400': '#597ef7',
  				'500': '#2f54eb',
  				'600': '#1d39c4',
  				'700': '#10239e',
  				'800': '#061178',
  				'900': '#030852',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': '#fff0f6',
  				'100': '#ffd6e7',
  				'200': '#ffadd2',
  				'300': '#ff85c0',
  				'400': '#f759ab',
  				'500': '#eb2f96',
  				'600': '#c41d7f',
  				'700': '#9e1068',
  				'800': '#780650',
  				'900': '#520339',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
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
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
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
  		},
  		fontFamily: {
  			sans: ['var(--font-inter)', ...fontFamily.sans]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate")],
}