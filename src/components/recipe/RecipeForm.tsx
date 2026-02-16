// // components/recipe/RecipeForm.tsx

// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   useGetRecipeByIdQuery,
//   useCreateRecipeMutation,
//   useUpdateRecipeMutation,
//   useGetUsedItemIdsQuery,
// } from '@/store/slice/recipeSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import { ItemSearchableInput } from '@/components/common/items/ItemSearchableInput'
// import UomConverter from '@/components/common/items/UomConverter'
// import { MultiSelectItemTable } from '@/components/common/items/MultiSelectItemTable'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import {
//   Save, ArrowLeft, AlertCircle, Package, Plus, Trash2, FlaskConical,Clock
// } from 'lucide-react'




// // =============================================
// // TYPES
// // =============================================

// interface RecipeFormProps {
//   mode: 'create' | 'edit'
//   id?: number
// }

// interface UomData {
//   primary: { id: number; name: string; qty: number }
//   secondary?: { id: number; name: string; qty: number }
//   tertiary?: { id: number; name: string; qty: number }
// }

// interface DetailItem {
//   id?: number
//   Item_id: number
//   itemName: string
//   qty: number
//   Uom_Id: number | null
//   uom1_qty: number
//   uom2_qty: number
//   uom3_qty: number
//   sale_unit: number
//   uomData: UomData | null
// }

// // =============================================
// // HELPER: Build UOM Data from Item
// // =============================================

// const buildUomData = (item: any): UomData | null => {
//   if (!item) return null

//   const uomData: UomData = {
//     primary: {
//       id: item.skuUOM || item.uom1?.id || 0,
//       name: item.uom1?.uom || 'Unit',
//       qty: item.uom1_qyt || 1
//     }
//   }

//   if (item.uomTwo && item.uom2_qty) {
//     uomData.secondary = {
//       id: item.uom2 || item.uomTwo?.id || 0,
//       name: item.uomTwo?.uom || '',
//       qty: parseFloat(item.uom2_qty) || 1
//     }
//   }

//   if (item.uomThree && item.uom3_qty) {
//     uomData.tertiary = {
//       id: item.uom3 || item.uomThree?.id || 0,
//       name: item.uomThree?.uom || '',
//       qty: parseFloat(item.uom3_qty) || 1
//     }
//   }

//   return uomData
// }

// // =============================================
// // COMPONENT
// // =============================================

// const RecipeForm: React.FC<RecipeFormProps> = ({ mode, id }) => {
//   const router = useRouter()

//   // =============================================
//   // STATE
//   // =============================================

//   const [formData, setFormData] = useState({
//     Item_id: null as number | null,
//     itemName: '',
//     qty: 1,
//     Uom_Id: null as number | null,
//     uom1_qty: 0,
//     uom2_qty: 0,
//     uom3_qty: 0,
//     sale_unit: 3,
//     uomData: null as UomData | null,
//     timeRequired: ''
//   })

//   const [details, setDetails] = useState<DetailItem[]>([])
//   const [showItemModal, setShowItemModal] = useState(false)

