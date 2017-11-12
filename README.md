tatsuppi
===========

## Requirements
- node v8.8.1
- npm 5.4.2
- yarn 1.2.1
- firebase 3.13.0

## First
- `yarn`のインストール

```
npm i -g yarn
```

- `firebase-tools`のインストール

```
npm i -g firebase-tools
```

## Setup
- パッケージのインストール

```
yarn
```

## Usage
- `webpack-dev-server`を起動して、`localhost:1192`にアクセスできるようにする

```
yarn start
```

- 開発環境で`public`ディレクトリに`index.html`と`index.css`と`bundle.js`を生成する

```
yarn build
```

- 本番環境で`public`ディレクトリに`index.html`と`index.css`と`bundle.js`を生成する

```
APP_ENV=production yarn build
```

- `fish`シェルの場合は一時的な環境変数の指定方法が異なる

```
env APP_ENV=production yarn build
```

- `public`ディレクトリのファイルをホスティングして、`localhost:5000`にアクセスできるようにする

```
yarn host
```

- `https://tatsuppi-417ae.firebaseapp.com`にアクセス出来るようにする
  - `https://tatsuppi.work`にもアクセス可能

```
yarn deploy
```
