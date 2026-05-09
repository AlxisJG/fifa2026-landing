import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#060916",
        pitch: "#0A1020",
        electric: "#46d2ff",
        gold: "#e7be62",
        aquaSoft: "#7ce2ff"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(70,210,255,0.22), 0 25px 90px rgba(6, 108, 185, 0.3)",
        panel: "0 15px 45px rgba(0, 0, 0, 0.35)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.1)"
      },
      backgroundImage: {
        stadium: "radial-gradient(circle at 50% -8%, rgba(70,210,255,0.25), rgba(6,9,22,0.15) 42%, rgba(6,9,22,1) 74%)",
        panel: "linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.01))"
      }
    }
  },
  plugins: []
};

export default config;
