import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TodoForm from '../TodoForm'
import { createTodo } from '@/lib/actions'

// Server Actionsをモック化
jest.mock('@/lib/actions', () => ({
  createTodo: jest.fn()
}))

const mockCreateTodo = createTodo as jest.MockedFunction<typeof createTodo>

describe('TodoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('フォームが正しくレンダリングされる', () => {
    render(<TodoForm />)
    
    expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('タスクを正常に作成できる', async () => {
    mockCreateTodo.mockResolvedValueOnce(undefined)
    
    render(<TodoForm />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'テストタスク' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith(expect.any(FormData))
    })
    
    // フォームがリセットされることを確認
    expect(input).toHaveValue('')
  })

  it('フォームの基本的な動作を確認する', async () => {
    mockCreateTodo.mockResolvedValueOnce(undefined)
    
    render(<TodoForm />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    // 初期状態の確認
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
    
    // 入力値の設定
    fireEvent.change(input, { target: { value: 'テストタスク' } })
    expect(input).toHaveValue('テストタスク')
    
    // フォーム送信
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalled()
    })
  })

  it('エラーが発生した場合にエラーメッセージを表示する', async () => {
    const errorMessage = 'タスクの作成に失敗しました'
    mockCreateTodo.mockRejectedValueOnce(new Error(errorMessage))
    
    render(<TodoForm />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'テストタスク' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('空のタイトルでは送信できない', () => {
    render(<TodoForm />)
    
    const button = screen.getByRole('button', { name: '追加' })
    
    // 空の状態で送信を試行
    fireEvent.click(button)
    
    // HTML5のrequired属性により送信されない
    expect(mockCreateTodo).not.toHaveBeenCalled()
  })
})