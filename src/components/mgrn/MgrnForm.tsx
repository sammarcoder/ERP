// // components/mgrn/MgrnForm.tsx

// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   useGetMgrnByIdQuery,
//   useGetNextMgrnNumberQuery,
//   useGetGinsForMgrnQuery,
//   useCreateMgrnMutation,
//   useUpdateMgrnMutation,
// } from '@/store/slice/mgrnSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import {CoaSearchableInput} from '@/components/common/coa/CoaSearchableInput'
// import {ConfirmationModal} from '@/components/common/ConfirmationModal'
// import {
//   Save, ArrowLeft, AlertCircle, Package, Plus, Trash2,
//   FileText, CheckCircle, X, Calendar, Search
// } from 'lucide-react'

// // =============================================
// // TYPES
// // =============================================

// interface MgrnFormProps {
//   mode: 'create' | 'edit'
//   id?: number
// }

// interface SelectedGin {
//   gin_id: number
//   gin_number: string
//   item_id: number
//   itemName: string
//   qty_planned: number
//   qty_produced: number
//   qty_remaining: number
//   qty_received: number
//   uomName: string
// }

// // =============================================
// // HELPERS
// // =============================================

// const toNumber = (value: any): number => {
//   const num = Number(value)
//   return isNaN(num) ? 0 : num
// }

// // =============================================
// // COMPONENT
// // =============================================

// const MgrnForm: React.FC<MgrnFormProps> = ({ mode, id }) => {
//   const router = useRouter()

//   // =============================================
//   // STATE
//   // =============================================

//   const [formData, setFormData] = useState({
//     mgrn_number: '',
//     coa_id: null as number | null,
//     coaName: '',
//     batchno: null as number | null,
//     batchName: '',
//     mgrn_date: new Date().toISOString().split('T')[0],
//     remarks: ''
//   })

//   const [selectedGins, setSelectedGins] = useState<SelectedGin[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [showGinSelector, setShowGinSelector] = useState(false)
//   const [showConfirm, setShowConfirm] = useState(false)

