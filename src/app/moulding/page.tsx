// 'use client'
// import React, { useState, useEffect, useMemo } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { MachineSearchableInput } from '@/components/common/Machines/MachineSearchableInput'
// import { EmployeeSearchableInput } from '@/components/common/Employees/EmployeeSearchableInput'
// import { MouldSearchableInput } from '@/components/common/mould/MouldSearchableInput'
// import {
//   useGetMouldingsQuery,
//   useCreateMouldingMutation,
//   useUpdateMouldingMutation,
//   useDeleteMouldingMutation
// } from '@/store/slice/mouldingApi'
// import { useGetShiftsQuery } from '@/store/slice/shiftApi'
// import {
//   Plus, Pencil, Trash2, Calendar, Clock, Settings,
//   User, Box, Zap, Wrench, Timer, Package, CheckCircle
// } from 'lucide-react'

// interface FormData {
//   date: string;
//   machineId: number | null;
//   operatorId: number | null;
//   shiftId: number | null;
//   startTime: string;
//   endTime: string;
//   shutdownElectricity: string;
//   shutdownMachine: string;
//   shutdownNamaz: string;
//   shutdownMould: string;
//   shutdownOther: string;
//   counterOne: string;
//   counterTwo: string;
//   mouldId: number | null;
//   selectedOutputMaterialId: number | null;
//   inputQty: string;
//   outputQty: string;
//   qualityCheckerId: number | null;
// }

// const initialForm: FormData = {
//   date: new Date().toISOString().split('T')[0],
//   machineId: null,
//   operatorId: null,
//   shiftId: null,
//   startTime: '',
//   endTime: '',
//   shutdownElectricity: '0',
//   shutdownMachine: '0',
//   shutdownNamaz: '0',
//   shutdownMould: '0',
//   shutdownOther: '0',
//   counterOne: '0',
//   counterTwo: '0',
//   mouldId: null,
//   selectedOutputMaterialId: null,
//   inputQty: '0',
//   outputQty: '0',
//   qualityCheckerId: null
// }

// export default function MouldingPage() {
//   const [page, setPage] = useState(1)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [deleteModal, setDeleteModal] = useState({ open: false, id: 0 })
//   const [editId, setEditId] = useState<number | null>(null)
//   const [formData, setFormData] = useState<FormData>(initialForm)
//   const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({})
//   const [selectedMould, setSelectedMould] = useState<any>(null)

//   const { data, isLoading } = useGetMouldingsQuery({ page, limit: 10 })
//   const { data: shiftsData } = useGetShiftsQuery({ page: 1, limit: 100 })
//   const [createMoulding, { isLoading: creating }] = useCreateMouldingMutation()
//   const [updateMoulding, { isLoading: updating }] = useUpdateMouldingMutation()
//   const [deleteMoulding, { isLoading: deleting }] = useDeleteMouldingMutation()

//   const shifts = shiftsData?.data || []

//   // Calculate final counter
//   const finalCounter = useMemo(() => {
//     const c1 = parseInt(formData.counterOne) || 0
//     const c2 = parseInt(formData.counterTwo) || 0
//     return c2 - c1
//   }, [formData.counterOne, formData.counterTwo])

//   // Auto-populate times when shift changes
//   useEffect(() => {
//     if (formData.shiftId) {
//       const shift = shifts.find((s: any) => s.id === formData.shiftId)
//       if (shift) {
//         setFormData(prev => ({
//           ...prev,
//           startTime: shift.startTime,
//           endTime: shift.endTime
//         }))
//       }
//     }
//   }, [formData.shiftId, shifts])

//   // Handle mould selection
//   const handleMouldChange = (mouldId: number | null, mould?: any) => {
//     setFormData(prev => ({
//       ...prev,
//       mouldId,
//       selectedOutputMaterialId: null // Reset output material when mould changes
//     }))
//     setSelectedMould(mould || null)
//   }

//   const validateForm = (): boolean => {
//     const errors: Partial<Record<keyof FormData, string>> = {}

