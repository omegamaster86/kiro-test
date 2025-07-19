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
    <div className="flex gap-2 mb-6">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilterChange(option.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}