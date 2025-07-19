import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TodoItem from '../TodoItem'
import { toggleTodo, updateTodo, deleteTodo } from '@/lib/actions'

// Server Actionsをモック化
jest.mock('@/lib/actions', () => ({
  toggleTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn()
}))

const mockToggleTodo = toggleTodo as jest.MockedFunction<typeof toggleTodo>
const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
const mockDeleteTodo = deleteTodo as jest.MockedFunction<typeof deleteTodo>

const mockTodo = {
  id: '1',
  title: 'テストタスク',
  completed: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}

const completedTodo = {
  ...mockTodo,
  id: '2',
  title: '完了済みタスク',
  completed: true
}

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('未完了タスクが正しくレンダリングされる', () => {
    render(<TodoItem todo={mockTodo} />)
    
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByText('削除')).toBeInTheDocument()
    expect(screen.getByText('2024/1/1')).toBeInTheDocument()
  })

  it('完了済みタスクが正しくレンダリングされる', () => {
    render(<TodoItem todo={completedTodo} />)
    
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByText(completedTodo.title)).toHaveClass('line-through')
  })

  it('チェックボックスをクリックして完了状態を切り替えできる', async () => {
    mockToggleTodo.mockResolvedValueOnce(undefined)
    
    render(<TodoItem todo={mockTodo} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    await waitFor(() => {
      expect(mockToggleTodo).toHaveBeenCalledWith(mockTodo.id)
    })
  })

  it('タスクタイトルをクリックして編集モードに入る', () => {
    render(<TodoItem todo={mockTodo} />)
    
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument()
    expect(screen.getByText('Enter: 保存 / Esc: キャンセル')).toBeInTheDocument()
  })

  it('編集モードでタイトルを更新できる', async () => {
    mockUpdateTodo.mockResolvedValueOnce(undefined)
    
    render(<TodoItem todo={mockTodo} />)
    
    // 編集モードに入る
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    // タイトルを変更
    const input = screen.getByDisplayValue(mockTodo.title)
    fireEvent.change(input, { target: { value: '更新されたタスク' } })
    
    // Enterキーで保存
    fireEvent.keyDown(input, { key: 'Enter' })
    
    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith(mockTodo.id, '更新されたタスク')
    })
  })

  it('編集モードでEscキーを押すとキャンセルされる', () => {
    render(<TodoItem todo={mockTodo} />)
    
    // 編集モードに入る
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    // タイトルを変更
    const input = screen.getByDisplayValue(mockTodo.title)
    fireEvent.change(input, { target: { value: '変更されたタスク' } })
    
    // Escキーでキャンセル
    fireEvent.keyDown(input, { key: 'Escape' })
    
    // 元のタイトルが表示される
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
    expect(mockUpdateTodo).not.toHaveBeenCalled()
  })

  it('空のタイトルで更新しようとするとエラーが表示される', async () => {
    render(<TodoItem todo={mockTodo} />)
    
    // 編集モードに入る
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    // タイトルを空にする
    const input = screen.getByDisplayValue(mockTodo.title)
    fireEvent.change(input, { target: { value: '' } })
    
    // Enterキーで保存を試行
    fireEvent.keyDown(input, { key: 'Enter' })
    
    await waitFor(() => {
      expect(screen.getByText('タスクのタイトルを入力してください')).toBeInTheDocument()
    })
    
    expect(mockUpdateTodo).not.toHaveBeenCalled()
  })

  it('削除ボタンをクリックして確認ダイアログが表示される', () => {
    render(<TodoItem todo={mockTodo} />)
    
    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('タスクの削除')).toBeInTheDocument()
    expect(screen.getByText(`「${mockTodo.title}」を削除しますか？この操作は取り消せません。`)).toBeInTheDocument()
  })

  it('削除を確認するとタスクが削除される', async () => {
    mockDeleteTodo.mockResolvedValueOnce(undefined)
    
    render(<TodoItem todo={mockTodo} />)
    
    // 削除ボタンをクリック
    const deleteButtons = screen.getAllByText('削除')
    fireEvent.click(deleteButtons[0]) // TodoItem内の削除ボタン
    
    // 確認ダイアログが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText('タスクの削除')).toBeInTheDocument()
    })
    
    // 確認ダイアログで削除を確認（ダイアログ内の削除ボタンを取得）
    const allDeleteButtons = screen.getAllByText('削除')
    const confirmButton = allDeleteButtons[1] // ダイアログ内の削除ボタン
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo.id)
    })
  })

  it('削除をキャンセルするとタスクが削除されない', () => {
    render(<TodoItem todo={mockTodo} />)
    
    // 削除ボタンをクリック
    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)
    
    // 確認ダイアログでキャンセル
    const cancelButton = screen.getByText('キャンセル')
    fireEvent.click(cancelButton)
    
    expect(mockDeleteTodo).not.toHaveBeenCalled()
    expect(screen.queryByText('タスクの削除')).not.toBeInTheDocument()
  })

  it('toggleTodoでエラーが発生した場合にエラーメッセージが表示される', async () => {
    const errorMessage = 'タスクの更新に失敗しました'
    mockToggleTodo.mockRejectedValueOnce(new Error(errorMessage))
    
    render(<TodoItem todo={mockTodo} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('updateTodoでエラーが発生した場合にエラーメッセージが表示される', async () => {
    const errorMessage = 'タスクの更新に失敗しました'
    mockUpdateTodo.mockRejectedValueOnce(new Error(errorMessage))
    
    render(<TodoItem todo={mockTodo} />)
    
    // 編集モードに入る
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    // タイトルを変更
    const input = screen.getByDisplayValue(mockTodo.title)
    fireEvent.change(input, { target: { value: '更新されたタスク' } })
    
    // Enterキーで保存
    fireEvent.keyDown(input, { key: 'Enter' })
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('文字数制限が正しく表示される', () => {
    render(<TodoItem todo={mockTodo} />)
    
    // 編集モードに入る
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    // 文字数カウンターが表示される
    expect(screen.getByText(/\/200/)).toBeInTheDocument()
  })

  it('文字数制限に近づくと警告色が表示される', () => {
    render(<TodoItem todo={mockTodo} />)
    
    // 編集モードに入る
    const titleElement = screen.getByText(mockTodo.title)
    fireEvent.click(titleElement)
    
    // 長いテキストを入力
    const input = screen.getByDisplayValue(mockTodo.title)
    const longText = 'a'.repeat(185) // 200文字制限の15文字手前
    fireEvent.change(input, { target: { value: longText } })
    
    // 警告色のクラスが適用される
    const counter = screen.getByText(/15\/200/)
    expect(counter).toHaveClass('text-orange-600')
  })
})