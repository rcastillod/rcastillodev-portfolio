/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Syne', 'sans-serif'],
      'poppins': ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary': '#161519',
        'primary-shade': '#131216',
        'primary-tint': '#2d2c30',
        'secondary': '#49da94',
        'secondary-shade': '#40c082',
        'secondary-tint': '#5bde9f',
        'grey': '#69686D',
      },
    },
  },
  plugins: [],
}
