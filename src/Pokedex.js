import React, { useState, useEffect } from 'react';  // <-- Add this line
import './Pokedex.css';

function Pokedex() {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    // Fetch all Pokémon names once
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        const names = data.results.map((p) => p.name);
        setPokemonList(names);
      });
  }, []);

  useEffect(() => {
    if (!search) return setSuggestions([]);
  
    const matches = pokemonList.filter((name, index) => {
      const id = (index + 1).toString(); // Get the Pokémon ID (1-based index)
      return name.includes(search.toLowerCase()) || id.startsWith(search);
    });
  
    setSuggestions(matches.slice(0, 5)); // Show up to 5 suggestions
  }, [search, pokemonList]);

  async function handleSelect(name) {
    setSearch(""); // Clear the search bar after selection
    setSuggestions([]); // Hide suggestions
  
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
  
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      const speciesData = await speciesRes.json();
  
      const flavorText = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      )?.flavor_text.replace(/\f/g, " ");
  
      setPokemon({
        ...data,
        species: speciesData.genera.find((g) => g.language.name === "en")?.genus || "Unknown Pokémon",
        description: flavorText || "No description available.",
      });
  
    } catch (error) {
      setPokemon(null);
    }
  }
  
  function PokemonTypeIcons({ types }) {
    return (
      <div className="type-icons">
        {types.map((type) => (
          <img
            key={type.type.name}
            src={`/types/${type.type.name}.png`} // Dynamically load type icon
            alt={`${type.type.name} type`}
            className="type-icon"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pokedex-grid-container">
      <div className="pokedex-title">
        <h2>Pokédex</h2>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter Pokémon name or #"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions.length > 0) {
                handleSelect(suggestions[0]);
              }
            }}
            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
          />

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((name) => (
                <li
                  key={name}
                  className="suggestion-item"
                  onClick={() => handleSelect(name)}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {pokemon && (
        <div className="pokemon-info-container">
          <div className="pokemon-sprite">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
          </div>

          <div className="pokemon-details">
            <div className="pokemon-name">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </div>

            <div className="pokedex-number">
              {pokemon.id.toString().padStart(3, "0")}
            </div>

            
            <div className="pokemon-species">{pokemon.species}</div>

            <div className="pokemon-stats">
              <div className="pokemon-height">
                <span>{`${Math.floor(pokemon.height / 3.048)}' ${Math.round((pokemon.height / 3.048 - Math.floor(pokemon.height / 3.048)) * 12)}"`}</span>
              </div>

              <div className="pokemon-weight">
                <span>{`${(pokemon.weight / 4.536).toFixed(1)} lbs. `}</span>
              </div>
            </div>
          </div>

          <div className="pokemon-description">{pokemon.description}</div>

          <PokemonTypeIcons types={pokemon.types} />
        </div>
        
      )}
    </div>
  );
}

export default Pokedex;