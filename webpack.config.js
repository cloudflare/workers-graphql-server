const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')

module.exports = {
  target: 'webworker',
  plugins: [new CompressionPlugin()],
  resolve: {
    alias: {
      'apollo-engine-reporting': path.resolve(__dirname, './null.js'),
      busboy: path.resolve(__dirname, './null.js'),
      fs: path.resolve(__dirname, './null.js'),
    },
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
}