//     if (!formData.date) errors.date = 'Date is required'
//     if (!formData.machineId) errors.machineId = 'Machine is required'
//     if (!formData.operatorId) errors.operatorId = 'Operator is required'
//     if (!formData.shiftId) errors.shiftId = 'Shift is required'
//     if (!formData.mouldId) errors.mouldId = 'Mould is required'
//     if (!formData.selectedOutputMaterialId) errors.selectedOutputMaterialId = 'Output material is required'
//     if (!formData.qualityCheckerId) errors.qualityCheckerId = 'Quality checker is required'

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     const payload = {
//       date: formData.date,
//       machineId: formData.machineId!,
//       operatorId: formData.operatorId!,
//       shiftId: formData.shiftId!,
//       startTime: formData.startTime,
//       endTime: formData.endTime,
//       shutdownElectricity: parseInt(formData.shutdownElectricity) || 0,
//       shutdownMachine: parseInt(formData.shutdownMachine) || 0,
//       shutdownNamaz: parseInt(formData.shutdownNamaz) || 0,
//       shutdownMould: parseInt(formData.shutdownMould) || 0,
//       shutdownOther: parseInt(formData.shutdownOther) || 0,
//       counterOne: parseInt(formData.counterOne) || 0,
//       counterTwo: parseInt(formData.counterTwo) || 0,
//       mouldId: formData.mouldId!,
//       selectedOutputMaterialId: formData.selectedOutputMaterialId!,
//       inputQty: parseFloat(formData.inputQty) || 0,
//       outputQty: parseFloat(formData.outputQty) || 0,
//       qualityCheckerId: formData.qualityCheckerId!
//     }

//     try {
//       if (editId) {
//         await updateMoulding({ id: editId, data: payload }).unwrap()
//       } else {
//         await createMoulding(payload).unwrap()
//       }
//       handleCloseModal()
//     } catch (err) {
//       console.error('Failed to save moulding:', err)
//     }
//   }

//   const handleEdit = (record: any) => {
//     setFormData({
//       date: record.date,
//       machineId: record.machineId,
//       operatorId: record.operatorId,
//       shiftId: record.shiftId,
//       startTime: record.startTime,
//       endTime: record.endTime,
//       shutdownElectricity: record.shutdownElectricity?.toString() || '0',
//       shutdownMachine: record.shutdownMachine?.toString() || '0',
//       shutdownNamaz: record.shutdownNamaz?.toString() || '0',
//       shutdownMould: record.shutdownMould?.toString() || '0',
//       shutdownOther: record.shutdownOther?.toString() || '0',
//       counterOne: record.counterOne?.toString() || '0',
//       counterTwo: record.counterTwo?.toString() || '0',
//       mouldId: record.mouldId,
//       selectedOutputMaterialId: record.selectedOutputMaterialId,
//       inputQty: record.inputQty?.toString() || '0',
//       outputQty: record.outputQty?.toString() || '0',
//       qualityCheckerId: record.qualityCheckerId
//     })
//     setSelectedMould(record.mould)
//     setEditId(record.id)
//     setIsModalOpen(true)
//   }

//   const handleDelete = async () => {
//     await deleteMoulding(deleteModal.id)
//     setDeleteModal({ open: false, id: 0 })
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setEditId(null)
//     setFormData(initialForm)
//     setFormErrors({})
//     setSelectedMould(null)
//   }

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Moulding Records</h1>
//           <p className="text-sm text-gray-500 mt-1">Track production moulding activities</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
//           Add Record
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mould</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counter</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={8} className="px-4 py-8 text-center">
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                       <span className="ml-2 text-gray-500">Loading...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : data?.data?.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
//                     No moulding records found
//                   </td>
//                 </tr>
//               ) : data?.data?.map((record: any) => (
//                 <tr key={record.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {new Date(record.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
//                       <Settings className="w-3 h-3 mr-1" />
//                       {record.machine?.name || '-'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">
//                     {record.operator?.employeeName || '-'}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">
//                     {record.shift?.name || '-'}
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
//                       <Box className="w-3 h-3 mr-1" />
//                       {record.mould?.name || '-'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                     {record.finalCounter}
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <div className="text-xs">
//                       <span className="text-gray-500">In: </span>{record.inputQty}
//                       <span className="mx-1">|</span>
//                       <span className="text-gray-500">Out: </span>{record.outputQty}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-right space-x-1">
//                     <Button size="sm" variant="ghost" onClick={() => handleEdit(record)}>
//                       <Pencil className="w-4 h-4" />
//                     </Button>
//                     <Button size="sm" variant="ghost" onClick={() => setDeleteModal({ open: true, id: record.id })}>
//                       <Trash2 className="w-4 h-4 text-red-500" />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <span className="text-sm text-gray-600">
//           Page {data?.page || 1} of {data?.totalPages || 1} ({data?.total || 0} total)
//         </span>
//         <div className="space-x-2">
//           <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
//             Previous
//           </Button>
//           <Button size="sm" variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= (data?.totalPages || 1)}>
//             Next
//           </Button>
//         </div>
//       </div>

//       {/* Create/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
          
//           <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col border border-white/20">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-lg sm:text-xl font-bold">
//                     {editId ? 'Edit Moulding Record' : 'Add New Moulding Record'}
//                   </h2>
//                   <p className="text-blue-100 text-sm mt-1 hidden sm:block">
//                     Enter production details
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleCloseModal}
//                   className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Scrollable Form */}
//             <div className="overflow-y-auto flex-1 p-4 sm:p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Section 1: Basic Information */}
//                 <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
//                     <Calendar className="w-4 h-4 mr-2 text-blue-600" />
//                     Basic Information
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <Input
//                       label="Date"
//                       type="date"
//                       value={formData.date}
//                       onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                       required
//                       error={formErrors.date}
//                     />
//                     <MachineSearchableInput
//                       label="Machine"
//                       value={formData.machineId}
//                       onChange={(id) => setFormData({ ...formData, machineId: id })}
//                       required
//                       error={formErrors.machineId}
//                     />
//                     <EmployeeSearchableInput
//                       label="Operator"
//                       value={formData.operatorId}
//                       onChange={(id) => setFormData({ ...formData, operatorId: id })}
//                       required
//                       error={formErrors.operatorId}
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                     <div className="space-y-1">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Shift <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={formData.shiftId || ''}
//                         onChange={(e) => setFormData({ ...formData, shiftId: parseInt(e.target.value) || null })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80"
//                       >
//                         <option value="">Select Shift</option>
//                         {shifts.map((shift: any) => (
//                           <option key={shift.id} value={shift.id}>{shift.name}</option>
//                         ))}
//                       </select>
//                       {formErrors.shiftId && <p className="text-sm text-red-500">{formErrors.shiftId}</p>}
//                     </div>
//                     <Input
//                       label="Start Time"
//                       type="time"
//                       value={formData.startTime}
//                       onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
//                     />
//                     <Input
//                       label="End Time"
//                       type="time"
//                       value={formData.endTime}
//                       onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 {/* Section 2: Shutdown Times */}
//                 <div className="bg-amber-50/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
//                   <h3 className="text-sm font-semibold text-amber-800 mb-4 flex items-center">
//                     <Timer className="w-4 h-4 mr-2" />
//                     Shutdown Times (minutes)
//                   </h3>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                     <Input
//                       label="Electricity"
//                       type="number"
//                       min="0"
//                       value={formData.shutdownElectricity}
//                       onChange={(e) => setFormData({ ...formData, shutdownElectricity: e.target.value })}
//                       icon={<Zap className="w-4 h-4 text-amber-600" />}
//                     />
//                     <Input
//                       label="Machine"
//                       type="number"
//                       min="0"
//                       value={formData.shutdownMachine}
//                       onChange={(e) => setFormData({ ...formData, shutdownMachine: e.target.value })}
//                       icon={<Wrench className="w-4 h-4 text-amber-600" />}
//                     />
//                     <Input
//                       label="Namaz"
//                       type="number"
//                       min="0"
//                       value={formData.shutdownNamaz}
//                       onChange={(e) => setFormData({ ...formData, shutdownNamaz: e.target.value })}
//                     />
//                     <Input
//                       label="Mould"
//                       type="number"
//                       min="0"
//                       value={formData.shutdownMould}
//                       onChange={(e) => setFormData({ ...formData, shutdownMould: e.target.value })}
//                     />
//                     <Input
//                       label="Other"
//                       type="number"
//                       min="0"
//                       value={formData.shutdownOther}
//                       onChange={(e) => setFormData({ ...formData, shutdownOther: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 {/* Section 3: Counter Readings */}
//                 <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
//                   <h3 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
//                     <Clock className="w-4 h-4 mr-2" />
//                     Counter Readings
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <Input
//                       label="Counter 1"
//                       type="number"
//                       min="0"
//                       value={formData.counterOne}
//                       onChange={(e) => setFormData({ ...formData, counterOne: e.target.value })}
//                     />
//                     <Input
//                       label="Counter 2"
//                       type="number"
//                       min="0"
//                       value={formData.counterTwo}
//                       onChange={(e) => setFormData({ ...formData, counterTwo: e.target.value })}
//                     />
//                     <div className="space-y-1">
//                       <label className="block text-sm font-medium text-gray-700">Final Counter</label>
//                       <div className="px-4 py-2.5 bg-blue-100 border border-blue-300 rounded-xl text-blue-800 font-bold">
//                         {finalCounter}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Section 4: Mould & Production */}
//                 <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
//                   <h3 className="text-sm font-semibold text-purple-800 mb-4 flex items-center">
//                     <Box className="w-4 h-4 mr-2" />
//                     Mould & Production
//                   </h3>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//                     <MouldSearchableInput
//                       label="Mould"
//                       value={formData.mouldId}
//                       onChange={handleMouldChange}
//                       required
//                       error={formErrors.mouldId}
//                     />
                    
