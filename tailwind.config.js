module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.liquid",
    "./layout/**/*.liquid",
    "./templates/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        background: "#EDEBE5", // Warm Off-White as main canvas bg
        foreground: "#0C0C0C", // Carbon Black as primary text
        brand: {
          red: "#F6C917",     // Racing Yellow accent
          darkRed: "#D5A706", // Footer brand mark yellow
          black: "#0C0C0C",   // Carbon Black
          white: "#EDEBE5",   // Warm Off-White
          surface: "#F5F4F0", // Light Surface tone
        },
        surface: "#F5F4F0",   // Light Surface tone
      },
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body: ["var(--font-body)", "Barlow", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        display: "-0.04em",
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
