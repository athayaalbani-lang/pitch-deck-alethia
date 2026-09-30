import containerQueries from "@tailwindcss/container-queries";
import typography from "@tailwindcss/typography";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      gridTemplateColumns: { 15: "repeat(15, minmax(0, 1fr))" },
      fontFamily: {"display":["var(--font-display)","sans-serif"],"body":["var(--font-body)","sans-serif"],"mono":["var(--font-mono)","sans-serif"],"pixel":["var(--font-pixel)","sans-serif"],"condensed":["var(--font-condensed)","sans-serif"],"grotesk":["var(--font-grotesk)","sans-serif"]},
      colors: {"border":"rgb(from var(--border) r g b / <alpha-value>)","input":"rgb(from var(--input) r g b / <alpha-value>)","ring":"rgb(from var(--ring) r g b / <alpha-value>)","background":"rgb(from var(--background) r g b / <alpha-value>)","foreground":"rgb(from var(--foreground) r g b / <alpha-value>)","primary":{"DEFAULT":"rgb(from var(--primary) r g b / <alpha-value>)","foreground":"rgb(from var(--primary-foreground) r g b / <alpha-value>)"},"secondary":{"DEFAULT":"rgb(from var(--secondary) r g b / <alpha-value>)","foreground":"rgb(from var(--secondary-foreground) r g b / <alpha-value>)"},"destructive":{"DEFAULT":"rgb(from var(--destructive) r g b / <alpha-value>)","foreground":"rgb(from var(--destructive-foreground) r g b / <alpha-value>)"},"muted":{"DEFAULT":"rgb(from var(--muted) r g b / <alpha-value>)","foreground":"rgb(from var(--muted-foreground) r g b / <alpha-value>)"},"accent":{"DEFAULT":"rgb(from var(--accent) r g b / <alpha-value>)","foreground":"rgb(from var(--accent-foreground) r g b / <alpha-value>)"},"popover":{"DEFAULT":"rgb(from var(--popover) r g b / <alpha-value>)","foreground":"rgb(from var(--popover-foreground) r g b / <alpha-value>)"},"card":{"DEFAULT":"rgb(from var(--card) r g b / <alpha-value>)","foreground":"rgb(from var(--card-foreground) r g b / <alpha-value>)"},"panel":"rgb(from var(--panel) r g b / <alpha-value>)","cyan":"rgb(from var(--cyan) r g b / <alpha-value>)","green":"rgb(from var(--green) r g b / <alpha-value>)","red":"rgb(from var(--red) r g b / <alpha-value>)","navy-0":"rgb(from var(--navy-0) r g b / <alpha-value>)","navy-1":"rgb(from var(--navy-1) r g b / <alpha-value>)","navy-2":"rgb(from var(--navy-2) r g b / <alpha-value>)","navy-3":"rgb(from var(--navy-3) r g b / <alpha-value>)","navy-4":"rgb(from var(--navy-4) r g b / <alpha-value>)","line":"rgb(from var(--line) r g b / <alpha-value>)","blue":"rgb(from var(--blue) r g b / <alpha-value>)","ice":"rgb(from var(--ice) r g b / <alpha-value>)","body":"rgb(from var(--body) r g b / <alpha-value>)","steel":"rgb(from var(--steel) r g b / <alpha-value>)","violet":"rgb(from var(--violet) r g b / <alpha-value>)","amber":"rgb(from var(--amber) r g b / <alpha-value>)"},
      borderRadius: {
        sm: "calc(var(--radius) - 6px)",
        DEFAULT: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
    },
  },
  plugins: [containerQueries, typography],
};
