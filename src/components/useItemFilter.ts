
// useItemFilter.ts - Custom hook for filtering items
import { useState, useEffect, useMemo } from 'react'

interface Item {
  id: number;
  itemName: string;
  itemClass1?: number | null;
  itemClass2?: number | null;
  itemClass3?: number | null;
  itemClass4?: number | null;
  [key: string]: any; // for other item properties
}

interface ClassFilters {
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
}

interface UseItemFilterProps {
  items: Item[];
  classFilters: ClassFilters;
}

export const useItemFilter = ({ items, classFilters }: UseItemFilterProps) => {
  // Memoized filtered items based on class selections
  const filteredItems = useMemo(() => {
    console.log('useItemFilter - Input data:', { items: items?.length, classFilters })
    
    if (!items || items.length === 0) return []

    // Check if any class filters are applied
    const hasClassFilters = Object.values(classFilters).some(value => value !== null && value !== undefined)
    
    console.log('useItemFilter - Has class filters:', hasClassFilters)
    
    if (!hasClassFilters) {
      console.log('useItemFilter - No filters, returning all items:', items.length)
      return items // Return all items if no filters applied
    }

    const filtered = items.filter(item => {
      let matchesFilters = true

      // Check each class filter - item must match ALL selected classes (AND logic)
      if (classFilters.itemClass1 !== null && classFilters.itemClass1 !== undefined) {
        const itemValue = Number(item.itemClass1)
        const filterValue = Number(classFilters.itemClass1)
        const matches = itemValue === filterValue
        console.log(`itemClass1 filter: item.itemClass1=${itemValue}, filter=${filterValue}, matches=${matches}`)
        matchesFilters = matchesFilters && matches
      }

      if (classFilters.itemClass2 !== null && classFilters.itemClass2 !== undefined) {
        const itemValue = Number(item.itemClass2)
        const filterValue = Number(classFilters.itemClass2)
        const matches = itemValue === filterValue
        console.log(`itemClass2 filter: item.itemClass2=${itemValue}, filter=${filterValue}, matches=${matches}`)
        matchesFilters = matchesFilters && matches
      }

      if (classFilters.itemClass3 !== null && classFilters.itemClass3 !== undefined) {
        const itemValue = Number(item.itemClass3)
        const filterValue = Number(classFilters.itemClass3)
        const matches = itemValue === filterValue
        console.log(`itemClass3 filter: item.itemClass3=${itemValue}, filter=${filterValue}, matches=${matches}`)
        matchesFilters = matchesFilters && matches
      }

      if (classFilters.itemClass4 !== null && classFilters.itemClass4 !== undefined) {
        const itemValue = Number(item.itemClass4)
        const filterValue = Number(classFilters.itemClass4)
        const matches = itemValue === filterValue
        console.log(`itemClass4 filter: item.itemClass4=${itemValue}, filter=${filterValue}, matches=${matches}`)
        matchesFilters = matchesFilters && matches
      }

      console.log(`Item ${item.itemName}: matchesFilters=${matchesFilters}`, {
        itemClass1: item.itemClass1,
        itemClass2: item.itemClass2,
        itemClass3: item.itemClass3,
        itemClass4: item.itemClass4
      })

      return matchesFilters
    })

    console.log('useItemFilter - Filtered results:', filtered.length, filtered.map(i => i.itemName))
    return filtered
  }, [items, classFilters])

  // Get active filter count for UI display
  const activeFilterCount = useMemo(() => {
    return Object.values(classFilters).filter(value => value !== null).length
  }, [classFilters])

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filters: { key: string; value: number; label: string }[] = []
    
    Object.entries(classFilters).forEach(([key, value]) => {
      if (value !== null) {
        filters.push({
          key,
          value,
          label: key.replace('itemClass', 'Class ')
        })
      }
    })
    
    return filters
  }, [classFilters])

  return {
    filteredItems,
    activeFilterCount,
    activeFilters,
    totalItems: items.length,
    filteredCount: filteredItems.length
  }
}