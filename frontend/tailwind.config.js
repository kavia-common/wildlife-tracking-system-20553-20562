/* Tailwind configuration with Ocean Professional theme */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#F59E0B',
        success: '#F59E0B',
        error: '#EF4444',
        background: '#f9fafb',
        surface: '#ffffff',
        text: '#111827'
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, rgba(59,130,246,0.1), #f9fafb)'
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl: '14px'
      },
      transitionDuration: {
        DEFAULT: '200ms'
      }
    }
  },
  plugins: []
};
