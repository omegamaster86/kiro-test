'use client'

import { toggleTodo, updateTodo, deleteTodo } from '@/lib/actions'
import { useState } from 'react'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggle() {
    setIsLoading(true)
    try {
      await toggleTodo(todo.id)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (window.confirm('このタスクを削除しますか？')) {
      setIsLoading(true)
      try {
        await deleteTodo(todo.id)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'エラーが発生しました')
        setIsLoading(false)
      }
    }
  }

  async function handleUpdate() {
    if (editTitle.trim() === '') {
      setError('タスクのタイトルを入力してください')
      return
    }

    if (editTitle.trim() === todo.title) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await updateTodo(todo.id, editTitle.trim())
      setIsEditing(false)
      setError('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleUpdate()
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title)
      setIsEditing(false)
      setError('')
    }
  }

  function handleTitleClick() {
    if (!isLoading) {
      setIsEditing(true)
      setEditTitle(todo.title)
      setError('')
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isLoading}
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            onClick={handleTitleClick}
            className={`cursor-pointer hover:text-blue-600 ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </span>
        )}
        
        {error && (
          <div className="mt-1 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
        </span>
        
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
        >
          削除
        </button>
      </div>
    </div>
  )
}