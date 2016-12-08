# よくないね。

いいね　だけじゃ　だめだよ

![icon](docs/icon.png)

## よくないよね

うん。

## 使い方

1. https://github.com/mzyy94/yokunaine/releases からChrome拡張機能をダウンロードしてインストール
2. 拡張機能ページ(chrome://extensions)を開く
3. *よくないね。* のオプション画面を開く
4. **Get Token**
5. _👍いいね_

## 開発者向け情報

    #React #ES2015 #JavaScript #Promise #NodeJs #AsyncAwait #Babel #ChromeExtension
    #Class #Symbol #WebPack

### 開発方法

#### Chrome拡張

```
cd chrome-extension
npm i
npm run build
```

#### サーバアプリケーション

```
cd server
npm i
export NODE_ENV=development
export client_id=da39a3ee5e6b4b0d3255bfef95601890afd80709
export client_secret=adc83b19e793491b1c6ea0fd8b46cd9f32e592fc
npm start
```

## FAQ

### こんなの作ってよかったの？

よくないね。

### 使ってて大丈夫なの？

よくないね。
OAuthの認証後は[すぐにTokenを破棄](https://github.com/mzyy94/yokunaine/blob/master/server/index.js#L58-L61)しているから悪用はされないはずだよ。

### よくないねボタンが動かないんだけど

サーバが落ちてるかもね。もしくはすでに「👍いいね」されてるとか。

### ソースコードがきもわるい

よくないね。
[こだわり](server/.eslintrc.json)みてね。
## LICENSE

[MIT](LICENSE)
