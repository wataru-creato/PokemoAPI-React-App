import {useState} from "react";
import { useEffect } from "react";
import PokemonCard from './PokemonCard.jsx'
import Modal from './Modal.jsx'

function Main({currentUser,onLogout}){

  const [pokemonState,setPokemonState]=useState([]);
  const [currentSelectPokemon,setCurrentSelectPokemon]=useState(null);

  useEffect(()=>{
    
      fetch("https://pokeapi.co/api/v2/pokemon?limit=12")
      .then(r=>r.json())
      .then(data=>{
        return Promise.all(
          data.results.map((p,index)=>
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${index+1}`)
            .then(res=>res.json())
            .then(species=>({
              id:index+1,
              name:species.names.find(n=>n.language.name==="ja").name,
              img:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index+1}.png`
            }))
          )
        );
      })
    .then(formatted=>{
      setPokemonState(formatted);

    });
  },[//第二引数にはいつ実行するのかを書く,何もない場合、初回で一回だけ実行する
    ]);

  return(
    <div>
      <p>これはメインページです</p>
      <p>ようこそ、{currentUser.name}</p>

      <div className="grid">
        {pokemonState.map(pokemon=>(
          <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={()=>setCurrentSelectPokemon(pokemon.id)}/>
        ))}
        {currentSelectPokemon!==null && (<Modal pokemonId={currentSelectPokemon} onClose={()=>setCurrentSelectPokemon(null)}/>)}
      </div>

      <button type="submit" name="logout" onClick={onLogout}>ログアウト</button>
    </div>
  );

}


export default Main;