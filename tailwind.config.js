module.exports = {
  darkMode: ['selector', '.dark-mode'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.liquid",
    "./layout/**/*.liquid",
    "./templates/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        // NOTE: these resolve through CSS custom properties (defined in src/index.css
        // under :root and html.dark-mode) so that Tailwind utilities like bg-brand-white,
        // text-brand-black, bg-background, etc. automatically flip with the theme toggle.
        background: "var(--bg, #EDEBE5)",
        foreground: "var(--fg, #0C0C0C)",
        brand: {
          red: "var(--accent, #7A7A7A)",       // Racing Grey accent (theme-invariant value, but var-driven)
          darkRed: "#D5A706",                   // Footer brand mark grey (intentional, theme-invariant)
          black: "var(--fg, #0C0C0C)",          // Flips with theme: dark text in light mode, light text in dark mode
          white: "var(--bg, #EDEBE5)",          // Flips with theme: light bg in light mode, dark bg in dark mode
          surface: "var(--surface, #F5F4F0)",
        },
        surface: "var(--surface, #F5F4F0)",
      },
      fontFamily: {
        display: ["var(--font-display)", "BTSE PS2", "btseps2", "sans-serif"],
        body: ["var(--font-body)", "Barlow", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        display: "0.06em",
        technical: "0.08em",
      },
      lineHeight: {
        display: "0.88",
        body: "1.65",
      },
    },
  },
  plugins: [],
}
