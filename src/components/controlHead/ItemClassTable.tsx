// components/ItemClass/ItemClassTable.tsx
import React from 'react'
import { ItemClass } from '@/types/itemsClass'
import { Button } from '../ui/Button'

interface ItemClassTableProps {
  itemClasses: ItemClass[]
  searchTerm: string
  onEdit: (itemClass: ItemClass) => void
  onDelete: (itemClass: ItemClass) => void
  onClearSearch: () => void
}

export const ItemClassTable: React.FC<ItemClassTableProps> = ({
  itemClasses,
  searchTerm,
  onEdit,
  onDelete,
  onClearSearch
}) => {
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    return text.replace(
      new RegExp(`(${searchTerm})`, 'gi'),
      '<mark class="bg-yellow-200">$1</mark>'
    )
  }

  if (itemClasses.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Control Head 2 Records
          </h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          {searchTerm ? (
            <div>
              <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
              <p className="text-sm">Try adjusting your search terms or clear the search to see all records.</p>
              <Button variant="secondary" onClick={onClearSearch} className="mt-4">
                Clear Search
              </Button>
            </div>
          ) : (
            'No control head 2 records found. Add your first record above.'
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Control Head 2 Records
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Control Head 2
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent (Control Head 1)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itemClasses.map((itemClass) => (
              <tr key={itemClass.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">
                        {itemClass.id}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {searchTerm ? (
                          <span dangerouslySetInnerHTML={{
                            __html: highlightSearchTerm(itemClass.zHead2, searchTerm)
                          }} />
                        ) : (
                          itemClass.zHead2
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {itemClass.id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {searchTerm && itemClass["Control-Head-2"]?.zHead1 ? (
                      <span dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(itemClass["Control-Head-2"].zHead1, searchTerm)
                      }} />
                    ) : (
                      itemClass["Control-Head-2"]?.zHead1 || `Head1 ID: ${itemClass.zHead1Id}`
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Parent ID: {itemClass.zHead1Id}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => onEdit(itemClass)}
                      className="px-3 py-1 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(itemClass)}
                      className="px-3 py-1 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
