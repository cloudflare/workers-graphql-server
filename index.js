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

addEventListener('fetch', event => {
  event.respondWith(
    graphqlCloudflare(() => {
      return server.createGraphQLServerOptions(event.request)
    })(event.request),
  )
})
