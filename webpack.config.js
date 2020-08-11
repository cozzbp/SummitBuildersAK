const path = require('path');

module.exports = {
  entry: './scripts.js',
  output: {
    filename: 'scripts.js',
    path: path.resolve(__dirname, 'docs'),
  },
};