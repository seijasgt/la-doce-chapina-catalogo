import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azul: "#4997D0",
        "azul-oscuro": "#1C3D6E",
        dorado: "#C9A227",
        crema: "#FDF9EE",
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        body: ["var(--font-opensans)", "sans-serif"],
      },
      backgroundImage: {
        "stripe-fade":
          "linear-gradient(180deg, #1C3D6E 0%, #1C3D6E 60%, #FDF9EE 60%, #FDF9EE 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
