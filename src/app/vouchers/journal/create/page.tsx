// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useCreateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
// } from '@/store/slice/journalVoucherSlice'
// import { JournalDetail } from '@/types/journalVoucher'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import VoucherHeader from '@/components/journalVoucher/VoucherHeader'
// import VoucherDetails from '@/components/journalVoucher/VoucherDetails'
// import { useRouter } from 'next/navigation'

// export default function CreateJournalVoucher() {
//   const router = useRouter()
  
//   // Form state
//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: true
//   })

//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([
//     {
//       lineId: 1,
//       coaId: 0,
//       description: '',
//       chqNo: '',
//       recieptNo: '',
//       ownDb: 0,
//       ownCr: 0,
//       rate: 1,
//       amountDb: 0,
//       amountCr: 0,
//       isCost: false,
//       currencyId: 1,
//       status: false,
//       idCard: '',
//       bank: '',
//       bankDate: ''
//     }
//   ])

//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   // RTK Query hooks
//   const { data: coaAccounts = [], isLoading: coaLoading, error: coaError } = useGetCoaAccountsQuery()
//   const { data: currencies = [], isLoading: currencyLoading } = useGetCurrenciesQuery()
//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()

//   // ✅ FIXED: Filtered COA accounts for Journal Voucher (isJvBalance = true)
//   const filteredCoaAccounts = useMemo(() => {
//     console.log('All COA Accounts:', coaAccounts) // Debug log
    
//     // ✅ FIXED: Ensure coaAccounts is array before filtering
//     if (!Array.isArray(coaAccounts)) {
//       console.warn('coaAccounts is not an array:', coaAccounts)
//       return []
//     }

//     const filtered = coaAccounts
//       .filter(account => {
//         console.log('Checking account:', account.acName, 'isJvBalance:', account.isJvBalance) // Debug log
//         return account.isJvBalance === true || account.isJvBalance === 1
//       })
//       .map(account => ({
//         id: account.id,
//         label: account.acName,
//         acCode: account.acCode,
//         acName: account.acName
//       }))
    
//     console.log('Filtered Journal Balance Accounts:', filtered) // Debug log
//     return filtered
//   }, [coaAccounts])

//   // ✅ FIXED: All COA accounts for detail lines
//   const allCoaAccounts = useMemo(() => {
//     if (!Array.isArray(coaAccounts)) {
//       return []
//     }
    
//     return coaAccounts.map(account => ({
//       id: account.id,
//       label: account.acName,
//       acCode: account.acCode,
//       acName: account.acName
//     }))
//   }, [coaAccounts])

//   // ✅ FIXED: Currency options
//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencies)) {
//       return []
//     }
    
//     return currencies.map(currency => ({
//       id: currency.id,
//       label: currency.currencyName,
//       currencyName: currency.currencyName
//     }))
//   }, [currencies])

//   // Calculate totals
//   const totals = useMemo(() => {
//     const debitTotal = journalDetails.reduce((sum, detail) => sum + (detail.ownDb || 0), 0)
//     const creditTotal = journalDetails.reduce((sum, detail) => sum + (detail.ownCr || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)
//     return { debitTotal, creditTotal, difference }
//   }, [journalDetails])

//   // Form handlers
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   const handleCoaChange = (name: string, value: number | null) => {
//     setFormData(prev => ({ ...prev, coaId: value }))
//   }

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }

//   const addDetailRow = () => {
//     setJournalDetails(prev => [...prev, {
//       lineId: prev.length + 1,
//       coaId: 0,
//       description: '',
//       chqNo: '',
//       recieptNo: '',
//       ownDb: 0,
//       ownCr: 0,
//       rate: 1,
//       amountDb: 0,
//       amountCr: 0,
//       isCost: false,
//       currencyId: 1,
//       status: false,
//       idCard: '',
//       bank: '',
//       bankDate: ''
//     }])
//   }

