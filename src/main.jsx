import {useState} from "react";
import { useEffect } from "react";
import PokemonCard from './PokemonCard.jsx'
import Modal from './Modal.jsx'
import FavoriteList from './FavoriteList.jsx'

function Main({currentUser,onLogout}){

  const [pokemonState,setPokemonState]=useState([]);
  const [currentSelectPokemon,setCurrentSelectPokemon]=useState(null);
  const [selectGenaration,setSelectGenaration]=useState("all");
  const [offset,setOffset]=useState(0);
  const [favoritePokemeon,setFavoritePokemon]=useState([]);
  const [pokemonMemo,setPokemonMemo]=useState({});
  const Limit=12;


//最初呼び出すときの処理
  useEffect(()=>{
    setPokemonState([]);
    setOffset(0);

    const fetchFn =
      selectGenaration === "all"
      ? fetchPokemons: fetchByGeneration;

    fetchFn(selectGenaration === "all" ? 0 : selectGenaration, 0)

    .then(pokemons=>{
      const sorted = [...pokemons].sort((a, b) => a.id - b.id);
      setPokemonState(sorted);
      setOffset(Limit);
      
    });
  },[selectGenaration//第二引数にはいつ実行するのかを書く,何もない場合、初回で一回だけ実行する
    ]);

    useEffect(() => {
    }, [favoritePokemeon]);

//呼び出す基本的な処理
    const fetchPokemons=(offset)=>{
      return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${Limit}`)
      .then(r=>r.json())
      .then(data=>{
        return Promise.all(
          data.results.map((p,index)=>
            Promise.all([
              fetch(p.url)
              .then(r=>r.json()),
               fetch(`https://pokeapi.co/api/v2/pokemon-species/${offset+index+1}`)
              .then(res=>res.json())
            ])

            .then(([pokemonData,speciesData])=>{
              return Promise.all(
                pokemonData.types.map(t=>
                  fetch(t.type.url)
                  .then(res=>res.json())
                  .then(typeData=>
                    typeData.names.find(n=>n.language.name==="ja").name,
                  )
                )
              ).then(japaneseTypes=>({
                id:offset+index+1,
                name:speciesData.names.find(n=>n.language.name==="ja").name,
                genaration:speciesData.generation.name,
                type:japaneseTypes.join("/"),
                img:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${offset+index+1}.png`

              }));
              
            })
          )
        );
      })
    };

//世代指定したときの処理
    const fetchByGeneration=(generation)=>{
      

      return fetch(`https://pokeapi.co/api/v2/generation/${generation}`)
      .then(res=>res.json())
      .then(geneData=>{
        console.log(geneData);
        console.log(geneData.pokemon_species);
        const speciesList=geneData.pokemon_species

        return Promise.all(
          speciesList.map((species)=>
            fetch(species.url)
            .then(res=>res.json())
            .then(speciesData=>
              fetch(`https://pokeapi.co/api/v2/pokemon/${speciesData.id}`)
              .then(res=>res.json())

              .then(pokemonData=>
                Promise.all(
              pokemonData.types.map(t=>
                  fetch(t.type.url)
                  .then(res=>res.json())
                  .then(typeData=>
                    typeData.names.find(n=>n.language.name==="ja").name,
                  )
                )
              
              ).then(japaneseTypes=>({
                  id: pokemonData.id,
                  name: speciesData.names.find(n => n.language.name === "ja").name,
                  generation: geneData.name,
                  type: japaneseTypes.join("/"),
                  img: pokemonData.sprites.front_default
              }))
               )
            )
          )
          
        )
      })
    };

//追加で呼び出すときの処理
    const loadPokemon=()=>{
      const fetchSelect=
      selectGenaration === "all"
      ? fetchPokemons: fetchByGeneration;

      fetchSelect(
        selectGenaration==="all" ? offset:selectGenaration,offset
      )
       .then(newPokemons=>{
        setPokemonState(prev=>[...prev,...newPokemons]);
        setOffset(prev=>prev+Limit);
       });         
    };

    const addFavorite=(pokemon)=>{
      setFavoritePokemon(prev=>{
        if (prev.some(p => p.id === pokemon.id)) return prev;
        return[...prev,pokemon]
        });
          console.log("追加するポケモン:", pokemon);
    };

    const deleteFavoriteAll=()=>{
      setFavoritePokemon([]);
    }

    const addMemo=(pokemonId,memo)=>{
      setPokemonMemo(prev=>({
        ...prev,
        [pokemonId]:memo
        // idとメモがセットになってPokemonMemoに保存される
      }));
    };

    const showFavoritePokemons=favoritePokemeon;

    const removeFavorite=(id)=>{
      setFavoritePokemon(prev=>prev.filter(p=>p.id!==id));
       if (currentSelectPokemon === id) {
        setCurrentSelectPokemon(null);
    }
    };

  return(
    <div>
      <p>これはメインページです</p>
      <p>ようこそ、{currentUser.name}</p>

      <div className="grid">
        <select name="generation" value={selectGenaration} onChange={(e)=>{console.log(e.target.value); setSelectGenaration(e.target.value)}}>
           <option value="all">全選択</option>
                <option value="generation-i">【1世代】カントー地方（赤/緑）</option>
                <option value="generation-ii">【2世代】ジョウト地方（金/銀）</option>
                <option value="generation-iii">【3世代】ホウエン地方（ルビー/サファイア）</option>
                <option value="generation-iv">【4世代】シンオウ地方（ダイヤモンド/パール）</option>
                <option value="generation-v">【5世代】イッシュ地方（ブラック/ホワイト）</option>
                <option value="generation-vi">【6世代】カロス地方（X/Y）</option>
                <option value="generation-vii">【7世代】アローラ地方（サン/ムーン）</option>
                <option value="generation-viii">【8世代】ガラル地方（ソード/シールド）</option>
                <option value="generation-ix">【9世代】パルデア地方（スカーレット/バイオレット）</option>
        </select>
        {[...pokemonState]
        .sort((a,b)=>a.id-b.id)
        .map(pokemon=>(
          <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={()=>setCurrentSelectPokemon(pokemon.id)}/>
        ))}
      </div>
      <div className="FavoriteList">
          <h2>お気に入り一覧</h2>
          {showFavoritePokemons.length===0 && (<p>現在はお気に入りが存在しません</p>)}
          {showFavoritePokemons.map(pokemon=>(
            <FavoriteList key={pokemon.id} pokemon={pokemon} onSelect={()=>setCurrentSelectPokemon(pokemon.id)} onRemove={()=>removeFavorite(pokemon.id)}/>
          ))}
          {currentSelectPokemon!==null && (<Modal pokemonId={currentSelectPokemon} onClose={()=>setCurrentSelectPokemon(null)} onFavorite={addFavorite} memo={pokemonMemo[currentSelectPokemon]??""} onMemo={addMemo}/>)}
      </div>
          <button type="submit" name="load" onClick={loadPokemon} disabled={selectGenaration!=="all"}>次のポケモンを読み込む</button>
          <button onClick={deleteFavoriteAll}>お気に入りをすべて削除する</button>
      <button type="submit" name="logout" onClick={onLogout}>ログアウト</button>
    </div>
  );

}


export default Main;