//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [apiError, setApiError] = useState('')

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const { data: editData, isLoading: isLoadingEdit } = useGetMgrnByIdQuery(id!, {
//     skip: mode !== 'edit' || !id
//   })

//   const { data: nextMgrnNumber } = useGetNextMgrnNumberQuery(undefined, {
//     skip: mode !== 'create'
//   })

//   const { data: availableGins = [], isLoading: isLoadingGins } = useGetGinsForMgrnQuery()

//   const [createMgrn, { isLoading: isCreating }] = useCreateMgrnMutation()
//   const [updateMgrn, { isLoading: isUpdating }] = useUpdateMgrnMutation()

//   // =============================================
//   // SET MGRN NUMBER FOR CREATE MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'create' && nextMgrnNumber) {
//       setFormData(prev => ({ ...prev, mgrn_number: nextMgrnNumber }))
//     }
//   }, [mode, nextMgrnNumber])

//   // =============================================
//   // POPULATE FORM IN EDIT MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'edit' && editData) {
//       setFormData({
//         mgrn_number: editData.Number || '',
//         coa_id: editData.COA_ID || null,
//         coaName: editData.coa?.acName || '',
//         batchno: editData.details?.[0]?.batchno || null,
//         batchName: '',
//         mgrn_date: editData.Date ? editData.Date.split('T')[0] : new Date().toISOString().split('T')[0],
//         remarks: editData.remarks || ''
//       })

//       // Populate selected GINs
//       if (editData.details && editData.details.length > 0) {
//         const gins: SelectedGin[] = editData.details.map(d => ({
//           gin_id: d.gin_id,
//           gin_number: d.gin?.gin_number || '',
//           item_id: d.Item_ID,
//           itemName: d.item?.itemName || '',
//           qty_planned: toNumber(d.gin?.qty_planned),
//           qty_produced: 0,
//           qty_remaining: 0,
//           qty_received: toNumber(d.Stock_In_SKU_UOM_Qty || d.uom2_qty),
//           uomName: ''
//         }))
//         setSelectedGins(gins)
//       }
//     }
//   }, [mode, editData])

//   // =============================================
//   // FILTER AVAILABLE GINS
//   // =============================================

//   const filteredGins = availableGins.filter(gin => {
//     const alreadySelected = selectedGins.some(sg => sg.gin_id === gin.id)
//     const matchesSearch = searchTerm === '' ||
//       gin.gin_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       gin.item?.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
//     return !alreadySelected && matchesSearch
//   })

//   // =============================================
//   // HANDLERS
//   // =============================================

//   const handleAddGin = useCallback((gin: any) => {
//     const newGin: SelectedGin = {
//       gin_id: gin.id,
//       gin_number: gin.gin_number,
//       item_id: gin.item_id,
//       itemName: gin.item?.itemName || '',
//       qty_planned: toNumber(gin.qty_planned),
//       qty_produced: toNumber(gin.qty_produced),
//       qty_remaining: toNumber(gin.qty_remaining),
//       qty_received: 0,
//       uomName: gin.item?.uomTwo?.uom || gin.uom?.uom || 'Pcs'
//     }

//     setSelectedGins(prev => [...prev, newGin])
//     setShowGinSelector(false)
//     setSearchTerm('')
//   }, [])

//   const handleRemoveGin = useCallback((ginId: number) => {
//     setSelectedGins(prev => prev.filter(g => g.gin_id !== ginId))
//   }, [])

//   const handleQtyReceivedChange = useCallback((ginId: number, value: string) => {
//     const qty = toNumber(value)
//     setSelectedGins(prev => prev.map(g =>
//       g.gin_id === ginId ? { ...g, qty_received: qty } : g
//     ))
//   }, [])

//   const handleCoaChange = useCallback((coaId: number | null, coaData?: any) => {
//     setFormData(prev => ({
//       ...prev,
//       coa_id: coaId,
//       coaName: coaData?.acName || ''
//     }))
//   }, [])

//   const handleBatchChange = useCallback((batchId: number | null, batchData?: any) => {
//     setFormData(prev => ({
//       ...prev,
//       batchno: batchId,
//       batchName: batchData?.acName || ''
//     }))
//   }, [])

//   const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, mgrn_date: e.target.value }))
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validate = useCallback(() => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.coa_id) {
//       newErrors.coa_id = 'Account is required'
//     }

//     if (!formData.batchno) {
//       newErrors.batchno = 'Batch is required'
//     }

//     if (!formData.mgrn_date) {
//       newErrors.mgrn_date = 'Date is required'
//     }

//     if (selectedGins.length === 0) {
//       newErrors.gins = 'At least one GIN must be selected'
//     }

//     // Check all selected GINs have qty_received
//     const ginsWithoutQty = selectedGins.filter(g => g.qty_received <= 0)
//     if (ginsWithoutQty.length > 0) {
//       newErrors.qty = 'All selected GINs must have quantity received'
//     }

//     // Check qty_received doesn't exceed qty_remaining
//     const overReceived = selectedGins.filter(g => g.qty_received > g.qty_remaining && g.qty_remaining > 0)
//     if (overReceived.length > 0) {
//       newErrors.over = `Quantity exceeds remaining for: ${overReceived.map(g => g.gin_number).join(', ')}`
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData, selectedGins])

//   const handleSaveClick = useCallback(() => {
//     if (validate()) setShowConfirm(true)
//   }, [validate])

//   // =============================================
//   // SAVE
//   // =============================================

//   const handleConfirmSave = useCallback(async () => {
//     setShowConfirm(false)

//     const payload = {
//       coa_id: formData.coa_id!,
//       batchno: formData.batchno,
//       mgrn_date: formData.mgrn_date,
//       remarks: formData.remarks || null,
//       details: selectedGins.map(g => ({
//         gin_id: g.gin_id,
//         qty_received: g.qty_received,
//         batchno: formData.batchno
//       }))
//     }

//     try {
//       if (mode === 'create') {
//         await createMgrn(payload).unwrap()
//       } else {
//         await updateMgrn({ id: id!, ...payload }).unwrap()
//       }
//       router.push('/mgrn')
//     } catch (error: any) {
//       setApiError(error?.data?.message || 'Failed to save MGRN')
//     }
//   }, [mode, id, formData, selectedGins, createMgrn, updateMgrn, router])

//   // =============================================
//   // LOADING
//   // =============================================

//   if (mode === 'edit' && isLoadingEdit) {
//     return <Loading size="lg" text="Loading MGRN..." />
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#28a745] to-[#20c997] rounded-lg p-6 mb-6 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <FileText className="w-8 h-8 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {mode === 'create' ? 'Create MGRN' : 'Edit MGRN'}
//               </h1>
//               <p className="text-green-100 mt-1">
//                 {formData.mgrn_number || 'Manufacturing Goods Receipt Note'}
//               </p>
//             </div>
//           </div>
//           <Button
//             variant="secondary"
//             onClick={() => router.push('/mgrn')}
//             icon={<ArrowLeft className="w-4 h-4" />}
//             className="bg-white text-[#28a745] hover:bg-gray-100"
//           >
//             Back to List
//           </Button>
//         </div>
//       </div>

//       {/* Error Display */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//           <span className="text-red-700">{apiError}</span>
//           <button onClick={() => setApiError('')} className="ml-auto text-red-600 hover:text-red-800">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* MGRN Details Section */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//           <Package className="w-5 h-5 mr-2 text-[#28a745]" />
//           MGRN Information
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* MGRN Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">MGRN Number</label>
//             <input
//               type="text"
//               value={formData.mgrn_number}
//               readOnly
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <Calendar className="w-4 h-4 inline mr-1" />
//               Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               value={formData.mgrn_date}
//               onChange={handleDateChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
//             />
//             {errors.mgrn_date && <p className="mt-1 text-sm text-red-600">{errors.mgrn_date}</p>}
//           </div>

//           {/* Account (COA) */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Account <span className="text-red-500">*</span>
//             </label>
//             <CoaSearchableInput
//               value={formData.coa_id}
//               onChange={handleCoaChange}
//               placeholder="Select account..."
//             />
//             {errors.coa_id && <p className="mt-1 text-sm text-red-600">{errors.coa_id}</p>}
//           </div>

//           {/* Batch (COA Searchable - ONE for all items) */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Batch <span className="text-red-500">*</span>
//             </label>
//             <CoaSearchableInput
//               value={formData.batchno}
//               onChange={handleBatchChange}
//               placeholder="Select batch for all items..."
//             />
//             {errors.batchno && <p className="mt-1 text-sm text-red-600">{errors.batchno}</p>}
//           </div>
//         </div>

//         {/* Remarks */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
//           <textarea
//             value={formData.remarks}
//             onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
//             rows={2}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
//             placeholder="Optional remarks..."
//           />
//         </div>
//       </div>

//       {/* GIN Selection Section */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//             <Package className="w-5 h-5 mr-2 text-blue-500" />
//             Selected GINs (Finished Products)
//             <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//               {selectedGins.length}
//             </span>
//           </h2>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowGinSelector(true)}
//             icon={<Plus className="w-4 h-4" />}
//           >
//             Add GIN
//           </Button>
//         </div>

//         {/* Error Messages */}
//         {errors.gins && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//             <AlertCircle className="w-4 h-4 inline mr-2" />
//             {errors.gins}
//           </div>
//         )}
//         {errors.qty && (
//           <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
//             <AlertCircle className="w-4 h-4 inline mr-2" />
//             {errors.qty}
//           </div>
//         )}
//         {errors.over && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//             <AlertCircle className="w-4 h-4 inline mr-2" />
//             {errors.over}
//           </div>
//         )}

//         {selectedGins.length === 0 ? (
//           <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
//             <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//             <p className="text-lg font-medium">No GINs Selected</p>
//             <p className="text-sm mt-1">Click "Add GIN" to select production orders to receive</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GIN</th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Finished Product</th>
//                   <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Planned</th>
//                   <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Produced</th>
//                   <th className="px-4 py-3 text-right text-xs font-semibold text-green-600 uppercase">Remaining</th>
//                   <th className="px-4 py-3 text-center text-xs font-semibold text-blue-600 uppercase">Qty Received</th>
//                   <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {selectedGins.map((gin, index) => {
//                   const isOverReceived = gin.qty_received > gin.qty_remaining && gin.qty_remaining > 0
//                   return (
//                     <tr key={gin.gin_id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
//                       <td className="px-4 py-3">
//                         <span className="text-sm font-medium text-blue-600">{gin.gin_number}</span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="text-sm font-medium text-gray-900">{gin.itemName}</span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <span className="text-sm text-gray-600">{gin.qty_planned.toFixed(2)}</span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <span className="text-sm text-gray-600">{gin.qty_produced.toFixed(2)}</span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <span className={`text-sm font-medium ${gin.qty_remaining > 0 ? 'text-green-600' : 'text-gray-400'}`}>
//                           {gin.qty_remaining.toFixed(2)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-center gap-1">
//                           <input
//                             type="number"
//                             value={gin.qty_received || ''}
//                             onChange={(e) => handleQtyReceivedChange(gin.gin_id, e.target.value)}
//                             placeholder="0"
//                             className={`w-24 px-2 py-1.5 border rounded text-sm text-right focus:outline-none focus:ring-1 ${
//                               isOverReceived
//                                 ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
//                                 : 'border-gray-300 focus:ring-[#28a745] focus:border-[#28a745]'
//                             }`}
//                             step="0.01"
//                             min="0"
//                           />
//                           {gin.uomName && (
//                             <span className="text-xs text-gray-500">{gin.uomName}</span>
//                           )}
//                         </div>
//                         {isOverReceived && (
//                           <p className="text-xs text-red-600 text-center mt-1">Exceeds remaining!</p>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveGin(gin.gin_id)}
//                           className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                           title="Remove GIN"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Actions Footer */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4">
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-gray-500">
//             {selectedGins.length > 0 && (
//               <span>
//                 Total: {selectedGins.reduce((sum, g) => sum + g.qty_received, 0).toFixed(2)} items to receive
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-4">
//             <Button variant="outline" onClick={() => router.push('/mgrn')}>
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleSaveClick}
//               loading={isCreating || isUpdating}
//               icon={<Save className="w-4 h-4" />}
//               className="bg-[#28a745] hover:bg-[#218838]"
//             >
//               {mode === 'create' ? 'Create MGRN' : 'Update MGRN'}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* GIN Selector Modal */}
//       {showGinSelector && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
//             {/* Modal Header */}
//             <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Select GIN</h3>
//               <button
//                 onClick={() => {
//                   setShowGinSelector(false)
//                   setSearchTerm('')
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Search */}
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="relative">
//                 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by GIN number or product..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
//                 />
//               </div>
//             </div>

