const { ApolloServer, gql } = require('apollo-server-cloudflare')
const { graphqlCloudflare } = require('apollo-server-cloudflare/dist/cloudflareApollo')

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({
  typeDefs,
  introspection: true,
  resolvers,
})

const handleRequest = async request => {
  const url = new URL(request.url)
  try {
    if (url.pathname === '/graphql') {
      return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request)
    } else if (url.pathname === '/graphiql') {
      // graphiql here
      return new Response('ok')
    } else {
      return new Response('Not found', { status: 404 })
    }
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

addEventListener('fetch', event => event.respondWith(handleRequest(event.request)))