//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [apiError, setApiError] = useState('')
//   const [showConfirm, setShowConfirm] = useState(false)

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const { data: editData, isLoading: isLoadingEdit } = useGetRecipeByIdQuery(id!, {
//     skip: mode !== 'edit' || !id
//   })

//   const { data: usedItemIds = [] } = useGetUsedItemIdsQuery(mode === 'edit' ? id : undefined)

//   const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation()
//   const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation()

//   // =============================================
//   // POPULATE FORM IN EDIT MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'edit' && editData) {
//       const uomData = buildUomData(editData.item)

//       setFormData({
//         Item_id: editData.Item_id,
//         itemName: editData.item?.itemName || '',
//         qty: editData.qty || 1,
//         Uom_Id: editData.Uom_Id,
//         uom1_qty: editData.qty || 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 3,
//         uomData,
//         timeRequired: editData.timeRequired?.toString() || ''
//       })

//       if (editData.details && editData.details.length > 0) {
//         const detailItems: DetailItem[] = editData.details.map(d => {
//           const itemUomData = buildUomData(d.item)
//           return {
//             id: d.id,
//             Item_id: d.Item_id,
//             itemName: d.item?.itemName || '',
//             qty: d.qty || 1,
//             Uom_Id: d.Uom_Id,
//             uom1_qty: d.qty || 0,
//             uom2_qty: 0,
//             uom3_qty: 0,
//             sale_unit: 3,
//             uomData: itemUomData
//           }
//         })
//         setDetails(detailItems)
//       }
//     }
//   }, [mode, editData])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   const handleMainItemChange = useCallback((itemId: number | null, itemData?: any) => {
//     const uomData = buildUomData(itemData)

//     setFormData(prev => ({
//       ...prev,
//       Item_id: itemId,
//       itemName: itemData?.itemName || '',
//       Uom_Id: itemData?.skuUOM || null,
//       uomData
//     }))
//     setErrors(prev => ({ ...prev, Item_id: '' }))
//   }, [])

//   const handleMainUomChange = useCallback((data: any) => {
//     setFormData(prev => ({
//       ...prev,
//       qty: data.uom1_qty || 0,
//       uom1_qty: data.uom1_qty || 0,
//       uom2_qty: data.uom2_qty || 0,
//       uom3_qty: data.uom3_qty || 0,
//       sale_unit: data.sale_unit || 3,
//       Uom_Id: data.Uom_Id || null
//     }))
//   }, [])

//   const handleAddItems = useCallback((selectedItems: any[]) => {
//     const newDetails: DetailItem[] = selectedItems.map(item => {
//       const uomData = buildUomData(item)
//       return {
//         Item_id: item.id,
//         itemName: item.itemName,
//         qty: 1,
//         Uom_Id: item.skuUOM || null,
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 3,
//         uomData
//       }
//     })

//     // Filter out duplicates
//     const existingIds = details.map(d => d.Item_id)
//     const filteredNew = newDetails.filter(d => !existingIds.includes(d.Item_id))

//     // Also exclude main item
//     const finalNew = filteredNew.filter(d => d.Item_id !== formData.Item_id)

//     setDetails(prev => [...prev, ...finalNew])
//     setShowItemModal(false)
//   }, [details, formData.Item_id])

//   const handleDetailUomChange = useCallback((index: number, data: any) => {
//     setDetails(prev => {
//       const updated = [...prev]
//       updated[index] = {
//         ...updated[index],
//         qty: data.uom1_qty || 0,
//         uom1_qty: data.uom1_qty || 0,
//         uom2_qty: data.uom2_qty || 0,
//         uom3_qty: data.uom3_qty || 0,
//         sale_unit: data.sale_unit || 3,
//         Uom_Id: data.Uom_Id || null
//       }
//       return updated
//     })
//   }, [])

//   const handleRemoveDetail = useCallback((index: number) => {
//     setDetails(prev => prev.filter((_, i) => i !== index))
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validate = useCallback(() => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.Item_id) {
//       newErrors.Item_id = 'Finished product is required'
//     }

//     if (formData.uom1_qty <= 0 && formData.uom2_qty <= 0 && formData.uom3_qty <= 0) {
//       newErrors.qty = 'Quantity is required'
//     }

//     if (details.length === 0) {
//       newErrors.details = 'At least one component is required'
//     }

//     // Check if all details have qty
//     const hasEmptyQty = details.some(d => d.uom1_qty <= 0 && d.uom2_qty <= 0 && d.uom3_qty <= 0)
//     if (hasEmptyQty) {
//       newErrors.details = 'All components must have quantity'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData, details])

//   const handleSaveClick = useCallback(() => {
//     if (validate()) setShowConfirm(true)
//   }, [validate])

//   // =============================================
//   // SAVE
//   // =============================================

//   const handleConfirmSave = useCallback(async () => {
//     setShowConfirm(false)

//     const payload = {
//       Item_id: formData.Item_id!,
//       qty: formData.uom1_qty || formData.qty || 1,
//       Uom_Id: formData.Uom_Id || null,
//       timeRequired: parseInt(formData.timeRequired) || 0,
//       details: details.map(d => ({
//         Item_id: d.Item_id,
//         qty: d.uom1_qty || d.qty || 1,
//         Uom_Id: d.Uom_Id || null
//       }))
//     }

//     try {
//       if (mode === 'create') {
//         await createRecipe(payload).unwrap()
//       } else {
//         await updateRecipe({ id: id!, ...payload }).unwrap()
//       }
//       router.push('/recipe')
//     } catch (error: any) {
//       setApiError(error?.data?.message || 'Failed to save recipe')
//     }
//   }, [mode, id, formData, details, createRecipe, updateRecipe, router])

//   // =============================================
//   // LOADING
//   // =============================================

//   if (mode === 'edit' && isLoadingEdit) {
//     return <Loading size="lg" text="Loading Recipe..." />
//   }

//   // =============================================
//   // EXCLUDED ITEMS
//   // =============================================

//   const excludedItemIds = [
//     ...(formData.Item_id ? [formData.Item_id] : []),
//     ...details.map(d => d.Item_id),
//     ...usedItemIds
//   ]

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <FlaskConical className="w-8 h-8 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {mode === 'create' ? 'Create New Recipe' : 'Edit Recipe'}
//               </h1>
//               <p className="text-blue-100 mt-1">
//                 {mode === 'create' ? 'Define product components' : `Editing Recipe #${id}`}
//               </p>
//             </div>
//           </div>
//           <Button
//             variant="secondary"
//             onClick={() => router.push('/recipe')}
//             icon={<ArrowLeft className="w-4 h-4" />}
//             className="bg-white text-[#509ee3] hover:bg-gray-100"
//           >
//             Back to List
//           </Button>
//         </div>
//       </div>

//       {/* Error */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600" />
//           <span className="text-red-700">{apiError}</span>
//         </div>
//       )}

//       {/* Main Section: Finished Product */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//           <Package className="w-5 h-5 mr-2 text-[#509ee3]" />
//           Finished Product
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Item */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Item <span className="text-red-500">*</span>
//             </label>
//             <ItemSearchableInput
//               value={formData.Item_id}
//               onChange={handleMainItemChange}
//               excludeIds={usedItemIds.filter(usedId => usedId !== formData.Item_id)}
//               placeholder="Select finished product..."
//               clearable
//             />
//             {errors.Item_id && <p className="mt-1 text-sm text-red-600">{errors.Item_id}</p>}
//           </div>

//           {/* UOM Converter - UOM1 & UOM3 ReadOnly */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Quantity & UOM <span className="text-red-500">*</span>
//             </label>
//             {formData.uomData ? (
//               <UomConverter
//                 uomData={formData.uomData}
//                 lineIndex={0}
//                 onChange={handleMainUomChange}
//                 initialValues={{
//                   uom1_qty: formData.uom1_qty?.toString() || '',
//                   uom2_qty: formData.uom2_qty?.toString() || '',
//                   uom3_qty: formData.uom3_qty?.toString() || '',
//                   sale_unit: formData.sale_unit?.toString() || '3'
//                 }}
//                 readOnly={{ primary: true, tertiary: true }}  // ✅ UOM1 & UOM3 ReadOnly
//               />
//             ) : (
//               <div className="text-sm text-gray-400 py-2">Select an item first</div>
//             )}
//             {errors.qty && <p className="mt-1 text-sm text-red-600">{errors.qty}</p>}
//           </div>

//           {/* Time Required */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <Clock className="w-4 h-4 inline mr-1" />
//               Time Required (minutes)
//             </label>
//             <input
//               type="number"
//               value={formData.timeRequired}
//               onChange={(e) => setFormData(prev => ({ ...prev, timeRequired: e.target.value }))}
//               placeholder="0"
//               min="0"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] focus:border-transparent"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Details Section: Components */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//             <FlaskConical className="w-5 h-5 mr-2 text-orange-500" />
//             Components / Raw Materials
//             <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//               {details.length} item{details.length !== 1 ? 's' : ''}
//             </span>
//           </h2>
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => setShowItemModal(true)}
//             icon={<Plus className="w-4 h-4" />}
//             disabled={!formData.Item_id}
//           >
//             Add Items
//           </Button>
//         </div>

//         {errors.details && (
//           <p className="mb-4 text-sm text-red-600">{errors.details}</p>
//         )}

//         {details.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <p className="text-lg font-medium">No Components Added</p>
//             <p className="text-sm mt-1">Click "Add Items" to select components</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-12">#</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">Item</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity & UOM</th>
//                   <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {details.map((detail, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 text-sm text-gray-500 font-medium">{index + 1}</td>
//                     <td className="px-4 py-3">
//                       <span className="text-sm font-medium text-gray-900">{detail.itemName}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       {detail.uomData ? (
//                         <UomConverter
//                           uomData={detail.uomData}
//                           lineIndex={index + 1}
//                           onChange={(data) => handleDetailUomChange(index, data)}
//                           initialValues={{
//                             uom1_qty: detail.uom1_qty?.toString() || '',
//                             uom2_qty: detail.uom2_qty?.toString() || '',
//                             uom3_qty: detail.uom3_qty?.toString() || '',
//                             sale_unit: detail.sale_unit?.toString() || '3'
//                           }}
//                           readOnly={{ primary: true, tertiary: true }}  // ✅ UOM1 & UOM3 ReadOnly
//                         />
//                       ) : (
//                         <span className="text-sm text-gray-400">No UOM data</span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveDetail(index)}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                         title="Remove"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4">
//         <div className="flex items-center justify-end gap-4">
//           <Button variant="outline" onClick={() => router.push('/recipe')}>
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleSaveClick}
//             loading={isCreating || isUpdating}
//             icon={<Save className="w-4 h-4" />}
//           >
//             {mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
//           </Button>
//         </div>
//       </div>

//       {/* Multi-Select Item Modal */}
//       {showItemModal && (
//         <MultiSelectItemTable
//           isOpen={showItemModal}
//           onClose={() => setShowItemModal(false)}
//           onSelectionComplete={handleAddItems}
//           excludeIds={excludedItemIds}
//           title="Select Components"
//         />
//       )}

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmSave}
//         title={mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
//         message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this recipe with ${details.length} component(s)?`}
//         confirmText={mode === 'create' ? 'Create' : 'Update'}
//         type="info"
//         loading={isCreating || isUpdating}
//       />
//     </div>
//   )
// }

