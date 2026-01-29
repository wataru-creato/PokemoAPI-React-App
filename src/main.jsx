import { useState } from "react";
import { useEffect } from "react";
import PokemonCard from './PokemonCard.jsx'
import Modal from './Modal.jsx'
import FavoriteList from './FavoriteList.jsx'
import { addFavoriteAPI, getFavoriteAPI, removeFavoriteAPI, deleteFavoriteAllAPI } from '../src/api/favorite.js'
import { memoEditAPI } from '../src/api/memo.js'
import './index.css'
import bg from "./img/pokemon_background_free.jpg";

function Main({ currentUser, onLogout }) {

  const [pokemonState, setPokemonState] = useState([]);
  const [currentSelectPokemon, setCurrentSelectPokemon] = useState(null);
  const [selectGeneration, setSelectGeneration] = useState("all");
  const [offset, setOffset] = useState(0);
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [favoritePokemonInfo, setFavoritePokemonInfo] = useState([]);
  const [pokemonMemo, setPokemonMemo] = useState({});
  const Limit = 12;


  //最初呼び出すときの処理
  //メモ状態を呼び出す
  useEffect(() => {
    if (!currentUser) return;

    async function FirstFetchMemo() {
      try {
        const res = await fetch("http://localhost/pokemonAPI-React/memo.php",
          {
            method: "GET",
            credentials: "include",
          });
        if (!res.ok) console.log("メモ取得失敗");

        const data = await res.json();
        console.log("レスポンス:", data);
        setPokemonMemo(data);
      } catch (error) {
        console.log("メモ読み込みエラー", error);
      }
    }

    FirstFetchMemo();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchFavorites = async () => {
      const res = await getFavoriteAPI(currentUser.id);
      if (!res.status) return;

      const pokemonFavoriteId = res.favorites;
      setFavoritePokemon(pokemonFavoriteId);
      // console.log(favorites);


      await favoritePokemonDetails(pokemonFavoriteId);
    };

    fetchFavorites();
  }, [currentUser]);
  //最初からお気に入りをひょうじするやつ


  useEffect(() => {
    setPokemonState([]);
    setOffset(0);

    const fetchFn = selectGeneration === "all" ? fetchPokemons : fetchByGeneration;


    fetchFn(selectGeneration === "all" ? 0 : selectGeneration, 0)

      .then(pokemons => {
        const sorted = [...pokemons].sort((a, b) => a.id - b.id);
        setPokemonState(sorted);
        setOffset(Limit);

      });
  }, [selectGeneration//第二引数にはいつ実行するのかを書く,何もない場合、初回で一回だけ実行する
  ]);

  useEffect(() => {
    console.log("お気に入り更新:", favoritePokemon);
  }, [favoritePokemon]);


  //呼び出す基本的な処理
  const fetchPokemons = async (offset) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${Limit}`);
    const data = await res.json();

    const pokemons = await Promise.all(
      data.results.map(async (p, index) => {

        const pokemonRes = await fetch(p.url)
        const pokemonData = await pokemonRes.json();


        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${offset + index + 1}`);
        const speciesData = await speciesRes.json();

        const japaneseTypes = await Promise.all(
          pokemonData.types.map(async (t) => {
            const typeRes = await fetch(t.type.url);
            const typeData = await typeRes.json();

            return typeData.names.find(n => n.language.name === "ja").name;
          })
        );
        return {
          id: offset + index + 1,
          name: speciesData.names.find(n => n.language.name === "ja").name,
          genaration: speciesData.generation.name,
          type: japaneseTypes.join("/"),
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${offset + index + 1}.png`
        };
      })
    );
    return pokemons;
  };

  //世代指定したときの処理
  const fetchByGeneration = async (generation) => {

    const generationRes = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
    const generationData = await generationRes.json();
    
    const speciesList = generationData.pokemon_species;

    const pokemons = await Promise.all(
    speciesList.map(async (species) => {
        const speciesRes = await fetch(species.url);
        const speciesData = await speciesRes.json();
        const pokemonRes=await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesData.id}`);
        const pokemonData=await pokemonRes.json();

              const japaneseTypes = await Promise.all(
              pokemonData.types.map(async (t) => {
                const typeRes = await fetch(t.type.url);
                const typeData = await typeRes.json();

                return typeData.names.find(n => n.language.name === "ja").name;
              })
            );
              return {
              id: pokemonData.id,
              name: speciesData.names.find(n => n.language.name === "ja").name,
              generation:generationData.name,
              type: japaneseTypes.join("/"),
              img: pokemonData.sprites.front_default
            };
          })
        );
          return pokemons;
  };

//追加で呼び出すときの処理
const loadPokemon = async() => {
if(selectGeneration==="all"){
  const newPokemons=await fetchPokemons(offset);
  setPokemonState(prev=>[...prev,...newPokemons]);
  setOffset(prev=>prev+Limit);
}else{
  const newPokemons=await fetchByGeneration(selectGeneration);
  setPokemonState(newPokemons);
  setOffset(Limit);
}
};



const addFavorite = async (pokemon) => {

  const result = await addFavoriteAPI(currentUser.id, pokemon.id);
  console.log("API result:", result);

  if (!result.status) {
    alert("結果：" + result.message);
    return;
  }

  setFavoritePokemon(prev => {
    if (prev.includes(pokemon.id)) return prev;
    const newIdList = [...prev, pokemon.id];

    favoritePokemonDetails(newIdList);
    return newIdList;
  });
  await refreshFavorites();
};

const deleteFavoriteAll = async () => {
  const confirm = window.confirm("本当にお気に入りをすべて削除しますか？");
  if (!confirm) return;

  const result = await deleteFavoriteAllAPI(currentUser.id);

  if (!result.status) {
    alert("結果：" + result.message);
    return;
  }

  setFavoritePokemonInfo([]);
  setCurrentSelectPokemon(null);
}

