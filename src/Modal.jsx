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
                flavor:pokemonSpeciesAPI.flavor_text_entries.find(n=>n.language.name==="ja")?.flavor_text ?.replace(/\n|\f/g, " ").replace(/\s+/g, " ").trim() ?? "現在の説明文なし...",
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
        <div>
            <button onClick={onClose} className="absolute left-3 top-2 text-2xl font-bold bg-red-200 text-danger bg-neutral-primary border border-danger hover:bg-danger hover:text-white focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base focus:outline-none py-6 border-1 border-black rounder-lg">×</button>

            <button type="submit" onClick={()=>onFavorite(pokemon)} className="absolute right-3 top-2 font-bold text-2xl bg-orange-200 text-warning bg-neutral-primary border border-warning hover:bg-warning hover:text-white focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base py-6 focus:outline-none border-1 border-black rounder-lg">♡</button>
            <div className="absolute right-3 top-16 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-black rounded shadow">お気に入りリストにポケモンを追加できます</div>
            <div className="font-pixel">
            <h1 className="text-5xl">{pokemon.name}</h1>
            <img src={pokemon.img} className="mx-auto w-full max-w-[360px]"></img>
            <p className="text-3xl">{pokemon.type}</p>
            <p className="text-lg">たかさ：{pokemon.height}m/おもさ：{pokemon.weight}kg</p>
            <div className="grid grid-cols-2 mt-2">
                <div className="border-2 border-black rounder-lg">
            <p>{pokemon.stat.map(s => <li key={s.name} className="stat list-none p-0 m-0 text-xl bg-blue-50">{statList[s.name]+ ":" + s.value}</li>)}</p>
            </div>
            <div className="border-2 border-black rounder-lg">
            <p className="text-xl mt-9">{pokemon.flavor}</p>
            </div>
            </div>
            </div>
            <textarea value={memo} onChange={(e)=>onMemo(pokemonId,e.target.value)} rows="3" className="bg-gray-200 border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body text-xl mt-8 border-2 border-black rounder-lg" placeholder="メモをのこせます..."></textarea>
            {/* あとでCSSとかで「・」を消すように設定する */}
        </div>
    );
}
export default Modal;