//                     {/* Output Material Dropdown */}
//                     <div className="space-y-1">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Output Material <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={formData.selectedOutputMaterialId || ''}
//                         onChange={(e) => setFormData({ ...formData, selectedOutputMaterialId: parseInt(e.target.value) || null })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white/80"
//                         disabled={!selectedMould}
//                       >
//                         <option value="">Select Output Material</option>
//                         {selectedMould?.outputMaterials?.map((item: any) => (
//                           <option key={item.id} value={item.id}>
//                             {item.itemName} ({item.uom1?.uom || 'N/A'})
//                           </option>
//                         ))}
//                       </select>
//                       {formErrors.selectedOutputMaterialId && (
//                         <p className="text-sm text-red-500">{formErrors.selectedOutputMaterialId}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Auto-populated Info */}
//                   {selectedMould && (
//                     <div className="bg-white/60 rounded-lg p-3 mb-4 border border-purple-100">
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="text-gray-500">Effective Cavities:</span>
//                           <span className="ml-2 font-medium text-purple-700">
//                             {selectedMould.effectiveCavities}/{selectedMould.totalCavities}
//                           </span>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Input Material:</span>
//                           <span className="ml-2 font-medium text-amber-700">
//                             {selectedMould.inputMaterial?.itemName || 'N/A'}
//                             {selectedMould.inputMaterial?.uom1?.uom && ` (${selectedMould.inputMaterial.uom1.uom})`}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <Input
//                       label="Input Qty"
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={formData.inputQty}
//                       onChange={(e) => setFormData({ ...formData, inputQty: e.target.value })}
//                     />
//                     <Input
//                       label="Output Qty"
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={formData.outputQty}
//                       onChange={(e) => setFormData({ ...formData, outputQty: e.target.value })}
//                     />
//                     <EmployeeSearchableInput
//                       label="Quality Checker"
//                       value={formData.qualityCheckerId}
//                       onChange={(id) => setFormData({ ...formData, qualityCheckerId: id })}
//                       required
//                       error={formErrors.qualityCheckerId}
//                     />
//                   </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
//                   <Button type="button" variant="secondary" onClick={handleCloseModal}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" loading={creating || updating}>
//                     {editId ? 'Update Record' : 'Create Record'}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation */}
//       <ConfirmationModal
//         isOpen={deleteModal.open}
//         onClose={() => setDeleteModal({ open: false, id: 0 })}
//         onConfirm={handleDelete}
//         title="Delete Moulding Record"
//         message="Are you sure you want to delete this moulding record? This action cannot be undone."
//         type="danger"
//         confirmText="Delete"
//         loading={deleting}
//       />
//     </div>
//   )
// }
























































