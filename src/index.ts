import { Hono } from 'hono'

import Apollo from './handlers/apollo'

export type GraphQLServerOptions = {
  baseEndpoint: string
  forwardUnmatchedRequestsToOrigin: boolean
  debug: boolean
  cors: boolean | Record<string, string>
  kvCache: boolean
}

export type Bindings = {
  KV_CACHE?: KVNamespace
}

const graphQLServerOptions: GraphQLServerOptions = {
  // Set the path for the GraphQL server
  baseEndpoint: '/',

  // When a request's path isn't matched, forward it to the origin
  forwardUnmatchedRequestsToOrigin: false,

  // Enable debug mode to return script errors directly in browser
  debug: false,

  // Enable CORS headers on GraphQL requests
  // Set to `true` for defaults (see `utils/setCors`),
  // or pass an object to configure each header
  cors: true,
  // cors: {
  //   allowCredentials: 'true',
  //   allowHeaders: 'Content-type',
  //   allowOrigin: '*',
  //   allowMethods: 'GET, POST, PUT',
  // }

  // Enable KV caching for external REST data source requests
  // Note that you'll need to add a KV namespace called
  // WORKERS_GRAPHQL_CACHE in your wrangler.toml file for this to
  // work! See the project README for more information.
  kvCache: false,
}

const app = new Hono<{ Bindings: Bindings }>()

app.all(graphQLServerOptions.baseEndpoint, (context) => {
  return Apollo(context, graphQLServerOptions)
})

app.all('*', async (c) => {
  if (graphQLServerOptions.forwardUnmatchedRequestsToOrigin) {
    return fetch(c.req.raw)
  }
  return new Response('Not found', { status: 404 })
})

app.onError((err, c) => {
  console.error(err)
  return c.text('Something went wrong', 500)
})

export default app
