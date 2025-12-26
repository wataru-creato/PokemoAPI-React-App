import {useEffect} from "react";
import {useState} from "react";

function Modal({pokemonId,onClose}){
    const [pokemon,setPokemon]=useState(null);

    useEffect(()=>{
        if (!pokemonId) return null;
        Promise.all([//どっちもおわるまで次にはいかないよって意味の処理
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then(r=>r.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
            .then(res=>res.json())
        ])
        .then(([pokemonAPI,pokemonSpeciesAPI])=>{
            setPokemon({
                id:pokemonId,
                name:pokemonSpeciesAPI.names.find(n=>n.language.name==="ja").name,
                img:pokemonAPI.sprites.front_default
            });
        });
        
    },[pokemonId]);

    if(!pokemon)return null;

    return(
        <div className="modal">
            <button onClick={onClose}>×</button>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.img}></img>
        </div>
    );
}
export default Modal;