# workers-graphql-server

An [Apollo GraphQL](https://www.apollographql.com/) server, built with [Cloudflare Workers](https://workers.cloudflare.com). [Try a demo by looking at a deployed GraphQL playground](https://graphql-on-workers.signalnerve.com/___graphql).

Why this rules: Cloudflare Workers is a serverless application platform for deploying your projects across Cloudflare's massive distributed network. Deploying your GraphQL application to the edge is a huge opportunity to build consistent low-latency API servers, with the added benefits of "serverless" (I know, the project has `server` in it): usage-based pricing, no cold starts, and instant, easy-to-use deployment software, using [Wrangler](https://github.com/cloudflare/wrangler).

By the way - as a full-stack developer who _loves_ GraphQL, and the developer advocate for Cloudflare Workers, I would love to see what you build with this! Let me know [on Twitter](https://twitter.com/signalnerve)!

## Usage

You can begin building your own Workers GraphQL server by [installing Wrangler](https://workers.cloudflare.com/docs/quickstart/), the Workers command-line tool, and generating a new project:

```
wrangler generate my-graphql-server https://github.com/signalnerve/workers-graphql-server
```

You'll need to configure your project's `wrangler.toml` file to prepare your project for deployment. See the docs (["Configuring and Publishing"](https://workers.cloudflare.com/docs/quickstart/configuring-and-publishing/)) for a guide on how to do this. Note that you'll need to [find your Cloudflare API keys](https://workers.cloudflare.com/docs/quickstart/api-keys/) to set up your config file.

The source for this project includes an example external REST data source, and defined types for the [PokeAPI](https://pokeapi.co/), as an example of how to integrate external APIs.

To start using the project, configure your `graphQLOptions` object in `src/index.js`:

```js
const graphQLOptions = {
  baseEndpoint: '/', // String
  playgroundEndpoint: '/___graphql', // ?String
  forwardUnmatchedRequestsToOrigin: false, // Boolean
  debug: false, // Boolean
  cors: true, // Boolean or Object to further configure
  kvCache: false // Boolean
}
```

### Endpoints

Make requests to your GraphQL server at the `baseEndpoint` (e.g. `graphql-on-workers.signalnerve.com/`) and, if configured, try GraphQL queries at the `playgroundEndpoint` (e.g. `graphql-on-workers.signalnerve.com/___graphql`).

### Origin forwarding

If you run your GraphQL server on a domain already registered with Cloudflare, you may want to pass any unmatched requests from inside your Workers script to your origin: in that case, set `forwardUnmatchedRequestToOrigin` to true (if you're running a GraphQL server on a [Workers.dev](https://workers.dev) subdomain, the default of `false` is fine).

### Debugging

While configuring your server, you may want to set the `debug` flag to `true`, to return script errors in your browser. This can be useful for debugging any errors while setting up your GraphQL server, but should be disabled on a production server.

### CORS

By default, the `cors` option allows cross-origin requests to the server from any origin. You may wish to configure it to whitelist specific origins, methods, or headers. To do this, change the `cors` option to an object:

```js
const graphQLOptions = {
  // ... other options ...

  cors: {
    allowCredentials: 'true',
    allowHeaders: 'Content-type',
    allowOrigin: '*',
    allowMethods: 'GET, POST, PUT',
  }
}
```

Note that by default, any field that you _don't_ pass here (e.g. `allowMethods`) will fallback to the default value. See `utils/setCors.js` for the default values for these fields.

### REST caching

Version 1.1.0 of this project includes support for caching external requests made via instances of [`RESTDataSource`](https://www.apollographql.com/docs/apollo-server/features/data-sources/), using KV. To use caching in your project, [create a new KV namespace](https://workers.cloudflare.com/docs/reference/storage/writing-data), and in `wrangler.toml`, configure your namespace, calling it `WORKERS_GRAPHQL_CACHE`:

```toml
# wrangler.toml

[[kv-namespaces]]
binding = "WORKERS_GRAPHQL_CACHE"
id = "$myId"
```

With a configured KV namespace set up, you can opt-in to KV caching by changing the `kvCache` config value in `graphQLOptions` (in `index.js`) to `true`.

## License

This project is licensed with the [MIT License](https://github.com/signalnerve/workers-graphql-server/blob/master/LICENSE).
