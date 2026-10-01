/** @type {import('tailwindcss').Config} */

// Faces are laid out on a fixed artboard and styled with CONTAINER queries, not
// media queries: `FaceShell` sets `containerType: "inline-size"` on the face
// root, so `@xl:` keys off the artboard width rather than the viewport.
//
// That leaves exactly two canvases to serve (see slides-layout-shared.ts):
//   - COMPACT mobile canvas .... 384 x  683
//   - desktop artboard ......... 1920 x 1080
// so a single breakpoint is all the deck needs, and `@xl:` is the only
// container variant used anywhere in src/.
//
// `xl` resolves to 36rem (576px) from the plugin's own defaults. That number
// sits cleanly between 384px and 1920px, so it does the job; overriding it
// under `theme.extend.container.screens` has no effect because the plugin
// installs its rem-based screen map itself. Change it in
// node_modules/@tailwindcss/container-queries/dist/index.js only if the two
// canvas widths ever move close enough together to matter.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Alethia's original stack. `terminal` is the label voice introduced by
        // the redesign and resolves to Archivo, matching the tracked-label style
        // the faces already used via `font-grotesk`.
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "sans-serif"],
        pixel: ["Silkscreen", "sans-serif"],
        condensed: ["Roboto Condensed", "Archivo", "sans-serif"],
        grotesk: ["Archivo", "Inter", "sans-serif"],
        terminal: ["Archivo", "Inter", "sans-serif"],
      },
      colors: {
        // Alethia's own palette, exposed as Tailwind tokens so new markup can
        // stop hard-coding hex. The lime ramp backs `--spectrum`.
        alethia: {
          lime: "#A6E86B",
          limeBright: "#B7F27D",
          green: "#7ED957",
          signal: "#F2A33C",
          red: "#F0645B",
          ice: "#F2F6F9",
          body: "#C2CCD6",
          steel: "#6B7885",
          slate: "#9AA7B4",
        },
      },
      borderRadius: {
        rw: "10px",
        "rw-lg": "14px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};