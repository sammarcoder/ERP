// components/ItemClass/ItemClassSearchBar.tsx
import React from 'react'
import { Button } from '../ui/Button'

interface ItemClassSearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  filteredCount: number
  totalCount: number
  onAddNew: () => void
}

export const ItemClassSearchBar: React.FC<ItemClassSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  filteredCount,
  totalCount,
  onAddNew
}) => {
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex justify-between w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Control Head 2 name, Parent name, or ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button onClick={onAddNew}>
            Add New Control Head 2
          </Button>
        </div>

        {searchTerm && (
          <Button
            variant="secondary"
            onClick={onClearSearch}
            className="flex items-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear</span>
          </Button>
        )}
      </div>

      {searchTerm && (
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">{filteredCount}</span> results found for
          <span className="font-medium text-blue-600"> "{searchTerm}"</span>
        </div>
      )}
    </div>
  )
}
