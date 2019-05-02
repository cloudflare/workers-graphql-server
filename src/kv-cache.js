class KVCache {
  get(key) {
    return GRAPHQL_ON_WORKERS.get(key)
  }

  set(key, value, options) {
    const opts = {}
    const ttl = options && options.ttl
    if (ttl) {
      opts.expirationTtl = ttl
    }
    return GRAPHQL_ON_WORKERS.put(key, value, opts)
  }
}

module.exports = { KVCache }
