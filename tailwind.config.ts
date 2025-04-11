import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        grey: "#151516",
        "grey-light": "#999999",
        dark: "#0D0E0E",
        "dark-2": "#111111",
        "bright-green": "#03F719",
        "dark-green": "#6CBC45",
        "bright-yellow": "#DDFD00",
        "bright-yellow-2": "#F5FF00",
        "blue-dark": "#1D06FD",
        "darkGray": "#212121",
        "lightGray": "#F9FAFB",
        "lightyellow": "#F6EE00",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("tailwind-scrollbar"), // Add the scrollbar plugin
  ],
};

export default config;
