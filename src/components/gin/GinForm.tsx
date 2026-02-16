

// // components/gin/GinForm.tsx

// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   useGetGinByIdQuery,
//   useGetNextGinNumberQuery,
//   useCreateGinMutation,
//   useUpdateGinMutation,
// } from '@/store/slice/ginSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import RecipeSelector from '@/components/gin/RecipeSelector'
// import EmployeeSelector from '@/components/gin/EmployeeSelector'
// import GinDetailRow from '@/components/gin/GinDetailRow'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import {
//   Save, ArrowLeft, AlertCircle, Package, Plus, Trash2,
//   FileText, Users, ClipboardList, AlertTriangle, Settings, List, Calendar
// } from 'lucide-react'

// // =============================================
// // TYPES
// // =============================================

// interface GinFormProps {
//   mode: 'create' | 'edit'
//   id?: number
// }

// interface UomData {
//   primary: { id: number; name: string; qty: number }
//   secondary?: { id: number; name: string; qty: number }
//   tertiary?: { id: number; name: string; qty: number }
// }

// interface DetailItem {
//   item_id: number
//   itemName: string
//   recipe_qty: number
//   suggested_qty: number
//   batchno: number | null
//   available_qty: number
//   issue_qty: number
//   issue_uom1_qty: number
//   issue_uom2_qty: number
//   issue_uom3_qty: number
//   issue_uom_id: number | null
//   remained_unused: number
//   wastage: number
//   actual_used: number
//   actual_used_uom1: number
//   actual_used_uom2: number
//   actual_used_uom3: number
//   uomData: UomData | null
// }

// const STATUS_OPTIONS = [
//   { value: 'open', label: 'Open' },
//   { value: 'close', label: 'Close' },
//   { value: 'pending', label: 'Pending' },
//   { value: 'rejected', label: 'Rejected' }
// ]

// const TABS = [
//   { id: 'header', label: 'GIN Header', icon: Settings },
//   { id: 'details', label: 'GIN Details', icon: List }
// ]

// // =============================================
// // HELPERS
// // =============================================

// const toNumber = (value: any): number => {
//   const num = Number(value)
//   return isNaN(num) ? 0 : num
// }

// const toFixed = (value: any, decimals: number = 2): string => {
//   return toNumber(value).toFixed(decimals)
// }

// // const buildUomData = (item: any): UomData | null => {
// //   if (!item) return null
// //   return {
// //     primary: {
// //       id: item.skuUOM || item.uom1?.id || 0,
// //       name: item.uom1?.uom || 'Pcs',
// //       qty: toNumber(item.uom1_qty) || 1
// //     },
// //     secondary: item.uomTwo && item.uom2_qty ? {
// //       id: item.uom2 || item.uomTwo?.id || 0,
// //       name: item.uomTwo?.uom || '',
// //       qty: toNumber(item.uom2_qty) || 1
// //     } : undefined,
// //     tertiary: item.uomThree && item.uom3_qty ? {
// //       id: item.uom3 || item.uomThree?.id || 0,
// //       name: item.uomThree?.uom || '',
// //       qty: toNumber(item.uom3_qty) || 1
// //     } : undefined
// //   }
// // }


// const buildUomData = (item: any): any | null => {
//   if (!item) return null

//   console.log('📦 Building UOM data for item:', item.itemName, {
//     uom2_qty: item.uom2_qty,
//     uom3_qty: item.uom3_qty
//   })

//   return {
//     primary: {
//       id: item.skuUOM || item.uom1?.id || 0,
//       name: item.uom1?.uom || 'Pcs',
//       qty: toNumber(item.uom1_qty) || 1
//     },
//     secondary: {
//       id: item.uom2 || item.uomTwo?.id || 0,
//       name: item.uomTwo?.uom || item.uom1?.uom || 'Pcs',
//       qty: toNumber(item.uom2_qty) || 1
//     },
//     tertiary: {
//       id: item.uom3 || item.uomThree?.id || 0,
//       name: item.uomThree?.uom || '',
//       qty: toNumber(item.uom3_qty) || 1
//     }
//   }
// }


// const formatDate = (date: Date | string): string => {
//   const d = new Date(date)
//   return d.toISOString().split('T')[0]
// }

// // =============================================
// // COMPONENT
// // =============================================

// const GinForm: React.FC<GinFormProps> = ({ mode, id }) => {
//   const router = useRouter()

//   // =============================================
//   // STATE
//   // =============================================

//   const [activeTab, setActiveTab] = useState('header')

//   const [formData, setFormData] = useState({
//     gin_number: '',
//     item_id: null as number | null,
//     itemName: '',
//     qty_planned: '',
//     Uom_Id: null as number | null,
//     uomName: '',
//     status: 'open' as 'open' | 'close' | 'pending' | 'rejected',
//     reason: '',
//     // Stock entry fields
//     coa_id: null as number | null,
//     coaName: '',
//     gin_date: formatDate(new Date())
//   })

//   const [recipeMainQty, setRecipeMainQty] = useState<number>(1)
//   const [details, setDetails] = useState<DetailItem[]>([])
//   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
//   const [employeeNames, setEmployeeNames] = useState<Map<number, string>>(new Map())

//   const [showRecipeModal, setShowRecipeModal] = useState(false)
//   const [showEmployeeModal, setShowEmployeeModal] = useState(false)
//   const [showConfirm, setShowConfirm] = useState(false)