// export default RecipeForm




















































// // components/recipe/RecipeForm.tsx

// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   useGetRecipeByIdQuery,
//   useCreateRecipeMutation,
//   useUpdateRecipeMutation,
//   useGetUsedItemIdsQuery,
// } from '@/store/slice/recipeSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import {ItemSearchableInput} from '@/components/common/items/ItemSearchableInput'
// import UomConverter from '@/components/common/items/UomConverter'
// import SimpleItemSelector, { SelectedItem } from './SimpleItemSelector'
// import {ConfirmationModal} from '@/components/common/ConfirmationModal'
// import {
//   Save, ArrowLeft, AlertCircle, Package, Plus, Trash2, FlaskConical, Clock
// } from 'lucide-react'

// // =============================================
// // TYPES
// // =============================================

// interface RecipeFormProps {
//   mode: 'create' | 'edit'
//   id?: number
// }

// interface UomData {
//   primary: { id: number; name: string; qty: number }
//   secondary?: { id: number; name: string; qty: number }
//   tertiary?: { id: number; name: string; qty: number }
// }

// interface DetailItem {
//   id?: number
//   Item_id: number
//   itemName: string
//   qty: number
//   Uom_Id: number | null
//   uom1_qty: number
//   uom2_qty: number
//   uom3_qty: number
//   sale_unit: number
//   uomData: UomData | null
// }

// // =============================================
// // HELPER: Build UOM Data from Raw Item
// // =============================================

// const buildUomDataFromRawItem = (item: any): UomData | null => {
//   if (!item) return null

