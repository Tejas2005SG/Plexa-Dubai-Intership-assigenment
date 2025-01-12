/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right bottom, #1c2529, #334c50, #4e7675, #72a395, #a1d1b1)',
      },
    },
  },
  plugins: [],
}

