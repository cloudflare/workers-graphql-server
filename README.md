# workers-graphql-server

An [Apollo GraphQL](https://www.apollographql.com/) server, built with [Cloudflare Workers](https://workers.cloudflare.com). Includes a GraphiQL route for testing requests.

[Try a demo by looking at the GraphiQL explorer](https://graphql-on-workers.signalnerve.com/graphiql).

Why this rules: Cloudflare Workers is a serverless application platform for deploying your projects across Cloudflare's massive distributed network. Deploying your GraphQL application to the edge is a huge opportunity to build consistent low-latency API servers, with the added benefits of "serverless" (I know, the project has `server` in it): usage-based pricing, no cold starts, and instant, easy-to-use deployment software, using [Wrangler](https://github.com/cloudflare/wrangler).

By the way - as a full-stack developer who _loves_ GraphQL, and the developer advocate for Cloudflare Workers, I would love to see what you build with this! Let me know [on Twitter](https://twitter.com/signalnerve)!

## Usage

You can begin building your own Workers GraphQL server by [installing Wrangler](https://workers.cloudflare.com/docs/quickstart/), the Workers command-line tool, and generating a new project:

```
wrangler generate my-graphql-server https://github.com/signalnerve/workers-graphql-server
```

The source for this project includes an external REST data source, and defined types for the [PokeAPI](https://pokeapi.co/), as an example of how to integrate external APIs.

To start using the project, configure your `graphQLOptions` object in `src/index.js`:

```js
const graphQLOptions = {
  baseUrl: '/', // String
  playgroundUrl: '/___graphql', // ?String
  forwardUnmatchedRequestsToOrigin: false, // Boolean
  debug: false, // Boolean
}
```

Make requests to your GraphQL server at the `baseUrl` (e.g. `graphql-on-workers.signalnerve.com/`) and, if configured, try GraphQL queries at the `playgroundUrl` (e.g. `graphql-on-workers.signalnerve.com/___graphql`).

If you run your GraphQL server on a domain already registered with Cloudflare, you may want to pass any unmatched requests from inside your Workers script to your origin: in that case, set `forwardUnmatchedRequestToOrigin` to true (if you're running a GraphQL server on a [Workers.dev](https://workers.dev) subdomain, the default of `false` is fine).

Finally, while configuring your server, you may want to set the `debug` flag to `true`, to allow script errors to be returned in your browser. This can be useful for debugging any errors while setting up your GraphQL server.

## License

This project is licensed with the [MIT License](https://github.com/signalnerve/workers-graphql-server/blob/master/LICENSE).