//   const uomData: UomData = {
//     primary: {
//       id: item.skuUOM || item.uom1?.id || 0,
//       name: item.uom1?.uom || 'Unit',
//       qty: item.uom1_qyt || 1
//     }
//   }

//   if (item.uomTwo && item.uom2_qty) {
//     uomData.secondary = {
//       id: item.uom2 || item.uomTwo?.id || 0,
//       name: item.uomTwo?.uom || '',
//       qty: parseFloat(item.uom2_qty) || 1
//     }
//   }

//   if (item.uomThree && item.uom3_qty) {
//     uomData.tertiary = {
//       id: item.uom3 || item.uomThree?.id || 0,
//       name: item.uomThree?.uom || '',
//       qty: parseFloat(item.uom3_qty) || 1
//     }
//   }

//   return uomData
// }

// // =============================================
// // COMPONENT
// // =============================================

// const RecipeForm: React.FC<RecipeFormProps> = ({ mode, id }) => {
//   const router = useRouter()

//   // =============================================
//   // STATE
//   // =============================================

//   const [formData, setFormData] = useState({
//     Item_id: null as number | null,
//     itemName: '',
//     qty: 1,
//     Uom_Id: null as number | null,
//     uom1_qty: 0,
//     uom2_qty: 0,
//     uom3_qty: 0,
//     sale_unit: 3,
//     uomData: null as UomData | null,
//     timeRequired: ''
//   })

//   const [details, setDetails] = useState<DetailItem[]>([])
//   const [showItemModal, setShowItemModal] = useState(false)

