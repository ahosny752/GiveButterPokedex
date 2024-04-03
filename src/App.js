import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchAllPokemon, fetchPokemonSpeciesByName, fetchPokemonDetailsByName,fetchEvolutionChainById } from "./api";

function App() {
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState(null)


    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()
            setPokemon(pokemonList)
        }

        fetchPokemon().then(() => { 
            /** noop **/
        })
    }, [])


    const filteredPokemon = useMemo(() => {
        // this function is memoized because the dataset is large and can get much larger, it doesn't get 
        // recalculated on every render, only when the original pokemon list or search value changes. 
        if (!searchValue.trim()) return pokemon;
        return pokemon.filter(pokemon => {
          const pokemonName = pokemon.name.toLowerCase();
          const query = searchValue.toLowerCase();
          return pokemonName.startsWith(query); // You can use either startsWith or includes depending on how you want the filter to work.
        });
      }, [pokemon, searchValue]);

    
      const onSearchValueChange = (event) => {
        setPokemonDetails(null);
        setSearchValue(event.target.value);
      };
    
      const calculateEvoChain = useMemo(() => (chain) => {
        //this function is computationally expensive, so its memoized so that it 
        // doesn't get recalculated on every render, only when the filtered list changes
        let evoChain = [];
        let evolutionChain = chain;
        while (evolutionChain) {
          const speciesName = evolutionChain.species?.name;
          evoChain.push({
            species_name: speciesName,
          });
          evolutionChain = evolutionChain.evolves_to?.[0];
        }
        return evoChain;
      }, [filteredPokemon]);
    
      const onGetDetails = useCallback((name) => async () => {
        // using useCallback to memoize the function so that it doesn't change on every render in 
        // the event this needs to be passed to a child component in the future
        try {
          const speciesResponse = await fetchPokemonSpeciesByName(name);
          const detailsResponse = await fetchPokemonDetailsByName(name);
          const evolutionId = speciesResponse?.evolution_chain?.url?.split('/')[6]
          const evolutionResponse = await fetchEvolutionChainById(evolutionId);
          const types = detailsResponse.types;
          const moves = detailsResponse.moves;
          const evoChain = calculateEvoChain(evolutionResponse.chain);
          const pokemonDetails = {
            name,
            types,
            moves,
            evoChain
          };
          setPokemonDetails(pokemonDetails);
        } catch (error) {
          console.error('error fetching pokemon details', error);
        };
    }, [filteredPokemon]);

const displayedPokemon = searchValue ? filteredPokemon : pokemon;
const shouldDisplayNotFound = displayedPokemon.length === 0;

return (
    <div className={'pokedex__container'}>
      <div className={'pokedex__search-input'}>
        <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
      </div>
      <div className={'pokedex__content'}>
        {shouldDisplayNotFound ? (
          <div style={{textAlign: 'center'}} className={'pokedex__search-results'}>
            No Results Found
          </div>
        ) : (
          <div className={'pokedex__search-results'}>
            {displayedPokemon.map(monster => (
              <div className={'pokedex__list-item'} key={monster.name}>
                <div>{monster.name}</div>
                <button onClick={onGetDetails(monster.name)}>Get Details</button>
              </div>
            ))}
          </div>
        )}
        {pokemonDetails && !shouldDisplayNotFound && (
          <div className={'pokedex__details'}>
            <div style={{fontWeight: '900'}}>{pokemonDetails.name}</div>
  
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100%', marginTop: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',  width: '200px' }}>
                <div style={{ fontWeight: '900', marginBottom: '20px' }}>Types</div>
                <div style={{ fontWeight: '900',  marginBottom: '20px'}}>Moves</div>
              </div>
  
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <ul style={{  padding: 0, margin: 0, marginLeft: '80px'}}>
                  {pokemonDetails.types.map((item, index) => (
                    <li key={index}>
                      <span> {item.type.name}</span>
                    </li>
                  ))}
                </ul>
                <ul style={{  padding: 0, margin: 0 }}>
                  {pokemonDetails.moves.map((item, index) => (
                    <li key={index}>
                      <span> {item.move.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px'}}>
              <div style={{fontWeight: '900', textAlign: 'center'}}>
                Evolutions
              </div>
  
              <div>
                <ul style={{ display: 'flex', listStyle: 'none',padding: '0px' }}>
                  {pokemonDetails.evoChain.map((item, index) => (
                    <li key={index} style={{ marginLeft: '10px' }}>
                      <span style={{fontStyle: 'italic'}}>{item.species_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;