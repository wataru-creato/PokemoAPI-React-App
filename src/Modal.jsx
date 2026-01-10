import {useEffect} from "react";
import {useState} from "react";

function Modal({pokemonId,onClose,onFavorite,memo,onMemo}){

    const statList={
        hp:"HP",
        attack:"こうげき",
        defense:"ぼうぎょ",
        "special-attack":"とくこう",
        "special-defense":"とくぼう",
        speed:"すばやさ"
    }

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
            return Promise.all(
                pokemonAPI.types.map(t=>
                  fetch(t.type.url)
                  .then(res=>res.json())
                  .then(typeData=>
                    typeData.names.find(n=>n.language.name==="ja").name,
                  )
            )
            ).then(japaneseTypes=>({
                id:pokemonId,
                name:pokemonSpeciesAPI.names.find(n=>n.language.name==="ja").name,
                type:japaneseTypes.join("/"),
                img:pokemonAPI.sprites.front_default,
                height:pokemonAPI.height/10,
                weight:pokemonAPI.weight/10,
                stat:pokemonAPI.stats.map(s=>({name:s.stat.name,value:s.base_stat}))
            }));
        })
        .then(pokemonData=>{
            setPokemon(pokemonData);
        });
        
    },[pokemonId]);

    if(!pokemon)return null;
    console.log(pokemon.type);
    console.log(pokemon.name);
    return(
        <div className="modal">
            <button onClick={onClose}>×</button>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.img}></img>
            <p>{pokemon.type}</p>
            <p>高さ：{pokemon.height}m</p>
            <p>重さ：{pokemon.weight}kg</p>
            <p>種族値</p>
            <p>{pokemon.stat.map(s => <li key={s.name} className="stat">{statList[s.name]+ ":" + s.value}</li>)}</p>
            <li>
            <button onClick={()=>onFavorite(pokemon)}>お気に入り</button>
            </li>
            <textarea value={memo} onChange={(e)=>onMemo(pokemonId,e.target.value)}></textarea>
            {/* あとでCSSとかで「・」を消すように設定する */}
        </div>
    );
}
export default Modal;