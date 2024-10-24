# workers-graphql-server

An [Apollo GraphQL](https://www.apollographql.com/) server, built with [Cloudflare Workers](https://workers.cloudflare.com).

Whether you host your APIs on-prem, in the cloud, or you're deploying [databases](https://developers.cloudflare.com/d1) to Cloudflare directly, you can deploy a globally distributed GraphQL server with Cloudflare Workers.

## Setup

Begin by cloning this repo and installing the dependencies:

```sh
$ git clone https://github.com/cloudflare/workers-graphql-server
$ npm install
```

You can begin running the project locally by running `npm run dev`.

You'll need to configure your project's `wrangler.toml` file to prepare your project for deployment. See the ["Configuration"](https://developers.cloudflare.com/workers/cli-wrangler/configuration/) docs for a guide on how to do this.

## Usage

The source for this project shows how to make requests to external APIs, using the [PokeAPI](https://pokeapi.co/) as an example. You can run an example query to ensure it works after deployment:

```graphql
query {
  pokemon: pokemon(id: 1) {
    id
    name
    height
    weight
    sprites {
      front_shiny
      back_shiny
    }
  }
}
```

Resolvers are defined in `src/resolvers.ts`. You can also use [Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) to connect to other Workers services, and use them inside your resolvers.

If you change your GraphQL schema at `src/schema.graphql`, you'll need to run `npm run codegen` to update the generated types in `src/generated/graphql.ts`. This ensures that you can correctly import and type your resolvers.

## Configuration

You can optionally configure your `graphQLOptions` object in `src/index.js`:

```js
const graphQLOptions = {
  baseEndpoint: '/',
  enableSandbox: true,
  forwardUnmatchedRequestsToOrigin: false,
  cors: true,
  kvCache: false,
}
```

### Base endpoint

Make requests to your GraphQL server by sending `POST` requests to the `baseEndpoint` (e.g. `graphql-on-workers.signalnerve.com/`).

### Sandbox

By default, the Apollo Sandbox is enabled. This allows you to test your GraphQL in a web GUI without needing to write any client code.

### Origin forwarding

If you run your GraphQL server on a domain already registered with Cloudflare, you may want to pass any unmatched requests from inside your Workers script to your origin: in that case, set `forwardUnmatchedRequestToOrigin` to true (if you're running a GraphQL server on a [Workers.dev](https://workers.dev) subdomain, the default of `false` is fine).

### Debugging

While configuring your server, you may want to set the `debug` flag to `true`, to return script errors in your browser. This can be useful for debugging any errors while setting up your GraphQL server, but should be disabled on a production server.

### CORS

By default, the `cors` option allows cross-origin requests to the server from any origin. You may wish to configure it to whitelist specific origins, methods, or headers. This is done by passing an object to `cors`, which is based on the [hono/cors](https://hono.dev/docs/middleware/builtin/cors) middleware:

```js
const graphQLOptions = {
  // ... other options ...

  cors: {
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  },
}
```

### Caching

This project includes support for using Workers KV as a cache in your resolvers. To use caching in your project, [create a new KV namespace](https://workers.cloudflare.com/docs/reference/storage/writing-data), and in `wrangler.toml`, configure your namespace, calling it `KV_CACHE` (note that this binding name is _required_, currently):

```toml
# wrangler.toml

[[kv-namespaces]]
binding = "KV_CACHE"
id = "$myId"
```

With a configured KV namespace set up, you can opt-in to KV caching by changing the `kvCache` config value in `graphQLOptions` (in `index.js`) to `true`.

In any resolver function, you can access the `cache` object, which is an instance of [`KVCache`](https://github.com/cloudflare/workers-graphql-server/blob/master/src/kv-cache.ts). You can use `.get` and `.set` to interact with the cache:

```ts
pokemon: async (_parent, { id }, { cache }) => {
  if (cache) {
    const pokemon = await cache.get(id)
    if (pokemon) {
      return pokemon
    }
  }

  // You can hook into any util functions, API wrappers, or other
  // code that you need to resolve your query.
  const pokemonData = await PokemonAPI.getPokemon(id)

  // You can also cache the data if you need to, with an optional TTL
  if (cache) await cache.set(id, pokemonData, { ttl: 60 })
  return pokemonData
},
```

## Credits

This project is heavily based on the [@as-integrations/cloudflare-workers](https://github.com/apollo-server-integrations/apollo-server-integration-cloudflare-workers) package, which is a great tool for building GraphQL servers with Cloudflare Workers.

It is built with [Hono](https://github.com/honojs/hono), a simple and powerful web framework for Cloudflare Workers.

## License

This project is licensed with the [MIT License](https://github.com/cloudflare/workers-graphql-server/blob/master/LICENSE).
