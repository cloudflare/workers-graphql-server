type SetOptions = {
  ttl?: number
}

class KVCache {
  #binding: KVNamespace

  constructor(binding: KVNamespace) {
    this.#binding = binding
  }

  async get(key: string): Promise<any> {
    return this.#binding.get(key)
  }

  async set(key: any, value: any | null, options: SetOptions = {}) {
    if (value === null) {
      return this.#binding.delete(key)
    }

    const opts: KVNamespacePutOptions = {}
    const ttl = options && options.ttl
    if (ttl) {
      opts.expirationTtl = ttl
    }

    return this.#binding.put(key, value, opts)
  }

  async delete(key: string) {
    return this.#binding.delete(key)
  }
}

export default KVCache