'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import {
  useGetMouldingsQuery,
  useDeleteMouldingMutation
} from '@/store/slice/mouldingApi'
import {
  Plus, Pencil, Trash2, Eye, Settings, Box, Calendar, Clock
} from 'lucide-react'

export default function MouldingListPage() {
  const [page, setPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: 0 })

  const { data, isLoading } = useGetMouldingsQuery({ page, limit: 10 })
  const [deleteMoulding, { isLoading: deleting }] = useDeleteMouldingMutation()

  const handleDelete = async () => {
    await deleteMoulding(deleteModal.id)
    setDeleteModal({ open: false, id: 0 })
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Moulding Records</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage production moulding activities</p>
        </div>
        <Link href="/moulding/create">
          <Button icon={<Plus className="w-4 h-4" />}>
            Add Record
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{data?.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Today</p>
              <p className="text-2xl font-bold text-green-600">
                {data?.data?.filter((r: any) => r.date === new Date().toISOString().split('T')[0]).length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Output (This Page)</p>
              <p className="text-2xl font-bold text-purple-600">
                {data?.data?.reduce((sum: number, r: any) => sum + (parseFloat(r.outputQty) || 0), 0).toFixed(2) || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Box className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Machine</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Operator</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Shift</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mould</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Final Counter</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Output</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-500">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Box className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No moulding records found</p>
                      <p className="text-gray-400 text-sm mt-1">Create your first record to get started</p>
                      <Link href="/moulding/create" className="mt-4">
                        <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                          Add Record
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.map((record: any) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm">
                    <div className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {record.startTime} - {record.endTime}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      <Settings className="w-3 h-3 mr-1" />
                      {record.machine?.name || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {record.operator?.employeeName || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                      {record.shift?.name || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                      <Box className="w-3 h-3 mr-1" />
                      {record.mould?.name || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`font-bold ${record.finalCounter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {record.finalCounter}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-xs">
                      <span className="text-gray-500">In:</span> <span className="font-medium">{record.inputQty}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-500">Out:</span> <span className="font-medium text-green-600">{record.outputQty}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end space-x-1">
                      <Link href={`/moulding/${record.id}/edit`}>
                        <Button size="sm" variant="ghost" title="Edit">
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteModal({ open: true, id: record.id })}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <span className="text-sm text-gray-600">
            Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.total)} of {data.total} records
          </span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
              {page} / {data.totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: 0 })}
        onConfirm={handleDelete}
        title="Delete Moulding Record"
        message="Are you sure you want to delete this moulding record? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  )
}