//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [apiError, setApiError] = useState('')
//   const [showConfirm, setShowConfirm] = useState(false)

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const { data: editData, isLoading: isLoadingEdit } = useGetRecipeByIdQuery(id!, {
//     skip: mode !== 'edit' || !id
//   })

//   const { data: usedItemIds = [] } = useGetUsedItemIdsQuery(mode === 'edit' ? id : undefined)

//   const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation()
//   const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation()

//   // =============================================
//   // POPULATE FORM IN EDIT MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'edit' && editData) {
//       const uomData = buildUomDataFromRawItem(editData.item)

//       setFormData({
//         Item_id: editData.Item_id,
//         itemName: editData.item?.itemName || '',
//         qty: editData.qty || 1,
//         Uom_Id: editData.Uom_Id,
//         uom1_qty: editData.qty || 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 3,
//         uomData,
//         timeRequired: editData.timeRequired?.toString() || ''
//       })

//       if (editData.details && editData.details.length > 0) {
//         const detailItems: DetailItem[] = editData.details.map(d => {
//           const itemUomData = buildUomDataFromRawItem(d.item)
//           return {
//             id: d.id,
//             Item_id: d.Item_id,
//             itemName: d.item?.itemName || '',
//             qty: d.qty || 1,
//             Uom_Id: d.Uom_Id,
//             uom1_qty: d.qty || 0,
//             uom2_qty: 0,
//             uom3_qty: 0,
//             sale_unit: 3,
//             uomData: itemUomData
//           }
//         })
//         setDetails(detailItems)
//       }
//     }
//   }, [mode, editData])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   const handleMainItemChange = useCallback((itemId: number | null, itemData?: any) => {
//     const uomData = buildUomDataFromRawItem(itemData)

//     setFormData(prev => ({
//       ...prev,
//       Item_id: itemId,
//       itemName: itemData?.itemName || '',
//       Uom_Id: itemData?.skuUOM || null,
//       uomData
//     }))
//     setErrors(prev => ({ ...prev, Item_id: '' }))
//   }, [])

//   const handleMainUomChange = useCallback((data: any) => {
//     setFormData(prev => ({
//       ...prev,
//       qty: data.uom1_qty || 0,
//       uom1_qty: data.uom1_qty || 0,
//       uom2_qty: data.uom2_qty || 0,
//       uom3_qty: data.uom3_qty || 0,
//       sale_unit: data.sale_unit || 3,
//       Uom_Id: data.Uom_Id || null
//     }))
//   }, [])

//   // Handle adding items from SimpleItemSelector
//   const handleAddItems = useCallback((items: SelectedItem[]) => {
//     const newDetails: DetailItem[] = items.map(item => ({
//       Item_id: item.id,
//       itemName: item.itemName,
//       qty: 1,
//       Uom_Id: item.uomData.primary.id || null,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 3,
//       uomData: item.uomData
//     }))

//     // Filter out duplicates
//     const existingIds = details.map(d => d.Item_id)
//     const filtered = newDetails.filter(d => !existingIds.includes(d.Item_id))

//     setDetails(prev => [...prev, ...filtered])
//     setShowItemModal(false)
//   }, [details])

//   const handleDetailUomChange = useCallback((index: number, data: any) => {
//     setDetails(prev => {
//       const updated = [...prev]
//       updated[index] = {
//         ...updated[index],
//         qty: data.uom1_qty || 0,
//         uom1_qty: data.uom1_qty || 0,
//         uom2_qty: data.uom2_qty || 0,
//         uom3_qty: data.uom3_qty || 0,
//         sale_unit: data.sale_unit || 3,
//         Uom_Id: data.Uom_Id || null
//       }
//       return updated
//     })
//   }, [])

//   const handleRemoveDetail = useCallback((index: number) => {
//     setDetails(prev => prev.filter((_, i) => i !== index))
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validate = useCallback(() => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.Item_id) {
//       newErrors.Item_id = 'Finished product is required'
//     }

//     if (formData.uom1_qty <= 0 && formData.uom2_qty <= 0 && formData.uom3_qty <= 0) {
//       newErrors.qty = 'Quantity is required'
//     }

//     if (details.length === 0) {
//       newErrors.details = 'At least one component is required'
//     }

//     // Check if all details have qty
//     const hasEmptyQty = details.some(d => d.uom1_qty <= 0 && d.uom2_qty <= 0 && d.uom3_qty <= 0)
//     if (hasEmptyQty) {
//       newErrors.details = 'All components must have quantity'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData, details])

//   const handleSaveClick = useCallback(() => {
//     if (validate()) setShowConfirm(true)
//   }, [validate])

//   // =============================================
//   // SAVE
//   // =============================================

//   const handleConfirmSave = useCallback(async () => {
//     setShowConfirm(false)

//     const payload = {
//       Item_id: formData.Item_id!,
//       qty: formData.uom1_qty || formData.qty || 1,
//       Uom_Id: formData.Uom_Id || null,
//       timeRequired: parseInt(formData.timeRequired) || 0,
//       details: details.map(d => ({
//         Item_id: d.Item_id,
//         qty: d.uom1_qty || d.qty || 1,
//         Uom_Id: d.Uom_Id || null
//       }))
//     }

//     try {
//       if (mode === 'create') {
//         await createRecipe(payload).unwrap()
//       } else {
//         await updateRecipe({ id: id!, ...payload }).unwrap()
//       }
//       router.push('/recipe')
//     } catch (error: any) {
//       setApiError(error?.data?.message || 'Failed to save recipe')
//     }
//   }, [mode, id, formData, details, createRecipe, updateRecipe, router])

//   // =============================================
//   // LOADING
//   // =============================================

//   if (mode === 'edit' && isLoadingEdit) {
//     return <Loading size="lg" text="Loading Recipe..." />
//   }

//   // =============================================
//   // EXCLUDED ITEMS
//   // =============================================

//   const excludedItemIds = [
//     ...(formData.Item_id ? [formData.Item_id] : []),
//     ...details.map(d => d.Item_id)
//   ].filter(Boolean) as number[]

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <FlaskConical className="w-8 h-8 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {mode === 'create' ? 'Create New Recipe' : 'Edit Recipe'}
//               </h1>
//               <p className="text-blue-100 mt-1">
//                 {mode === 'create' ? 'Define product components' : `Editing Recipe #${id}`}
//               </p>
//             </div>
//           </div>
//           <Button
//             variant="secondary"
//             onClick={() => router.push('/recipe')}
//             icon={<ArrowLeft className="w-4 h-4" />}
//             className="bg-white text-[#509ee3] hover:bg-gray-100"
//           >
//             Back to List
//           </Button>
//         </div>
//       </div>

//       {/* Error */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600" />
//           <span className="text-red-700">{apiError}</span>
//         </div>
//       )}

//       {/* Main Section: Finished Product */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//           <Package className="w-5 h-5 mr-2 text-[#509ee3]" />
//           Finished Product
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Item */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Item <span className="text-red-500">*</span>
//             </label>
//             <ItemSearchableInput
//               value={formData.Item_id}
//               onChange={handleMainItemChange}
//               excludeIds={usedItemIds.filter(usedId => usedId !== formData.Item_id)}
//               placeholder="Select finished product..."
//               clearable
//             />
//             {errors.Item_id && <p className="mt-1 text-sm text-red-600">{errors.Item_id}</p>}
//           </div>

//           {/* UOM Converter - UOM1 & UOM3 ReadOnly */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Quantity & UOM <span className="text-red-500">*</span>
//             </label>
//             {formData.uomData ? (
//               <UomConverter
//                 uomData={formData.uomData}
//                 lineIndex={0}
//                 onChange={handleMainUomChange}
//                 initialValues={{
//                   uom1_qty: formData.uom1_qty?.toString() || '',
//                   uom2_qty: formData.uom2_qty?.toString() || '',
//                   uom3_qty: formData.uom3_qty?.toString() || '',
//                   sale_unit: formData.sale_unit?.toString() || '3'
//                 }}
//                 readOnly={{ primary: true, tertiary: true }}
//               />
//             ) : (
//               <div className="text-sm text-gray-400 py-2">Select an item first</div>
//             )}
//             {errors.qty && <p className="mt-1 text-sm text-red-600">{errors.qty}</p>}
//           </div>

//           {/* Time Required */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <Clock className="w-4 h-4 inline mr-1" />
//               Time Required (minutes)
//             </label>
//             <input
//               type="number"
//               value={formData.timeRequired}
//               onChange={(e) => setFormData(prev => ({ ...prev, timeRequired: e.target.value }))}
//               placeholder="0"
//               min="0"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] focus:border-transparent"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Details Section: Components */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//             <FlaskConical className="w-5 h-5 mr-2 text-orange-500" />
//             Components / Raw Materials
//             <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//               {details.length} item{details.length !== 1 ? 's' : ''}
//             </span>
//           </h2>
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => setShowItemModal(true)}
//             icon={<Plus className="w-4 h-4" />}
//             disabled={!formData.Item_id}
//           >
//             Add Items
//           </Button>
//         </div>

//         {errors.details && (
//           <p className="mb-4 text-sm text-red-600">{errors.details}</p>
//         )}

//         {details.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <p className="text-lg font-medium">No Components Added</p>
//             <p className="text-sm mt-1">Click "Add Items" to select components</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-12">#</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">Item</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity & UOM</th>
//                   <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {details.map((detail, index) => (
//                   <tr key={`${detail.Item_id}-${index}`} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 text-sm text-gray-500 font-medium">{index + 1}</td>
//                     <td className="px-4 py-3">
//                       <span className="text-sm font-medium text-gray-900">{detail.itemName}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       {detail.uomData ? (
//                         <UomConverter
//                           uomData={detail.uomData}
//                           lineIndex={index + 1}
//                           onChange={(data) => handleDetailUomChange(index, data)}
//                           initialValues={{
//                             uom1_qty: detail.uom1_qty?.toString() || '',
//                             uom2_qty: detail.uom2_qty?.toString() || '',
//                             uom3_qty: detail.uom3_qty?.toString() || '',
//                             sale_unit: detail.sale_unit?.toString() || '3'
//                           }}
//                           readOnly={{ primary: true, tertiary: true }}
//                         />
//                       ) : (
//                         <span className="text-sm text-gray-400">No UOM data</span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveDetail(index)}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                         title="Remove"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4">
//         <div className="flex items-center justify-end gap-4">
//           <Button variant="outline" onClick={() => router.push('/recipe')}>
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleSaveClick}
//             loading={isCreating || isUpdating}
//             icon={<Save className="w-4 h-4" />}
//           >
//             {mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
//           </Button>
//         </div>
//       </div>

//       {/* Simple Item Selector Modal */}
//       <SimpleItemSelector
//         isOpen={showItemModal}
//         onClose={() => setShowItemModal(false)}
//         onAdd={handleAddItems}
//         excludeIds={excludedItemIds}
//         title="Select Components"
//       />

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmSave}
//         title={mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
//         message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this recipe with ${details.length} component(s)?`}
//         confirmText={mode === 'create' ? 'Create' : 'Update'}
//         type="info"
//         loading={isCreating || isUpdating}
//       />
//     </div>
//   )
// }

