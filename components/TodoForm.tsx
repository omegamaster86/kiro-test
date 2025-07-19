'use client'

import { createTodo } from '@/lib/actions'
import { useState, useRef } from 'react'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

export default function TodoForm() {
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  
  const maxLength = 200
  const remainingChars = maxLength - title.length

  async function handleSubmit(formData: FormData) {
    setError('')
    setIsSubmitting(true)

    try {
      await createTodo(formData)
      // フォームをリセット
      formRef.current?.reset()
      setTitle('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    // エラーをクリア
    if (error) {
      setError('')
    }
  }

  return (
    <div className="mb-6 sm:mb-8">
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleInputChange}
              placeholder="新しいタスクを入力..."
              maxLength={maxLength}
              className={`w-full px-4 py-3 sm:py-2 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base sm:text-sm ${
                remainingChars < 20 
                  ? 'border-orange-300 focus:ring-orange-500 hover:border-orange-400' 
                  : 'border-gray-300 focus:ring-blue-500 hover:border-blue-300'
              }`}
              disabled={isSubmitting}
              required
            />
            <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
              <span></span>
              <span className={remainingChars < 20 ? 'text-orange-600 font-medium' : ''}>
                {remainingChars}/{maxLength}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || title.trim().length === 0}
            className="px-6 py-3 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium shadow-md hover:shadow-lg min-w-[100px]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                追加中...
              </span>
            ) : '追加'}
          </button>
        </div>
      </form>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={() => setError('')}
          className="mt-3"
        />
      )}
    </div>
  )
}