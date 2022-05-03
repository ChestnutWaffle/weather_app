module.exports = {
  content: ["./**/*.{html,js,ejs}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["garden", "dark"],
  },
}