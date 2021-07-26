const path = require('path')

module.exports = {
  target: 'webworker',
  resolve: {},
  mode: 'production',
  optimization: {
    usedExports: true,
  },
}
