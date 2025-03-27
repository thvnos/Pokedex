import React from "react";
import "./PokemonInfo.css";

function PokemonInfo({ pokemon }) {
  if (!pokemon) return null;

  // Get type names
  const type1 = pokemon.types[0]?.type.name;
  const type2 = pokemon.types[1]?.type.name || null;

  // Convert height and weight
  const heightFeet = `${Math.floor(pokemon.height / 3.048)}'${Math.round((pokemon.height / 3.048 - Math.floor(pokemon.height / 3.048)) * 12)}"`;
  const weightPounds = (pokemon.weight / 4.536).toFixed(1);

  return (
    <div className="pokemon-info-container">
      {/* Header */}
      <div className="pokemon-header">
        <span className="dex-number">#{pokemon.id.toString().padStart(3, "0")}</span>
        <span className="pokemon-name">{pokemon.name.toUpperCase()}</span>
      </div>

      <span className="pokemon-species">{pokemon.species}</span>

      {/* Pokémon Sprite */}
      <div className="pokemon-sprite">
        <img
          src={pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default}
          alt={pokemon.name}
        />
      </div>

      {/* Pokémon Types */}
      <div className="pokemon-types">
        <span className={`type-label ${type1}`}>{type1.toUpperCase()}</span>
        {type2 && <span className={`type-label ${type2}`}>{type2.toUpperCase()}</span>}
      </div>

      {/* Height & Weight */}
      <div className="pokemon-stats">
        <div className="stat-box">
          <span>HT</span>
          <span>{heightFeet}</span>
        </div>
        <div className="stat-box">
          <span>WT</span>
          <span>{weightPounds} lbs.</span>
        </div>
      </div>

      {/* Description */}
      <div className="pokemon-description">{pokemon.description}</div>
    </div>
  );
}

export default PokemonInfo;