// export default RecipeForm




















































// components/recipe/RecipeForm.tsx

'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useGetUsedItemIdsQuery,
} from '@/store/slice/recipeSlice'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { ItemSearchableInput } from '@/components/common/items/ItemSearchableInput'
import UomConverter from '@/components/common/items/UomConverter'
import SimpleItemSelector, { SelectedItem } from './SimpleItemSelector'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import {
  Save, ArrowLeft, AlertCircle, Package, Plus, Trash2, FlaskConical, Clock
} from 'lucide-react'

import UomConverterSimple from '@/components/recipe/UomConverterSimple'

// =============================================
// TYPES
// =============================================

interface RecipeFormProps {
  mode: 'create' | 'edit'
  id?: number
}

interface UomData {
  primary: { id: number; name: string; qty: number }
  secondary?: { id: number; name: string; qty: number }
  tertiary?: { id: number; name: string; qty: number }
}

interface DetailItem {
  id?: number
  Item_id: number
  itemName: string
  qty: number
  Uom_Id: number | null
  uom1_qty: number
  uom2_qty: number
  uom3_qty: number
  sale_unit: number
  uomData: UomData | null
}

// =============================================
// HELPER: Build UOM Data from Raw Item
// =============================================

const buildUomDataFromRawItem = (item: any): UomData | null => {
  if (!item) return null

  const uomData: UomData = {
    primary: {
      id: item.skuUOM || item.uom1?.id || 0,
      name: item.uom1?.uom || 'Unit',
      qty: item.uom1_qyt || 1
    }
  }

  if (item.uomTwo && item.uom2_qty) {
    uomData.secondary = {
      id: item.uom2 || item.uomTwo?.id || 0,
      name: item.uomTwo?.uom || '',
      qty: parseFloat(item.uom2_qty) || 1
    }
  }

  if (item.uomThree && item.uom3_qty) {
    uomData.tertiary = {
      id: item.uom3 || item.uomThree?.id || 0,
      name: item.uomThree?.uom || '',
      qty: parseFloat(item.uom3_qty) || 1
    }
  }

  return uomData
}

// =============================================
// HELPER: Calculate UOM values from primary qty
// =============================================

const calculateUomValues = (primaryQty: number, uomData: UomData | null) => {
  if (!uomData || !primaryQty) {
    return { uom1_qty: 0, uom2_qty: 0, uom3_qty: 0 }
  }

  const uom1_qty = primaryQty
  const uom2_qty = uomData.secondary ? primaryQty / uomData.secondary.qty : 0
  const uom3_qty = uomData.tertiary ? primaryQty / uomData.tertiary.qty : 0

  return { uom1_qty, uom2_qty, uom3_qty }
}

// =============================================
// COMPONENT
// =============================================

