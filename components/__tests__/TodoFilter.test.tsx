import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import TodoFilter from '../TodoFilter'

// Next.jsのhooksをモック化
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

// URLSearchParamsのモック
const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params)
  return {
    get: (key: string) => searchParams.get(key),
    toString: () => searchParams.toString()
  }
}

describe('TodoFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    })
  })

  it('フィルターオプションが正しくレンダリングされる', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams())
    
    render(<TodoFilter />)
    
    expect(screen.getByText('全て')).toBeInTheDocument()
    expect(screen.getByText('未完了')).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('デフォルトで「全て」フィルターがアクティブになる', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams())
    
    render(<TodoFilter />)
    
    const allButton = screen.getByText('全て')
    expect(allButton).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-purple-500')
  })

  it('URLパラメータに基づいてアクティブフィルターが設定される', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams({ filter: 'active' }))
    
    render(<TodoFilter />)
    
    const activeButton = screen.getByText('未完了')
    expect(activeButton).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-purple-500')
  })

  it('「未完了」フィルターをクリックするとURLが更新される', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams())
    
    render(<TodoFilter />)
    
    const activeButton = screen.getByText('未完了')
    fireEvent.click(activeButton)
    
    expect(mockPush).toHaveBeenCalledWith('/?filter=active')
  })

  it('「完了済み」フィルターをクリックするとURLが更新される', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams())
    
    render(<TodoFilter />)
    
    const completedButton = screen.getByText('完了済み')
    fireEvent.click(completedButton)
    
    expect(mockPush).toHaveBeenCalledWith('/?filter=completed')
  })

  it('「全て」フィルターをクリックするとfilterパラメータが削除される', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams({ filter: 'active' }))
    
    render(<TodoFilter />)
    
    const allButton = screen.getByText('全て')
    fireEvent.click(allButton)
    
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('既存のURLパラメータを保持しながらフィルターを変更する', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams({ 
      filter: 'all',
      page: '2',
      sort: 'date'
    }))
    
    render(<TodoFilter />)
    
    const activeButton = screen.getByText('未完了')
    fireEvent.click(activeButton)
    
    // URLパラメータの順序は保証されないため、含まれているかどうかをチェック
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('filter=active'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=date'))
  })

  it('アクティブでないフィルターボタンは通常のスタイルを持つ', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams({ filter: 'active' }))
    
    render(<TodoFilter />)
    
    const allButton = screen.getByText('全て')
    const completedButton = screen.getByText('完了済み')
    
    expect(allButton).toHaveClass('bg-white/80', 'text-gray-700')
    expect(completedButton).toHaveClass('bg-white/80', 'text-gray-700')
  })

  it('フィルターボタンにホバー効果が適用される', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams())
    
    render(<TodoFilter />)
    
    const activeButton = screen.getByText('未完了')
    expect(activeButton).toHaveClass('hover:scale-105', 'active:scale-95')
  })

  it('無効なフィルター値の場合は全てのボタンが非アクティブになる', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams({ filter: 'invalid' }))
    
    render(<TodoFilter />)
    
    const allButton = screen.getByText('全て')
    const activeButton = screen.getByText('未完了')
    const completedButton = screen.getByText('完了済み')
    
    // 無効な値の場合、どのボタンもアクティブにならない
    expect(allButton).toHaveClass('bg-white/80', 'text-gray-700')
    expect(activeButton).toHaveClass('bg-white/80', 'text-gray-700')
    expect(completedButton).toHaveClass('bg-white/80', 'text-gray-700')
  })

  it('フィルターの切り替えが正しく動作する', () => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams())
    
    render(<TodoFilter />)
    
    // 未完了フィルターをクリック
    fireEvent.click(screen.getByText('未完了'))
    expect(mockPush).toHaveBeenCalledWith('/?filter=active')
    
    // 完了済みフィルターをクリック
    fireEvent.click(screen.getByText('完了済み'))
    expect(mockPush).toHaveBeenCalledWith('/?filter=completed')
    
    // 全てフィルターをクリック
    fireEvent.click(screen.getByText('全て'))
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})