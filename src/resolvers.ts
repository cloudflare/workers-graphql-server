import type { Context } from 'hono'
import { Movie, Resolvers } from './generated/graphql'
import PokemonAPI from './utils/pokeapi'

const createResolvers = (context: Context): Resolvers<any> => {
  return {
    Query: {
      movies: async () => {
        // You can access the context object to access any
        // environment variables, bindings, or other data
        // that you need to resolve your query.
        const _envKey = context.env.ENV_KEY
        const _userId = context.req.header("x-user-id")

        // You can bind other services in any resolver function
        // This allows you to connect any Workers services, databases,
        // or other external resources to your GraphQL API with a single
        // line of code.
        // return await context.env.MOVIES.getMovies()
        const exampleMovie = {
          id: "1",
          rating: 5,
          releaseDate: "1999-03-24",
          title: "The Matrix"
        } as Movie
        return [exampleMovie]
      },

      // You can also use the `cache` object to cache data
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
    },
  }
}

export default createResolvers