//   const removeDetailRow = (index: number) => {
//     if (journalDetails.length > 1) {
//       setJournalDetails(prev => prev.filter((_, i) => i !== index))
//     }
//   }

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!formData.voucherNo.trim()) {
//       newErrors.voucherNo = 'Voucher number is required'
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//     }

//     if (!formData.coaId) {
//       newErrors.coaId = 'Journal Balance account is required for auto-balancing'
//     }

//     // Check if at least one entry has amount and account
//     const validEntries = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )

//     if (validEntries.length === 0) {
//       newErrors.general = 'At least one valid journal entry is required'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // Auto-balance logic
//   const createBalancedVoucher = () => {
//     // Filter out empty entries
//     let balancedDetails = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )
    
//     // Add auto-balancing entry if needed
//     if (totals.difference > 0 && formData.coaId) {
//       const balancingEntry: JournalDetail = {
//         lineId: balancedDetails.length + 1,
//         coaId: formData.coaId,
//         description: 'Auto Balancing Entry',
//         chqNo: '',
//         recieptNo: '',
//         ownDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
//         ownCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
//         rate: 1,
//         amountDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
//         amountCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
//         isCost: false,
//         currencyId: 1,
//         status: true,
//         idCard: '',
//         bank: '',
//         bankDate: ''
//       }
//       balancedDetails.push(balancingEntry)
//     }

//     return balancedDetails
//   }

//   // Create voucher
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!validateForm()) return

//     try {
//       const balancedDetails = createBalancedVoucher()
      
//       await createVoucher({
//         master: {
//           date: formData.date,
//           voucherTypeId: 10, // Journal Voucher
//           voucherNo: formData.voucherNo,
//           status: formData.status
//         },
//         details: balancedDetails
//       }).unwrap()

//       alert('Journal Voucher created successfully!')
//       router.push('/vouchers')
//     } catch (err: any) {
//       console.error('Failed to create voucher:', err)
//       setErrors({ general: err?.data?.message || 'Failed to create voucher' })
//     }
//   }

//   // Show loading state
//   if (coaLoading || currencyLoading) {
//     return <Loading size="lg" text="Loading Journal Voucher..." />
//   }

//   // Show error state
//   if (coaError) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//           <p className="text-red-600">Failed to load COA accounts. Please try again.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Page Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Create Journal Voucher</h1>
//               <p className="text-gray-600 mt-2">Create a new journal entry with automatic balancing</p>
//             </div>
//             <Button
//               variant="secondary"
//               onClick={() => router.back()}
//               className="flex items-center space-x-2"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               <span>Back</span>
//             </Button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Error Display */}
//           {errors.general && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-600">{errors.general}</p>
//             </div>
//           )}

//           {/* Debug Info - Remove in production */}
//           {process.env.NODE_ENV === 'development' && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <p className="text-yellow-800 text-sm">
//                 <strong>Debug:</strong> Found {coaAccounts.length} total COA accounts, 
//                 {filteredCoaAccounts.length} Journal Balance accounts
//               </p>
//             </div>
//           )}

//           {/* Header Section */}
//           <VoucherHeader
//             voucherType="journal"
//             formData={formData}
//             filteredCoaAccounts={filteredCoaAccounts}
//             errors={errors}
//             onInputChange={handleInputChange}
//             onCoaChange={handleCoaChange}
//           />

//           {/* Details Section */}
//           <VoucherDetails
//             journalDetails={journalDetails}
//             allCoaAccounts={allCoaAccounts}
//             currencyOptions={currencyOptions}
//             totals={totals}
//             balancingCoaId={formData.coaId}
//             onDetailChange={handleDetailChange}
//             onAddRow={addDetailRow}
//             onRemoveRow={removeDetailRow}
//           />

//           {/* Submit Section */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex justify-end space-x-4">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 loading={isCreating}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Create Journal Voucher
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }












































'use client'
import VoucherForm from '@/components/journalVoucher/VoucherForm'

export default function CreateJournalVoucher() {
  return <VoucherForm mode="create" voucherType="journal" />
}
