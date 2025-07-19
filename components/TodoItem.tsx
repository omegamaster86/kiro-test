'use client'

import { toggleTodo, updateTodo, deleteTodo } from '@/lib/actions'
import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import ConfirmDialog from './ConfirmDialog'

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const maxLength = 200
  const remainingChars = maxLength - editTitle.length

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

  function handleDeleteClick() {
    setShowDeleteDialog(true)
  }

  async function handleDeleteConfirm() {
    setIsLoading(true)
    try {
      await deleteTodo(todo.id)
      setShowDeleteDialog(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  function handleDeleteCancel() {
    setShowDeleteDialog(false)
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
    <div className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-slide-in ${
      todo.completed ? 'opacity-75 hover:opacity-90' : ''
    }`}>
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading}
          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 transition-all duration-200 hover:scale-110"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value)
                  if (error) setError('')
                }}
                onBlur={handleUpdate}
                onKeyDown={handleKeyDown}
                maxLength={maxLength}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  remainingChars < 20 
                    ? 'border-orange-300 focus:ring-orange-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                autoFocus
              />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="text-gray-400">Enter: 保存 / Esc: キャンセル</span>
                <span className={remainingChars < 20 ? 'text-orange-600 font-medium' : ''}>
                  {remainingChars}/{maxLength}
                </span>
              </div>
            </div>
          ) : (
            <span
              onClick={handleTitleClick}
              className={`block cursor-pointer hover:text-blue-600 transition-all duration-200 text-sm sm:text-base break-words ${
                todo.completed 
                  ? 'line-through text-gray-500 hover:text-gray-600' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}
              title="クリックして編集"
            >
              {todo.title}
            </span>
          )}
          
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError('')}
              className="mt-2 text-xs sm:text-sm"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm">
        <span className="text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
        </span>
        
        <button
          onClick={handleDeleteClick}
          disabled={isLoading}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium border border-transparent hover:border-red-200"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : '削除'}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="タスクの削除"
        message={`「${todo.title}」を削除しますか？この操作は取り消せません。`}
        confirmText="削除"
        cancelText="キャンセル"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isLoading}
      />
    </div>
  )
}