import { render, screen } from '@testing-library/react'
import TodoPage from '../page'
import { getTodos } from '@/lib/actions'

// Server Actionsとコンポーネントをモック化
jest.mock('@/lib/actions', () => ({
  getTodos: jest.fn()
}))

jest.mock('@/components/TodoForm', () => {
  return function MockTodoForm() {
    return <div data-testid="todo-form">Todo Form</div>
  }
})

jest.mock('@/components/TodoFilter', () => {
  return function MockTodoFilter() {
    return <div data-testid="todo-filter">Todo Filter</div>
  }
})

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

jest.mock('@/components/TodoList', () => {
  return function MockTodoList({ todos }: { todos: Todo[] }) {
    return <div data-testid="todo-list">Todo List ({todos.length} items)</div>
  }
})

jest.mock('@/components/ErrorMessage', () => {
  return function MockErrorMessage({ message }: { message: string }) {
    return <div data-testid="error-message">{message}</div>
  }
})

const mockGetTodos = getTodos as jest.MockedFunction<typeof getTodos>

describe('TodoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page title and description', async () => {
    mockGetTodos.mockResolvedValue([])
    
    render(await TodoPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByText('ToDoリスト')).toBeInTheDocument()
    expect(screen.getByText('タスクを管理して効率的に作業を進めましょう')).toBeInTheDocument()
  })

  it('renders all main components', async () => {
    mockGetTodos.mockResolvedValue([])
    
    render(await TodoPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('todo-form')).toBeInTheDocument()
    expect(screen.getByTestId('todo-filter')).toBeInTheDocument()
    expect(screen.getByTestId('todo-list')).toBeInTheDocument()
  })

  it('calls getTodos with default filter "all"', async () => {
    mockGetTodos.mockResolvedValue([])
    
    render(await TodoPage({ searchParams: Promise.resolve({}) }))
    
    expect(mockGetTodos).toHaveBeenCalledWith('all')
  })

  it('calls getTodos with specified filter', async () => {
    mockGetTodos.mockResolvedValue([])
    
    render(await TodoPage({ searchParams: Promise.resolve({ filter: 'active' }) }))
    
    expect(mockGetTodos).toHaveBeenCalledWith('active')
  })

  it('passes todos data to TodoList component', async () => {
    const mockTodos: Todo[] = [
      { 
        id: 'todo-1', 
        title: 'Test Todo 1', 
        completed: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      { 
        id: 'todo-2', 
        title: 'Test Todo 2', 
        completed: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      }
    ]
    mockGetTodos.mockResolvedValue(mockTodos)
    
    render(await TodoPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByText('Todo List (2 items)')).toBeInTheDocument()
  })

  it('displays error message when getTodos throws an error', async () => {
    const errorMessage = 'データベース接続エラー'
    mockGetTodos.mockRejectedValue(new Error(errorMessage))
    
    render(await TodoPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText('Todo List (0 items)')).toBeInTheDocument()
  })

  it('displays generic error message when error is not an Error instance', async () => {
    mockGetTodos.mockRejectedValue('Unknown error')
    
    render(await TodoPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument()
    expect(screen.getByText('Todo List (0 items)')).toBeInTheDocument()
  })
})