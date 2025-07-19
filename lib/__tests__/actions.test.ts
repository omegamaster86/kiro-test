/**
 * @jest-environment node
 */

import { createTodo, toggleTodo, updateTodo, deleteTodo } from '../actions'
import { prisma } from '../prisma'

// Prismaクライアントをモック化
jest.mock('../prisma', () => ({
  prisma: {
    todo: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Next.jsのrevalidatePathをモック化
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTodo', () => {
    it('should create a new todo with valid title', async () => {
      const formData = new FormData()
      formData.append('title', 'テストタスク')

      mockPrisma.todo.create.mockResolvedValue({
        id: '1',
        title: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await expect(createTodo(formData)).resolves.not.toThrow()

      expect(mockPrisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'テストタスク',
          completed: false,
        },
      })
    })

    it('should throw error for empty title', async () => {
      const formData = new FormData()
      formData.append('title', '')

      await expect(createTodo(formData)).rejects.toThrow('タスクのタイトルを入力してください')
    })

    it('should throw error for whitespace-only title', async () => {
      const formData = new FormData()
      formData.append('title', '   ')

      await expect(createTodo(formData)).rejects.toThrow('タスクのタイトルを入力してください')
    })
  })

  describe('toggleTodo', () => {
    it('should toggle todo completion status', async () => {
      const todoId = '1'
      const mockTodo = {
        id: todoId,
        title: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.todo.findUnique.mockResolvedValue(mockTodo)
      mockPrisma.todo.update.mockResolvedValue({
        ...mockTodo,
        completed: true,
      })

      await expect(toggleTodo(todoId)).resolves.not.toThrow()

      expect(mockPrisma.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: { completed: true },
      })
    })

    it('should throw error for non-existent todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(null)

      await expect(toggleTodo('999')).rejects.toThrow('タスクの状態切り替えに失敗しました')
    })
  })

  describe('updateTodo', () => {
    it('should update todo title', async () => {
      const todoId = '1'
      const newTitle = '更新されたタスク'
      const mockTodo = {
        id: todoId,
        title: '元のタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.todo.findUnique.mockResolvedValue(mockTodo)
      mockPrisma.todo.update.mockResolvedValue({
        ...mockTodo,
        title: newTitle,
      })

      await expect(updateTodo(todoId, newTitle)).resolves.not.toThrow()

      expect(mockPrisma.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: { title: newTitle },
      })
    })

    it('should throw error for empty title', async () => {
      await expect(updateTodo('1', '')).rejects.toThrow('タスクのタイトルを入力してください')
    })

    it('should throw error for non-existent todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(null)

      await expect(updateTodo('999', '新しいタイトル')).rejects.toThrow('タスクの更新に失敗しました')
    })
  })

  describe('deleteTodo', () => {
    it('should delete existing todo', async () => {
      const todoId = '1'
      const mockTodo = {
        id: todoId,
        title: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.todo.findUnique.mockResolvedValue(mockTodo)
      mockPrisma.todo.delete.mockResolvedValue(mockTodo)

      await expect(deleteTodo(todoId)).resolves.not.toThrow()

      expect(mockPrisma.todo.delete).toHaveBeenCalledWith({
        where: { id: todoId },
      })
    })

    it('should throw error for non-existent todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(null)

      await expect(deleteTodo('999')).rejects.toThrow('タスクの削除に失敗しました')
    })
  })
})