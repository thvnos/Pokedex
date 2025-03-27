import React, { useState, useEffect } from "react";

function Pokedex() {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState("pikachu"); // Default Pokémon

  useEffect(() => {
    if (!search) return; // Prevent empty searches
    fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pokémon not found");
        return res.json();
      })
      .then((data) => setPokemon(data))
      .catch(() => setPokemon(null));
  }, [search]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Pokédex</h2>
      
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Enter Pokémon name or ID" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", fontSize: "16px" }}
      />

      {/* Pokémon Display */}
      {pokemon ? (
        <div>
          <h3>{pokemon.name.toUpperCase()}</h3>
          <img 
            src={pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default} 
            alt={pokemon.name} 
          />
        </div>
      ) : (
        <p>Pokémon not found.</p>
      )}
    </div>
  );
}

export default Pokedex;