const addMemo = async (pokemonId, memo) => {
  setPokemonMemo(prev => ({
    ...prev,
    [pokemonId]: memo
    // idとメモがセットになってPokemonMemoに保存される
  }));

  const result = await memoEditAPI(currentUser.id, pokemonId, memo);

  if (!result) {
    return;
  }

};



const removeFavorite = async (pokemonId) => {
  const confirm = window.confirm("このポケモンを削除しますか？");
  if (!confirm) return;
  const result = await removeFavoriteAPI(currentUser.id, pokemonId);

  if (!result.status) {
    alert("結果：" + result.message);
    return;
  }
  setFavoritePokemon(prev =>
    prev.filter(id => id !== pokemonId));
  await refreshFavorites();
};

console.log(currentUser);

const favoritePokemonDetails = async (favoriteIds) => {
  const detail = await Promise.all(
    favoriteIds.map(async id => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const res_spi = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

      const pokemonData = await res.json();
      const speciesData = await res_spi.json();

      const typeNames = await Promise.all(
        pokemonData.types.map(async t => {
          const typeRes = await fetch(t.type.url);
          const typeData = await typeRes.json();
          return typeData.names.find(n => n.language.name === "ja").name;
        })
      );

      return {
        id: pokemonData.id,
        name: speciesData.names.find(n => n.language.name === "ja").name,
        type: typeNames.join("/"),
        img: pokemonData.sprites.front_default
      };
    })

  );
  setFavoritePokemonInfo(detail);
};

const refreshFavorites = async () => {
  const res = await getFavoriteAPI(currentUser.id);
  if (!res.status) return;

  const favoriteIds = res.favorites;
  setFavoritePokemon(favoriteIds);


  await favoritePokemonDetails(favoriteIds);
};

return (
  <div>
    <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url(${bg})` }} />
    <div className="absolute top-4 left-4 font-pixel">
      <div className="border-8 border-black rounder-lg fixed top-4  bg-gray-50 z-20 py-20 px-10 text-2xl">
        <p>{currentUser.name}さん、</p>
        <br /><p>ようこそ、</p>
        <p>ポケモマイずかんへ</p>
        <button type="submit" name="logout" onClick={onLogout} className="group relative inline-flex h-12 items-center justify-center rounded-md px-6 font-medium bg-gray-300 top-8">⇒ログアウト</button>
      </div>
    </div>

    <div className="select-floating font-pixel">
      <select name="generation" value={selectGeneration} onChange={(e) => { console.log(e.target.value); setSelectGeneration(e.target.value) }} className="select rounded-full px-6 py-3 text-lg min-w-[280px] shadow-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="all">ぜんせんたく</option>
        <option value="generation-i">【1世代】カントー（赤/緑）</option>
        <option value="generation-ii">【2世代】ジョウト（金/銀）</option>
        <option value="generation-iii">【3世代】ホウエン（ルビー/サファイア）</option>
        <option value="generation-iv">【4世代】シンオウ（ダイヤモンド/パール）</option>
        <option value="generation-v">【5世代】イッシュ（ブラック/ホワイト）</option>
        <option value="generation-vi">【6世代】カロス（X/Y）</option>
        <option value="generation-vii">【7世代】アローラ（サン/ムーン）</option>
        <option value="generation-viii">【8世代】ガラル（ソード/シールド）</option>
        <option value="generation-ix">【9世代】パルデア（スカーレット/バイオレット）</option>
      </select>
    </div>
    <div className="flex justify-center w-full">
      <div className="grid py-8 w-full max-w-[1600px] mx-auto px-6 min-h-screen">

        <div className="grid grid-cols-[1fr_280px] gap-6">
          <div className="overflow-y-auto h-screen pr-2 min-w-0">
            <div className="grid grid-cols-4 gap-6">
              {[...pokemonState]
                .sort((a, b) => a.id - b.id)
                .map(pokemon => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={() => setCurrentSelectPokemon(pokemon.id)} />
                ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button type="submit" name="load" onClick={loadPokemon} disabled={selectGeneration !== "all"} className="bottom-0 gap-8 font-pixel mx-4 mt-4 text-2xl">つづきをよむ</button>
            </div>
          </div>

          <div className="sticky top-4 right-12 w-[280px]">
            <div className="border-4 border-black rounded-lg top-6 py-4 bg-gray-50 text-2xl px-2">
              <h2 className="font-pixel">おきにいりリスト</h2>

              <button onClick={deleteFavoriteAll} className="mt-2 mb-4 h-12 overflow-hidden rounded bg-red-500 px-4 py-2.5 text-white transition-all duration-300 hover:bg-red-300 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2 text-lg font-pixel">すべて削除する</button>

              {favoritePokemonInfo.length === 0 && (<p className="font-pixel">おきにいりなし</p>)}
              {favoritePokemonInfo.map(pokemon => (
                <FavoriteList key={pokemon.id} pokemon={pokemon} onSelect={() => setCurrentSelectPokemon(pokemon.id)} onRemove={() => removeFavorite(pokemon.id)} />
              ))}
            </div>
          </div>

          {currentSelectPokemon !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setCurrentSelectPokemon(null)}>
              <div className="rounded-xl px-8 py-12 w-[480px] bg-gray-50 relative border-2 border-black rounded-lg" style={{ width: 650 }} onClick={(e) => e.stopPropagation()}>
                <Modal className="z-50 flex items-center justify-center" pokemonId={currentSelectPokemon} onClose={() => setCurrentSelectPokemon(null)} onFavorite={addFavorite} memo={pokemonMemo[currentSelectPokemon] ?? ""} onMemo={addMemo} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  </div>

);

}


export default Main;