# workers-graphql-server

An [Apollo GraphQL](https://www.apollographql.com/) server, built with [Cloudflare Workers](https://workers.cloudflare.com). Includes a GraphiQL route for testing requests.

[Try a demo by looking at the GraphiQL explorer](https://graphql-on-workers.signalnerve.com/graphiql).

## Usage

You can begin building your own Workers GraphQL server by [installing Wrangler](https://workers.cloudflare.com/docs/quickstart/), the Workers command-line tool, and generating a new project:

```
wrangler generate my-graphql-server https://github.com/signalnerve/workers-graphql-server
```

The source for this project includes an external REST data source, and defined types for the [PokeAPI](https://pokeapi.co/), as an example of how to integrate external APIs.

By the way - as a fullstack developer who _loves GraphQL_, and the developer advocate for Cloudflare Workers, I would love to see what you build with this! Let me know [on Twitter](https://twitter.com/signalnerve)!

## License

This project is licensed with the [MIT License](https://github.com/signalnerve/workers-graphql-server/blob/master/LICENSE).
