// components/ui/RecipeSelector.tsx

'use client'
import React, { useState, useMemo } from 'react'
import { useGetAllRecipesQuery } from '@/store/slice/recipeSlice'
import { Search, X, Check, Loader2, FlaskConical } from 'lucide-react'

interface RecipeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (recipe: any) => void
  excludeIds?: number[]
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  excludeIds = []
}) => {
  const [search, setSearch] = useState('')
  const { data: recipes = [], isLoading } = useGetAllRecipesQuery()

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe: any) => {
      if (excludeIds.includes(recipe.id)) return false
      if (!recipe.status) return false // Only active recipes
      
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        return recipe.item?.itemName?.toLowerCase().includes(searchLower)
      }
      return true
    })
  }, [recipes, search, excludeIds])

  const handleSelect = (recipe: any) => {
    onSelect(recipe)
    setSearch('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-t-lg text-white">
          <div className="flex items-center">
            <FlaskConical className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Select Recipe</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#509ee3]" />
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FlaskConical className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recipes found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRecipes.map((recipe: any) => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelect(recipe)}
                  className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-[#509ee3]/10 border border-transparent hover:border-[#509ee3] transition-colors"
                >
                  <FlaskConical className="w-5 h-5 mr-3 text-orange-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{recipe.item?.itemName}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {recipe.qty} | Components: {recipe.details?.length || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeSelector
