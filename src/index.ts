import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'

// Imported from Hono since it isn't exported
type CORSOptions = {
  origin:
    | string
    | string[]
    | ((origin: string, c: Context) => string | undefined | null)
  allowMethods?: string[]
  allowHeaders?: string[]
  maxAge?: number
  credentials?: boolean
  exposeHeaders?: string[]
}

import Apollo from './handlers/apollo'

export type GraphQLServerOptions = {
  baseEndpoint: string
  enableSandbox: boolean
  forwardUnmatchedRequestsToOrigin: boolean
  cors: boolean | CORSOptions
  kvCache: boolean
}

export type Bindings = {
  KV_CACHE?: KVNamespace
}

const graphQLServerOptions: GraphQLServerOptions = {
  // Set the path for the GraphQL server
  baseEndpoint: '/',

  // Enable the Apollo Sandbox
  enableSandbox: true,

  // When a request's path isn't matched, forward it to the origin
  forwardUnmatchedRequestsToOrigin: false,

  // Enable CORS headers on GraphQL requests
  // Set to `true` for defaults (see `utils/setCors`),
  // or pass an object to configure each header
  cors: true,
  // cors: {
  //   allowHeaders: ['Content-type'],
  //   allowMethods: ['GET', 'POST', 'PUT'],
  //   credentials: true,
  //   origin: '*',
  // },

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

if (graphQLServerOptions.cors) {
  if (typeof graphQLServerOptions.cors === 'boolean') {
    app.use(cors())
  } else {
    app.use(cors(graphQLServerOptions.cors))
  }
}

app.onError((err, c) => {
  console.error(err)
  return c.text('Something went wrong', 500)
})

export default app
