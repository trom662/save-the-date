/** Tailwind config – ersetzt die frühere Inline-Konfiguration des CDN-Builds */
module.exports = {
    content: ['./index.html', './scripts.js'],
    theme: {
        extend: {
            colors: {
                'metal-black': '#0a0a0a',
                'metal-red': '#dc2626',
                'metal-gray': '#141414',
                'metal-gray-light': '#1e1e1e',
                'metal-light': '#f5f5f5',
                'metal-muted': '#a3a3a3',
            },
            fontFamily: {
                'metal': ['Metal Mania', 'cursive'],
                'sans': ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)' },
                },
            },
        },
    },
    plugins: [],
};
