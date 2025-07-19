import { getTodos } from '@/lib/actions'
import TodoForm from '@/components/TodoForm'
import TodoFilter from '@/components/TodoFilter'
import TodoList from '@/components/TodoList'

interface TodoPageProps {
  searchParams: Promise<{ filter?: 'all' | 'active' | 'completed' }>
}

export default async function TodoPage({ searchParams }: TodoPageProps) {
  // URLパラメータからフィルター状態を取得（デフォルトは'all'）
  const params = await searchParams
  const filter = params.filter || 'all'
  
  // getTodos関数を呼び出してデータを取得
  const todos = await getTodos(filter)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ToDoリスト
          </h1>
          <p className="text-gray-600">
            タスクを管理して効率的に作業を進めましょう
          </p>
        </header>

        <main className="bg-white rounded-lg shadow-md p-6">
          {/* タスク作成フォーム */}
          <TodoForm />
          
          {/* フィルタリングオプション */}
          <TodoFilter />
          
          {/* タスクリスト */}
          <TodoList todos={todos} />
        </main>
      </div>
    </div>
  )
}
