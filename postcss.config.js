module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-inline-svg': {
      paths: ['./src/'],
    },
    'autoprefixer': {},
    'cssnano': {},
  },
};
