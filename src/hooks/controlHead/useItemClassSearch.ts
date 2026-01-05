// hooks/useItemClassSearch.ts
import { useState, useMemo, useCallback } from 'react'
import { ItemClass } from '@/types/itemsClass'

export const useItemClassSearch = (itemClasses: ItemClass[]) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItemClasses = useMemo(() => {
    if (!searchTerm.trim()) return itemClasses

    return itemClasses.filter(itemClass =>
      itemClass.zHead2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemClass["Control-Head-2"]?.zHead1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemClass.zHead1Id.toString().includes(searchTerm) ||
      itemClass.id.toString().includes(searchTerm)
    )
  }, [itemClasses, searchTerm])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  return {
    searchTerm,
    filteredItemClasses,
    clearSearch,
    handleSearchChange
  }
}
