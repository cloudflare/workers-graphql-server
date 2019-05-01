const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path')

module.exports = {
  target: 'webworker',
  plugins: [new CompressionPlugin()],
  resolve: {
    alias: {
      fs: path.resolve(__dirname, './null.js'), // module.exports = {}
      busboy: path.resolve(__dirname, './null.js'),
    },
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
}
