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
      colors: {
        'normal': 'var(--color-normal)',
        'fighting': 'var(--color-fighting)',
        'flying': 'var(--color-flying)',
        'poison': 'var(--color-poison)',
        'ground': 'var(--color-ground)',
        'rock': 'var(--color-rock)',
        'bug': 'var(--color-bug)',
        'ghost': 'var(--color-ghost)',
        'steel': 'var(--color-steel)',
        'fire': 'var(--color-fire)',
        'water': 'var(--color-water)',
        'grass': 'var(--color-grass)',
        'electric': 'var(--color-electric)',
        'psychic': 'var(--color-psychic)',
        'ice': 'var(--color-ice)',
        'dragon': 'var(--color-dragon)',
        'dark': 'var(--color-dark)',
        'fairy': 'var(--color-fairy)',
        'unknown': 'var(--color-unknown)',
        'shadow': 'var(--color-shadow)',
        'mainbg':'#deeded', 'maintext':'#2e3156', 'searchbox':'#c9dde2',
        'secondbg':'#b0d2d2', 'statsbar':'#2e3156', 'pokdetbg':'#404465'
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /bg-/, variants: ['hover', 'focus'] },
  ],
};
export default config;
