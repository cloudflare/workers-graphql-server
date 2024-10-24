import type { Resolvers } from './generated/graphql'
import PokemonAPI from './utils/pokeapi'

const Resolvers: Resolvers = {
  Query: {
    pokemon: async (_parent, { id }, { cache }) => {
      if (cache) {
        const pokemon = await cache.get(id)
        if (pokemon) {
          return pokemon
        }
      }

      const pokemonData = await PokemonAPI.getPokemon(id)
      if (cache) await cache.set(id, pokemonData)
      return pokemonData
    },
  },
}

export default Resolvers
