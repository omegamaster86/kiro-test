# kiro-test

Next.js 15とReact 19を使用したモダンなWebアプリケーションプロジェクトです。

## 技術スタック

- **Next.js 15.4.1** - App Routerを使用したReactフレームワーク
- **React 19.1.0** - 最新のReactとconcurrent機能
- **TypeScript 5** - 型安全なJavaScript
- **Tailwind CSS 4** - ユーティリティファーストCSSフレームワーク
- **Prisma 6.12.0** - 型安全なORMとデータベースツールキット
- **SQLite** - 軽量なファイルベースデータベース
- **Turbopack** - 高速な開発用バンドラー

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

### データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーションの実行
npx prisma migrate dev

# Prisma Studioでデータベースを確認（オプション）
npx prisma studio
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

## 機能

このプロジェクトはTODOリストアプリケーションとして実装されており、以下の機能を提供します：

### 実装済み機能
- **Server Actions**: Next.js 15のServer Actionsを使用したサーバーサイド処理
- **データベース**: Prisma + SQLiteによるデータ永続化
- **タスク作成**: 新しいタスクの追加（TodoFormコンポーネント）
- **タスク表示**: 全タスクの一覧表示（TodoListコンポーネント）
- **タスク完了切り替え**: タスクの完了/未完了状態の切り替え（TodoItemコンポーネント）
- **タスク編集**: 既存タスクのインライン編集（TodoItemコンポーネント）
- **タスク削除**: 不要なタスクの削除（TodoItemコンポーネント）
- **フィルタリング**: 全て/未完了/完了済みでのタスク絞り込み（TodoFilterコンポーネント）

### 実装済み機能（追加）
- **メインページ統合**: 全コンポーネントをメインページに統合完了
- **URLパラメータ対応**: フィルター状態をURLで管理

### 実装済み機能（UI/UX）
- **レスポンシブデザイン**: モバイルファーストのUIデザイン完了
- **モダンUI**: グラデーション背景とガラスモーフィズム効果
- **アニメーション**: フェードイン・スライドアップアニメーション
- **レスポンシブタイポグラフィ**: 画面サイズに応じた文字サイズ調整

### 実装中の機能
- **エラーハンドリング**: より詳細なエラー表示とローディング状態

### Server Actions
Next.js 15のServer Actionsを活用した以下のAPI：

- `getTodos(filter?)` - タスク取得（フィルタリング対応）
- `createTodo(formData)` - 新規タスク作成
- `toggleTodo(id)` - タスク完了状態切り替え
- `updateTodo(id, title)` - タスクタイトル更新
- `deleteTodo(id)` - タスク削除

## プロジェクト構造

```
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # ホームページ
│   └── globals.css     # グローバルスタイル
├── lib/                # ユーティリティとヘルパー
│   ├── actions.ts      # Server Actions（TODO操作）
│   ├── prisma.ts       # Prismaクライアント設定
│   └── __tests__/      # テストファイル
├── prisma/             # データベース関連
│   ├── schema.prisma   # データベーススキーマ
│   ├── dev.db          # SQLiteデータベースファイル
│   └── migrations/     # マイグレーションファイル
├── public/             # 静的アセット
└── .kiro/              # Kiro設定ファイル
    ├── specs/          # 機能仕様書
    └── steering/       # 開発ガイドライン
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