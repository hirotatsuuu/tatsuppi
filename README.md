tatsuppi
===========

## Requirements
- node v8.2.0
- npm 5.3.0
- yarn v0.27.5
- firebase 3.10.1

## First
- `yarn`のインストール

```
npm i -g yarn
```

- `firebase-tools`のインストール

```
npm i -g firebase-tools`
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

- `public`ディレクトリに`index.html`と`index.css`と`bundle.js`を生成する

```
yarn build
```

- `public`ディレクトリのファイルをホスティングして、`localhost:5000`にアクセスできるようにする

```
yarn host
```

- `https://tatsuppi-417ae.firebaseapp.com`にアクセス出来るようにする

```
yarn deploy
```