//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [apiError, setApiError] = useState('')

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const { data: editData, isLoading: isLoadingEdit } = useGetGinByIdQuery(id!, {
//     skip: mode !== 'edit' || !id
//   })

//   const { data: nextGinNumber } = useGetNextGinNumberQuery(undefined, {
//     skip: mode !== 'create'
//   })

//   const [createGin, { isLoading: isCreating }] = useCreateGinMutation()
//   const [updateGin, { isLoading: isUpdating }] = useUpdateGinMutation()

//   // =============================================
//   // SET GIN NUMBER FOR CREATE MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'create' && nextGinNumber) {
//       setFormData(prev => ({ ...prev, gin_number: nextGinNumber }))
//     }
//   }, [mode, nextGinNumber])

//   // =============================================
//   // POPULATE FORM IN EDIT MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'edit' && editData) {
//       const mainQty = toNumber(editData.recipe?.qty) || 1
//       setRecipeMainQty(mainQty)

//       setFormData({
//         gin_number: editData.gin_number || '',
//         item_id: editData.item_id,
//         itemName: editData.item?.itemName || '',
//         qty_planned: toNumber(editData.qty_planned).toString(),
//         Uom_Id: editData.Uom_Id,
//         uomName: editData.uom?.uom || '',
//         status: editData.status || 'open',
//         reason: editData.reason || '',
//         coa_id: editData.coa_id || null,
//         coaName: editData.coa?.acName || '',
//         gin_date: editData.gin_date ? formatDate(editData.gin_date) : formatDate(new Date())
//       })

//       // Build recipe qty map
//       const recipeQtyMap = new Map<number, number>()
//       if (editData.recipe?.details) {
//         editData.recipe.details.forEach((rd: any) => {
//           recipeQtyMap.set(rd.Item_id, toNumber(rd.qty))
//         })
//       }

//       // Populate details
//       if (editData.details && editData.details.length > 0) {
//         const detailItems: DetailItem[] = editData.details.map(d => {
//           const recipeQty = recipeQtyMap.get(d.item_id) || toNumber(d.suggested_qty)
//           const uomData = buildUomData(d.item)

//           return {
//             item_id: d.item_id,
//             itemName: d.item?.itemName || '',
//             recipe_qty: recipeQty,
//             suggested_qty: toNumber(d.suggested_qty),
//             batchno: d.batchno || null,
//             available_qty: 0,
//             issue_qty: toNumber(d.issue_qty),
//             issue_uom1_qty: toNumber(d.issue_uom1_qty),
//             issue_uom2_qty: toNumber(d.issue_qty),
//             issue_uom3_qty: toNumber(d.issue_uom3_qty),
//             issue_uom_id: d.issue_uom_id || null,
//             remained_unused: toNumber(d.remained_unused),
//             wastage: toNumber(d.wastage),
//             actual_used: toNumber(d.actual_used) || (toNumber(d.issue_qty) - toNumber(d.remained_unused)),
//             actual_used_uom1: toNumber(d.actual_used_uom1),
//             actual_used_uom2: toNumber(d.actual_used),
//             actual_used_uom3: toNumber(d.actual_used_uom3),
//             uomData
//           }
//         })
//         setDetails(detailItems)
//       }

//       // Populate employees
//       if (editData.employees && editData.employees.length > 0) {
//         const empIds = editData.employees.map(e => e.employee_id)
//         setSelectedEmployees(empIds)

//         const names = new Map<number, string>()
//         editData.employees.forEach(e => {
//           if (e.employee) names.set(e.employee_id, e.employee.employeeName)
//         })
//         setEmployeeNames(names)
//       }
//     }
//   }, [mode, editData])

//   // =============================================
//   // RECALCULATE SUGGESTED QTY WHEN QTY_PLANNED CHANGES
//   // =============================================

//   useEffect(() => {
//     const qtyPlanned = toNumber(formData.qty_planned)

//     if (qtyPlanned > 0 && details.length > 0 && recipeMainQty > 0) {
//       setDetails(prev => prev.map(detail => {
//         const recipeQty = toNumber(detail.recipe_qty)
//         const suggested = (recipeQty / recipeMainQty) * qtyPlanned

//         return {
//           ...detail,
//           suggested_qty: toNumber(suggested.toFixed(4))
//         }
//       }))
//     }
//   }, [formData.qty_planned, recipeMainQty])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   const handleRecipeSelect = useCallback((recipe: any) => {
//     const mainQty = toNumber(recipe.qty) || 1
//     setRecipeMainQty(mainQty)

//     setFormData(prev => ({
//       ...prev,
//       item_id: recipe.Item_id,
//       itemName: recipe.item?.itemName || '',
//       Uom_Id: recipe.Uom_Id,
//       uomName: recipe.uom?.uom || ''
//     }))

//     if (recipe.details && recipe.details.length > 0) {
//       const qtyPlanned = toNumber(formData.qty_planned)

//       const newDetails: DetailItem[] = recipe.details.map((d: any) => {
//         const recipeQty = toNumber(d.qty)
//         const suggested = qtyPlanned > 0 ? (recipeQty / mainQty) * qtyPlanned : recipeQty
//         const uomData = buildUomData(d.item)

//         return {
//           item_id: d.Item_id || d.item?.id,
//           itemName: d.item?.itemName || '',
//           recipe_qty: recipeQty,
//           suggested_qty: toNumber(suggested.toFixed(4)),
//           batchno: null,
//           available_qty: 0,
//           issue_qty: 0,
//           issue_uom1_qty: 0,
//           issue_uom2_qty: 0,
//           issue_uom3_qty: 0,
//           issue_uom_id: d.Uom_Id || uomData?.secondary?.id || null,
//           remained_unused: 0,
//           wastage: 0,
//           actual_used: 0,
//           actual_used_uom1: 0,
//           actual_used_uom2: 0,
//           actual_used_uom3: 0,
//           uomData
//         }
//       })

//       setDetails(newDetails)
//     }

//     setShowRecipeModal(false)
//   }, [formData.qty_planned])

//   const handleQtyPlannedChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, qty_planned: value }))
//   }, [])

//   const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, gin_date: e.target.value }))
//   }, [])

//   const handleCoaChange = useCallback((coaId: number | null, coaData?: any) => {
//     setFormData(prev => ({
//       ...prev,
//       coa_id: coaId,
//       coaName: coaData?.acName || ''
//     }))
//   }, [])

//   const handleDetailUpdate = useCallback((index: number, data: any) => {
//     setDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], ...data }
//       return updated
//     })
//   }, [])

//   const handleDetailRemove = useCallback((index: number) => {
//     setDetails(prev => prev.filter((_, i) => i !== index))
//   }, [])

//   const handleStatusChange = useCallback((status: 'open' | 'close' | 'pending' | 'rejected') => {
//     setFormData(prev => ({
//       ...prev,
//       status,
//       reason: (status !== 'pending' && status !== 'rejected') ? '' : prev.reason
//     }))
//   }, [])

//   const handleEmployeeSelect = useCallback((empIds: number[]) => {
//     setSelectedEmployees(empIds)
//   }, [])

//   const handleRemoveEmployee = useCallback((empId: number) => {
//     setSelectedEmployees(prev => prev.filter(id => id !== empId))
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validate = useCallback(() => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.item_id) {
//       newErrors.item_id = 'Please select a recipe'
//     }

//     if (toNumber(formData.qty_planned) <= 0) {
//       newErrors.qty_planned = 'Planned quantity is required'
//     }

//     if (details.length === 0) {
//       newErrors.details = 'No components found'
//     }

//     if (!formData.coa_id) {
//       newErrors.coa_id = 'Account is required'
//     }

//     if (!formData.gin_date) {
//       newErrors.gin_date = 'Date is required'
//     }

//     if ((formData.status === 'pending' || formData.status === 'rejected') && !formData.reason.trim()) {
//       newErrors.reason = 'Reason is required for pending/rejected status'
//     }

//     // Check batch selection for items with issue qty
//     const itemsWithoutBatch = details.filter(d => !d.batchno && d.issue_qty > 0)
//     if (itemsWithoutBatch.length > 0) {
//       newErrors.batch = 'Please select batch for all items with issue qty'
//     }

//     // Check issue > available
//     const overIssued = details.filter(d => d.batchno && d.issue_qty > d.available_qty && d.available_qty > 0)
//     if (overIssued.length > 0) {
//       newErrors.overIssue = 'Issue qty exceeds available for some items'
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
//       item_id: formData.item_id!,
//       qty_planned: toNumber(formData.qty_planned),
//       Uom_Id: formData.Uom_Id,
//       status: formData.status,
//       reason: formData.reason || null,
//       coa_id: formData.coa_id,
//       gin_date: formData.gin_date,
//       details: details.map(d => ({
//         item_id: d.item_id,
//         suggested_qty: toNumber(d.suggested_qty),
//         batchno: d.batchno,
//         issue_qty: toNumber(d.issue_qty),
//         issue_uom1_qty: toNumber(d.issue_uom1_qty),
//         issue_uom2_qty: toNumber(d.issue_uom2_qty),
//         issue_uom3_qty: toNumber(d.issue_uom3_qty),
//         issue_uom_id: d.issue_uom_id,
//         remained_unused: toNumber(d.remained_unused),
//         wastage: toNumber(d.wastage),
//         actual_used: toNumber(d.actual_used),
//         actual_used_uom1: toNumber(d.actual_used_uom1),
//         actual_used_uom2: toNumber(d.actual_used_uom2),
//         actual_used_uom3: toNumber(d.actual_used_uom3)
//       })),
//       employees: selectedEmployees
//     }

//     try {
//       if (mode === 'create') {
//         await createGin(payload).unwrap()
//       } else {
//         await updateGin({ id: id!, ...payload }).unwrap()
//       }
//       router.push('/gin')
//     } catch (error: any) {
//       setApiError(error?.data?.message || 'Failed to save GIN')
//     }
//   }, [mode, id, formData, details, selectedEmployees, createGin, updateGin, router])

//   // =============================================
//   // LOADING
//   // =============================================

//   if (mode === 'edit' && isLoadingEdit) {
//     return <Loading size="lg" text="Loading GIN..." />
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <FileText className="w-8 h-8 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {mode === 'create' ? 'Create GIN' : 'Edit GIN'}
//               </h1>
//               <p className="text-blue-100 mt-1">{formData.gin_number || 'Goods Issue Note'}</p>
//             </div>
//           </div>
//           <Button
//             variant="secondary"
//             onClick={() => router.push('/gin')}
//             icon={<ArrowLeft className="w-4 h-4" />}
//             className="bg-white text-[#509ee3] hover:bg-gray-100"
//           >
//             Back to List
//           </Button>
//         </div>
//       </div>

//       {/* Error Display */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600" />
//           <span className="text-red-700">{apiError}</span>
//           <button onClick={() => setApiError('')} className="ml-auto text-red-600 hover:text-red-800">×</button>
//         </div>
//       )}

//       {/* Tabs Navigation */}
//       <div className="mb-6">
//         <div className="flex border-b border-gray-200 bg-white rounded-t-lg">
//           {TABS.map(tab => {
//             const Icon = tab.icon
//             const isActive = activeTab === tab.id
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${isActive
//                     ? 'border-[#509ee3] text-[#509ee3] bg-blue-50'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//               >
//                 <Icon className="w-4 h-4" />
//                 {tab.label}
//                 {tab.id === 'details' && details.length > 0 && (
//                   <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
//                     {details.length}
//                   </span>
//                 )}
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* =============================================
//           TAB 1: HEADER
//           ============================================= */}
//       {activeTab === 'header' && (
//         <>
//           {/* GIN Details Section */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//               <Package className="w-5 h-5 mr-2 text-[#509ee3]" />
//               GIN Information
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               {/* GIN Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">GIN Number</label>
//                 <input
//                   type="text"
//                   value={formData.gin_number}
//                   readOnly
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 />
//               </div>

//               {/* Date */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Calendar className="w-4 h-4 inline mr-1" />
//                   Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.gin_date}
//                   onChange={handleDateChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
//                 />
//                 {errors.gin_date && <p className="mt-1 text-sm text-red-600">{errors.gin_date}</p>}
//               </div>

//               {/* Account (COA) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Account <span className="text-red-500">*</span>
//                 </label>
//                 <CoaSearchableInput
//                   value={formData.coa_id}
//                   onChange={handleCoaChange}
//                   placeholder="Select account..."
//                 />
//                 {errors.coa_id && <p className="mt-1 text-sm text-red-600">{errors.coa_id}</p>}
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => handleStatusChange(e.target.value as any)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
//                 >
//                   {STATUS_OPTIONS.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//               {/* Recipe Selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Recipe (Product) <span className="text-red-500">*</span>
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowRecipeModal(true)}
//                   disabled={mode === 'edit'}
//                   className={`w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between ${mode === 'edit'
//                       ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
//                       : 'border-gray-300 hover:border-[#509ee3] hover:bg-gray-50'
//                     }`}
//                 >
//                   <span className={formData.itemName ? 'text-gray-900' : 'text-gray-400'}>
//                     {formData.itemName || 'Select Recipe...'}
//                   </span>
//                   <Package className="w-4 h-4 text-gray-400" />
//                 </button>
//                 {errors.item_id && <p className="mt-1 text-sm text-red-600">{errors.item_id}</p>}
//               </div>

//               {/* Qty Planned */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Qty Planned <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="number"
//                     value={formData.qty_planned}
//                     onChange={(e) => handleQtyPlannedChange(e.target.value)}
//                     placeholder="0"
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
//                   />
//                   {formData.uomName && (
//                     <span className="text-sm text-gray-500 whitespace-nowrap px-2 py-1 bg-gray-100 rounded">
//                       {formData.uomName}
//                     </span>
//                   )}
//                 </div>
//                 {errors.qty_planned && <p className="mt-1 text-sm text-red-600">{errors.qty_planned}</p>}
//               </div>

//               {/* Recipe Main Qty (readonly info) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Base Qty</label>
//                 <input
//                   type="text"
//                   value={recipeMainQty}
//                   readOnly
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             {/* Reason (for pending/rejected) */}
//             {(formData.status === 'pending' || formData.status === 'rejected') && (
//               <div className="mt-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-500" />
//                   Reason <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={formData.reason}
//                   onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
//                   placeholder="Enter reason for pending/rejected status..."
//                 />
//                 {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
//               </div>
//             )}
//           </div>

//           {/* Employees Section */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <Users className="w-5 h-5 mr-2 text-purple-500" />
//                 Assigned Employees
//                 <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
//                   {selectedEmployees.length}
//                 </span>
//               </h2>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowEmployeeModal(true)}
//                 icon={<Plus className="w-4 h-4" />}
//               >
//                 Select Employees
//               </Button>
//             </div>

//             {selectedEmployees.length === 0 ? (
//               <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
//                 <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                 <p>No employees assigned</p>
//                 <p className="text-sm">Click "Select Employees" to assign workers</p>
//               </div>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {selectedEmployees.map(empId => (
//                   <span
//                     key={empId}
//                     className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
//                   >
//                     {employeeNames.get(empId) || `Employee #${empId}`}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveEmployee(empId)}
//                       className="ml-2 hover:text-purple-900"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* =============================================
//           TAB 2: DETAILS
//           ============================================= */}
//       {activeTab === 'details' && (
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//             <ClipboardList className="w-5 h-5 mr-2 text-orange-500" />
//             Component Items
//             <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
//               {details.length} items
//             </span>
//           </h2>

//           {/* Errors */}
//           {errors.details && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//               <AlertCircle className="w-4 h-4 inline mr-1" />
//               {errors.details}
//             </div>
//           )}
//           {errors.batch && (
//             <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
//               <AlertTriangle className="w-4 h-4 inline mr-1" />
//               {errors.batch}
//             </div>
//           )}
//           {errors.overIssue && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//               <AlertTriangle className="w-4 h-4 inline mr-1" />
//               {errors.overIssue}
//             </div>
//           )}

//           {details.length === 0 ? (
//             <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
//               <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//               <p className="text-lg font-medium">No Components</p>
//               <p className="text-sm mt-1">Go to Header tab and select a recipe to load components</p>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setActiveTab('header')}
//                 className="mt-4"
//               >
//                 Go to Header
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10">#</th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Item</th>
//                     <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-20">Suggested</th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">Batch</th>
//                     <th className="px-3 py-3 text-right text-xs font-semibold text-green-600 uppercase w-20">Available</th>
//                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Issue Qty</th>
//                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">Unused</th>
//                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">Wastage</th>
//                     <th className="px-3 py-3 text-right text-xs font-semibold text-blue-600 uppercase w-24">Actual Used</th>
//                     <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-16">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {details.map((detail, index) => (
//                     <GinDetailRow
//                       key={`${detail.item_id}-${index}`}
//                       detail={detail}
//                       index={index}
//                       mode={mode}
//                       ginId={id}
//                       onUpdate={handleDetailUpdate}
//                       onRemove={handleDetailRemove}
//                     />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* =============================================
//           ACTION BUTTONS
//           ============================================= */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-gray-500">
//             {details.length > 0 && (
//               <span>
//                 {details.filter(d => d.batchno).length} of {details.length} items have batch selected
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-4">
//             <Button variant="outline" onClick={() => router.push('/gin')}>
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleSaveClick}
//               loading={isCreating || isUpdating}
//               icon={<Save className="w-4 h-4" />}
//             >
//               {mode === 'create' ? 'Create GIN' : 'Update GIN'}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* =============================================
//           MODALS
//           ============================================= */}
//       <RecipeSelector
//         isOpen={showRecipeModal}
//         onClose={() => setShowRecipeModal(false)}
//         onSelect={handleRecipeSelect}
//       />

//       <EmployeeSelector
//         isOpen={showEmployeeModal}
//         onClose={() => setShowEmployeeModal(false)}
//         onSelect={handleEmployeeSelect}
//         selectedIds={selectedEmployees}
//       />

//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmSave}
//         title={mode === 'create' ? 'Create GIN' : 'Update GIN'}
//         message={
//           mode === 'create'
//             ? `Create GIN with ${details.length} component(s)? This will also create MGDN for stock out.`
//             : `Update GIN with ${details.length} component(s)?`
//         }
//         confirmText={mode === 'create' ? 'Create' : 'Update'}
//         type="info"
//         loading={isCreating || isUpdating}
//       />
//     </div>
//   )
// }

// export default GinForm



























































// components/gin/GinForm.tsx

'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetGinByIdQuery,
  useGetNextGinNumberQuery,
  useCreateGinMutation,
  useUpdateGinMutation,
} from '@/store/slice/ginSlice'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import RecipeSelector from './RecipeSelector'
import EmployeeSelector from './EmployeeSelector'
import GinDetailRow from '@/components/gin/GinDetailRow'
import {ConfirmationModal} from '@/components/common/ConfirmationModal'
import {CoaSearchableInput} from '@/components/common/coa/CoaSearchableInput'
import {
  Save, ArrowLeft, AlertCircle, Package, Plus, Trash2,
  FileText, Users, ClipboardList, AlertTriangle, Settings, List,
  TrendingUp, Calendar
} from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface GinFormProps {
  mode: 'create' | 'edit'
  id?: number
}

interface UomData {
  primary: { id: number; name: string; qty: number }
  secondary?: { id: number; name: string; qty: number }
  tertiary?: { id: number; name: string; qty: number }
}

interface DetailItem {
  item_id: number
  itemName: string
  recipe_qty: number
  suggested_qty: number
  batchno: number | null
  available_qty: number
  issue_qty: number
  issue_uom1_qty: number
  issue_uom2_qty: number
  issue_uom3_qty: number
  issue_uom_id: number | null
  remained_unused: number
  wastage: number
  actual_used: number
  actual_used_uom1: number
  actual_used_uom2: number
  actual_used_uom3: number
  uomData: UomData | null
}

interface MgrnEntry {
  ID: number
  batchno: number | null
  uom1_qty: string
  uom2_qty: string
  uom3_qty: string
  Stock_In_UOM_Qty: string
  Stock_In_SKU_UOM_Qty: string
  Stock_In_UOM3_Qty: string
  stockMain?: {
    ID: number
    Number: string
    Date: string
    Stock_Type_ID: number
    Status: string
  }
  batchDetails?: {
    id: number
    acName: string
  }
}

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'close', label: 'Close' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' }
]

const TABS = [
  { id: 'header', label: 'GIN Header', icon: Settings },
  { id: 'details', label: 'GIN Details', icon: List }
]

// =============================================
// HELPERS
// =============================================

const toNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const buildUomData = (item: any): UomData | null => {
  if (!item) return null
  
  return {
    primary: {
      id: item.skuUOM || item.uom1?.id || 0,
      name: item.uom1?.uom || 'Pcs',
      qty: toNumber(item.uom1_qty) || 1
    },
    secondary: {
      id: item.uom2 || item.uomTwo?.id || 0,
      name: item.uomTwo?.uom || item.uom1?.uom || 'Pcs',
      qty: toNumber(item.uom2_qty) || 1
    },
    tertiary: {
      id: item.uom3 || item.uomThree?.id || 0,
      name: item.uomThree?.uom || '',
      qty: toNumber(item.uom3_qty) || 1
    }
  }
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// =============================================
// COMPONENT
// =============================================

const GinForm: React.FC<GinFormProps> = ({ mode, id }) => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [activeTab, setActiveTab] = useState('header')

  const [formData, setFormData] = useState({
    gin_number: '',
    item_id: null as number | null,
    itemName: '',
    qty_planned: '',
    Uom_Id: null as number | null,
    uomName: '',
    status: 'open' as 'open' | 'close' | 'pending' | 'rejected',
    reason: '',
    coa_id: null as number | null,
    coaName: '',
    gin_date: new Date().toISOString().split('T')[0]
  })

  const [recipeMainQty, setRecipeMainQty] = useState<number>(1)
  const [details, setDetails] = useState<DetailItem[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [employeeNames, setEmployeeNames] = useState<Map<number, string>>(new Map())

  const [showRecipeModal, setShowRecipeModal] = useState(false)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  // ✅ MGRN Data State
  const [mgrnData, setMgrnData] = useState<{
    totalProduced: number
    qtyRemaining: number
    mgrnEntries: MgrnEntry[]
  }>({
    totalProduced: 0,
    qtyRemaining: 0,
    mgrnEntries: []
  })

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: editData, isLoading: isLoadingEdit } = useGetGinByIdQuery(id!, {
    skip: mode !== 'edit' || !id
  })

  const { data: nextGinNumber } = useGetNextGinNumberQuery(undefined, {
    skip: mode !== 'create'
  })

  const [createGin, { isLoading: isCreating }] = useCreateGinMutation()
  const [updateGin, { isLoading: isUpdating }] = useUpdateGinMutation()

  // =============================================
  // SET GIN NUMBER FOR CREATE MODE
  // =============================================

  useEffect(() => {
    if (mode === 'create' && nextGinNumber) {
      setFormData(prev => ({ ...prev, gin_number: nextGinNumber }))
    }
  }, [mode, nextGinNumber])

  // =============================================
  // POPULATE FORM IN EDIT MODE
  // =============================================

  useEffect(() => {
    if (mode === 'edit' && editData) {
      const mainQty = toNumber(editData.recipe?.qty) || 1
      setRecipeMainQty(mainQty)

      setFormData({
        gin_number: editData.gin_number || '',
        item_id: editData.item_id,
        itemName: editData.item?.itemName || '',
        qty_planned: toNumber(editData.qty_planned).toString(),
        Uom_Id: editData.Uom_Id,
        uomName: editData.uom?.uom || '',
        status: editData.status || 'open',
        reason: editData.reason || '',
        coa_id: editData.coa_id || null,
        coaName: editData.coa?.acName || '',
        gin_date: editData.gin_date ? editData.gin_date.split('T')[0] : new Date().toISOString().split('T')[0]
      })

      // ✅ Set MGRN data
      setMgrnData({
        totalProduced: toNumber(editData.totalProduced),
        qtyRemaining: toNumber(editData.qtyRemaining),
        mgrnEntries: editData.mgrnEntries || []
      })

      // Build recipe qty map
      const recipeQtyMap = new Map<number, number>()
      if (editData.recipe?.details) {
        editData.recipe.details.forEach((rd: any) => {
          recipeQtyMap.set(rd.Item_id, toNumber(rd.qty))
        })
      }

      // Populate details
      if (editData.details && editData.details.length > 0) {
        const detailItems: DetailItem[] = editData.details.map(d => {
          const recipeQty = recipeQtyMap.get(d.item_id) || toNumber(d.suggested_qty)
          const uomData = buildUomData(d.item)
          const issueQty = toNumber(d.issue_qty)
          const unusedQty = toNumber(d.remained_unused)
          const actualUsed = Math.max(0, issueQty - unusedQty)

          return {
            item_id: d.item_id,
            itemName: d.item?.itemName || '',
            recipe_qty: recipeQty,
            suggested_qty: toNumber(d.suggested_qty),
            batchno: d.batchno || null,
            available_qty: 0,
            issue_qty: issueQty,
            issue_uom1_qty: toNumber(d.issue_uom1_qty),
            issue_uom2_qty: issueQty,
            issue_uom3_qty: toNumber(d.issue_uom3_qty),
            issue_uom_id: d.issue_uom_id || null,
            remained_unused: unusedQty,
            wastage: toNumber(d.wastage),
            actual_used: actualUsed,
            actual_used_uom1: toNumber(d.actual_used_uom1),
            actual_used_uom2: actualUsed,
            actual_used_uom3: toNumber(d.actual_used_uom3),
            uomData
          }
        })
        setDetails(detailItems)
      }

      // Populate employees
      if (editData.employees && editData.employees.length > 0) {
        const empIds = editData.employees.map(e => e.employee_id)
        setSelectedEmployees(empIds)

        const names = new Map<number, string>()
        editData.employees.forEach(e => {
          if (e.employee) names.set(e.employee_id, e.employee.employeeName)
        })
        setEmployeeNames(names)
      }
    }
  }, [mode, editData])

  // =============================================
  // RECALCULATE SUGGESTED QTY WHEN QTY_PLANNED CHANGES
  // =============================================

  useEffect(() => {
    const qtyPlanned = toNumber(formData.qty_planned)

    if (qtyPlanned > 0 && details.length > 0 && recipeMainQty > 0) {
      setDetails(prev => prev.map(detail => {
        const recipeQty = toNumber(detail.recipe_qty)
        const suggested = (recipeQty / recipeMainQty) * qtyPlanned

        return {
          ...detail,
          suggested_qty: toNumber(suggested.toFixed(4))
        }
      }))
    }
  }, [formData.qty_planned, recipeMainQty])

  // =============================================
  // HANDLERS
  // =============================================

  const handleRecipeSelect = useCallback(async (recipe: any) => {
    const mainQty = toNumber(recipe.qty) || 1
    setRecipeMainQty(mainQty)

    setFormData(prev => ({
      ...prev,
      item_id: recipe.Item_id,
      itemName: recipe.item?.itemName || '',
      Uom_Id: recipe.Uom_Id,
      uomName: recipe.uom?.uom || ''
    }))

    if (recipe.details && recipe.details.length > 0) {
      const qtyPlanned = toNumber(formData.qty_planned)

      const newDetails: DetailItem[] = recipe.details.map((d: any) => {
        const recipeQty = toNumber(d.qty)
        const suggested = qtyPlanned > 0 ? (recipeQty / mainQty) * qtyPlanned : recipeQty
        const uomData = buildUomData(d.item)

        return {
          item_id: d.Item_id || d.item?.id,
          itemName: d.item?.itemName || '',
          recipe_qty: recipeQty,
          suggested_qty: toNumber(suggested.toFixed(4)),
          batchno: null,
          available_qty: 0,
          issue_qty: 0,
          issue_uom1_qty: 0,
          issue_uom2_qty: 0,
          issue_uom3_qty: 0,
          issue_uom_id: d.Uom_Id || uomData?.secondary?.id || null,
          remained_unused: 0,
          wastage: 0,
          actual_used: 0,
          actual_used_uom1: 0,
          actual_used_uom2: 0,
          actual_used_uom3: 0,
          uomData
        }
      })

      setDetails(newDetails)
    }

    setShowRecipeModal(false)
  }, [formData.qty_planned])

  const handleQtyPlannedChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, qty_planned: value }))
  }, [])

  const handleDetailUpdate = useCallback((index: number, data: any) => {
    setDetails(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...data }
      return updated
    })
  }, [])

  const handleDetailRemove = useCallback((index: number) => {
    setDetails(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleStatusChange = useCallback((status: 'open' | 'close' | 'pending' | 'rejected') => {
    setFormData(prev => ({
      ...prev,
      status,
      reason: (status !== 'pending' && status !== 'rejected') ? '' : prev.reason
    }))
  }, [])

  const handleEmployeeSelect = useCallback((empIds: number[], names?: Map<number, string>) => {
    setSelectedEmployees(empIds)
    if (names) {
      setEmployeeNames(names)
    }
  }, [])

  const handleRemoveEmployee = useCallback((empId: number) => {
    setSelectedEmployees(prev => prev.filter(id => id !== empId))
  }, [])

  const handleCoaChange = useCallback((coaId: number | null, coaData?: any) => {
    setFormData(prev => ({
      ...prev,
      coa_id: coaId,
      coaName: coaData?.acName || ''
    }))
  }, [])

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, gin_date: e.target.value }))
  }, [])

  // =============================================
  // VALIDATION
  // =============================================

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.item_id) {
      newErrors.item_id = 'Please select a recipe'
    }

    if (toNumber(formData.qty_planned) <= 0) {
      newErrors.qty_planned = 'Planned quantity is required'
    }

    if (details.length === 0) {
      newErrors.details = 'No components found'
    }

    if (!formData.coa_id) {
      newErrors.coa_id = 'Account is required'
    }

    if (!formData.gin_date) {
      newErrors.gin_date = 'Date is required'
    }

    if ((formData.status === 'pending' || formData.status === 'rejected') && !formData.reason.trim()) {
      newErrors.reason = 'Reason is required'
    }

    // Check batch selection for items with issue qty > 0
    const itemsWithoutBatch = details.filter(d => !d.batchno && d.issue_qty > 0)
    if (itemsWithoutBatch.length > 0) {
      newErrors.batch = `Please select batch for: ${itemsWithoutBatch.map(d => d.itemName).join(', ')}`
    }

    // Check issue qty doesn't exceed available
    const overIssuedItems = details.filter(d => d.batchno && d.issue_qty > d.available_qty && d.available_qty > 0)
    if (overIssuedItems.length > 0) {
      newErrors.overIssue = `Issue qty exceeds available for: ${overIssuedItems.map(d => d.itemName).join(', ')}`
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
      item_id: formData.item_id!,
      qty_planned: toNumber(formData.qty_planned),
      Uom_Id: formData.Uom_Id,
      status: formData.status,
      reason: formData.reason || null,
      coa_id: formData.coa_id,
      gin_date: formData.gin_date,
      details: details.map(d => ({
        item_id: d.item_id,
        suggested_qty: toNumber(d.suggested_qty),
        batchno: d.batchno,
        issue_qty: toNumber(d.issue_qty),
        issue_uom1_qty: toNumber(d.issue_uom1_qty),
        issue_uom2_qty: toNumber(d.issue_uom2_qty),
        issue_uom3_qty: toNumber(d.issue_uom3_qty),
        issue_uom_id: d.issue_uom_id,
        remained_unused: toNumber(d.remained_unused),
        wastage: toNumber(d.wastage),
        actual_used: toNumber(d.actual_used),
        actual_used_uom1: toNumber(d.actual_used_uom1),
        actual_used_uom2: toNumber(d.actual_used_uom2),
        actual_used_uom3: toNumber(d.actual_used_uom3)
      })),
      employees: selectedEmployees
    }

    try {
      if (mode === 'create') {
        await createGin(payload).unwrap()
      } else {
        await updateGin({ id: id!, ...payload }).unwrap()
      }
      router.push('/gin')
    } catch (error: any) {
      setApiError(error?.data?.message || 'Failed to save GIN')
    }
  }, [mode, id, formData, details, selectedEmployees, createGin, updateGin, router])

  // =============================================
  // LOADING
  // =============================================

  if (mode === 'edit' && isLoadingEdit) {
    return <Loading size="lg" text="Loading GIN..." />
  }

  // =============================================
  // CALCULATE PROGRESS
  // =============================================

  const qtyPlanned = toNumber(formData.qty_planned)
  const progressPercent = qtyPlanned > 0 ? Math.min(100, (mgrnData.totalProduced / qtyPlanned) * 100) : 0

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'Create GIN' : 'Edit GIN'}
              </h1>
              <p className="text-blue-100 mt-1">{formData.gin_number || 'Goods Issue Note'}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/gin')}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="bg-white text-[#509ee3] hover:bg-gray-100"
          >
            Back to List
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{apiError}</span>
          <button onClick={() => setApiError('')} className="ml-auto text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ✅ Production Summary - Only in Edit Mode */}
      {mode === 'edit' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Production Summary
          </h2>

          {/* Progress Bar */}
          {/* <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Production Progress</span>
              <span className="font-medium text-gray-900">
                {mgrnData.totalProduced.toFixed(2)} / {qtyPlanned.toFixed(2)} {formData.uomName}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  progressPercent >= 100 ? 'bg-green-500' : 
                  progressPercent >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {progressPercent.toFixed(1)}% Complete
            </p>
          </div> */}

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">Planned</p>
              <p className="text-lg font-bold text-blue-800">
                {qtyPlanned.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-medium">Produced</p>
              <p className="text-lg font-bold text-green-800">
                {mgrnData.totalProduced.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-orange-600 font-medium">Remaining</p>
              <p className="text-lg font-bold text-orange-800">
                {mgrnData.qtyRemaining.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-purple-600 font-medium">MGRNs Created</p>
              <p className="text-lg font-bold text-purple-800">
                {mgrnData.mgrnEntries.length}
              </p>
            </div>
          </div> */}

          {/* MGRN Entries List */}
          {mgrnData.mgrnEntries.length > 0 && (
            <div className="mt-4">
              {/* <h3 className="text-sm font-semibold text-gray-700 mb-2">MGRN Receipts</h3> */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">MGRN #</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Batch</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Qty Received</th>
                      {/* <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Status</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mgrnData.mgrnEntries.map((entry, idx) => (
                      <tr key={entry.ID || idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <span className="font-medium text-green-600">
                            {entry.stockMain?.Number || '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {entry.stockMain?.Date ? formatDate(entry.stockMain.Date) : '-'}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {entry.batchDetails?.acName || `Batch #${entry.batchno}` || '-'}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900">
                          {toNumber(entry.Stock_In_SKU_UOM_Qty || entry.uom2_qty).toFixed(2)}
                        </td>
                        {/* <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            entry.stockMain?.Status === 'Post' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {entry.stockMain?.Status || 'UnPost'}
                          </span>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="">
                    <tr>
                      {/* <td  className="px-3 py-2 text-right text-sm font-semibold text-gray-700">
                        Total Produced:{mgrnData.totalProduced.toFixed(2)}
                      </td> */}
                      {/* <td className="px-3 py-2 text-right text-sm font-bold text-green-600">
                        {mgrnData.totalProduced.toFixed(2)}
                      </td> */}
                      {/* <td></td> */}
                    </tr>
                  </tfoot>
                </table>
                <div className="mt-2 px-3 py-1 text-right text-[#4d98de] font-semibold space-x-1">
                     {mgrnData.totalProduced.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* No MGRNs Message */}
          {mgrnData.mgrnEntries.length === 0 && (
            <div className="mt-4 text-center py-4 bg-gray-50 rounded-lg">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No production receipts yet</p>
              <p className="text-xs text-gray-400 mt-1">Create MGRN to record finished products</p>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 bg-white rounded-t-lg">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const hasError = (tab.id === 'header' && (errors.item_id || errors.qty_planned || errors.coa_id || errors.gin_date || errors.reason)) ||
                            (tab.id === 'details' && (errors.details || errors.batch || errors.overIssue))
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors relative ${
                  isActive
                    ? 'border-[#509ee3] text-[#509ee3] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {hasError && (
                  <span className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* =============================================
          TAB 1: HEADER
          ============================================= */}
      {activeTab === 'header' && (
        <>
          {/* GIN Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-[#509ee3]" />
              GIN Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* GIN Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GIN Number</label>
                <input
                  type="text"
                  value={formData.gin_number}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.gin_date}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
                />
                {errors.gin_date && <p className="mt-1 text-sm text-red-600">{errors.gin_date}</p>}
              </div>

              {/* Account (COA) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account <span className="text-red-500">*</span>
                </label>
                <CoaSearchableInput
                  value={formData.coa_id}
                  onChange={handleCoaChange}
                  placeholder="Select account..."
                />
                {errors.coa_id && <p className="mt-1 text-sm text-red-600">{errors.coa_id}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Recipe Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe (Product) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(true)}
                  disabled={mode === 'edit'}
                  className={`w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between ${
                    mode === 'edit'
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed text-gray-600'
                      : 'border-gray-300 hover:border-[#509ee3] bg-white'
                  }`}
                >
                  <span className={formData.itemName ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.itemName || 'Select Recipe...'}
                  </span>
                  <Package className="w-4 h-4 text-gray-400" />
                </button>
                {errors.item_id && <p className="mt-1 text-sm text-red-600">{errors.item_id}</p>}
              </div>

              {/* Qty Planned */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qty Planned <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.qty_planned}
                    onChange={(e) => handleQtyPlannedChange(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
                  />
                  {formData.uomName && (
                    <span className="text-sm text-gray-500 whitespace-nowrap bg-gray-100 px-3 py-2 rounded-lg">
                      {formData.uomName}
                    </span>
                  )}
                </div>
                {errors.qty_planned && <p className="mt-1 text-sm text-red-600">{errors.qty_planned}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] bg-white"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason (for pending/rejected) */}
            {(formData.status === 'pending' || formData.status === 'rejected') && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-500" />
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
                  placeholder="Enter reason for pending/rejected status..."
                />
                {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
              </div>
            )}
          </div>

          {/* Employees Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                Assigned Employees
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {selectedEmployees.length}
                </span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmployeeModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Select Employees
              </Button>
            </div>

            {selectedEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No employees assigned</p>
                <p className="text-sm text-gray-400 mt-1">Click "Select Employees" to assign</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedEmployees.map(empId => (
                  <span
                    key={empId}
                    className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {employeeNames.get(empId) || `Employee #${empId}`}
                    <button
                      type="button"
                      onClick={() => handleRemoveEmployee(empId)}
                      className="ml-2 hover:text-purple-900 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* =============================================
          TAB 2: DETAILS
          ============================================= */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-orange-500" />
            Component Items
            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {details.length} items
            </span>
          </h2>

          {/* Error Messages */}
          {errors.details && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              {errors.details}
            </div>
          )}
          {errors.batch && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              {errors.batch}
            </div>
          )}
          {errors.overIssue && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              {errors.overIssue}
            </div>
          )}

          {details.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No Components</p>
              <p className="text-sm mt-1">Go to Header tab and select a recipe to load components</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setActiveTab('header')}
              >
                Go to Header Tab
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item</th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Suggested</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Batch</th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-green-600 uppercase tracking-wider">Available</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Issue Qty</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Unused</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Wastage</th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-blue-600 uppercase tracking-wider">Actual Used</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {details.map((detail, index) => (
                    <GinDetailRow
                      key={`${detail.item_id}-${index}`}
                      detail={detail}
                      index={index}
                      mode={mode}
                      ginId={id}
                      onUpdate={handleDetailUpdate}
                      onRemove={handleDetailRemove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Actions Footer */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {details.length > 0 && (
              <span>
                {details.filter(d => d.batchno).length} of {details.length} items have batch selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/gin')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveClick}
              loading={isCreating || isUpdating}
              icon={<Save className="w-4 h-4" />}
            >
              {mode === 'create' ? 'Create GIN' : 'Update GIN'}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecipeSelector
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        onSelect={handleRecipeSelect}
      />

      <EmployeeSelector
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onSelect={handleEmployeeSelect}
        selectedIds={selectedEmployees}
      />

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title={mode === 'create' ? 'Create GIN' : 'Update GIN'}
        message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this GIN with ${details.length} component(s)? This will also create/update the manufacturing dispatch (MGDN).`}
        confirmText={mode === 'create' ? 'Create' : 'Update'}
        type="info"
        loading={isCreating || isUpdating}
      />
    </div>
  )
}

export default GinForm
