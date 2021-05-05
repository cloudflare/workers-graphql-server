const path = require('path')

module.exports = {
  target: 'webworker',
  resolve: {
    alias: {
      // While Apollo Server doesn't use the 'fs' Node.js builtin itself,
      // its dependency - graphql-upload - does leverage it.
      // An intention is for Apollo Server 3.x to no longer directly rely on
      // graphql-upload, so this may be re-visited when that release occurs.
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
