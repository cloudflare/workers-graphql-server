class PokemonAPI {
  static #baseURL = 'https://pokeapi.co/api/v2/'

  static getPokemon = async (id: string) => {
    return fetch(`${this.#baseURL}pokemon/${id}`).then((res) => res.json())
  }
}

export default PokemonAPI
