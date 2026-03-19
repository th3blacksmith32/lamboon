import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        surge: "#22d3ee",
        ember: "#f59e0b",
        mist: "#cbd5f5"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(7, 17, 31, 0.32)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(34, 211, 238, 0.18), transparent 38%), linear-gradient(135deg, rgba(245, 158, 11, 0.12), transparent 34%)"
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
