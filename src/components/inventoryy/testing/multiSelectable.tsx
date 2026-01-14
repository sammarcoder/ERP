// components/inventoryy/testing/multiSelectable.tsx - IMPROVED UI
import React, { useState, useMemo, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

interface Props {
  isPurchase?: boolean
  preSelectedIds?: number[]
  onSelectionChange?: (selected: any[]) => void
  editable?: boolean
}

export const MultiSelectItemTable: React.FC<Props> = ({
  isPurchase = false,
  preSelectedIds = [],
  onSelectionChange,
  editable = true
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilters, setClassFilters] = useState({
    class1: '',
    class2: '',
    class3: '',
    class4: ''
  })
  
  const appliedPreSelectedKeyRef = React.useRef<string>('')
  const lastSentRef = React.useRef<string>('')

  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
  const allItems: any[] = itemsResponse?.data || []

  const extractItemData = (item: any) => ({
    id: item.id,
    itemName: item.itemName,
    sellingPrice: item.sellingPrice,
    purchasePricePKR: item.purchasePricePKR,
    barCode: item.barCode,
    uom1: item.skuUOM,
    uom1_name: item.uom1?.uom,
    qyt_1: item.uom1_qyt,
    uom2: item.uom2,
    uom2_name: item.uomTwo?.uom,
    qty_2: item.uom2_qty,
    uom3: item.uom3,
    uom3_name: item.uomThree?.uom,
    qty_3: item.uom3_qty,
    itemClass1: item.itemClass1,
    itemClass2: item.itemClass2,
    itemClass3: item.itemClass3,
    itemClass4: item.itemClass4
  })

  const classOptions = useMemo(() => ({
    class1: [...new Set(allItems.map(i => i.itemClass1).filter(Boolean))],
    class2: [...new Set(allItems.map(i => i.itemClass2).filter(Boolean))],
    class3: [...new Set(allItems.map(i => i.itemClass3).filter(Boolean))],
    class4: [...new Set(allItems.map(i => i.itemClass4).filter(Boolean))]
  }), [allItems])

  useEffect(() => {
    if (allItems.length === 0) return

    const preKey = JSON.stringify(preSelectedIds || [])
    if (preKey !== appliedPreSelectedKeyRef.current) {
      appliedPreSelectedKeyRef.current = preKey
      const mapped = new Set<number>()
      preSelectedIds?.forEach((pre) => {
        const found = allItems.find(it =>
          String(it.id) === String(pre) ||
          String(it.Item_ID) === String(pre) ||
          String(it.barCode) === String(pre)
        )
        if (found) mapped.add(found.id)
      })
      
      const currentArray = Array.from(selectedIds).sort()
      const mappedArray = Array.from(mapped).sort()
      const isEqual = currentArray.length === mappedArray.length && currentArray.every((v, i) => v === mappedArray[i])
      if (!isEqual) {
        setSelectedIds(mapped)
        return
      }
    }

    const selectedArray = Array.from(selectedIds)
    const extracted = allItems
      .filter(item => selectedArray.includes(item.id))
      .map(extractItemData)

    const extractedKey = JSON.stringify(extracted.map(i => i.id).sort())
    if (extractedKey !== lastSentRef.current) {
      lastSentRef.current = extractedKey
      onSelectionChange?.(extracted)
    }
  }, [allItems.length, Array.from(selectedIds).join(','), preSelectedIds])

  const filteredItems = useMemo(() => {
    let filtered = allItems

    if (classFilters.class1) filtered = filtered.filter(i => i.itemClass1 === parseInt(classFilters.class1))
    if (classFilters.class2) filtered = filtered.filter(i => i.itemClass2 === parseInt(classFilters.class2))
    if (classFilters.class3) filtered = filtered.filter(i => i.itemClass3 === parseInt(classFilters.class3))
    if (classFilters.class4) filtered = filtered.filter(i => i.itemClass4 === parseInt(classFilters.class4))

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.itemName?.toLowerCase().includes(search) ||
        item.barCode?.toString().includes(search) ||
        item.id.toString().includes(search)
      )
    }

    return filtered
  }, [allItems, searchTerm, classFilters])

  useEffect(() => {
    if (editable) appliedPreSelectedKeyRef.current = ''
  }, [editable])

  const handleSelect = (id: number) => {
    if (!editable) return
    setSelectedIds(prev => new Set([...prev, id]))
  }

  const handleRemove = (id: number) => {
    if (!editable) return
    setSelectedIds(prev => {
      const s = new Set(prev)
      s.delete(id)
      return s
    })
  }

  if (isLoading) return <div className="text-center py-8">Loading items...</div>

  return (
    <div>
      {editable && (
        <>
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by name, barcode, ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              {['class1', 'class2', 'class3', 'class4'].map(cls => (
                <select
                  key={cls}
                  value={classFilters[cls as keyof typeof classFilters]}
                  onChange={(e) => setClassFilters(prev => ({ ...prev, [cls]: e.target.value }))}
                  className="border rounded px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All {cls.replace('class', 'Class ')}</option>
                  {classOptions[cls as keyof typeof classOptions].map((val: any) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <div className="overflow-auto max-h-[60vh] border rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">UOM Conversions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => {
                  const isSelected = selectedIds.has(item.id)
                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => (isSelected ? handleRemove(item.id) : handleSelect(item.id))} 
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3">
                        {isSelected ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Added
                          </span>
                        ) : (
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            checked={false}
                            readOnly
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        {item.barCode && <div className="text-xs text-gray-500">Barcode: {item.barCode}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-4 items-center">
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm font-medium text-blue-600">
                              1 {item.uom1?.uom || 'Unit'}
                            </span>
                          </div>
                          {item.uom2 && item.uomTwo?.uom && (
                            <div className="flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-sm text-green-600">
                                {item.uom2_qty} {item.uom1?.uom} / {item.uomTwo.uom}
                              </span>
                            </div>
                          )}
                          {item.uom3 && item.uomThree?.uom && (
                            <div className="flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              <span className="text-sm text-yellow-600">
                                {item.uom3_qty} {item.uom1?.uom} / {item.uomThree.uom}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isPurchase ? item.purchasePricePKR : item.sellingPrice}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredItems.length} items | Selected: {selectedIds.size}
          </div>
        </>
      )}
    </div>
  )
}
