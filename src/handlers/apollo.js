const { ApolloServer } = require('apollo-server-cloudflare')
const { graphqlCloudflare } = require('apollo-server-cloudflare/dist/cloudflareApollo')

const PokemonAPI = require('../datasources/pokeapi')
const resolvers = require('../resolvers')
const typeDefs = require('../schema')

const dataSources = () => ({
  pokemonAPI: new PokemonAPI(),
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  dataSources,
})

const handler = (request, _graphQLOptions) =>
  graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request)

module.exports = handler