const RecipeForm: React.FC<RecipeFormProps> = ({ mode, id }) => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [formData, setFormData] = useState({
    Item_id: null as number | null,
    itemName: '',
    qty: 1,
    Uom_Id: null as number | null,
    uom1_qty: 0,
    uom2_qty: 0,
    uom3_qty: 0,
    sale_unit: 3,
    uomData: null as UomData | null,
    timeRequired: ''
  })

  const [details, setDetails] = useState<DetailItem[]>([])
  const [showItemModal, setShowItemModal] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: editData, isLoading: isLoadingEdit } = useGetRecipeByIdQuery(id!, {
    skip: mode !== 'edit' || !id
  })

  const { data: usedItemIds = [] } = useGetUsedItemIdsQuery(mode === 'edit' ? id : undefined)

  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation()
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation()

  // =============================================
  // POPULATE FORM IN EDIT MODE
  // =============================================

  useEffect(() => {
    if (mode === 'edit' && editData) {
      const uomData = buildUomDataFromRawItem(editData.item)
      const savedQty = editData.qty || 0

      // Calculate all UOM values from saved qty
      const uomValues = calculateUomValues(savedQty, uomData)

      setFormData({
        Item_id: editData.Item_id,
        itemName: editData.item?.itemName || '',
        qty: savedQty,
        Uom_Id: editData.Uom_Id,
        uom1_qty: uomValues.uom1_qty,
        uom2_qty: uomValues.uom2_qty,
        uom3_qty: uomValues.uom3_qty,
        sale_unit: 3,
        uomData,
        timeRequired: editData.timeRequired?.toString() || ''
      })

      if (editData.details && editData.details.length > 0) {
        const detailItems: DetailItem[] = editData.details.map(d => {
          const itemUomData = buildUomDataFromRawItem(d.item)
          const detailQty = d.qty || 0
          const detailUomValues = calculateUomValues(detailQty, itemUomData)

          return {
            id: d.id,
            Item_id: d.Item_id,
            itemName: d.item?.itemName || '',
            qty: detailQty,
            Uom_Id: d.Uom_Id,
            uom1_qty: detailUomValues.uom1_qty,
            uom2_qty: detailUomValues.uom2_qty,
            uom3_qty: detailUomValues.uom3_qty,
            sale_unit: 3,
            uomData: itemUomData
          }
        })
        setDetails(detailItems)
      }
    }
  }, [mode, editData])

  // =============================================
  // HANDLERS
  // =============================================

  const handleMainItemChange = useCallback((itemId: number | null, itemData?: any) => {
    const uomData = buildUomDataFromRawItem(itemData)

    setFormData(prev => ({
      ...prev,
      Item_id: itemId,
      itemName: itemData?.itemName || '',
      Uom_Id: itemData?.skuUOM || null,
      uomData,
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0
    }))
    setErrors(prev => ({ ...prev, Item_id: '' }))
  }, [])

  const handleMainUomChange = useCallback((data: any) => {
    setFormData(prev => ({
      ...prev,
      qty: data.uom1_qty || 0,
      uom1_qty: data.uom1_qty || 0,
      uom2_qty: data.uom2_qty || 0,
      uom3_qty: data.uom3_qty || 0,
      sale_unit: data.sale_unit || 3,
      Uom_Id: data.Uom_Id || null
    }))
  }, [])

  // Handle adding items from SimpleItemSelector
  const handleAddItems = useCallback((items: SelectedItem[]) => {
    const newDetails: DetailItem[] = items.map(item => ({
      Item_id: item.id,
      itemName: item.itemName,
      qty: 1,
      Uom_Id: item.uomData.primary.id || null,
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 3,
      uomData: item.uomData
    }))

    // Filter out duplicates
    const existingIds = details.map(d => d.Item_id)
    const filtered = newDetails.filter(d => !existingIds.includes(d.Item_id))

    setDetails(prev => [...prev, ...filtered])
    setShowItemModal(false)
  }, [details])

  const handleDetailUomChange = useCallback((index: number, data: any) => {
    setDetails(prev => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        qty: data.uom1_qty || 0,
        uom1_qty: data.uom1_qty || 0,
        uom2_qty: data.uom2_qty || 0,
        uom3_qty: data.uom3_qty || 0,
        sale_unit: data.sale_unit || 3,
        Uom_Id: data.Uom_Id || null
      }
      return updated
    })
  }, [])

  const handleRemoveDetail = useCallback((index: number) => {
    setDetails(prev => prev.filter((_, i) => i !== index))
  }, [])

  // =============================================
  // VALIDATION
  // =============================================

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.Item_id) {
      newErrors.Item_id = 'Finished product is required'
    }

    if (formData.uom1_qty <= 0 && formData.uom2_qty <= 0 && formData.uom3_qty <= 0) {
      newErrors.qty = 'Quantity is required'
    }

    if (details.length === 0) {
      newErrors.details = 'At least one component is required'
    }

    // Check if all details have qty
    const hasEmptyQty = details.some(d => d.uom1_qty <= 0 && d.uom2_qty <= 0 && d.uom3_qty <= 0)
    if (hasEmptyQty) {
      newErrors.details = 'All components must have quantity'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, details])

  const handleSaveClick = useCallback(() => {
    if (validate()) setShowConfirm(true)
  }, [validate])

  // =============================================
  // SAVE
  // =============================================

  const handleConfirmSave = useCallback(async () => {
    setShowConfirm(false)

    const payload = {
      Item_id: formData.Item_id!,
      qty: formData.uom1_qty || formData.qty || 1,
      Uom_Id: formData.Uom_Id || null,
      timeRequired: parseInt(formData.timeRequired) || 0,
      details: details.map(d => ({
        Item_id: d.Item_id,
        qty: d.uom1_qty || d.qty || 1,
        Uom_Id: d.Uom_Id || null
      }))
    }

    try {
      if (mode === 'create') {
        await createRecipe(payload).unwrap()
      } else {
        await updateRecipe({ id: id!, ...payload }).unwrap()
      }
      router.push('/recipe')
    } catch (error: any) {
      setApiError(error?.data?.message || 'Failed to save recipe')
    }
  }, [mode, id, formData, details, createRecipe, updateRecipe, router])

  // =============================================
  // LOADING
  // =============================================

  if (mode === 'edit' && isLoadingEdit) {
    return <Loading size="lg" text="Loading Recipe..." />
  }

  // =============================================
  // EXCLUDED ITEMS
  // =============================================

  const excludedItemIds = [
    ...(formData.Item_id ? [formData.Item_id] : []),
    ...details.map(d => d.Item_id)
  ].filter(Boolean) as number[]

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FlaskConical className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'Create New Recipe' : 'Edit Recipe'}
              </h1>
              <p className="text-blue-100 mt-1">
                {mode === 'create' ? 'Define product components' : `Editing Recipe #${id}`}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/recipe')}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="bg-white text-[#509ee3] hover:bg-gray-100"
          >
            Back to List
          </Button>
        </div>
      </div>

      {/* Error */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{apiError}</span>
        </div>
      )}

      {/* Main Section: Finished Product */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-[#509ee3]" />
          Finished Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item <span className="text-red-500">*</span>
            </label>
            <ItemSearchableInput
              value={formData.Item_id}
              onChange={handleMainItemChange}
              excludeIds={usedItemIds.filter(usedId => usedId !== formData.Item_id)}
              placeholder="Select finished product..."
              clearable
              disabled={mode === 'edit'}  // ✅ Disable in edit mode
            />
            {errors.Item_id && <p className="mt-1 text-sm text-red-600">{errors.Item_id}</p>}
          </div>

          {/* UOM Converter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity & UOM <span className="text-red-500">*</span>
            </label>
            {/* {formData.uomData ? (
              <UomConverter
                uomData={formData.uomData}
                lineIndex={0}
                onChange={handleMainUomChange}
                initialValues={{
                  uom1_qty: formData.uom1_qty?.toString() || '',
                  uom2_qty: formData.uom2_qty?.toString() || '',
                  uom3_qty: formData.uom3_qty?.toString() || '',
                  sale_unit: formData.sale_unit?.toString() || '2'
                }}
                readOnly={{ primary: true, tertiary: true }}
              />
            ) : (
              <div className="text-sm text-gray-400 py-2">Select an item first</div>
            )} */}


            {formData.uomData ? (
              <UomConverterSimple
                uomData={formData.uomData}
                lineIndex={0}
                onChange={handleMainUomChange}
                initialValues={{
                  uom1_qty: formData.uom1_qty?.toString() || '',
                  uom2_qty: formData.uom2_qty?.toString() || '',
                  uom3_qty: formData.uom3_qty?.toString() || ''
                }}
              />
            ) : (
              <div className="text-sm text-gray-400 py-2">Select an item first</div>
            )}
            {errors.qty && <p className="mt-1 text-sm text-red-600">{errors.qty}</p>}
          </div>

          {/* Time Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time Required (minutes)
            </label>
            <input
              type="number"
              value={formData.timeRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, timeRequired: e.target.value }))}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Details Section: Components */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FlaskConical className="w-5 h-5 mr-2 text-orange-500" />
            Components / Raw Materials
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              {details.length} item{details.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowItemModal(true)}
            icon={<Plus className="w-4 h-4" />}
            disabled={!formData.Item_id}
          >
            Add Items
          </Button>
        </div>

        {errors.details && (
          <p className="mb-4 text-sm text-red-600">{errors.details}</p>
        )}

        {details.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No Components Added</p>
            <p className="text-sm mt-1">Click "Add Items" to select components</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity & UOM</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {details.map((detail, index) => (
                  <tr key={`${detail.Item_id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{detail.itemName}</span>
                    </td>
                    <td className="px-4 py-3">
                      {/* {detail.uomData ? (
                        <UomConverter
                          uomData={detail.uomData}
                          lineIndex={index + 1}
                          onChange={(data) => handleDetailUomChange(index, data)}
                          initialValues={{
                            uom1_qty: detail.uom1_qty?.toString() || '',
                            uom2_qty: detail.uom2_qty?.toString() || '',
                            uom3_qty: detail.uom3_qty?.toString() || '',
                            sale_unit: detail.sale_unit?.toString() || '3'
                          }}
                          readOnly={{ primary: true, tertiary: true }}
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No UOM data</span>
                      )} */}


                      {detail.uomData ? (
                        <UomConverterSimple
                          uomData={detail.uomData}
                          lineIndex={index + 1}
                          onChange={(data) => handleDetailUomChange(index, data)}
                          initialValues={{
                            uom1_qty: detail.uom1_qty?.toString() || '',
                            uom2_qty: detail.uom2_qty?.toString() || '',
                            uom3_qty: detail.uom3_qty?.toString() || ''
                          }}
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No UOM data</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/recipe')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            loading={isCreating || isUpdating}
            icon={<Save className="w-4 h-4" />}
          >
            {mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
          </Button>
        </div>
      </div>

      {/* Simple Item Selector Modal */}
      <SimpleItemSelector
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onAdd={handleAddItems}
        excludeIds={excludedItemIds}
        title="Select Components"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title={mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
        message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this recipe with ${details.length} component(s)?`}
        confirmText={mode === 'create' ? 'Create' : 'Update'}
        type="info"
        loading={isCreating || isUpdating}
      />
    </div>
  )
}

export default RecipeForm
