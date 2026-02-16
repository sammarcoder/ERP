// components/recipe/RecipeList.tsx

'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetAllRecipesQuery,
  useDeleteRecipeMutation,
  useToggleRecipeStatusMutation,
  Recipe
} from '@/store/slice/recipeSlice'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import {ConfirmationModal} from '@/components/common/ConfirmationModal'
import {
  Plus, Edit2, Trash2, Eye, Search, FlaskConical, CheckCircle, XCircle
} from 'lucide-react'
import { clsx } from 'clsx'

const RecipeList: React.FC = () => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: recipes = [], isLoading, isError } = useGetAllRecipesQuery()
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation()
  const [toggleStatus] = useToggleRecipeStatusMutation()

  // =============================================
  // FILTERED DATA
  // =============================================

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes

    const search = searchTerm.toLowerCase()
    return recipes.filter(recipe =>
      recipe.item?.itemName?.toLowerCase().includes(search)
    )
  }, [recipes, searchTerm])

  // =============================================
  // HANDLERS
  // =============================================

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteRecipe(deleteId).unwrap()
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap()
    } catch (error) {
      console.error('Toggle status error:', error)
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (isLoading) {
    return <Loading size="lg" text="Loading recipes..." />
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FlaskConical className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Recipes / BOM</h1>
              <p className="text-blue-100 mt-1">Manage product recipes and bill of materials</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/recipe/create')}
            icon={<Plus className="w-4 h-4" />}
            className="bg-white text-[#509ee3] hover:bg-gray-100"
          >
            Add Recipe
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by item name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No Recipes Found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first recipe to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">UOM</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Components</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecipes.map((recipe, index) => (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {recipe.item?.itemName || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {recipe.qty}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {recipe.uom?.uom || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {recipe.details?.length || 0} items
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(recipe.id)}
                      className={clsx(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        recipe.status
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      )}
                    >
                      {recipe.status ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push(`/recipe/${recipe.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/recipe/edit/${recipe.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(recipe.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={isDeleting}
      />
    </div>
  )
}

export default RecipeList
