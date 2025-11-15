/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Esta parte é a mais importante
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
