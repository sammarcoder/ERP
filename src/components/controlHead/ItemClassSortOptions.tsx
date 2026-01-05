// components/ItemClass/ItemClassSortOptions.tsx
import React from 'react'

type SortOption = 'head1' | 'head2' | null

interface ItemClassSortOptionsProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export const ItemClassSortOptions: React.FC<ItemClassSortOptionsProps> = ({
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="sortOption"
          checked={sortBy === 'head1'}
          onChange={() => onSortChange('head1')}
          className="text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Control Head 1 (A-Z)</span>
      </label>
      
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="sortOption"
          checked={sortBy === 'head2'}
          onChange={() => onSortChange('head2')}
          className="text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Control Head 2 (A-Z)</span>
      </label>
      
      {sortBy && (
        <button
          onClick={() => onSortChange(null)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear Sort
        </button>
      )}
    </div>
  )
}