//             {/* GIN List */}
//             <div className="max-h-[400px] overflow-y-auto">
//               {isLoadingGins ? (
//                 <div className="p-8 text-center text-gray-500">
//                   <Loading size="sm" text="Loading GINs..." />
//                 </div>
//               ) : filteredGins.length === 0 ? (
//                 <div className="p-8 text-center text-gray-500">
//                   <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                   <p>No available GINs found</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-200">
//                   {filteredGins.map(gin => (
//                     <button
//                       key={gin.id}
//                       onClick={() => handleAddGin(gin)}
//                       className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
//                     >
//                       <div>
//                         <p className="font-medium text-blue-600">{gin.gin_number}</p>
//                         <p className="text-sm text-gray-900">{gin.item?.itemName}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Planned: {toNumber(gin.qty_planned).toFixed(2)} |
//                           Produced: {toNumber(gin.qty_produced).toFixed(2)} |
//                           <span className="text-green-600 font-medium"> Remaining: {toNumber(gin.qty_remaining).toFixed(2)}</span>
//                         </p>
//                       </div>
//                       <CheckCircle className="w-5 h-5 text-gray-300" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmSave}
//         title={mode === 'create' ? 'Create MGRN' : 'Update MGRN'}
//         message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this MGRN with ${selectedGins.length} finished product(s)? Batch: ${formData.batchName || formData.batchno}`}
//         confirmText={mode === 'create' ? 'Create' : 'Update'}
//         type="info"
//         loading={isCreating || isUpdating}
//       />
//     </div>
//   )
// }

