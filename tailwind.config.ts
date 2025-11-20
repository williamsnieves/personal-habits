import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#FFB775", // Warm orange/peach
                    hover: "#FFA04D",
                    light: "#FFF0E0",
                },
                secondary: {
                    DEFAULT: "#A0D9B4", // Soft green
                    dark: "#4CAF50",
                },
                background: "#F8F9FA", // Light gray background
                card: "#FFFFFF",
                text: {
                    primary: "#2D3748",
                    secondary: "#718096",
                    muted: "#A0AEC0",
                },
                accent: {
                    red: "#FF8A80",
                    yellow: "#FFD54F",
                    blue: "#64B5F6",
                }
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
};
export default config;
