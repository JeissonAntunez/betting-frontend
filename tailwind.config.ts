import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF5800",
          green: "#0C8C44",
        },
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};

export default config;
