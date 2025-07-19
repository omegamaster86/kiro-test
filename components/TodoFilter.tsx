'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type FilterType = 'all' | 'active' | 'completed'

interface FilterOption {
  value: FilterType
  label: string
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: '全て' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' }
]

export default function TodoFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = (searchParams.get('filter') as FilterType) || 'all'

  function handleFilterChange(filter: FilterType) {
    const params = new URLSearchParams(searchParams.toString())
    
    if (filter === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', filter)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/?${queryString}` : '/'
    
    router.push(url)
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilterChange(option.value)}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            currentFilter === option.value
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200 hover:border-blue-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}