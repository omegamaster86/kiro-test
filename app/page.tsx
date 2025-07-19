import { getTodos } from '@/lib/actions'
import TodoForm from '@/components/TodoForm'
import TodoFilter from '@/components/TodoFilter'
import TodoList from '@/components/TodoList'
import ErrorMessage from '@/components/ErrorMessage'

interface TodoPageProps {
  searchParams: Promise<{ filter?: 'all' | 'active' | 'completed' }>
}

export default async function TodoPage({ searchParams }: TodoPageProps) {
  // URLパラメータからフィルター状態を取得（デフォルトは'all'）
  const params = await searchParams
  const filter = params.filter || 'all'
  
  // getTodos関数を呼び出してデータを取得
  let todos: Array<{
    id: string
    title: string
    completed: boolean
    createdAt: Date
    updatedAt: Date
  }> = []
  let error: string | null = null
  
  try {
    todos = await getTodos(filter)
  } catch (err) {
    error = err instanceof Error ? err.message : 'データの取得に失敗しました'
    todos = []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ToDoリスト
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            タスクを管理して効率的に作業を進めましょう
          </p>
        </header>

        <main className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-white/20 animate-slide-up">
          {/* データ取得エラーの表示 */}
          {error && (
            <ErrorMessage 
              message={error}
              className="mb-6"
            />
          )}
          
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
