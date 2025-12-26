# PokemoAPI-React-App
PokemonAPI-playground【https://github.com/wataru-creato/PokemoAPI-playground】
(JSで作成)の完成版である。
React+PHP+DBを使用し、フルスタック寄りの作品を目指したものである。

DOM操作が複雑化した課題を、Reactによる状態管理と
コンポーネント設計で解決することを目的としている。

## 機能一覧

- ログイン機能
- ユーザごとにお気に入り・メモを管理
- 世代ごとに絞り込み
- 名前検索


## 設計方針

- PokemonAPI-playground(https://github.com/wataru-creato/PokemoAPI-playground)
ではDOM操作が複雑になってしまったため、Reactに移行
- stateは「ユーザ依存のもの」「その画面でローカルなもの（完結するもの）」で分離
- 派生したデータにはstateをもたない

## コンポーネント構成

App
 ├ Login
 ├ Register
 └ Main
     ├ PokemonList
     ├ PokemonCard
     └ PokemonModal

Main
├─ state
│   └─ pokemons: []       ← API結果をここに
├─ useEffect
│   └─ 初回レンダリング時に fetch
├─ render
│   └─ PokemonList に pokemons を渡す
├─ PokemonCard
│   └─ モーダル開くときに詳細API fetch

## State設計

### App
- currentUser
- favoritePokemonIds
- memos

### Main
- pokemons
- selectedPokemonId
- visibleCount
- selectedGeneration
- searchText
- showFavoritesOnly
<!-- のちになぜここに設計したのかをそれぞれ説明できたほうがいい -->
