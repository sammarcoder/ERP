// 'use client'
// import React, { useState, useMemo, useEffect } from 'react'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
// } from '@/store/slice/journalVoucherSlice'
// import { JournalDetail, JournalMaster } from '@/types/journalVoucher'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount, formatInputDate } from '@/utils/formatters'

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: {
//     master: JournalMaster
//     details: JournalDetail[]
//   }
// }

// const VoucherForm: React.FC<VoucherFormProps> = ({ mode, voucherType, initialData }) => {
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
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

//   // Load initial data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialData) {
//       setFormData({
//         voucherNo: initialData.master.voucherNo,
//         date: formatInputDate(initialData.master.date),
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status
//       })
//       setJournalDetails(initialData.details)
//     }
//   }, [mode, initialData])

//   // Voucher type configuration
//   const voucherConfig = {
//     journal: {
//       type: 10,
//       title: 'Journal Voucher',
//       coaFilter: 'isJvBalance'
//     },
//     pettycash: {
//       type: 14,
//       title: 'Petty Cash Voucher',
//       coaFilter: 'isPettyCash'
//     }
//   }

//   const config = voucherConfig[voucherType]

//   // Filtered COA accounts based on voucher type
//   const filteredCoaAccounts = useMemo(() => {
//     console.log('🔍 All COA Accounts:', coaAccounts)
//     console.log('🔍 Filtering for:', config.coaFilter)

//     if (!Array.isArray(coaAccounts)) {
//       console.warn('❌ coaAccounts is not an array:', coaAccounts)
//       return []
//     }

//     const filtered = coaAccounts
//       .filter(account => {
//         const isMatch = account[config.coaFilter] === true
//         console.log(`🏷️ Account ${account.acName}: ${config.coaFilter} = ${account[config.coaFilter]} (match: ${isMatch})`)
//         return isMatch
//       })
//       .map(account => ({
//         id: account.id,
//         label: account.acName,
//         acCode: account.acCode,
//         acName: account.acName
//       }))

//     console.log('✅ Filtered accounts:', filtered)
//     return filtered
//   }, [coaAccounts, config.coaFilter])

//   // All COA accounts for detail lines
//   const allCoaAccounts = useMemo(() => {
//     if (!Array.isArray(coaAccounts)) return []
//     return coaAccounts.map(account => ({
//       id: account.id,
//       label: account.acName,
//       acCode: account.acCode,
//       acName: account.acName
//     }))
//   }, [coaAccounts])

//   // Currency options
//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencies)) return []
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
//       newErrors.coaId = `${config.title} account is required for auto-balancing`
//     }

//     const validEntries = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )

//     if (validEntries.length === 0) {
//       newErrors.general = 'At least one valid journal entry is required'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // ✅ FIXED: Auto-balance logic with proper null values
//   const createBalancedVoucher = () => {
//     let balancedDetails = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )

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
//         idCard: null, // ✅ FIXED: null instead of empty string
//         bank: null,   // ✅ FIXED: null instead of empty string  
//         bankDate: null // ✅ FIXED: null instead of empty string
//       }
//       balancedDetails.push(balancingEntry)
//     }

//     return balancedDetails
//   }

//   // Submit handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!validateForm()) return

//     try {
//       const balancedDetails = createBalancedVoucher()

//       const voucherData = {
//         master: {
//           date: formData.date,
//           voucherTypeId: config.type,
//           voucherNo: formData.voucherNo,
//           status: formData.status,
//           ...(formData.coaId && { balacingId: formData.coaId })
//         },
//         details: balancedDetails
//       }

//       if (mode === 'create') {
//         await createVoucher(voucherData).unwrap()
//         alert(`${config.title} created successfully!`)
//       } else {
//         await updateVoucher({
//           id: initialData?.master.id!,
//           ...voucherData
//         }).unwrap()
//         alert(`${config.title} updated successfully!`)
//       }

//       router.push('/vouchers')
//     } catch (err: any) {
//       console.error('Failed to save voucher:', err)
//       setErrors({ general: err?.data?.message || 'Failed to save voucher' })
//     }
//   }

//   if (coaLoading || currencyLoading) {
//     return <Loading size="lg" text={`Loading ${config.title}...`} />
//   }

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
//         {/* Page Header with Fixed Date Display */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {mode === 'create' ? 'Create' : 'Edit'} {config.title}
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {mode === 'create' ? 'Create a new' : 'Edit'} {config.title.toLowerCase()} with automatic balancing
//               </p>
//               {/* ✅ FIXED: Display current date in proper format */}
//               <div className="mt-2 text-sm text-gray-500">
//                 Today: {formatDisplayDate(new Date())} | Selected Date: {formData.date ? formatDisplayDate(formData.date) : 'Not selected'}
//               </div>
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

//           {/* Debug Info - Enhanced */}
//           {process.env.NODE_ENV === 'development' && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="space-y-2 text-sm">
//                 <p className="text-blue-800">
//                   <strong>🔍 Debug Info:</strong>
//                 </p>
//                 <p className="text-blue-700">
//                   • Total COAs: {coaAccounts.length} | Filtered ({config.coaFilter}): {filteredCoaAccounts.length} | All: {allCoaAccounts.length}
//                 </p>
//                 <p className="text-blue-700">
//                   • Selected Date: {formData.date} | Formatted: {formatDisplayDate(formData.date)}
//                 </p>
//                 <p className="text-blue-700">
//                   • Voucher Type: {config.title} (ID: {config.type})
//                 </p>
//                 <p className="text-blue-700">
//                   • Totals: Dr {formatAmount(totals.debitTotal)} | Cr {formatAmount(totals.creditTotal)} | Diff {formatAmount(totals.difference)}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Header Section */}
//           <VoucherHeader
//             voucherType={voucherType}
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

//           {/* Summary Section with Fixed Date Display */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Voucher Summary</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-sm text-gray-600">Voucher Number</div>
//                 <div className="text-lg font-semibold text-gray-900">{formData.voucherNo || 'Not set'}</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-sm text-gray-600">Date</div>
//                 <div className="text-lg font-semibold text-gray-900">
//                   {/* ✅ FIXED: Display formatted date */}
//                   {formData.date ? formatDisplayDate(formData.date) : 'Not selected'}
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-sm text-gray-600">Total Debit</div>
//                 <div className="text-lg font-semibold text-green-600">{formatAmount(totals.debitTotal)}</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="text-sm text-gray-600">Total Credit</div>
//                 <div className="text-lg font-semibold text-blue-600">{formatAmount(totals.creditTotal)}</div>
//               </div>
//             </div>

//             {/* Balance Status */}
//             <div className="mt-4 p-4 rounded-lg bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-600">Balance Status</div>
//                 <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   totals.difference === 0 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {totals.difference === 0 ? '✓ Balanced' : `Difference: ${formatAmount(totals.difference)}`}
//                 </div>
//               </div>
//               {totals.difference > 0 && formData.coaId && (
//                 <div className="mt-2 text-sm text-blue-600">
//                   🔄 Auto-balancing entry will be created to balance this voucher
//                 </div>
//               )}
//             </div>
//           </div>

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
//                 loading={isCreating || isUpdating}
//                 className={voucherType === 'journal' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
//               >
//                 {mode === 'create' ? 'Create' : 'Update'} {config.title}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default VoucherForm






















































// 'use client'
// import React, { useState, useMemo, useEffect } from 'react'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
// } from '@/store/slice/journalVoucherSlice'
// import { JournalDetail, JournalMaster } from '@/types/journalVoucher'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount } from '@/utils/formatters'

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: {
//     master: JournalMaster
//     details: JournalDetail[]
//   }
// }

// const VoucherForm: React.FC<VoucherFormProps> = ({ mode, voucherType, initialData }) => {
//   const router = useRouter()

//   // ✅ FIXED: Default status = false
//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false // ✅ Changed default to false
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
//       bankDate: '' // ✅ Allow empty, will be converted to null
//     }
//   ])

//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   // RTK Query hooks
//   const { data: coaAccounts = [], isLoading: coaLoading, error: coaError } = useGetCoaAccountsQuery()
//   const { data: currencies = [], isLoading: currencyLoading } = useGetCurrenciesQuery()
//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

//   // Load initial data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialData) {
//       setFormData({
//         voucherNo: initialData.master.voucherNo,
//         // date: formatInputDate(initialData.master.date),
//         date: initialData.master.date ? new Date(initialData.master.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status
//       })
//       setJournalDetails(initialData.details)
//     }
//   }, [mode, initialData])

//   // Voucher type configuration
//   const voucherConfig = {
//     journal: {
//       type: 10,
//       title: 'Journal Voucher',
//       coaFilter: 'isJvBalance'
//     },
//     pettycash: {
//       type: 14,
//       title: 'Petty Cash Voucher', 
//       coaFilter: 'isPettyCash'
//     }
//   }

//   const config = voucherConfig[voucherType]

//   // Filtered COA accounts based on voucher type
//   const filteredCoaAccounts = useMemo(() => {
//     if (!Array.isArray(coaAccounts)) return []

//     const filtered = coaAccounts
//       .filter(account => account[config.coaFilter] === true)
//       .map(account => ({
//         id: account.id,
//         label: account.acName,
//         acCode: account.acCode,
//         acName: account.acName
//       }))

//     return filtered
//   }, [coaAccounts, config.coaFilter])

//   // All COA accounts for detail lines
//   const allCoaAccounts = useMemo(() => {
//     if (!Array.isArray(coaAccounts)) return []
//     return coaAccounts.map(account => ({
//       id: account.id,
//       label: account.acName,
//       acCode: account.acCode,
//       acName: account.acName
//     }))
//   }, [coaAccounts])

//   // Currency options
//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencies)) return []
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

//   // ✅ UPDATED: Validation - bankDate is optional now
//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!formData.voucherNo.trim()) {
//       newErrors.voucherNo = 'Voucher number is required'
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//     }

//     if (!formData.coaId) {
//       newErrors.coaId = `${config.title} account is required for auto-balancing`
//     }

//     const validEntries = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )

//     if (validEntries.length === 0) {
//       newErrors.general = 'At least one valid journal entry is required'
//     }

//     // ✅ REMOVED: bankDate validation - now optional

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // ✅ FIXED: Auto-balance logic with proper null handling
//   const createBalancedVoucher = () => {
//     let balancedDetails = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )

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
//         idCard: null, // ✅ Use null instead of empty string
//         bank: null,
//         bankDate: null
//       }
//       balancedDetails.push(balancingEntry)
//     }

//     return balancedDetails
//   }

//   // Submit handler
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   if (!validateForm()) return

//   //   try {
//   //     const balancedDetails = createBalancedVoucher()

//   //     const voucherData = {
//   //       master: {
//   //         date: formData.date,
//   //         voucherTypeId: config.type,
//   //         voucherNo: formData.voucherNo,
//   //         status: formData.status, // ✅ Will be false by default
//   //         ...(formData.coaId && { balacingId: formData.coaId })
//   //       },
//   //       details: balancedDetails
//   //     }

//   //     if (mode === 'create') {
//   //       await createVoucher(voucherData).unwrap()
//   //       alert(`${config.title} created successfully!`)
//   //     } else {
//   //       await updateVoucher({
//   //         id: initialData?.master.id!,
//   //         ...voucherData
//   //       }).unwrap()
//   //       alert(`${config.title} updated successfully!`)
//   //     }

//   //     router.push('/vouchers')
//   //   } catch (err: any) {
//   //     console.error('Failed to save voucher:', err)
//   //     setErrors({ general: err?.data?.message || 'Failed to save voucher' })
//   //   }
//   // }




// // Update the handleSubmit function in VoucherForm
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()
//   if (!validateForm()) return

//   try {
//     const balancedDetails = createBalancedVoucher()

//     const voucherData = {
//       master: {
//         date: formData.date,
//         voucherTypeId: config.type,
//         voucherNo: formData.voucherNo,
//         status: formData.status,
//         ...(formData.coaId && { balacingId: formData.coaId })
//       },
//       details: balancedDetails
//     }

//     if (mode === 'create') {
//       await createVoucher(voucherData).unwrap()
//       alert(`${config.title} created successfully!`)
//     } else {
//       // ✅ FIX: Pass id along with master and details
//       await updateVoucher({
//         id: initialData?.master.id!,
//         master: voucherData.master,
//         details: voucherData.details
//       }).unwrap()
//       alert(`${config.title} updated successfully!`)
//     }

//     router.push('/vouchers')
//   } catch (err: any) {
//     console.error('Failed to save voucher:', err)
//     setErrors({ general: err?.data?.message || 'Failed to save voucher' })
//   }
// }





//   if (coaLoading || currencyLoading) {
//     return <Loading size="lg" text={`Loading ${config.title}...`} />
//   }

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
//     <div className="min-h-screen py-4 "> {/* ✅ Reduced padding */}
//       <div className="max-w-7xl mx-auto">
//         {/* ✅ COMPACT: Header with less spacing */}
//         <div className="mb-4"> {/* ✅ Reduced margin */}
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900"> {/* ✅ Smaller heading */}
//                 {mode === 'create' ? 'Create' : 'Edit'} {config.title}
//               </h1>
//               <div className="mt-1 text-sm text-gray-500"> {/* ✅ Reduced margin */}
//                 <span>{mode === 'create' ? 'Create a new' : 'Edit'} {config.title.toLowerCase()}</span>
//                 {formData.date && (
//                   <span className="ml-4">📅 {formatDisplayDate(formData.date)}</span>
//                 )}
//               </div>
//             </div>
//             <Button
//               variant="secondary"
//               onClick={() => router.back()}
//               className="flex items-center space-x-2"
//             >
//               <span>← Back</span>
//             </Button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4"> {/* ✅ Reduced spacing */}
//           {/* Error Display */}
//           {errors.general && (
//             <div className="bg-red-50 border border-red-200 rounded-lg "> {/* ✅ Reduced padding */}
//               <p className="text-red-600 text-sm">{errors.general}</p>
//             </div>
//           )}

//           {/* Header Section */}
//           <VoucherHeader
//             voucherType={voucherType}
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

//           {/* ✅ COMPACT: Submit Section */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"> {/* ✅ Reduced padding */}
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 Status: <span className={`px-2 py-1 rounded text-xs ${formData.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                   {formData.status ? 'Posted' : 'Draft'}
//                 </span>
//               </div>
//               <div className="flex space-x-3">
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={() => router.back()}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   loading={isCreating || isUpdating}
//                   className={voucherType === 'journal' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
//                 >
//                   {mode === 'create' ? 'Create' : 'Update'} {config.title}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default VoucherForm


























































// 'use client'
// import React, { useState, useMemo, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
// } from '@/store/slice/journalVoucherSlice'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import { Button } from '@/components/ui/Button'
// import { JournalDetail } from '@/types/journalVoucher'
// import { Save, X, Plus } from 'lucide-react'

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: {
//     master: any
//     details: any[]
//   }
// }

// const VoucherForm: React.FC<VoucherFormProps> = ({ mode, voucherType, initialData }) => {
//   const router = useRouter()

//   // Form configuration
//   const config = {
//     journal: {
//       title: 'Journal Voucher',
//       type: 10,
//       coaFilter: 'isJvBalance',
//       balanceLabel: 'Journal Balance Account'
//     },
//     pettycash: {
//       title: 'Petty Cash Voucher',
//       type: 14,
//       coaFilter: 'isPettyCash',
//       balanceLabel: 'Petty Cash Account'
//     }
//   }[voucherType]

//   // State
//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false
//   })

//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   // RTK Queries & Mutations
//   const { data: coaData = [] } = useGetCoaAccountsQuery()
//   const { data: currencyData = [] } = useGetCurrenciesQuery()
//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

//   // Filtered COA accounts
//   const filteredCoaAccounts = useMemo(() => {
//     return coaData
//       .filter(account => account[config.coaFilter] === true)
//       .map(account => ({
//         id: account.id,
//         label: `${account.acCode} - ${account.acName}`,
//         acCode: account.acCode,
//         acName: account.acName
//       }))
//   }, [coaData, config.coaFilter])

//   // Currency options
//   const currencyOptions = useMemo(() => {
//     return currencyData.map(currency => ({
//       id: currency.id,
//       label: `${currency.currencyName}`,
//       currencyName: currency.currencyName
//     }))
//   }, [currencyData])

//   // ✅ FIXED: Robust auto-balance filtering
//   const isAutoBalanceEntry = (detail: any) => {
//     const description = (detail.description || '').toLowerCase()
//     return description.includes('auto balancing') || 
//            description.includes('auto balance') || 
//            description === 'auto balancing entry'
//   }

//   // ✅ FIXED: Load data with ROBUST filtering
//   useEffect(() => {
//     if (mode === 'edit' && initialData && initialData.details) {
//       console.log('🔍 EDIT MODE - Raw data from API:', initialData.details)

//       // Set master data
//       setFormData({
//         voucherNo: initialData.master.voucherNo || '',
//         date: initialData.master.date ? new Date(initialData.master.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status || false
//       })

//       // ✅ ROBUST FILTER: Multiple ways to detect auto-balance entries
//       const manualEntries = initialData.details.filter(detail => {
//         const isAuto = isAutoBalanceEntry(detail)
//         console.log(`Entry: "${detail.description}" | IsAuto: ${isAuto}`)
//         return !isAuto
//       })

//       console.log(`🔍 FILTERED: ${initialData.details.length} total → ${manualEntries.length} manual entries`)
//       console.log(`🔍 REMOVED: ${initialData.details.length - manualEntries.length} auto-balance entries`)

//       // Map to proper format
//       const mappedEntries = manualEntries.map((detail, index) => ({
//         lineId: index + 1,
//         coaId: Number(detail.coaId) || 0,
//         description: detail.description || '',
//         chqNo: detail.chqNo || '',
//         recieptNo: detail.recieptNo || '',
//         ownDb: Number(detail.ownDb) || 0,
//         ownCr: Number(detail.ownCr) || 0,
//         rate: Number(detail.rate) || 1,
//         amountDb: Number(detail.amountDb) || 0,
//         amountCr: Number(detail.amountCr) || 0,
//         isCost: Boolean(detail.isCost),
//         currencyId: Number(detail.currencyId) || 1,
//         status: Boolean(detail.status),
//         idCard: detail.idCard || '',
//         bank: detail.bank || '',
//         bankDate: detail.bankDate || ''
//       }))

//       setJournalDetails(mappedEntries)
//       console.log('🔍 FINAL LOADED ENTRIES:', mappedEntries)

//     } else {
//       // CREATE MODE: Start with empty row
//       console.log('🔍 CREATE MODE - Starting fresh')
//       setJournalDetails([{
//         lineId: 1,
//         coaId: 0,
//         description: '',
//         chqNo: '',
//         recieptNo: '',
//         ownDb: 0,
//         ownCr: 0,
//         rate: 1,
//         amountDb: 0,
//         amountCr: 0,
//         isCost: false,
//         currencyId: 1,
//         status: false,
//         idCard: '',
//         bank: '',
//         bankDate: ''
//       }])
//     }
//   }, [mode, initialData])

//   // Calculate totals
//   const totals = useMemo(() => {
//     const validEntries = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )

//     const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownDb) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownCr) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     return { debitTotal, creditTotal, difference }
//   }, [journalDetails])

//   // ✅ FIXED: Clean submission data preparation
//   const prepareSubmissionData = () => {
//     console.log('🔍 Preparing final submission data...')

//     // Get only valid entries (exclude empty and auto-balance)
//     const validEntries = journalDetails.filter(detail => {
//       const hasValidCoa = detail.coaId > 0
//       const hasValidAmount = (Number(detail.ownDb) > 0 || Number(detail.ownCr) > 0)
//       const isNotAutoBalance = !isAutoBalanceEntry(detail)

//       return hasValidCoa && hasValidAmount && isNotAutoBalance
//     })

//     console.log('🔍 Valid manual entries for submission:', validEntries.length)

//     // Calculate totals from valid entries only
//     const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownDb) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownCr) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     console.log('🔍 Totals - Debit:', debitTotal, 'Credit:', creditTotal, 'Diff:', difference)

//     // Prepare clean entries
//     let finalEntries = validEntries.map((detail, index) => ({
//       lineId: index + 1,
//       coaId: Number(detail.coaId),
//       description: String(detail.description || ''),
//       chqNo: String(detail.chqNo || ''),
//       recieptNo: String(detail.recieptNo || ''),
//       ownDb: Number(detail.ownDb || 0),
//       ownCr: Number(detail.ownCr || 0),
//       rate: Number(detail.rate || 1),
//       amountDb: Number(detail.ownDb || 0),
//       amountCr: Number(detail.ownCr || 0),
//       isCost: Boolean(detail.isCost),
//       currencyId: Number(detail.currencyId || 1),
//       status: Boolean(detail.status),
//       idCard: detail.idCard || null,
//       bank: detail.bank || null,
//       bankDate: detail.bankDate || null
//     }))

//     // Add auto-balance if needed
//     if (difference > 0 && formData.coaId) {
//       const autoBalanceEntry = {
//         lineId: finalEntries.length + 1,
//         coaId: Number(formData.coaId),
//         description: 'Auto Balancing Entry',
//         chqNo: '',
//         recieptNo: '',
//         ownDb: creditTotal > debitTotal ? difference : 0,
//         ownCr: debitTotal > creditTotal ? difference : 0,
//         rate: 1,
//         amountDb: creditTotal > debitTotal ? difference : 0,
//         amountCr: debitTotal > creditTotal ? difference : 0,
//         isCost: false,
//         currencyId: 1,
//         status: true,
//         idCard: null,
//         bank: null,
//         bankDate: null
//       }

//       finalEntries.push(autoBalanceEntry)
//       console.log('🔍 Added single auto-balance entry:', autoBalanceEntry)
//     }

//     console.log('🔍 Final entries count:', finalEntries.length)
//     return finalEntries
//   }

//   // Form handlers
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const handleCoaChange = (name: string, value: number | null) => {
//     setFormData(prev => ({ ...prev, coaId: value }))
//     if (errors.coaId) {
//       setErrors(prev => ({ ...prev, coaId: '' }))
//     }
//   }

//   // ✅ FIXED: Proper detail change handler
//   const handleDetailChange = (index: number, field: string, value: any) => {
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }

//   // ✅ FIXED: Add row handler (NOT submit)
//   const handleAddRow = () => {
//     console.log('🔍 Adding new row...')
//     const newRow: JournalDetail = {
//       lineId: journalDetails.length + 1,
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
//     setJournalDetails(prev => [...prev, newRow])
//   }

//   const handleRemoveRow = (index: number) => {
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
//       newErrors.coaId = `${config.balanceLabel} is required`
//     }

//     const validDetails = journalDetails.filter(detail => 
//       detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
//     )
//     if (validDetails.length === 0) {
//       newErrors.details = 'At least one journal detail is required'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // ✅ FIXED: Clear submit logic
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log('🔍 FORM SUBMIT - Mode:', mode)

//     if (!validateForm()) {
//       console.log('🔍 Validation failed')
//       return
//     }

//     try {
//       const finalDetails = prepareSubmissionData()

//       const submissionData = {
//         master: {
//           date: formData.date,
//           voucherTypeId: config.type,
//           voucherNo: formData.voucherNo,
//           status: formData.status,
//           balacingId: formData.coaId
//         },
//         details: finalDetails
//       }

//       console.log('🔍 SUBMITTING:', submissionData)

//       if (mode === 'create') {
//         await createVoucher(submissionData).unwrap()
//         console.log('✅ Created successfully')
//         alert(`${config.title} created successfully!`)
//       } else {
//         await updateVoucher({
//           id: initialData?.master.id,
//           ...submissionData
//         }).unwrap()
//         console.log('✅ Updated successfully')
//         alert(`${config.title} updated successfully!`)
//       }

//       router.push('/vouchers')
//     } catch (err: any) {
//       console.error('❌ Submit failed:', err)
//       setErrors({ general: err?.data?.message || `Failed to ${mode} voucher` })
//     }
//   }

//   // ✅ FIXED: Cancel handler
//   const handleCancel = () => {
//     console.log('🔍 Canceling form')
//     router.push('/vouchers')
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* ✅ FIXED: Proper form structure */}
//       <div className="space-y-6">
//         {/* ✅ FIXED: Header with visible buttons */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {mode === 'create' ? 'Create New' : 'Edit'} {config.title}
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 {mode === 'create' ? 'Create a new voucher entry' : 'Update existing voucher entry'}
//               </p>
//             </div>

//             {/* ✅ FIXED: Always visible action buttons */}
//             <div className="flex items-center space-x-3">
//               <Button
//                 variant="secondary"
//                 onClick={handleCancel}
//                 disabled={isCreating || isUpdating}
//                 icon={<X className="w-4 h-4" />}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 onClick={handleSubmit}
//                 loading={isCreating || isUpdating}
//                 disabled={isCreating || isUpdating}
//                 icon={<Save className="w-4 h-4" />}
//               >
//                 {mode === 'create' ? 'Create' : 'Update'} Voucher
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {errors.general && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="text-red-600">
//               <strong>Error:</strong> {errors.general}
//             </div>
//           </div>
//         )}

//         {/* ✅ FIXED: Form components */}
//         <VoucherHeader
//           voucherType={voucherType}
//           formData={formData}
//           filteredCoaAccounts={filteredCoaAccounts}
//           errors={errors}
//           onInputChange={handleInputChange}
//           onCoaChange={handleCoaChange}
//         />

//         <VoucherDetails
//           journalDetails={journalDetails}
//           allCoaAccounts={coaData.map(account => ({
//             id: account.id,
//             label: `${account.acCode} - ${account.acName}`,
//             acCode: account.acCode,
//             acName: account.acName
//           }))}
//           currencyOptions={currencyOptions}
//           totals={totals}
//           balancingCoaId={formData.coaId}
//           onDetailChange={handleDetailChange}
//           onAddRow={handleAddRow}
//           onRemoveRow={handleRemoveRow}
//         />

//         {errors.details && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="text-red-600">{errors.details}</div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default VoucherForm

























































'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useCreateJournalVoucherMutation,
  useUpdateJournalVoucherMutation,
  useGetCoaAccountsQuery,
  useGetCurrenciesQuery,
} from '@/store/slice/journalVoucherSlice'
import VoucherHeader from './VoucherHeader'
import VoucherDetails from './VoucherDetails'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { JournalDetail } from '@/types/journalVoucher'
import { Save, X } from 'lucide-react'

interface VoucherFormProps {
  mode: 'create' | 'edit'
  voucherType: 'journal' | 'pettycash'
  initialData?: {
    master: any
    details: any[]
  }
}

const VoucherForm: React.FC<VoucherFormProps> = ({ mode, voucherType, initialData }) => {
  const router = useRouter()

  // Form configuration
  const config = {
    journal: {
      title: 'Journal Voucher',
      type: 10,
      coaFilter: 'isJvBalance',
      balanceLabel: 'Journal Balance Account'
    },
    pettycash: {
      title: 'Petty Cash Voucher',
      type: 14,
      coaFilter: 'isPettyCash',
      balanceLabel: 'Petty Cash Account'
    }
  }[voucherType]

  // State
  const [formData, setFormData] = useState({
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    coaId: null as number | null,
    status: false
  })

  const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // ✅ FIXED: Confirmation modal state with proper types
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: 'save' | 'cancel'
    title: string
    message: string
  }>({
    isOpen: false,
    action: 'save',
    title: '',
    message: ''
  })

  // RTK Queries & Mutations
  const { data: coaData = [] } = useGetCoaAccountsQuery()
  const { data: currencyData = [] } = useGetCurrenciesQuery()
  const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
  const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

  // Filtered COA accounts
  const filteredCoaAccounts = useMemo(() => {
    return coaData
      .filter(account => account[config.coaFilter] === true)
      .map(account => ({
        id: account.id,
        label: `${account.acCode} - ${account.acName}`,
        acCode: account.acCode,
        acName: account.acName
      }))
  }, [coaData, config.coaFilter])

  // Currency options
  const currencyOptions = useMemo(() => {
    return currencyData.map(currency => ({
      id: currency.id,
      label: `${currency.currencyName}`,
      currencyName: currency.currencyName
    }))
  }, [currencyData])

  // Auto-balance filtering
  const isAutoBalanceEntry = (detail: any) => {
    if (!detail) return false

    const description = String(detail.description || '').toLowerCase().trim()

    const descriptionMatches = [
      'auto balancing entry',
      'auto balance entry',
      'auto balancing',
      'auto balance',
      'balancing entry',
      'system generated'
    ].some(match => description.includes(match))

    return descriptionMatches
  }

  // Load data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData && initialData.details) {
      console.log('🔍 EDIT MODE - Loading data')

      setFormData({
        voucherNo: initialData.master.voucherNo || '',
        date: initialData.master.date ? new Date(initialData.master.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        coaId: initialData.master.balacingId || null,
        status: initialData.master.status || false
      })

      const manualEntries = initialData.details.filter((detail, index) => {
        const isAuto = isAutoBalanceEntry(detail)
        console.log(`Entry ${index + 1}: "${detail.description}" → Keep: ${!isAuto}`)
        return !isAuto
      })

      console.log(`🔍 Filtered: ${initialData.details.length} → ${manualEntries.length} entries`)

      const mappedEntries = manualEntries.map((detail, index) => ({
        lineId: index + 1,
        coaId: Number(detail.coaId) || 0,
        description: detail.description || '',
        chqNo: detail.chqNo || '',
        recieptNo: detail.recieptNo || '',
        ownDb: Number(detail.ownDb) || 0,
        ownCr: Number(detail.ownCr) || 0,
        rate: Number(detail.rate) || 1,
        amountDb: Number(detail.amountDb) || 0,
        amountCr: Number(detail.amountCr) || 0,
        isCost: Boolean(detail.isCost),
        currencyId: Number(detail.currencyId) || 1,
        status: Boolean(detail.status),
        idCard: detail.idCard || '',
        bank: detail.bank || '',
        bankDate: detail.bankDate || ''
      }))

      setJournalDetails(mappedEntries)

    } else {
      // CREATE MODE: Start with empty row
      setJournalDetails([{
        lineId: 1,
        coaId: 0,
        description: '',
        chqNo: '',
        recieptNo: '',
        ownDb: 0,
        ownCr: 0,
        rate: 1,
        amountDb: 0,
        amountCr: 0,
        isCost: false,
        currencyId: 1,
        status: false,
        idCard: '',
        bank: '',
        bankDate: ''
      }])
    }
  }, [mode, initialData])

  // Calculate totals
  const totals = useMemo(() => {
    const validEntries = journalDetails.filter(detail =>
      detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
    )

    const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownDb) || 0), 0)
    const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownCr) || 0), 0)
    const difference = Math.abs(debitTotal - creditTotal)

    return { debitTotal, creditTotal, difference }
  }, [journalDetails])

  // Prepare submission data
  const prepareSubmissionData = () => {
    const validEntries = journalDetails.filter(detail => {
      const hasValidCoa = detail.coaId > 0
      const hasValidAmount = (Number(detail.ownDb) > 0 || Number(detail.ownCr) > 0)
      const isNotAutoBalance = !isAutoBalanceEntry(detail)

      return hasValidCoa && hasValidAmount && isNotAutoBalance
    })

    const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownDb) || 0), 0)
    const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.ownCr) || 0), 0)
    const difference = Math.abs(debitTotal - creditTotal)

    // let finalEntries = validEntries.map((detail, index) => ({
    //   lineId: index + 1,
    //   coaId: Number(detail.coaId),
    //   description: String(detail.description || ''),
    //   chqNo: String(detail.chqNo || ''),
    //   recieptNo: String(detail.recieptNo || ''),
    //   ownDb: Number(detail.ownDb || 0),
    //   ownCr: Number(detail.ownCr || 0),
    //   rate: Number(detail.rate || 1),
    //   amountDb: Number(detail.ownDb || 0),
    //   amountCr: Number(detail.ownCr || 0),
    //   isCost: Boolean(detail.isCost),
    //   currencyId: Number(detail.currencyId || 1),
    //   status: Boolean(detail.status),
    //   idCard: detail.idCard || null,
    //   bank: detail.bank || null,
    //   bankDate: detail.bankDate || null
    // }))
    // ✅ FIXED: Keep separate values
    let finalEntries = validEntries.map((detail, index) => ({
      lineId: index + 1,
      coaId: Number(detail.coaId),
      description: String(detail.description || ''),
      chqNo: String(detail.chqNo || ''),
      recieptNo: String(detail.recieptNo || ''),
      ownDb: Number(detail.ownDb || 0),      // ✅ Own Debit value
      ownCr: Number(detail.ownCr || 0),      // ✅ Own Credit value
      rate: Number(detail.rate || 1),
      amountDb: Number(detail.amountDb || 0), // ✅ Actual Debit value (separate)
      amountCr: Number(detail.amountCr || 0), // ✅ Actual Credit value (separate)
      isCost: Boolean(detail.isCost),
      currencyId: Number(detail.currencyId || 1),
      status: Boolean(detail.status),
      idCard: detail.idCard || null,
      bank: detail.bank || null,
      bankDate: detail.bankDate || null
    }))


    // Add auto-balance if needed
    if (difference > 0 && formData.coaId) {
      const autoBalanceEntry = {
        lineId: finalEntries.length + 1,
        coaId: Number(formData.coaId),
        description: 'Auto Balancing Entry',
        chqNo: '',
        recieptNo: '',
        ownDb: creditTotal > debitTotal ? difference : 0,
        ownCr: debitTotal > creditTotal ? difference : 0,
        rate: 1,
        amountDb: creditTotal > debitTotal ? difference : 0,
        amountCr: debitTotal > creditTotal ? difference : 0,
        isCost: false,
        currencyId: 1,
        status: true,
        idCard: null,
        bank: null,
        bankDate: null
      }

      finalEntries.push(autoBalanceEntry)
    }

    return finalEntries
  }

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCoaChange = (name: string, value: number | null) => {
    setFormData(prev => ({ ...prev, coaId: value }))
    if (errors.coaId) {
      setErrors(prev => ({ ...prev, coaId: '' }))
    }
  }

  const handleDetailChange = (index: number, field: string, value: any) => {
    setJournalDetails(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddRow = () => {
    const newRow: JournalDetail = {
      lineId: journalDetails.length + 1,
      coaId: 0,
      description: '',
      chqNo: '',
      recieptNo: '',
      ownDb: 0,
      ownCr: 0,
      rate: 1,
      amountDb: 0,
      amountCr: 0,
      isCost: false,
      currencyId: 1,
      status: false,
      idCard: '',
      bank: '',
      bankDate: ''
    }
    setJournalDetails(prev => [...prev, newRow])
  }

  const handleRemoveRow = (index: number) => {
    if (journalDetails.length > 1) {
      setJournalDetails(prev => prev.filter((_, i) => i !== index))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.voucherNo.trim()) {
      newErrors.voucherNo = 'Voucher number is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    if (!formData.coaId) {
      newErrors.coaId = `${config.balanceLabel} is required`
    }

    const validDetails = journalDetails.filter(detail =>
      detail.coaId > 0 && (detail.ownDb > 0 || detail.ownCr > 0)
    )
    if (validDetails.length === 0) {
      newErrors.details = 'At least one journal detail is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ FIXED: Handle save button click (show confirmation)
  const handleSaveClick = () => {
    if (!validateForm()) {
      console.log('🔍 Validation failed')
      return
    }

    setConfirmModal({
      isOpen: true,
      action: 'save',
      title: `${mode === 'create' ? 'Create' : 'Update'} ${config.title}`,
      message: `Are you sure you want to ${mode === 'create' ? 'create this new' : 'update this'} ${config.title.toLowerCase()}?`
    })
  }

  // ✅ FIXED: Handle cancel button click (show confirmation)
  const handleCancelClick = () => {
    setConfirmModal({
      isOpen: true,
      action: 'cancel',
      title: 'Cancel Changes',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.'
    })
  }

  // ✅ FIXED: Actual submit logic (called after confirmation)
  // const handleSubmit = async () => {
  //   try {
  //     const finalDetails = prepareSubmissionData()

  //     const submissionData = {
  //       master: {
  //         date: formData.date,
  //         voucherTypeId: config.type,
  //         voucherNo: formData.voucherNo,
  //         status: formData.status,
  //         balacingId: formData.coaId
  //       },
  //       details: finalDetails
  //     }

  //     console.log('🔍 SUBMITTING:', submissionData)

  //     if (mode === 'create') {
  //       await createVoucher(submissionData).unwrap()
  //       console.log('✅ Created successfully')
  //     } else {
  //       await updateVoucher({
  //         id: initialData?.master.id,
  //         ...submissionData
  //       }).unwrap()
  //       console.log('✅ Updated successfully')
  //     }

  //     router.push('/vouchers')
  //   } catch (err: any) {
  //     console.error('❌ Submit failed:', err)
  //     setErrors({ general: err?.data?.message || `Failed to ${mode} voucher` })
  //   }
  // }

  // // ✅ FIXED: Handle confirmation modal actions
  // const handleConfirmAction = async () => {
  //   setConfirmModal(prev => ({ ...prev, isOpen: false }))

  //   if (confirmModal.action === 'save') {
  //     await handleSubmit()
  //   } else if (confirmModal.action === 'cancel') {
  //     router.push('/vouchers')
  //   }
  // }










  const handleSubmit = async () => {
    try {
      const finalDetails = prepareSubmissionData()

      const submissionData = {
        master: {
          date: formData.date,
          voucherTypeId: config.type,
          voucherNo: formData.voucherNo,
          status: formData.status,
          balacingId: formData.coaId
        },
        details: finalDetails
      }

      console.log('🔍 SUBMITTING:', submissionData)

      if (mode === 'create') {
        await createVoucher(submissionData).unwrap()
        console.log('✅ Created successfully')
      } else {
        await updateVoucher({
          id: initialData?.master.id,
          ...submissionData
        }).unwrap()
        console.log('✅ Updated successfully')
      }

      // ✅ FIXED: Dynamic routing based on voucher type
      const redirectPath = voucherType === 'journal' ? '/vouchers/journal' : '/vouchers/petty'
      console.log('🔍 Redirecting to:', redirectPath)
      router.push(redirectPath)

    } catch (err: any) {
      console.error('❌ Submit failed:', err)
      setErrors({ general: err?.data?.message || `Failed to ${mode} voucher` })
    }
  }

  // ✅ FIXED: Handle confirmation modal actions with dynamic routing
  const handleConfirmAction = async () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))

    if (confirmModal.action === 'save') {
      await handleSubmit()
    } else if (confirmModal.action === 'cancel') {
      // ✅ FIXED: Dynamic routing for cancel too
      const redirectPath = voucherType === 'journal' ? '/vouchers/journal' : '/vouchers/petty'
      console.log('🔍 Canceling, redirecting to:', redirectPath)
      router.push(redirectPath)
    }
  }














  const handleCancelConfirmation = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="max-w-6xl mx-auto p-">
      <div className="">
        {/* Header */}
        <div className="">
          {/* <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New' : 'Edit'} {config.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Create a new voucher entry' : 'Update existing voucher entry'}
            </p>
          </div> */}
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">
              <strong>Error:</strong> {errors.general}
            </div>
          </div>
        )}

        {/* Form Components */}
        <VoucherHeader
          voucherType={voucherType}
          formData={formData}
          filteredCoaAccounts={filteredCoaAccounts}
          errors={errors}
          onInputChange={handleInputChange}
          onCoaChange={handleCoaChange}
        />

        <VoucherDetails
          journalDetails={journalDetails}
          allCoaAccounts={coaData.map(account => ({
            id: account.id,
            label: `${account.acName}`,
            acCode: account.acCode,
            acName: account.acName
          }))}
          currencyOptions={currencyOptions}
          totals={totals}
          balancingCoaId={formData.coaId}
          onDetailChange={handleDetailChange}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
        />

        {errors.details && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">{errors.details}</div>
          </div>
        )}

        {/* ✅ FIXED: Bottom action buttons */}
        <div className="">
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelClick}
              disabled={isCreating || isUpdating}
              icon={<X className="w-4 h-4" />}
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveClick}
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
              icon={<Save className="w-4 h-4" />}
              size="md"
            >
              {mode === 'create' ? 'Create' : 'Update'} Voucher
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Confirmation Modal with proper type handling */}
      {/* ✅ FIXED: Using correct type values */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.action === 'save' ? (mode === 'create' ? 'Create' : 'Update') : 'Yes, Cancel'}
        cancelText={confirmModal.action === 'save' ? 'Review Again' : 'Keep Editing'}
        type={confirmModal.action === 'save' ? 'info' : 'warning'}
        loading={isCreating || isUpdating}
      />

    </div>
  )
}

export default VoucherForm
