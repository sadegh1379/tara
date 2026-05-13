/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#6366F1',
          deep: '#4F46E5',
        },
        violet: '#8B5CF6',
        tara: {
          pink: '#EC4899',
          success: '#10B981',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extrabold': ['Inter_800ExtraBold'],
        vazirmatn: ['Vazirmatn_400Regular'],
        'vazirmatn-bold': ['Vazirmatn_700Bold'],
      },
    },
  },
};
