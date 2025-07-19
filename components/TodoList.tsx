import TodoItem from './TodoItem'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 text-gray-500 animate-fade-in">
        <div className="mb-4">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-lg sm:text-xl font-medium mb-2">タスクがありません</p>
        <p className="text-sm sm:text-base text-gray-400">上のフォームから新しいタスクを追加してください</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {todos.map((todo, index) => (
        <div 
          key={todo.id} 
          className="animate-slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TodoItem todo={todo} />
        </div>
      ))}
    </div>
  )
}