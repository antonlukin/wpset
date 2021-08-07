const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    enabled: true,
    content: ['./views/**/*.ejs'],
    options: {
      keyframes: true,
    },
  },
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      sky: colors.sky,
      gray: colors.coolGray,
      white: colors.white,
      black: colors.black,
    },
    fontSize: {
      'xs': ['0.75rem', '1.625'],
      'sm': ['0.875rem', '1.625'],
      'base': ['1rem', '1.625'],
      'lg': ['1.125rem', '1.5'],
      'xl': ['1.25rem', '1.5'],
      '2xl': ['1.5rem', '1.375'],
      '3xl': ['1.75rem', '1.25'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  separator: ':',
};
