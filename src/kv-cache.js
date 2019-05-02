class KVCache {
  get(key) {
    const encodedKey = encodeURIComponent(key)
    return GRAPHQL_ON_WORKERS.get(encodedKey)
  }

  set(key, value, options) {
    const opts = {}
    const ttl = options && options.ttl
    if (ttl) {
      opts.expirationTtl = ttl
    }
    const encodedKey = encodeURIComponent(key)
    return GRAPHQL_ON_WORKERS.put(encodedKey, value, opts)
  }
}

module.exports = { KVCache }
