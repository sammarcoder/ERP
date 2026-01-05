// hooks/useItemClassSort.ts
import { useState, useMemo, useCallback } from 'react'
import { ItemClass } from '@/types/itemsClass'

type SortOption = 'head1' | 'head2' | null

export const useItemClassSort = (itemClasses: ItemClass[]) => {
  const [sortBy, setSortBy] = useState<SortOption>(null)

  const sortedItemClasses = useMemo(() => {
    if (!sortBy) return itemClasses

    return [...itemClasses].sort((a, b) => {
      if (sortBy === 'head1') {
        // Sort by Control Head 1 (parent name) ascending
        const aName = a["Control-Head-2"]?.zHead1 || `Head1 ID: ${a.zHead1Id}`
        const bName = b["Control-Head-2"]?.zHead1 || `Head1 ID: ${b.zHead1Id}`
        return aName.localeCompare(bName)
      } else if (sortBy === 'head2') {
        // Sort by Control Head 2 name ascending
        return a.zHead2.localeCompare(b.zHead2)
      }
      return 0
    })
  }, [itemClasses, sortBy])

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(current => current === newSort ? null : newSort)
  }, [])

  return {
    sortBy,
    sortedItemClasses,
    handleSortChange
  }
}
