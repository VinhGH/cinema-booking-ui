/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--secondary))',
                border: 'hsl(var(--border))',
                error: 'hsl(var(--error))',
                success: 'hsl(var(--success))',
                warning: 'hsl(var(--warning))',
                muted: 'hsl(var(--muted))',
                accent: 'hsl(var(--accent))',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [],
}
