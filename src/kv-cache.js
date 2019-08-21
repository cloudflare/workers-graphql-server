class KVCache {
  get(key) {
    return WORKERS_GRAPHQL_CACHE.get(key)
  }

  set(key, value, options) {
    const opts = {}
    const ttl = options && options.ttl
    if (ttl) {
      opts.expirationTtl = ttl
    }
    return WORKERS_GRAPHQL_CACHE.put(key, value, opts)
  }
}

module.exports = KVCache
