const path = require('path')

module.exports = {
  target: 'webworker',
  resolve: {
    alias: {
      fs: path.resolve(__dirname, './null.js'),

      // The 'net' and 'tls' Node.js built-in usage within Apollo Server
      // is merely to run `instanceof` checks against an existing,
      // user-supplied "server" instance when subscriptions are desired to
      // be bound to an already-created server.  For the purposes of
      // Cloudflare, where none of these Node.js builtins exist, this
      // instanceof check is irrelevant because such a class could not
      // exist.
      net: path.resolve(__dirname, './null.js'),
      tls: path.resolve(__dirname, './null.js'),
    },
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
}
