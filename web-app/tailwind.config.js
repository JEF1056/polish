/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#9333ea",
                    secondary: "#a78bfa",
                    accent: "#c7d2fe",
                    neutral: "#191D24",
                    "base-100": "#2A303C",
                    info: "#67e8f9",
                    success: "#86efac",
                    warning: "#fde047",
                    error: "#fca5a5",
                },
            },
        ],
    },
};
