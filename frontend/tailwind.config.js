module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9ff',
          100: '#e6f2ff',
          500: '#2563eb'
        },
        accent: {
          50: '#fff7ed',
          500: '#f97316'
        },
        green: {
          primary: '#55ac62',
          secondary: '#3e974b', 
          accent: '#086214',
          light: '#8bc193'
        }
      },
      fontFamily: {
        'karla': ['Karla', 'sans-serif'],
        'kreon': ['Kreon', 'serif'],
      },
      borderRadius: {
        'xl': '12px'
      },
      boxShadow: {
        'figma': '0px 4px 4px 0px rgba(0,0,0,0.25)',
      }
    },
  },
  plugins: [],
};
