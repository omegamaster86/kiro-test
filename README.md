# kiro-test

Next.js 15とReact 19を使用したモダンなWebアプリケーションプロジェクトです。

## 技術スタック

- **Next.js 15.4.1** - App Routerを使用したReactフレームワーク
- **React 19.1.0** - 最新のReactとconcurrent機能
- **TypeScript 5** - 型安全なJavaScript
- **Tailwind CSS 4** - ユーティリティファーストCSSフレームワーク
- **Turbopack** - 高速な開発用バンドラー

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

### その他のコマンド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# コードリンティング
npm run lint

# テスト実行
npm run test

# テスト監視モード
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

## プロジェクト構造

```
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # ホームページ
│   └── globals.css     # グローバルスタイル
├── public/             # 静的アセット
└── .kiro/              # Kiro設定ファイル
```

## 開発ガイドライン

- **ファイル命名**: ケバブケースを使用（例: `button.tsx`）
- **コンポーネント名**: パスカルケースを使用（例: `HeaderBreadcrumb`）
- **スタイリング**: Tailwind CSSユーティリティクラスを優先
- **TypeScript**: 厳密モードを有効化
- **レスポンシブデザイン**: モバイルファーストアプローチ

## デプロイ

このプロジェクトは[Vercel](https://vercel.com/)での簡単なデプロイに最適化されています。

詳細については[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。