// export default MgrnForm





























































// components/mgrn/MgrnForm.tsx

'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetMgrnByIdQuery,
  useGetNextMgrnNumberQuery,
  useGetGinsForMgrnQuery,
  useCreateMgrnMutation,
  useUpdateMgrnMutation,
} from '@/store/slice/mgrnSlice'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import {
  Save, ArrowLeft, AlertCircle, Package, Plus, Trash2,
  FileText, X, Calendar, Search, Info, Check
} from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface MgrnFormProps {
  mode: 'create' | 'edit'
  id?: number
}

interface SelectedGin {
  gin_id: number
  gin_number: string
  item_id: number
  itemName: string
  qty_planned: number
  qty_received: number
  uomName: string
  status: string
}

// =============================================
// HELPERS
// =============================================

const toNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

// =============================================
// COMPONENT
// =============================================

const MgrnForm: React.FC<MgrnFormProps> = ({ mode, id }) => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [formData, setFormData] = useState({
    mgrn_number: '',
    coa_id: null as number | null,
    coaName: '',
    batchno: null as number | null,  // ✅ ONE batch for all items
    batchName: '',
    mgrn_date: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  const [selectedGins, setSelectedGins] = useState<SelectedGin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showGinSelector, setShowGinSelector] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Multi-select state for GIN popup
  const [tempSelectedGinIds, setTempSelectedGinIds] = useState<Set<number>>(new Set())

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: editData, isLoading: isLoadingEdit } = useGetMgrnByIdQuery(id!, {
    skip: mode !== 'edit' || !id
  })

  const { data: nextMgrnNumber } = useGetNextMgrnNumberQuery(undefined, {
    skip: mode !== 'create'
  })

  const { data: availableGins = [], isLoading: isLoadingGins, refetch: refetchGins } = useGetGinsForMgrnQuery()

  const [createMgrn, { isLoading: isCreating }] = useCreateMgrnMutation()
  const [updateMgrn, { isLoading: isUpdating }] = useUpdateMgrnMutation()

  // =============================================
  // SET MGRN NUMBER FOR CREATE MODE
  // =============================================

  useEffect(() => {
    if (mode === 'create' && nextMgrnNumber) {
      setFormData(prev => ({ ...prev, mgrn_number: nextMgrnNumber }))
    }
  }, [mode, nextMgrnNumber])

  // =============================================
  // POPULATE FORM IN EDIT MODE
  // =============================================

  // useEffect(() => {
  //   if (mode === 'edit' && editData) {
  //     console.log('📦 Edit Data:', editData)

  //     // Get batch from first detail (all items have same batch)
  //     const firstDetail = editData.details?.[0]
  //     const batchno = firstDetail?.batchno || null
  //     const batchName = firstDetail?.batchDetails?.acName || ''

  //     setFormData({
  //       mgrn_number: editData.Number || '',
  //       coa_id: editData.COA_ID || null,
  //       coaName: editData.coa?.acName || '',
  //       batchno: batchno,
  //       batchName: batchName,
  //       mgrn_date: editData.Date ? editData.Date.split('T')[0] : new Date().toISOString().split('T')[0],
  //       remarks: editData.remarks || ''
  //     })

  //     // Populate selected GINs
  //     if (editData.details && editData.details.length > 0) {
  //       const gins: SelectedGin[] = editData.details.map(d => ({
  //         gin_id: d.gin_id,
  //         gin_number: d.gin?.gin_number || `GIN-${d.gin_id}`,
  //         item_id: d.Item_ID,
  //         itemName: d.item?.itemName || d.gin?.item?.itemName || '',
  //         qty_planned: toNumber(d.gin?.qty_planned),
  //         qty_received: toNumber(d.Stock_In_SKU_UOM_Qty || d.uom2_qty),
  //         uomName: d.item?.uomTwo?.uom || '',
  //         status: d.gin?.status || 'open'
  //       }))
  //       setSelectedGins(gins)
  //     }
  //   }
  // }, [mode, editData])




  // =============================================
  // POPULATE FORM IN EDIT MODE
  // =============================================

  useEffect(() => {
    if (mode === 'edit' && editData) {
      console.log('📦 Edit Data:', editData)

      // Get batch from first detail (all items have same batch)
      const firstDetail = editData.details?.[0]
      const batchno = firstDetail?.batchno || null
      const batchName = firstDetail?.batchDetails?.acName || ''

      setFormData({
        mgrn_number: editData.Number || '',
        coa_id: editData.COA_ID || null,
        coaName: editData.coa?.acName || editData.account?.acName || '',
        batchno: batchno,
        batchName: batchName,
        mgrn_date: editData.Date ? editData.Date.split('T')[0] : new Date().toISOString().split('T')[0],
        remarks: editData.remarks || ''
      })

      // Populate selected GINs
      if (editData.details && editData.details.length > 0) {
        const gins: SelectedGin[] = editData.details.map(d => {
          // ✅ FIX: Check both 'gin' and 'ginMain' (API returns 'ginMain')
          const ginData = d.gin || d.ginMain

          return {
            gin_id: d.gin_id,
            gin_number: ginData?.gin_number || `GIN-${d.gin_id}`,
            item_id: d.Item_ID,
            itemName: d.item?.itemName || ginData?.item?.itemName || '',
            qty_planned: toNumber(ginData?.qty_planned),
            qty_received: toNumber(d.Stock_In_SKU_UOM_Qty || d.uom2_qty),
            uomName: d.item?.uomTwo?.uom || '',
            status: ginData?.status || 'open'
          }
        })
        setSelectedGins(gins)
      }
    }
  }, [mode, editData])

  // ✅ Batch change handler
  // const handleBatchChange = useCallback((batchId: number | null, batchData?: any) => {
  //   console.log('🔄 Batch changed:', batchId, batchData)
  //   setFormData(prev => ({
  //     ...prev,
  //     batchno: batchId,
  //     batchName: batchData?.acName || batchData?.name || ''
  //   }))
  // }, [])


  // =============================================
  // FILTER AVAILABLE GINS
  // =============================================

  const filteredGins = availableGins.filter(gin => {
    const alreadySelected = selectedGins.some(sg => sg.gin_id === gin.id)
    const matchesSearch = searchTerm === '' ||
      gin.gin_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gin.item?.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    return !alreadySelected && matchesSearch
  })

  // =============================================
  // HANDLERS
  // =============================================

  // Toggle GIN selection in popup
  const handleToggleGinSelection = useCallback((ginId: number) => {
    setTempSelectedGinIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ginId)) {
        newSet.delete(ginId)
      } else {
        newSet.add(ginId)
      }
      return newSet
    })
  }, [])

  // Add all selected GINs and close popup
  const handleAddSelectedGins = useCallback(() => {
    const newGins: SelectedGin[] = []

    tempSelectedGinIds.forEach(ginId => {
      const gin = availableGins.find(g => g.id === ginId)
      if (gin) {
        newGins.push({
          gin_id: gin.id,
          gin_number: gin.gin_number,
          item_id: gin.item_id,
          itemName: gin.item?.itemName || '',
          qty_planned: toNumber(gin.qty_planned),
          qty_received: 0,
          uomName: gin.item?.uomTwo?.uom || gin.uom?.uom || 'Pcs',
          status: gin.status
        })
      }
    })

    setSelectedGins(prev => [...prev, ...newGins])
    setTempSelectedGinIds(new Set())
    setShowGinSelector(false)
    setSearchTerm('')
  }, [tempSelectedGinIds, availableGins])

  const handleRemoveGin = useCallback((ginId: number) => {
    setSelectedGins(prev => prev.filter(g => g.gin_id !== ginId))
  }, [])

  const handleQtyReceivedChange = useCallback((ginId: number, value: string) => {
    const qty = toNumber(value)
    setSelectedGins(prev => prev.map(g =>
      g.gin_id === ginId ? { ...g, qty_received: qty } : g
    ))
  }, [])

  const handleCoaChange = useCallback((coaId: number | null, coaData?: any) => {
    setFormData(prev => ({
      ...prev,
      coa_id: coaId,
      coaName: coaData?.acName || ''
    }))
  }, [])

  // ✅ Batch change in header - applies to ALL items
  const handleBatchChange = useCallback((batchId: number | null, batchData?: any) => {
    setFormData(prev => ({
      ...prev,
      batchno: batchId,
      batchName: batchData?.acName || ''
    }))
  }, [])

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, mgrn_date: e.target.value }))
  }, [])

  // Open GIN selector
  const openGinSelector = useCallback(() => {
    refetchGins()
    setTempSelectedGinIds(new Set())
    setSearchTerm('')
    setShowGinSelector(true)
  }, [refetchGins])

  // =============================================
  // VALIDATION
  // =============================================

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.coa_id) {
      newErrors.coa_id = 'Account is required'
    }

    if (!formData.batchno) {
      newErrors.batchno = 'Batch is required for all items'
    }

    if (!formData.mgrn_date) {
      newErrors.mgrn_date = 'Date is required'
    }

    if (selectedGins.length === 0) {
      newErrors.gins = 'At least one GIN must be selected'
    }

    // Check all selected GINs have qty_received
    const ginsWithoutQty = selectedGins.filter(g => g.qty_received <= 0)
    if (ginsWithoutQty.length > 0) {
      newErrors.qty = 'All selected GINs must have quantity received'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, selectedGins])

  const handleSaveClick = useCallback(() => {
    if (validate()) setShowConfirm(true)
  }, [validate])

  // =============================================
  // SAVE
  // =============================================

  const handleConfirmSave = useCallback(async () => {
    setShowConfirm(false)

    // ✅ Same batch for ALL items from header
    const payload = {
      coa_id: formData.coa_id!,
      batchno: formData.batchno,
      mgrn_date: formData.mgrn_date,
      remarks: formData.remarks || null,
      details: selectedGins.map(g => ({
        gin_id: g.gin_id,
        qty_received: g.qty_received
      }))
    }

    try {
      if (mode === 'create') {
        await createMgrn(payload).unwrap()
      } else {
        await updateMgrn({ id: id!, ...payload }).unwrap()
      }
      router.push('/mgrn')
    } catch (error: any) {
      setApiError(error?.data?.message || 'Failed to save MGRN')
    }
  }, [mode, id, formData, selectedGins, createMgrn, updateMgrn, router])

  // =============================================
  // LOADING
  // =============================================

  if (mode === 'edit' && isLoadingEdit) {
    return <Loading size="lg" text="Loading MGRN..." />
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-[#509ee3] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'Create MGRN' : 'Edit MGRN'}
              </h1>
              <p className="text-green-100 mt-1">
                {formData.mgrn_number || 'Manufacturing Goods Receipt Note'}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/mgrn')}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="bg-white text-[#28a745] hover:bg-gray-100"
          >
            Back to List
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      {/* <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">How MGRN Works:</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Select GINs with status <span className="font-semibold">"Open"</span> to receive finished products</li>
            <li><span className="font-semibold">One batch</span> applies to all finished products in this MGRN</li>
            <li>Partial production is supported - you can create multiple MGRNs per GIN</li>
          </ul>
        </div>
      </div> */}

      {/* Error Display */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{apiError}</span>
          <button onClick={() => setApiError('')} className="ml-auto text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MGRN Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-[#28a745]" />
          MGRN Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* MGRN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">MGRN Number</label>
            <input
              type="text"
              value={formData.mgrn_number}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.mgrn_date}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
            />
            {errors.mgrn_date && <p className="mt-1 text-sm text-red-600">{errors.mgrn_date}</p>}
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

          {/* ✅ Batch (ONE for all items) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch (for all items) <span className="text-red-500">*</span>
            </label>
            <CoaSearchableInput
              value={formData.batchno}
              onChange={handleBatchChange}
              placeholder="Select batch..."
            />
            {errors.batchno && <p className="mt-1 text-sm text-red-600">{errors.batchno}</p>}
          </div>
        </div>

        {/* Remarks */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
            placeholder="Optional remarks..."
          />
        </div>
      </div>

      {/* GIN Selection Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-500" />
            Selected GINs (Finished Products to Receive)
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {selectedGins.length}
            </span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={openGinSelector}
            icon={<Plus className="w-4 h-4" />}
          >
            Add GIN
          </Button>
        </div>

        {/* Error Messages */}
        {errors.gins && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {errors.gins}
          </div>
        )}
        {errors.qty && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {errors.qty}
          </div>
        )}

        {selectedGins.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No GINs Selected</p>
            <p className="text-sm mt-1">Click "Add GIN" to select production orders to receive</p>
            <p className="text-xs mt-2 text-gray-400">Only GINs with status "Open" are available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GIN</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Finished Product</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Planned</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 uppercase">Qty Received</th>
                  {/* ✅ Batch Column - Display Only */}
                  <th className="px-3 py-3 text-left text-xs font-semibold text-purple-600 uppercase">Batch</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedGins.map((gin, index) => (
                  <tr key={gin.gin_id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-medium text-blue-600">{gin.gin_number}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-medium text-gray-900">{gin.itemName}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${gin.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {gin.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-sm text-gray-600">{gin.qty_planned.toFixed(2)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={gin.qty_received || ''}
                          onChange={(e) => handleQtyReceivedChange(gin.gin_id, e.target.value)}
                          placeholder="0"
                          className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#28a745] focus:border-[#28a745]"
                          step="0.01"
                          min="0"
                        />
                        {gin.uomName && (
                          <span className="text-xs text-gray-500">{gin.uomName}</span>
                        )}
                      </div>
                    </td>
                    {/* ✅ Batch - Display Only (from header) */}
                    {/* <td className="px-3 py-3">
                      <span className={`text-sm ${formData.batchName ? 'text-purple-600 font-medium' : 'text-gray-400 italic'}`}>
                        {formData.batchName || 'Select batch above'}
                      </span>
                    </td> */}

                    {/* Batch Column */}
                    <td className="px-3 py-3">
                      {formData.batchno ? (
                        <span className="text-sm text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">
                          {formData.batchName || `Batch #${formData.batchno}`}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Select batch above
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveGin(gin.gin_id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove GIN"
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

      {/* Summary */}
      {selectedGins.length > 0 && (
        <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-green-600">GINs Selected:</span>
              <span className="ml-2 font-medium text-green-800">{selectedGins.length}</span>
            </div>
            <div>
              <span className="text-green-600">Total Qty Received:</span>
              <span className="ml-2 font-medium text-green-800">
                {selectedGins.reduce((sum, g) => sum + g.qty_received, 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-green-600">Batch:</span>
              <span className="ml-2 font-medium text-green-800">
                {formData.batchName || 'Not selected'}
              </span>
            </div>
            <div>
              <span className="text-green-600">Date:</span>
              <span className="ml-2 font-medium text-green-800">{formData.mgrn_date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions Footer */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/mgrn')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            loading={isCreating || isUpdating}
            icon={<Save className="w-4 h-4" />}
            // className="bg-[#28a745]"
          >
            {mode === 'create' ? 'Create MGRN' : 'Update MGRN'}
          </Button>
        </div>
      </div>

      {/* GIN Selector Modal (Multi-Select) */}
      {showGinSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select GINs</h3>
                <p className="text-sm text-gray-500">
                  {tempSelectedGinIds.size > 0
                    ? `${tempSelectedGinIds.size} GIN(s) selected`
                    : 'Click to select multiple GINs'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowGinSelector(false)
                  setTempSelectedGinIds(new Set())
                  setSearchTerm('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by GIN number or product name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
                  autoFocus
                />
              </div>
            </div>

            {/* GIN List */}
            <div className="max-h-[350px] overflow-y-auto">
              {isLoadingGins ? (
                <div className="p-8 text-center text-gray-500">
                  <Loading size="sm" text="Loading GINs..." />
                </div>
              ) : filteredGins.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No available GINs found</p>
                  <p className="text-sm mt-1">All GINs are either closed or already selected</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredGins.map(gin => {
                    const isSelected = tempSelectedGinIds.has(gin.id)
                    return (
                      <button
                        key={gin.id}
                        onClick={() => handleToggleGinSelection(gin.id)}
                        className={`w-full px-6 py-4 text-left transition-colors flex items-center justify-between ${isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-blue-600">{gin.gin_number}</p>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              {gin.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 mt-1">{gin.item?.itemName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Planned: <strong>{toNumber(gin.qty_planned).toFixed(2)}</strong>
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                          }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filteredGins.length} available GIN(s)
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowGinSelector(false)
                    setTempSelectedGinIds(new Set())
                    setSearchTerm('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddSelectedGins}
                  disabled={tempSelectedGinIds.size === 0}
                  className="bg-[#28a745] hover:bg-[#218838]"
                >
                  Add {tempSelectedGinIds.size > 0 ? `(${tempSelectedGinIds.size})` : ''} GINs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title={mode === 'create' ? 'Create MGRN' : 'Update MGRN'}
        message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this MGRN?\n\n• ${selectedGins.length} finished product(s)\n• Batch: ${formData.batchName || 'Not selected'}\n• Total Qty: ${selectedGins.reduce((sum, g) => sum + g.qty_received, 0).toFixed(2)}`}
        confirmText={mode === 'create' ? 'Create' : 'Update'}
        type="info"
        loading={isCreating || isUpdating}
      />
    </div>
  )
}

export default MgrnForm
