import type { Config } from "tailwindcss";

import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
                serif: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
                display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"San Francisco"', 'sans-serif'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Dynamic Slate Logic for Themes
                slate: {
                    50: 'var(--slate-50)',
                    100: 'var(--slate-100)',
                    200: 'var(--slate-200)',
                    300: 'var(--slate-300)',
                    400: 'var(--slate-400)',
                    500: 'var(--slate-500)',
                    600: 'var(--slate-600)',
                    700: 'var(--slate-700)',
                    800: 'var(--slate-800)',
                    900: 'var(--slate-900)',
                    950: 'var(--slate-950)',
                },


                // Clinical Semantics (Wave 0)
                clinical: {
                    risk: 'var(--noble-clinical-risk)',
                    progress: 'var(--noble-clinical-progress)',
                    complete: 'var(--noble-clinical-complete)',
                    action: 'var(--noble-neutral-action)',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                scan: {
                    '0%': { top: '0%', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { top: '100%', opacity: '0' },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                scan: 'scan 2s ease-in-out infinite',
            },
        },
    },
    plugins: [tailwindAnimate],
};
export default config;
