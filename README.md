# PokemoAPI-React-App
React+PHP+MySQLを用いて作成したポケモン図鑑アプリです。
ログイン機能を実装し、ユーザのお気に入りポケモン登録とそれぞれのポケモンのメモを保存できます。
フロントだけでなく、バックエンドも実装し、一通りのシステムの流れを学びました。

## デモ動画


https://github.com/user-attachments/assets/cd7dcd55-a145-4400-9092-30a7d58afd57


## 使用技術

## フロントエンド
- React
- Tailwind CSS

## バックエンド
- PHP
- My SQL

## API
- PokeAPI

## DB設計

## DB構成
-pokemon_react_app

Tables
- users(id,username,password_hash)
- favorites(id,user_id,pokemon_id)
- memos(id,user_id,pokemon_id,memo_text)


## 機能一覧

- ログイン機能
- 世代ごとに絞り込み
- ポケモンごとの詳細情報
- ユーザごとにお気に入り・メモを管理

## 工夫した点
- お気に入り・メモをDBでユーザごとに管理

## 今後の改善予定

- 


## コンポーネント構成

- App
- Login:認証
- Register:ユーザの新規登録
- Main:一覧表示と状態管理
- Modal:詳細表示とお気に入り、メモ編集
- PokemonCard:一覧表示
- FavoriteList:ユーザのお気に入りポケモンの情報


## State設計

状態は以下の2種類に分けて管理しました。

- 認証ユーザに依存する情報(App)
- 一覧表示など画面内で完結する情報(Main)
