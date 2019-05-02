const { ApolloServer, gql } = require('apollo-server-cloudflare')
const { graphqlCloudflare } = require('apollo-server-cloudflare/dist/cloudflareApollo')
const { PokemonAPI } = require('../pokeapi')
const { KVCache } = require('../kv-cache')

const typeDefs = gql`
  type PokemonSprites {
    front_default: String!
    front_shiny: String!
    front_female: String!
    front_shiny_female: String!
    back_default: String!
    back_shiny: String!
    back_female: String!
    back_shiny_female: String!
  }

  type Pokemon {
    id: ID!
    name: String!
    height: Int!
    weight: Int!
    sprites: PokemonSprites!
  }

  type Query {
    pokemon(id: ID!): Pokemon
  }
`

const resolvers = {
  Query: {
    pokemon: async (_source, { id }, { dataSources }) => {
      return dataSources.pokemonAPI.getPokemon(id)
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  cache: new KVCache(),
  dataSources: () => ({
    pokemonAPI: new PokemonAPI(),
  }),
})

const handler = request =>
  graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request)

module.exports = handler
