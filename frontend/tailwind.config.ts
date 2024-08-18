import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      tiny: { max: "319px" },
      xxs: "320px",
      sxs: "380px",
      nsxs: { max: "379px" },
      xs: "480px",
      nxs: { max: "479px" },
      sm: "640px",
      nsm: { max: "639px" },
      md: "748px",
      nmd: { max: "748px" },
      lmd: "860px",
      nlmd: { max: "859px" },
      lg: "1024px",
      nlg: { max: "1023px" },
      xl: "1280px",
      nxl: { max: "1279px" },
      "2xl": "1536px",
      n2xl: { max: "1535px" },
    },
  },
  plugins: [],
};
export default config;
