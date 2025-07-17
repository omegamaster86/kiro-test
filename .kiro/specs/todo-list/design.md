# 設計書

## 概要

Next.js App Routerを使用したフルスタックToDoリストアプリケーション。フロントエンドはReact 19とTailwind CSS、バックエンドはNext.js API Routes、データベースはSQLiteとPrisma ORMを使用します。

## アーキテクチャ

### 技術スタック
- **フロントエンド**: React 19, Next.js 15 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Next.js Server Actions
- **データベース**: SQLite
- **ORM**: Prisma
- **状態管理**: Server Components + Server Actions (Next.js 15の推奨パターン)

### アーキテクチャパターン
- **フロントエンド**: Server Components + Client Components
- **バックエンド**: Server Actions パターン
- **データアクセス**: Prismaクライアント直接アクセス

## コンポーネントとインターフェース

### フロントエンドコンポーネント

#### 1. TodoPage (Server Component)
- データの取得とレンダリング
- Server Actionsの統合
- 子コンポーネントの統合

#### 2. TodoForm (Client Component)
- 新しいタスクの作成フォーム
- Server Actionを使用した送信処理
- バリデーション機能

#### 3. TodoList (Server Component)
- タスクリストの表示
- フィルタリング機能
- 各タスクアイテムの管理

#### 4. TodoItem (Client Component)
- 個別タスクの表示
- インライン編集機能
- Server Actionsを使用した完了状態切り替え
- Server Actionsを使用した削除機能

#### 5. TodoFilter (Client Component)
- フィルタリングオプション（全て/未完了/完了済み）
- URLパラメータでの状態管理

### Server Actions

#### createTodo
- 新しいタスクの作成
- パラメータ: `FormData` (title フィールド)
- 戻り値: void (revalidatePathでページを更新)

#### updateTodo
- タスクの更新（タイトル、完了状態）
- パラメータ: `id: string, data: { title?: string, completed?: boolean }`
- 戻り値: void (revalidatePathでページを更新)

#### deleteTodo
- タスクの削除
- パラメータ: `id: string`
- 戻り値: void (revalidatePathでページを更新)

#### toggleTodo
- タスクの完了状態切り替え
- パラメータ: `id: string`
- 戻り値: void (revalidatePathでページを更新)

## データモデル

### Todo エンティティ

```typescript
interface Todo {
  id: string;          // UUID
  title: string;       // タスクのタイトル
  completed: boolean;  // 完了状態
  createdAt: Date;     // 作成日時
  updatedAt: Date;     // 更新日時
}
```

### Prismaスキーマ

```prisma
model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## エラーハンドリング

### フロントエンド
- API呼び出し失敗時のエラー表示
- フォームバリデーションエラーの表示
- ネットワークエラーの適切な処理

### バックエンド
- 400: バリデーションエラー（空のタイトルなど）
- 404: 存在しないタスクへのアクセス
- 500: サーバー内部エラー

### エラーレスポンス形式
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
```

## テスト戦略

### 単体テスト
- コンポーネントのレンダリングテスト
- API エンドポイントの機能テスト
- バリデーション機能のテスト

### 統合テスト
- フロントエンドとバックエンドの連携テスト
- データベース操作のテスト

### E2Eテスト
- ユーザーフローの完全なテスト
- ブラウザでの実際の操作テスト

### テストツール
- **単体テスト**: Jest, React Testing Library
- **E2Eテスト**: Playwright または Cypress

## セキュリティ考慮事項

- SQLインジェクション対策（Prismaによる自動対策）
- XSS対策（Reactによる自動エスケープ）
- CSRF対策（Next.jsのデフォルト設定）
- 入力値のサニタイゼーション

## パフォーマンス最適化

- Server-side Rendering（SSR）の活用
- 静的生成（SSG）の検討
- 画像最適化（Next.js Image コンポーネント）
- バンドルサイズの最適化

## デプロイメント

- **開発環境**: `npm run dev`
- **本番環境**: Vercel または類似のプラットフォーム
- **データベース**: 本番環境ではPostgreSQLまたはMySQLへの移行を検討