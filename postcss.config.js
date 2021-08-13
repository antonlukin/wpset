module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-svg': {
      dirs: ['./src/'],
    },
    'postcss-inline-svg': {
      paths: ['./src/'],
    },
    'autoprefixer': {},
    'cssnano': {},
  },
};
