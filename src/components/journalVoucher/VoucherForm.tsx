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
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { JournalDetail } from '@/types/journalVoucher'
// import { Save, X } from 'lucide-react'

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

//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false
//   })

//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [validationErrors, setValidationErrors] = useState<string[]>([]) // ✅ NEW: Separate validation errors

//   const [confirmModal, setConfirmModal] = useState<{
//     isOpen: boolean
//     action: 'save' | 'cancel'
//     title: string
//     message: string
//   }>({
//     isOpen: false,
//     action: 'save',
//     title: '',
//     message: ''
//   })

//   const { data: coaData = [] } = useGetCoaAccountsQuery()
//   const { data: currencyData = [] } = useGetCurrenciesQuery()
//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

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

//   const currencyOptions = useMemo(() => {
//     return currencyData.map(currency => ({
//       id: currency.id,
//       label: `${currency.currencyName}`,
//       currencyName: currency.currencyName
//     }))
//   }, [currencyData])

//   const isAutoBalanceEntry = (detail: any) => {
//     if (!detail) return false

//     const description = String(detail.description || '').toLowerCase().trim()

//     const descriptionMatches = [
//       'auto balancing entry',
//       'auto balance entry',
//       'auto balancing',
//       'auto balance',
//       'balancing entry',
//       'system generated'
//     ].some(match => description.includes(match))

//     return descriptionMatches
//   }

//   useEffect(() => {
//     if (mode === 'edit' && initialData && initialData.details) {
//       console.log('🔍 EDIT MODE - Loading data')

//       setFormData({
//         voucherNo: initialData.master.voucherNo || '',
//         date: initialData.master.date ? new Date(initialData.master.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status || false
//       })

//       const manualEntries = initialData.details.filter((detail, index) => {
//         const isAuto = isAutoBalanceEntry(detail)
//         console.log(`Entry ${index + 1}: "${detail.description}" → Keep: ${!isAuto}`)
//         return !isAuto
//       })

//       console.log(`🔍 Filtered: ${initialData.details.length} → ${manualEntries.length} entries`)

//       const mappedEntries = manualEntries.map((detail, index) => ({
//         lineId: index + 1,
//         coaId: Number(detail.coaId) || 0,
//         description: detail.description || '',
//         chqNo: detail.chqNo || '',
//         recieptNo: detail.recieptNo || '',
//         ownDb: Number(detail.ownDb) || 0,
//         ownCr: Number(detail.ownCr) || 0,
//         rate: 0,
//         amountDb: Number(detail.amountDb) || 0,
//         amountCr: Number(detail.amountCr) || 0,
//         isCost: Boolean(detail.isCost),
//         currencyId: Number(detail.currencyId) || null,
//         status: Boolean(detail.status),
//         idCard: detail.idCard || '',
//         bank: detail.bank || '',
//         bankDate: detail.bankDate || ''
//       }))

//       setJournalDetails(mappedEntries)

//     } else {
//       setJournalDetails([{
//         lineId: 1,
//         coaId: 0,
//         description: '',
//         chqNo: '',
//         recieptNo: '',
//         ownDb: 0,
//         ownCr: 0,
//         rate: 0,
//         amountDb: 0,
//         amountCr: 0,
//         isCost: false,
//         currencyId: null,
//         status: false,
//         idCard: '',
//         bank: '',
//         bankDate: ''
//       }])
//     }
//   }, [mode, initialData])

//   const totals = useMemo(() => {
//     const validEntries = journalDetails.filter(detail =>
//       detail.coaId > 0 && (detail.amountDb > 0 || detail.amountCr > 0)
//     )

//     const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountDb) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountCr) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     return { debitTotal, creditTotal, difference }
//   }, [journalDetails])

//   const prepareSubmissionData = () => {
//     const validEntries = journalDetails.filter(detail => {
//       const hasValidCoa = detail.coaId > 0
//       const hasValidAmount = (Number(detail.amountDb) > 0 || Number(detail.amountCr) > 0)
//       const hasDescription = detail.description && detail.description.trim() !== ''
//       const isNotAutoBalance = !isAutoBalanceEntry(detail)

//       return hasValidCoa && hasValidAmount && hasDescription && isNotAutoBalance
//     })

//     const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountDb) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountCr) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     let finalEntries = validEntries.map((detail, index) => ({
//       lineId: index + 1,
//       coaId: Number(detail.coaId),
//       description: String(detail.description || ''),
//       chqNo: String(detail.chqNo || ''),
//       recieptNo: String(detail.recieptNo || ''),
//       ownDb: Number(detail.ownDb || 0),
//       ownCr: Number(detail.ownCr || 0),
//       rate: Number(detail.rate || 0),
//       amountDb: Number(detail.amountDb || 0),
//       amountCr: Number(detail.amountCr || 0),
//       isCost: Boolean(detail.isCost),
//       currencyId: detail.currencyId ? Number(detail.currencyId) : null,
//       status: Boolean(detail.status),
//       idCard: detail.idCard || null,
//       bank: detail.bank || null,
//       bankDate: detail.bankDate || null
//     }))

//     if (difference > 0 && formData.coaId) {
//       const autoBalanceEntry = {
//         lineId: finalEntries.length + 1,
//         coaId: Number(formData.coaId),
//         description: 'Auto Balancing Entry',
//         chqNo: '',
//         recieptNo: '',
//         ownDb: 0,
//         ownCr: 0,
//         rate: 0,
//         amountDb: creditTotal > debitTotal ? difference : 0,
//         amountCr: debitTotal > creditTotal ? difference : 0,
//         isCost: false,
//         currencyId: null,
//         status: true,
//         idCard: null,
//         bank: null,
//         bankDate: null
//       }

//       finalEntries.push(autoBalanceEntry)
//     }

//     return finalEntries
//   }

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

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })

//     // ✅ Clear validation errors when user makes changes
//     if (validationErrors.length > 0) {
//       setValidationErrors([])
//     }
//   }

//   const handleAddRow = () => {
//     const newRow: JournalDetail = {
//       lineId: journalDetails.length + 1,
//       coaId: 0,
//       description: '',
//       chqNo: '',
//       recieptNo: '',
//       ownDb: 0,
//       ownCr: 0,
//       rate: 0,
//       amountDb: 0,
//       amountCr: 0,
//       isCost: false,
//       currencyId: null,
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

//   // ✅ BULLETPROOF: Comprehensive validation function
//   const validateForm = (): { isValid: boolean; errors: string[] } => {
//     console.log('🔍 Starting validation...')

//     const validationErrors: string[] = []
//     const newErrors: { [key: string]: string } = {}

//     // ✅ Header validation
//     if (!formData.voucherNo || !formData.voucherNo.trim()) {
//       newErrors.voucherNo = 'Voucher number is required'
//       validationErrors.push('Voucher number is required')
//     }
//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//       validationErrors.push('Date is required')
//     }
//     if (!formData.coaId) {
//       newErrors.coaId = `${config.balanceLabel} is required`
//       validationErrors.push(`${config.balanceLabel} is required`)
//     }

//     // ✅ Details validation - Check EVERY row
//     let hasCompleteRows = false

//     journalDetails.forEach((detail, index) => {
//       const rowNum = index + 1
//       console.log(`🔍 Checking Row ${rowNum}:`, {
//         coaId: detail.coaId,
//         description: detail.description?.trim(),
//         amountDb: detail.amountDb,
//         amountCr: detail.amountCr
//       })

//       // ✅ Check if row has ANY data
//       const hasAnyData = (
//         (detail.coaId && detail.coaId > 0) ||
//         (detail.description && detail.description.trim() !== '') ||
//         (detail.amountDb && detail.amountDb > 0) ||
//         (detail.amountCr && detail.amountCr > 0) ||
//         (detail.ownDb && detail.ownDb > 0) ||
//         (detail.ownCr && detail.ownCr > 0) ||
//         (detail.recieptNo && detail.recieptNo.trim() !== '') ||
//         (detail.chqNo && detail.chqNo.trim() !== '') ||
//         (detail.idCard && detail.idCard.trim() !== '') ||
//         (detail.bank && detail.bank.trim() !== '') ||
//         detail.bankDate ||
//         detail.currencyId
//       )

//       console.log(`🔍 Row ${rowNum} hasAnyData:`, hasAnyData)

//       if (hasAnyData) {
//         // ✅ Row has data, validate required fields
//         let rowHasErrors = false

//         if (!detail.coaId || detail.coaId === 0) {
//           validationErrors.push(`Row ${rowNum}: Please select an Account`)
//           rowHasErrors = true
//         }

//         if (!detail.description || detail.description.trim() === '') {
//           validationErrors.push(`Row ${rowNum}: Please enter Description`)
//           rowHasErrors = true
//         }

//         if ((!detail.amountDb || detail.amountDb === 0) && (!detail.amountCr || detail.amountCr === 0)) {
//           validationErrors.push(`Row ${rowNum}: Please enter Debit or Credit amount`)
//           rowHasErrors = true
//         }

//         // ✅ Check if this row is complete
//         if (!rowHasErrors) {
//           hasCompleteRows = true
//         }

//         console.log(`🔍 Row ${rowNum} validation:`, { rowHasErrors, hasCompleteRows })
//       }
//     })

//     // ✅ Must have at least one complete row
//     if (!hasCompleteRows) {
//       validationErrors.push('At least one complete journal entry is required (Account + Description + Debit OR Credit)')
//     }

//     console.log('🔍 Validation result:', { 
//       validationErrors, 
//       isValid: validationErrors.length === 0 
//     })

//     setErrors(newErrors)
//     setValidationErrors(validationErrors)

//     return {
//       isValid: validationErrors.length === 0,
//       errors: validationErrors
//     }
//   }

//   // ✅ FIXED: Bulletproof save handler
//   const handleSaveClick = (e?: React.MouseEvent) => {
//     if (e) {
//       e.preventDefault() // ✅ Prevent any default behavior
//       e.stopPropagation()
//     }

//     console.log('🔍 Save button clicked!')
//     console.log('🔍 Current journal details:', journalDetails)

//     // ✅ STRICT validation
//     const validation = validateForm()

//     console.log('🔍 Validation complete:', validation)

//     if (!validation.isValid) {
//       console.log('❌ VALIDATION FAILED - Showing errors and STAYING on page')
//       console.log('❌ Validation errors:', validation.errors)

//       // ✅ Force scroll to top to show errors
//       window.scrollTo({ top: 0, behavior: 'smooth' })

//       return false // ✅ STOP EXECUTION
//     }

//     console.log('✅ Validation passed - showing confirmation')

//     setConfirmModal({
//       isOpen: true,
//       action: 'save',
//       title: `${mode === 'create' ? 'Create' : 'Update'} ${config.title}`,
//       message: `Are you sure you want to ${mode === 'create' ? 'create this new' : 'update this'} ${config.title.toLowerCase()}?`
//     })
//   }

//   const handleCancelClick = () => {
//     setConfirmModal({
//       isOpen: true,
//       action: 'cancel',
//       title: 'Cancel Changes',
//       message: 'Are you sure you want to cancel? All unsaved changes will be lost.'
//     })
//   }

//   const handleSubmit = async () => {
//     try {
//       console.log('🔍 Final submission attempt...')

//       // ✅ Final validation check
//       const validation = validateForm()
//       if (!validation.isValid) {
//         console.log('❌ Final validation failed - aborting')
//         return
//       }

//       const finalDetails = prepareSubmissionData()

//       if (finalDetails.length === 0) {
//         console.log('❌ No valid details to submit')
//         setErrors({ general: 'No valid journal entries to submit' })
//         setValidationErrors(['No valid journal entries found'])
//         return
//       }

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
//       } else {
//         await updateVoucher({
//           id: initialData?.master.id,
//           ...submissionData
//         }).unwrap()
//         console.log('✅ Updated successfully')
//       }

//       // ✅ Only redirect after successful submission
//       const redirectPath = voucherType === 'journal' ? '/vouchers/journal' : '/vouchers/petty'
//       console.log('🔍 Success - redirecting to:', redirectPath)
//       router.push(redirectPath)

//     } catch (err: any) {
//       console.error('❌ Submit failed:', err)
//       setErrors({ general: err?.data?.message || `Failed to ${mode} voucher` })
//       setValidationErrors([err?.data?.message || `Failed to ${mode} voucher`])
//     }
//   }

//   const handleConfirmAction = async () => {
//     setConfirmModal(prev => ({ ...prev, isOpen: false }))

//     if (confirmModal.action === 'save') {
//       await handleSubmit()
//     } else if (confirmModal.action === 'cancel') {
//       const redirectPath = voucherType === 'journal' ? '/vouchers/journal' : '/vouchers/petty'
//       console.log('🔍 Canceling, redirecting to:', redirectPath)
//       router.push(redirectPath)
//     }
//   }

//   const handleCancelConfirmation = () => {
//     setConfirmModal(prev => ({ ...prev, isOpen: false }))
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="space-y-6">
//         {/* ✅ FIXED: Prominent validation errors display */}
//         {validationErrors.length > 0 && (
//           <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg">
//             {/* <div className="flex items-center mb-2">
//               <div className="text-red-600 font-bold text-lg">⚠️ Validation Errors</div>
//             </div> */}
//             <div className="text-red-700">
//               <div className="text-sm space-y-1">
//                 {validationErrors.map((error, index) => (
//                   <div key={index} className="flex items-start">
//                     <span className="text-red-500 mr-2">•</span>
//                     <span>{error}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {errors.general && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="text-red-600">
//               <strong>Error:</strong> {errors.general}
//             </div>
//           </div>
//         )}

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
//             label: `${account.acName}`,
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

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-end space-x-4">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={handleCancelClick}
//               disabled={isCreating || isUpdating}
//               icon={<X className="w-4 h-4" />}
//               size="md"
//             >
//               Cancel
//             </Button>
//             {/* ✅ FIXED: Explicit button handler */}
//             <Button
//               type="button"
//               variant="primary"
//               onClick={handleSaveClick}
//               loading={isCreating || isUpdating}
//               disabled={isCreating || isUpdating}
//               icon={<Save className="w-4 h-4" />}
//               size="md"
//             >
//               {mode === 'create' ? 'Create' : 'Update'} Voucher
//             </Button>
//           </div>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={handleCancelConfirmation}
//         onConfirm={handleConfirmAction}
//         title={confirmModal.title}
//         message={confirmModal.message}
//         confirmText={confirmModal.action === 'save' ? (mode === 'create' ? 'Create' : 'Update') : 'Yes, Cancel'}
//         cancelText={confirmModal.action === 'save' ? 'Review Again' : 'Keep Editing'}
//         type={confirmModal.action === 'save' ? 'info' : 'warning'}
//         loading={isCreating || isUpdating}
//       />
//     </div>
//   )
// }

// export default VoucherForm






























































// // components/vouchers/VoucherForm.tsx
// 'use client'
// import React, { useState, useEffect, useMemo, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/Button'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery
// } from '@/store/slice/journalVoucherSlice'
// import { AlertCircle, RefreshCw, Save, X, CheckCircle } from 'lucide-react'

// // Types
// interface JournalDetail {
//   lineId: number
//   coaId: number
//   description: string
//   recieptNo?: string
//   currencyId?: number | null
//   rate?: number
//   ownDb?: number
//   ownCr?: number
//   amountDb: number
//   amountCr: number
//   idCard?: string
//   bank?: string
//   bankDate?: string | null
//   status: boolean
//   // Raw values for decimal input handling
//   rate_raw?: string
//   ownDb_raw?: string
//   ownCr_raw?: string
//   amountDb_raw?: string
//   amountCr_raw?: string
// }

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: { master: any; details: any[] }
// }

// // Empty detail row template
// const createEmptyDetail = (lineId: number): JournalDetail => ({
//   lineId,
//   coaId: 0,
//   description: '',
//   recieptNo: '',
//   currencyId: null,
//   rate: 0,
//   ownDb: 0,
//   ownCr: 0,
//   amountDb: 0,
//   amountCr: 0,
//   idCard: '',
//   bank: '',
//   bankDate: null,
//   status: true
// })

// export const VoucherForm: React.FC<VoucherFormProps> = ({
//   mode,
//   voucherType,
//   initialData
// }) => {
//   const router = useRouter()

//   // ✅ Config with prefix
//   const config = useMemo(() => ({
//     journal: {
//       title: 'Journal Voucher',
//       type: 10,
//       coaFilter: 'isJvBalance',
//       balanceLabel: 'Journal Balance Account',
//       prefix: 'JV-',
//       listPath: '/vouchers/journal'
//     },
//     pettycash: {
//       title: 'Petty Cash Voucher',
//       type: 14,
//       coaFilter: 'isPettyCash',
//       balanceLabel: 'Petty Cash Account',
//       prefix: 'PC-',
//       listPath: '/vouchers/pettycash'
//     }
//   }[voucherType]), [voucherType])

//   // ==================== STATE ====================

//   // Form Data
//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false
//   })

//   // Opening checkbox
//   const [isOpening, setIsOpening] = useState(false)

//   // Journal Details
//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([createEmptyDetail(1)])

//   // Errors
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [apiError, setApiError] = useState<string | null>(null)

//   // Confirmation Modal
//   const [confirmModal, setConfirmModal] = useState<{
//     isOpen: boolean
//     type: 'save' | 'cancel' | null
//     message: string
//   }>({
//     isOpen: false,
//     type: null,
//     message: ''
//   })

//   // ==================== RTK QUERY ====================

//   // Mutations
//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

//   // Queries
//   const { data: coaData = [], isLoading: coaLoading } = useGetCoaAccountsQuery()
//   const { data: currencyData = [], isLoading: currencyLoading } = useGetCurrenciesQuery()

//   // ==================== MEMOIZED DATA ====================

//   // All COA accounts for details dropdown
//   const allCoaAccounts = useMemo(() => {
//     return coaData.map((coa: any) => ({
//       id: coa.id,
//       label: `${coa.acCode} - ${coa.acName}`,
//       acCode: coa.acCode || `COA-${coa.id}`,
//       acName: coa.acName || 'Unknown'
//     }))
//   }, [coaData])

//   // Currency options
//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencyData)) return []
//     return currencyData.map((currency: any) => ({
//       id: currency.id,
//       label: currency.currencyName || currency.name,
//       currencyName: currency.currencyName || currency.name
//     }))
//   }, [currencyData])

//   // Calculate totals
//   const totals = useMemo(() => {
//     const validEntries = journalDetails.filter(d => 
//       d.coaId > 0 && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     const debitTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountDb)) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountCr)) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     return {
//       debitTotal: Math.round(debitTotal * 100) / 100,
//       creditTotal: Math.round(creditTotal * 100) / 100,
//       difference: Math.round(difference * 100) / 100
//     }
//   }, [journalDetails])

//   // ==================== EFFECTS ====================

//   // Initialize form for create mode with prefix
//   useEffect(() => {
//     if (mode === 'create') {
//       setFormData(prev => ({
//         ...prev,
//         voucherNo: config.prefix
//       }))
//       setJournalDetails([createEmptyDetail(1)])
//       setIsOpening(false)
//     }
//   }, [mode, config.prefix])

//   // Load data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialData) {
//       console.log('📝 Loading edit data:', initialData)

//       // Set form data
//       setFormData({
//         voucherNo: initialData.master.voucherNo || config.prefix,
//         date: initialData.master.date 
//           ? initialData.master.date.split('T')[0] 
//           : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status || false
//       })

//       // Set opening
//       setIsOpening(initialData.master.isOpening || false)

//       // Filter out auto-balance entries
//       const manualEntries = initialData.details.filter((detail: any) => {
//         const description = detail.description?.toLowerCase().trim() || ''
//         return !['auto balancing entry', 'auto balance entry', 'balancing entry', 'system generated']
//           .some(match => description.includes(match))
//       })

//       if (manualEntries.length > 0) {
//         setJournalDetails(manualEntries.map((detail: any, index: number) => ({
//           lineId: index + 1,
//           coaId: detail.coaId || 0,
//           description: detail.description || '',
//           recieptNo: detail.recieptNo || '',
//           currencyId: detail.currencyId || null,
//           rate: detail.rate || 0,
//           ownDb: detail.ownDb || 0,
//           ownCr: detail.ownCr || 0,
//           amountDb: detail.amountDb || 0,
//           amountCr: detail.amountCr || 0,
//           idCard: detail.idCard || '',
//           bank: detail.bank || '',
//           bankDate: detail.bankDate || null,
//           status: detail.status !== undefined ? detail.status : true
//         })))
//       } else {
//         setJournalDetails([createEmptyDetail(1)])
//       }
//     }
//   }, [mode, initialData, config.prefix])

//   // ==================== HANDLERS ====================

//   // Handle voucher number input with auto-prefix
//   const handleVoucherNoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value
//     const prefix = config.prefix

//     // If value doesn't start with prefix, add it
//     if (!value.startsWith(prefix)) {
//       const withoutAnyPrefix = value.replace(/^(JV-|PC-)/i, '')
//       value = prefix + withoutAnyPrefix
//     }

//     setFormData(prev => ({ ...prev, voucherNo: value }))

//     // Clear errors when user changes voucher number
//     if (errors.voucherNo) {
//       setErrors(prev => ({ ...prev, voucherNo: '' }))
//     }
//     if (apiError) {
//       setApiError(null)
//     }
//   }, [config.prefix, errors.voucherNo, apiError])

//   // Handle other input changes
//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target

//     if (name === 'voucherNo') {
//       handleVoucherNoChange(e)
//       return
//     }

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }, [handleVoucherNoChange, errors])

//   // Handle COA change from searchable input
//   const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     console.log('📌 COA Selected:', selectedId, selectedOption)

//     setFormData(prev => ({
//       ...prev,
//       coaId: selectedId ? Number(selectedId) : null
//     }))

//     if (errors.coaId) {
//       setErrors(prev => ({ ...prev, coaId: '' }))
//     }
//   }, [errors.coaId])

//   // Handle opening change
//   const handleOpeningChange = useCallback((checked: boolean) => {
//     setIsOpening(checked)
//   }, [])

//   // Handle detail change
//   const handleDetailChange = useCallback((index: number, field: string, value: any) => {
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = {
//         ...updated[index],
//         [field]: value
//       }
//       return updated
//     })
//   }, [])

//   // Add new row
//   const handleAddRow = useCallback(() => {
//     setJournalDetails(prev => [
//       ...prev,
//       createEmptyDetail(prev.length + 1)
//     ])
//   }, [])

//   // Remove row
//   const handleRemoveRow = useCallback((index: number) => {
//     if (journalDetails.length <= 1) return

//     setJournalDetails(prev => {
//       const updated = prev.filter((_, i) => i !== index)
//       return updated.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [journalDetails.length])

//   // ==================== VALIDATION ====================

//   const validateForm = useCallback(() => {
//     const newErrors: { [key: string]: string } = {}
//     const newValidationErrors: string[] = []

//     // Header validation
//     if (!formData.voucherNo || formData.voucherNo === config.prefix) {
//       newErrors.voucherNo = 'Voucher number is required'
//       newValidationErrors.push('Voucher number is required')
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//       newValidationErrors.push('Date is required')
//     }

//     if (!formData.coaId) {
//       newErrors.coaId = `${config.balanceLabel} is required`
//       newValidationErrors.push(`${config.balanceLabel} is required`)
//     }

//     // Details validation
//     const entriesWithData = journalDetails.filter(d => 
//       d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0
//     )

//     entriesWithData.forEach((detail, index) => {
//       const rowNum = index + 1

//       if (!detail.coaId || detail.coaId === 0) {
//         newValidationErrors.push(`Row ${rowNum}: Account is required`)
//       }
//       if (!detail.description || detail.description.trim() === '') {
//         newValidationErrors.push(`Row ${rowNum}: Description is required`)
//       }
//       if ((!detail.amountDb || detail.amountDb === 0) && (!detail.amountCr || detail.amountCr === 0)) {
//         newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
//       }
//     })

//     // Must have at least one complete entry
//     const completeEntries = journalDetails.filter(d => 
//       d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     if (completeEntries.length === 0) {
//       newValidationErrors.push('At least one complete entry is required')
//     }

//     setErrors(newErrors)
//     setValidationErrors(newValidationErrors)

//     return newValidationErrors.length === 0
//   }, [formData, journalDetails, config])

//   // ==================== SUBMISSION ====================

//   // Prepare submission data
//   const prepareSubmissionData = useCallback(() => {
//     // Get valid entries
//     const validEntries = journalDetails.filter(d => 
//       d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     // Map to API format
//     let finalEntries = validEntries.map((entry, index) => ({
//       lineId: index + 1,
//       coaId: entry.coaId,
//       description: entry.description,
//       recieptNo: entry.recieptNo || null,
//       currencyId: entry.currencyId || null,
//       rate: entry.rate || 0,
//       ownDb: entry.ownDb || 0,
//       ownCr: entry.ownCr || 0,
//       amountDb: parseFloat(String(entry.amountDb)) || 0,
//       amountCr: parseFloat(String(entry.amountCr)) || 0,
//       idCard: entry.idCard || null,
//       bank: entry.bank || null,
//       bankDate: entry.bankDate || null,
//       status: entry.status !== undefined ? entry.status : true
//     }))

//     // Add auto-balance entry if needed
//     if (totals.difference > 0 && formData.coaId) {
//       const autoBalanceEntry = {
//         lineId: finalEntries.length + 1,
//         coaId: formData.coaId,
//         description: 'Auto Balancing Entry',
//         recieptNo: null,
//         currencyId: null,
//         rate: 0,
//         ownDb: 0,
//         ownCr: 0,
//         amountDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
//         amountCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
//         idCard: null,
//         bank: null,
//         bankDate: null,
//         status: true
//       }
//       finalEntries.push(autoBalanceEntry)
//       console.log('➕ Added auto-balance entry:', autoBalanceEntry)
//     }

//     return {
//       master: {
//         voucherNo: formData.voucherNo,
//         date: formData.date,
//         balacingId: formData.coaId,
//         voucherTypeId: config.type,
//         status: formData.status,
//         isOpening: isOpening
//       },
//       details: finalEntries
//     }
//   }, [formData, journalDetails, totals, config.type, isOpening])

//   // Handle save click - show confirmation
//   const handleSaveClick = useCallback(() => {
//     if (!validateForm()) {
//       return
//     }

//     setConfirmModal({
//       isOpen: true,
//       type: 'save',
//       message: mode === 'create' 
//         ? `Are you sure you want to create ${config.title} "${formData.voucherNo}"?`
//         : `Are you sure you want to update ${config.title} "${formData.voucherNo}"?`
//     })
//   }, [validateForm, mode, config.title, formData.voucherNo])

//   // Handle cancel click - show confirmation if there are changes
//   const handleCancelClick = useCallback(() => {
//     const hasChanges = formData.voucherNo !== config.prefix || 
//       journalDetails.some(d => d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0)

//     if (hasChanges) {
//       setConfirmModal({
//         isOpen: true,
//         type: 'cancel',
//         message: 'You have unsaved changes. Are you sure you want to cancel?'
//       })
//     } else {
//       router.push(config.listPath)
//     }
//   }, [formData.voucherNo, config.prefix, config.listPath, journalDetails, router])

//   // Handle submit
//   const handleSubmit = async () => {
//     setApiError(null)
//     setConfirmModal({ isOpen: false, type: null, message: '' })

//     const submissionData = prepareSubmissionData()
//     console.log('📤 Submitting:', submissionData)

//     try {
//       if (mode === 'create') {
//         const result = await createVoucher(submissionData).unwrap()
//         console.log('✅ Created:', result)
//         router.push(config.listPath)
//       } else {
//         const result = await updateVoucher({
//           id: initialData?.master.id,
//           ...submissionData
//         }).unwrap()
//         console.log('✅ Updated:', result)
//         router.push(config.listPath)
//       }
//     } catch (error: any) {
//       console.error('❌ Error:', error)

//       // Handle API error
//       if (error?.data?.errorCode === 'DUPLICATE_VOUCHER_NO') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, voucherNo: error.data.message }))
//       } else if (error?.data?.message) {
//         setApiError(error.data.message)
//       } else {
//         setApiError('Failed to save voucher. Please try again.')
//       }
//     }
//   }

//   // Handle confirm modal actions
//   const handleConfirmAction = useCallback(() => {
//     if (confirmModal.type === 'save') {
//       handleSubmit()
//     } else if (confirmModal.type === 'cancel') {
//       router.push(config.listPath)
//     }
//   }, [confirmModal.type, config.listPath, router])

//   const handleCloseModal = useCallback(() => {
//     setConfirmModal({ isOpen: false, type: null, message: '' })
//   }, [])

//   // ==================== LOADING STATE ====================

//   if (coaLoading || currencyLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3] mx-auto mb-4" />
//           <p className="text-gray-500">Loading form data...</p>
//         </div>
//       </div>
//     )
//   }

//   // ==================== RENDER ====================

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           {mode === 'create' ? `Create ${config.title}` : `Edit ${config.title}`}
//         </h1>
//         <p className="text-gray-500 mt-1">
//           {mode === 'create' 
//             ? `Fill in the details to create a new ${config.title.toLowerCase()}`
//             : `Update the ${config.title.toLowerCase()} details`
//           }
//         </p>
//       </div>

//       {/* API Error Display */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <p className="text-red-700 font-medium">{apiError}</p>
//           </div>
//         </div>
//       )}

//       {/* Validation Errors Display */}
//       {validationErrors.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             Please fix the following errors:
//           </h3>
//           <ul className="list-disc list-inside text-red-700 space-y-1">
//             {validationErrors.map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Voucher Header */}
//       <VoucherHeader
//         voucherType={voucherType}
//         formData={formData}
//         errors={errors}
//         isOpening={isOpening}
//         onInputChange={handleInputChange}
//         onCoaChange={handleCoaChange}
//         onOpeningChange={handleOpeningChange}
//       />

//       {/* Voucher Details */}
//       <VoucherDetails
//         journalDetails={journalDetails}
//         allCoaAccounts={allCoaAccounts}
//         currencyOptions={currencyOptions}
//         totals={totals}
//         balancingCoaId={formData.coaId}
//         onDetailChange={handleDetailChange}
//         onAddRow={handleAddRow}
//         onRemoveRow={handleRemoveRow}
//       />

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
//         <Button
//           variant="outline"
//           onClick={handleCancelClick}
//           disabled={isCreating || isUpdating}
//           icon={<X className="w-4 h-4" />}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={handleSaveClick}
//           disabled={isCreating || isUpdating}
//           icon={isCreating || isUpdating 
//             ? <RefreshCw className="w-4 h-4 animate-spin" /> 
//             : <Save className="w-4 h-4" />
//           }
//         >
//           {isCreating || isUpdating 
//             ? 'Saving...' 
//             : mode === 'create' 
//               ? `Create ${config.title}` 
//               : `Update ${config.title}`
//           }
//         </Button>
//       </div>

//       {/* Confirmation Modal */}
//       {confirmModal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
//             <div className="flex items-center gap-3 mb-4">
//               {confirmModal.type === 'save' ? (
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <CheckCircle className="w-6 h-6 text-blue-600" />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-yellow-100 rounded-full">
//                   <AlertCircle className="w-6 h-6 text-yellow-600" />
//                 </div>
//               )}
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {confirmModal.type === 'save' ? 'Confirm Save' : 'Confirm Cancel'}
//               </h3>
//             </div>

//             <p className="text-gray-600 mb-6">{confirmModal.message}</p>

//             {/* Show auto-balance info if saving */}
//             {confirmModal.type === 'save' && totals.difference > 0 && formData.coaId && (
//               <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-sm text-blue-700">
//                   <strong>Note:</strong> An auto-balancing entry of{' '}
//                   <span className="font-mono font-bold">{totals.difference.toLocaleString()}</span>{' '}
//                   will be added to balance the voucher.
//                 </p>
//               </div>
//             )}

//             <div className="flex justify-end gap-3">
//               <Button
//                 variant="outline"
//                 onClick={handleCloseModal}
//               >
//                 No, Go Back
//               </Button>
//               <Button
//                 variant={confirmModal.type === 'save' ? 'primary' : 'danger'}
//                 onClick={handleConfirmAction}
//               >
//                 {confirmModal.type === 'save' ? 'Yes, Save' : 'Yes, Cancel'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherForm






























































// // components/vouchers/VoucherForm.tsx

// 'use client'
// import React, { useState, useEffect, useMemo, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/Button'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery
// } from '@/store/slice/journalVoucherSlice'
// import { AlertCircle, RefreshCw, Save, X, CheckCircle } from 'lucide-react'

// // Types
// interface JournalDetail {
//   lineId: number
//   coaId: number
//   description: string
//   recieptNo?: string
//   currencyId?: number | null
//   rate?: number
//   ownDb?: number
//   ownCr?: number
//   amountDb: number
//   amountCr: number
//   idCard?: string
//   bank?: string
//   bankDate?: string | null
//   status: boolean
//   rate_raw?: string
//   ownDb_raw?: string
//   ownCr_raw?: string
//   amountDb_raw?: string
//   amountCr_raw?: string
//   isCurrencyLocked?: boolean
//   coaType?: string | number
// }

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: { master: any; details: any[] }
// }

// // Empty detail row template
// const createEmptyDetail = (lineId: number): JournalDetail => ({
//   lineId,
//   coaId: 0,
//   description: '',
//   recieptNo: '',
//   currencyId: null,
//   rate: 0,
//   ownDb: 0,
//   ownCr: 0,
//   amountDb: 0,
//   amountCr: 0,
//   idCard: '',
//   bank: '',
//   bankDate: null,
//   status: true
// })

// export const VoucherForm: React.FC<VoucherFormProps> = ({
//   mode,
//   voucherType,
//   initialData
// }) => {
//   const router = useRouter()

//   // Config
//   const config = useMemo(() => ({
//     journal: {
//       title: 'Journal Voucher',
//       type: 10,
//       coaFilter: 'isJvBalance',
//       balanceLabel: 'Journal Balance Account',
//       prefix: 'JV-',
//       listPath: '/vouchers/journal'
//     },
//     pettycash: {
//       title: 'Petty Cash Voucher',
//       type: 14,
//       coaFilter: 'isPettyCash',
//       balanceLabel: 'Petty Cash Account',
//       prefix: 'PC-',
//       listPath: '/vouchers/petty'
//     }
//   }[voucherType]), [voucherType])

//   // ==================== STATE ====================

//   // Track duplicate receipts for highlighting
//   const [duplicateReceipts, setDuplicateReceipts] = useState<string[]>([])

//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false
//   })

//   const [isOpening, setIsOpening] = useState(false)
//   const [linkedJournalId, setLinkedJournalId] = useState<number | null>(null)  // ✅ NEW
//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([createEmptyDetail(1)])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [apiError, setApiError] = useState<string | null>(null)

//   const [confirmModal, setConfirmModal] = useState<{
//     isOpen: boolean
//     type: 'save' | 'cancel' | null
//     message: string
//   }>({
//     isOpen: false,
//     type: null,
//     message: ''
//   })

//   // ==================== RTK QUERY ====================

//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()
//   const { data: coaData = [], isLoading: coaLoading } = useGetCoaAccountsQuery()
//   const { data: currencyData = [], isLoading: currencyLoading } = useGetCurrenciesQuery()



//   // ✅ Handle Clone Row - Reverse Debit/Credit, append "R" to receipt
//   const handleCloneRow = useCallback((index: number) => {
//     setJournalDetails(prev => {
//       const rowToClone = prev[index]

//       // Generate new receipt number with "R" suffix
//       let newReceiptNo = rowToClone.recieptNo || ''
//       if (newReceiptNo) {
//         newReceiptNo = newReceiptNo + 'R'
//       }

//       // Create cloned row with REVERSED Debit/Credit
//       const clonedRow: JournalDetail = {
//         ...rowToClone,
//         lineId: prev.length + 1,
//         recieptNo: newReceiptNo,
//         // ✅ Reverse Debit and Credit
//         amountDb: rowToClone.amountCr || 0,
//         amountCr: rowToClone.amountDb || 0,
//         ownDb: rowToClone.ownCr || 0,
//         ownCr: rowToClone.ownDb || 0,
//         // Clear raw values
//         amountDb_raw: undefined,
//         amountCr_raw: undefined,
//         ownDb_raw: undefined,
//         ownCr_raw: undefined,
//       }

//       // Insert cloned row after original
//       const newDetails = [...prev]
//       newDetails.splice(index + 1, 0, clonedRow)

//       // Reassign lineIds
//       return newDetails.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [])









//   useEffect(() => {
//     const receiptCounts: { [key: string]: number } = {}

//     journalDetails.forEach(detail => {
//       const receipt = detail.recieptNo?.trim()
//       if (receipt) {
//         receiptCounts[receipt] = (receiptCounts[receipt] || 0) + 1
//       }
//     })

//     // Find receipts that appear more than once
//     const duplicates = Object.entries(receiptCounts)
//       .filter(([_, count]) => count > 1)
//       .map(([receipt, _]) => receipt)

//     setDuplicateReceipts(duplicates)
//   }, [journalDetails])


//   // ==================== MEMOIZED DATA ====================

//   const allCoaAccounts = useMemo(() => {
//     return coaData.map((coa: any) => ({
//       id: coa.id,
//       label: `${coa.acCode} - ${coa.acName}`,
//       acCode: coa.acCode || `COA-${coa.id}`,
//       acName: coa.acName || 'Unknown'
//     }))
//   }, [coaData])

//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencyData)) return []
//     return currencyData.map((currency: any) => ({
//       id: currency.id,
//       label: currency.currencyName || currency.name,
//       currencyName: currency.currencyName || currency.name
//     }))
//   }, [currencyData])

//   const totals = useMemo(() => {
//     const validEntries = journalDetails.filter(d =>
//       d.coaId > 0 && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     const debitTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountDb)) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountCr)) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     return {
//       debitTotal: Math.round(debitTotal * 100) / 100,
//       creditTotal: Math.round(creditTotal * 100) / 100,
//       difference: Math.round(difference * 100) / 100
//     }
//   }, [journalDetails])

//   // ==================== EFFECTS ====================

//   // Initialize for create mode
//   useEffect(() => {
//     if (mode === 'create') {
//       setFormData(prev => ({
//         ...prev,
//         voucherNo: config.prefix
//       }))
//       setJournalDetails([createEmptyDetail(1)])
//       setIsOpening(false)
//       setLinkedJournalId(null)  // ✅ Reset
//     }
//   }, [mode, config.prefix])

//   // Load data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialData) {
//       console.log('📝 Loading edit data:', initialData)

//       setFormData({
//         voucherNo: initialData.master.voucherNo || config.prefix,
//         date: initialData.master.date
//           ? initialData.master.date.split('T')[0]
//           : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status || false
//       })

//       setIsOpening(initialData.master.isOpening || false)
//       setLinkedJournalId(initialData.master.linkedJournalId || null)  // ✅ Load linked journal

//       // Filter out auto-balance entries
//       const manualEntries = initialData.details.filter((detail: any) => {
//         const description = detail.description?.toLowerCase().trim() || ''
//         return !['auto balancing entry', 'auto balance entry', 'balancing entry', 'system generated']
//           .some(match => description.includes(match))
//       })

//       if (manualEntries.length > 0) {
//         setJournalDetails(manualEntries.map((detail: any, index: number) => ({
//           lineId: index + 1,
//           coaId: detail.coaId || 0,
//           description: detail.description || '',
//           recieptNo: detail.recieptNo || '',
//           currencyId: detail.currencyId || null,
//           rate: detail.rate || 0,
//           ownDb: detail.ownDb || 0,
//           ownCr: detail.ownCr || 0,
//           amountDb: detail.amountDb || 0,
//           amountCr: detail.amountCr || 0,
//           idCard: detail.idCard || '',
//           bank: detail.bank || '',
//           bankDate: detail.bankDate || null,
//           status: detail.status !== undefined ? detail.status : true
//         })))
//       } else {
//         setJournalDetails([createEmptyDetail(1)])
//       }
//     }
//   }, [mode, initialData, config.prefix])

//   // ==================== HANDLERS ====================

//   // Handle voucher number with prefix
//   const handleVoucherNoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value
//     const prefix = config.prefix

//     if (!value.startsWith(prefix)) {
//       const withoutAnyPrefix = value.replace(/^(JV-|PC-)/i, '')
//       value = prefix + withoutAnyPrefix
//     }

//     setFormData(prev => ({ ...prev, voucherNo: value }))

//     if (errors.voucherNo) setErrors(prev => ({ ...prev, voucherNo: '' }))
//     if (apiError) setApiError(null)
//   }, [config.prefix, errors.voucherNo, apiError])

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target

//     if (name === 'voucherNo') {
//       handleVoucherNoChange(e)
//       return
//     }

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))

//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
//   }, [handleVoucherNoChange, errors])

//   const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     setFormData(prev => ({
//       ...prev,
//       coaId: selectedId ? Number(selectedId) : null
//     }))
//     if (errors.coaId) setErrors(prev => ({ ...prev, coaId: '' }))
//   }, [errors.coaId])

//   // ✅ NEW: Handle linked journal change
//   const handleLinkedJournalChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     console.log('📌 Linked Journal Selected:', selectedId, selectedOption)
//     setLinkedJournalId(selectedId ? Number(selectedId) : null)
//     if (errors.linkedJournalId) setErrors(prev => ({ ...prev, linkedJournalId: '' }))
//   }, [errors])

//   const handleOpeningChange = useCallback((checked: boolean) => {
//     setIsOpening(checked)
//   }, [])

//   const handleDetailChange = useCallback((index: number, field: string, value: any) => {
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }, [])

//   const handleAddRow = useCallback(() => {
//     setJournalDetails(prev => [...prev, createEmptyDetail(prev.length + 1)])
//   }, [])

//   const handleRemoveRow = useCallback((index: number) => {
//     if (journalDetails.length <= 1) return
//     setJournalDetails(prev => {
//       const updated = prev.filter((_, i) => i !== index)
//       return updated.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [journalDetails.length])

//   // ==================== VALIDATION ====================

//   // const validateForm = useCallback(() => {
//   //   const newErrors: { [key: string]: string } = {}
//   //   const newValidationErrors: string[] = []

//   //   // Header validation
//   //   if (!formData.voucherNo || formData.voucherNo === config.prefix) {
//   //     newErrors.voucherNo = 'Voucher number is required'
//   //     newValidationErrors.push('Voucher number is required')
//   //   }

//   //   if (!formData.date) {
//   //     newErrors.date = 'Date is required'
//   //     newValidationErrors.push('Date is required')
//   //   }

//   //   if (!formData.coaId) {
//   //     newErrors.coaId = `${config.balanceLabel} is required`
//   //     newValidationErrors.push(`${config.balanceLabel} is required`)
//   //   }

//   //   // ✅ NEW: Validate linkedJournalId for Petty Cash
//   //   if (voucherType === 'pettycash' && !linkedJournalId) {
//   //     newErrors.linkedJournalId = 'Link to Journal Voucher is required'
//   //     newValidationErrors.push('Petty Cash must be linked to a Journal Voucher')
//   //   }

//   //   // Details validation
//   //   const entriesWithData = journalDetails.filter(d => 
//   //     d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0
//   //   )

//   //   entriesWithData.forEach((detail, index) => {
//   //     const rowNum = index + 1
//   //     if (!detail.coaId || detail.coaId === 0) {
//   //       newValidationErrors.push(`Row ${rowNum}: Account is required`)
//   //     }
//   //     if (!detail.description || detail.description.trim() === '') {
//   //       newValidationErrors.push(`Row ${rowNum}: Description is required`)
//   //     }
//   //     if ((!detail.amountDb || detail.amountDb === 0) && (!detail.amountCr || detail.amountCr === 0)) {
//   //       newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
//   //     }
//   //   })

//   //   const completeEntries = journalDetails.filter(d => 
//   //     d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
//   //   )

//   //   if (completeEntries.length === 0) {
//   //     newValidationErrors.push('At least one complete entry is required')
//   //   }

//   //   setErrors(newErrors)
//   //   setValidationErrors(newValidationErrors)

//   //   return newValidationErrors.length === 0
//   // }, [formData, journalDetails, config, voucherType, linkedJournalId])


//   // ==================== VALIDATION ====================

//   // const validateForm = useCallback(() => {
//   //   const newErrors: { [key: string]: string } = {}
//   //   const newValidationErrors: string[] = []

//   //   // =============================================
//   //   // 1. HEADER VALIDATION
//   //   // =============================================

//   //   // Voucher Number
//   //   if (!formData.voucherNo || formData.voucherNo === config.prefix) {
//   //     newErrors.voucherNo = 'Voucher number is required'
//   //     newValidationErrors.push('Voucher number is required')
//   //   }

//   //   // Date
//   //   if (!formData.date) {
//   //     newErrors.date = 'Date is required'
//   //     newValidationErrors.push('Date is required')
//   //   }

//   //   // Balance Account (COA)
//   //   if (!formData.coaId) {
//   //     newErrors.coaId = `${config.balanceLabel} is required`
//   //     newValidationErrors.push(`${config.balanceLabel} is required`)
//   //   }

//   //   // =============================================
//   //   // 2. LINKED JOURNAL VALIDATION (Petty Cash Only)
//   //   // =============================================

//   //   if (voucherType === 'pettycash' && !linkedJournalId) {
//   //     newErrors.linkedJournalId = 'Link to Journal Voucher is required'
//   //     newValidationErrors.push('Petty Cash must be linked to a Journal Voucher')
//   //   }

//   //   // =============================================
//   //   // 3. DUPLICATE RECEIPTS WITHIN FORM
//   //   // =============================================

//   //   if (duplicateReceipts.length > 0) {
//   //     newValidationErrors.push(`Duplicate receipt numbers in form: ${duplicateReceipts.join(', ')}`)
//   //   }

//   //   // =============================================
//   //   // 4. DETAILS VALIDATION
//   //   // =============================================

//   //   // Get entries that have any data
//   //   const entriesWithData = journalDetails.filter(d =>
//   //     d.coaId > 0 ||
//   //     (d.description && d.description.trim() !== '') ||
//   //     (d.amountDb && d.amountDb > 0) ||
//   //     (d.amountCr && d.amountCr > 0) ||
//   //     (d.recieptNo && d.recieptNo.trim() !== '')
//   //   )

//   //   entriesWithData.forEach((detail, idx) => {
//   //     // Find actual index in journalDetails
//   //     const actualIndex = journalDetails.findIndex(d => d.lineId === detail.lineId)
//   //     const rowNum = actualIndex + 1

//   //     // Account is required
//   //     if (!detail.coaId || detail.coaId === 0) {
//   //       newValidationErrors.push(`Row ${rowNum}: Account is required`)
//   //     }

//   //     // Description is required
//   //     if (!detail.description || detail.description.trim() === '') {
//   //       newValidationErrors.push(`Row ${rowNum}: Description is required`)
//   //     }

//   //     // Receipt is required
//   //     if (!detail.recieptNo || detail.recieptNo.trim() === '') {
//   //       newValidationErrors.push(`Row ${rowNum}: Receipt number is required`)
//   //     }

//   //     // Debit OR Credit is required (at least one)
//   //     const hasDebit = detail.amountDb && detail.amountDb > 0
//   //     const hasCredit = detail.amountCr && detail.amountCr > 0

//   //     if (!hasDebit && !hasCredit) {
//   //       newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
//   //     }

//   //     // Cannot have both Debit and Credit (extra safety check)
//   //     if (hasDebit && hasCredit) {
//   //       newValidationErrors.push(`Row ${rowNum}: Cannot have both Debit and Credit in same row`)
//   //     }

//   //     // If currency is selected, exchange rate should be provided (optional warning)
//   //     if (detail.currencyId && detail.currencyId > 0 && (!detail.rate || detail.rate === 0)) {
//   //       // This is a warning, not a hard error - uncomment if required
//   //       // newValidationErrors.push(`Row ${rowNum}: Exchange rate is recommended when currency is selected`)
//   //     }
//   //   })

//   //   // =============================================
//   //   // 5. MUST HAVE AT LEAST ONE COMPLETE ENTRY
//   //   // =============================================

//   //   const completeEntries = journalDetails.filter(d =>
//   //     d.coaId > 0 &&
//   //     d.description &&
//   //     d.description.trim() !== '' &&
//   //     d.recieptNo &&
//   //     d.recieptNo.trim() !== '' &&
//   //     ((d.amountDb && d.amountDb > 0) || (d.amountCr && d.amountCr > 0))
//   //   )

//   //   if (completeEntries.length === 0) {
//   //     newValidationErrors.push('At least one complete entry is required (Account, Description, Receipt, and Amount)')
//   //   }

//   //   // =============================================
//   //   // 6. TOTALS VALIDATION (Optional)
//   //   // =============================================

//   //   // If you want to warn about unbalanced vouchers without auto-balance account
//   //   if (totals.difference > 0 && !formData.coaId) {
//   //     newValidationErrors.push(`Voucher is unbalanced by ${totals.difference.toLocaleString()}. Select a ${config.balanceLabel} for auto-balancing.`)
//   //   }

//   //   // =============================================
//   //   // SET ERRORS AND RETURN
//   //   // =============================================

//   //   setErrors(newErrors)
//   //   setValidationErrors(newValidationErrors)

//   //   const isValid = newValidationErrors.length === 0

//   //   if (!isValid) {
//   //     console.log('❌ Validation Failed:', newValidationErrors)
//   //   } else {
//   //     console.log('✅ Validation Passed')
//   //   }

//   //   return isValid

//   // }, [
//   //   formData,
//   //   journalDetails,
//   //   config,
//   //   voucherType,
//   //   linkedJournalId,
//   //   duplicateReceipts,
//   //   totals
//   // ])









//   const validateForm = useCallback(() => {
//   const newErrors: { [key: string]: string } = {}
//   const newValidationErrors: string[] = []

//   // Header validation
//   if (!formData.voucherNo || formData.voucherNo === config.prefix) {
//     newErrors.voucherNo = 'Voucher number is required'
//     newValidationErrors.push('Voucher number is required')
//   }

//   if (!formData.date) {
//     newErrors.date = 'Date is required'
//     newValidationErrors.push('Date is required')
//   }

//   if (!formData.coaId) {
//     newErrors.coaId = `${config.balanceLabel} is required`
//     newValidationErrors.push(`${config.balanceLabel} is required`)
//   }

//   // Linked Journal (Petty Cash only)
//   if (voucherType === 'pettycash' && !linkedJournalId) {
//     newErrors.linkedJournalId = 'Link to Journal Voucher is required'
//     newValidationErrors.push('Petty Cash must be linked to a Journal Voucher')
//   }

//   // Duplicate receipts within form (only check if receipts are entered)
//   if (duplicateReceipts.length > 0) {
//     newValidationErrors.push(`Duplicate receipt numbers in form: ${duplicateReceipts.join(', ')}`)
//   }

//   // Details validation
//   const entriesWithData = journalDetails.filter(d =>
//     d.coaId > 0 ||
//     (d.description && d.description.trim() !== '') ||
//     (d.amountDb && d.amountDb > 0) ||
//     (d.amountCr && d.amountCr > 0)
//   )

//   entriesWithData.forEach((detail, idx) => {
//     const actualIndex = journalDetails.findIndex(d => d.lineId === detail.lineId)
//     const rowNum = actualIndex + 1

//     // Account is required
//     if (!detail.coaId || detail.coaId === 0) {
//       newValidationErrors.push(`Row ${rowNum}: Account is required`)
//     }

//     // Description is required
//     if (!detail.description || detail.description.trim() === '') {
//       newValidationErrors.push(`Row ${rowNum}: Description is required`)
//     }

//     // ❌ REMOVED: Receipt is NOT required
//     // if (!detail.recieptNo?.trim()) {
//     //   newValidationErrors.push(`Row ${rowNum}: Receipt number is required`)
//     // }

//     // Debit OR Credit is required
//     const hasDebit = detail.amountDb && detail.amountDb > 0
//     const hasCredit = detail.amountCr && detail.amountCr > 0

//     if (!hasDebit && !hasCredit) {
//       newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
//     }
//   })

//   // Must have at least one complete entry
//   const completeEntries = journalDetails.filter(d =>
//     d.coaId > 0 &&
//     d.description &&
//     d.description.trim() !== '' &&
//     ((d.amountDb && d.amountDb > 0) || (d.amountCr && d.amountCr > 0))
//   )

//   if (completeEntries.length === 0) {
//     newValidationErrors.push('At least one complete entry is required')
//   }

//   setErrors(newErrors)
//   setValidationErrors(newValidationErrors)

//   return newValidationErrors.length === 0

// }, [formData, journalDetails, config, voucherType, linkedJournalId, duplicateReceipts])



//   // ==================== SUBMISSION ====================

//   const prepareSubmissionData = useCallback(() => {
//     const validEntries = journalDetails.filter(d =>
//       d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     let finalEntries = validEntries.map((entry, index) => ({
//       lineId: index + 1,
//       coaId: entry.coaId,
//       description: entry.description,
//       recieptNo: entry.recieptNo || null,
//       currencyId: entry.currencyId || null,
//       rate: entry.rate || 0,
//       ownDb: entry.ownDb || 0,
//       ownCr: entry.ownCr || 0,
//       amountDb: parseFloat(String(entry.amountDb)) || 0,
//       amountCr: parseFloat(String(entry.amountCr)) || 0,
//       idCard: entry.idCard || null,
//       bank: entry.bank || null,
//       bankDate: entry.bankDate || null,
//       status: entry.status !== undefined ? entry.status : true
//     }))

//     // Add auto-balance entry if needed
//     if (totals.difference > 0 && formData.coaId) {
//       finalEntries.push({
//         lineId: finalEntries.length + 1,
//         coaId: formData.coaId,
//         description: 'Auto Balancing Entry',
//         recieptNo: null,
//         currencyId: null,
//         rate: 0,
//         ownDb: 0,
//         ownCr: 0,
//         amountDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
//         amountCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
//         idCard: null,
//         bank: null,
//         bankDate: null,
//         status: true
//       })
//     }

//     return {
//       master: {
//         voucherNo: formData.voucherNo,
//         date: formData.date,
//         balacingId: formData.coaId,
//         voucherTypeId: config.type,
//         status: formData.status,
//         isOpening: isOpening,
//         linkedJournalId: voucherType === 'pettycash' ? linkedJournalId : null  // ✅ Include for Petty Cash only
//       },
//       details: finalEntries
//     }
//   }, [formData, journalDetails, totals, config.type, isOpening, voucherType, linkedJournalId])

//   const handleSaveClick = useCallback(() => {
//     if (!validateForm()) return

//     setConfirmModal({
//       isOpen: true,
//       type: 'save',
//       message: mode === 'create'
//         ? `Are you sure you want to create ${config.title} "${formData.voucherNo}"?`
//         : `Are you sure you want to update ${config.title} "${formData.voucherNo}"?`
//     })
//   }, [validateForm, mode, config.title, formData.voucherNo])

//   const handleCancelClick = useCallback(() => {
//     const hasChanges = formData.voucherNo !== config.prefix ||
//       journalDetails.some(d => d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0)

//     if (hasChanges) {
//       setConfirmModal({
//         isOpen: true,
//         type: 'cancel',
//         message: 'You have unsaved changes. Are you sure you want to cancel?'
//       })
//     } else {
//       router.push(config.listPath)
//     }
//   }, [formData.voucherNo, config.prefix, config.listPath, journalDetails, router])

//   const handleSubmit = async () => {
//     setApiError(null)
//     setConfirmModal({ isOpen: false, type: null, message: '' })

//     const submissionData = prepareSubmissionData()
//     console.log('📤 Submitting:', submissionData)

//     try {
//       if (mode === 'create') {
//         const result = await createVoucher(submissionData).unwrap()
//         console.log('✅ Created:', result)
//         router.push(config.listPath)
//       } else {
//         const result = await updateVoucher({
//           id: initialData?.master.id,
//           ...submissionData
//         }).unwrap()
//         console.log('✅ Updated:', result)
//         router.push(config.listPath)
//       }
//     } catch (error: any) {
//       console.error('❌ Error:', error)



//       if (error?.data?.errorCode === 'DUPLICATE_VOUCHER_NO') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, voucherNo: error.data.message }))
//       }
//       else if (error?.data?.errorCode === 'DUPLICATE_RECEIPT_NO') {
//         setApiError(error.data.message)
//       }
//       else if (error?.data?.errorCode === 'LINKED_JOURNAL_REQUIRED') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
//       } else if (error?.data?.errorCode === 'INVALID_LINKED_JOURNAL') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
//       } else if (error?.data?.message) {
//         setApiError(error.data.message)
//       } else {
//         setApiError('Failed to save voucher. Please try again.')
//       }
//     }
//   }

//   const handleConfirmAction = useCallback(() => {
//     if (confirmModal.type === 'save') {
//       handleSubmit()
//     } else if (confirmModal.type === 'cancel') {
//       router.push(config.listPath)
//     }
//   }, [confirmModal.type, config.listPath, router])

//   const handleCloseModal = useCallback(() => {
//     setConfirmModal({ isOpen: false, type: null, message: '' })
//   }, [])

//   // ==================== LOADING STATE ====================

//   if (coaLoading || currencyLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3] mx-auto mb-4" />
//           <p className="text-gray-500">Loading form data...</p>
//         </div>
//       </div>
//     )
//   }

//   // ==================== RENDER ====================

//   return (
//     <div className="max-w-full sm:max-w-6xl md:max-w-6xl lg:max-w-8xl xl:max-w-9xl 2xl:max-w-9xl mx-auto p-2">
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           {mode === 'create' ? `Create ${config.title}` : `Edit ${config.title}`}
//         </h1>
//         <p className="text-gray-500 mt-1">
//           {mode === 'create'
//             ? `Fill in the details to create a new ${config.title.toLowerCase()}`
//             : `Update the ${config.title.toLowerCase()} details`
//           }
//         </p>
//       </div>

//       {/* API Error */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <p className="text-red-700 font-medium">{apiError}</p>
//           </div>
//         </div>
//       )}

//       {/* Validation Errors */}
//       {validationErrors.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             Please fix the following errors:
//           </h3>
//           <ul className="list-disc list-inside text-red-700 space-y-1">
//             {validationErrors.map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Voucher Header - ✅ Updated props */}
//       <VoucherHeader
//         voucherType={voucherType}
//         formData={formData}
//         errors={errors}
//         isOpening={isOpening}
//         linkedJournalId={linkedJournalId}
//         onInputChange={handleInputChange}
//         onCoaChange={handleCoaChange}
//         onOpeningChange={handleOpeningChange}
//         onLinkedJournalChange={handleLinkedJournalChange}
//       />

//       {/* Voucher Details */}
//       {/* <VoucherDetails
//         journalDetails={journalDetails}
//         allCoaAccounts={allCoaAccounts}
//         currencyOptions={currencyOptions}
//         totals={totals}
//         balancingCoaId={formData.coaId}
//         onDetailChange={handleDetailChange}
//         onAddRow={handleAddRow}
//         onRemoveRow={handleRemoveRow}
//       /> */}

//       <VoucherDetails
//         voucherType={voucherType}  // ✅ Pass this
//         journalDetails={journalDetails}
//         currencyOptions={currencyOptions}
//         totals={totals}
//         balancingCoaId={formData.coaId}
//         duplicateReceipts={duplicateReceipts}
//         onDetailChange={handleDetailChange}
//         onAddRow={handleAddRow}
//         onRemoveRow={handleRemoveRow}
//         onCloneRow={handleCloneRow}
//       />








//       {/* Action Buttons */}
//       <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
//         <Button
//           variant="outline"
//           onClick={handleCancelClick}
//           disabled={isCreating || isUpdating}
//           icon={<X className="w-4 h-4" />}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={handleSaveClick}
//           disabled={isCreating || isUpdating}
//           icon={isCreating || isUpdating
//             ? <RefreshCw className="w-4 h-4 animate-spin" />
//             : <Save className="w-4 h-4" />
//           }
//         >
//           {isCreating || isUpdating
//             ? 'Saving...'
//             : mode === 'create'
//               ? `Create ${config.title}`
//               : `Update ${config.title}`
//           }
//         </Button>
//       </div>

//       {/* Confirmation Modal */}
//       {confirmModal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
//             <div className="flex items-center gap-3 mb-4">
//               {confirmModal.type === 'save' ? (
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <CheckCircle className="w-6 h-6 text-blue-600" />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-yellow-100 rounded-full">
//                   <AlertCircle className="w-6 h-6 text-yellow-600" />
//                 </div>
//               )}
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {confirmModal.type === 'save' ? 'Confirm Save' : 'Confirm Cancel'}
//               </h3>
//             </div>

//             <p className="text-gray-600 mb-6">{confirmModal.message}</p>

//             {confirmModal.type === 'save' && totals.difference > 0 && formData.coaId && (
//               <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-sm text-blue-700">
//                   <strong>Note:</strong> An auto-balancing entry of{' '}
//                   <span className="font-mono font-bold">{totals.difference.toLocaleString()}</span>{' '}
//                   will be added to balance the voucher.
//                 </p>
//               </div>
//             )}

//             <div className="flex justify-end gap-3">
//               <Button variant="outline" onClick={handleCloseModal}>
//                 No, Go Back
//               </Button>
//               <Button
//                 variant={confirmModal.type === 'save' ? 'primary' : 'danger'}
//                 onClick={handleConfirmAction}
//               >
//                 {confirmModal.type === 'save' ? 'Yes, Save' : 'Yes, Cancel'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherForm

































































































// // components/vouchers/VoucherForm.tsx bf cf

// 'use client'
// import React, { useState, useEffect, useMemo, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/Button'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
//   useGetBFRFQuery
// } from '@/store/slice/journalVoucherSlice'
// import { AlertCircle, RefreshCw, Save, X, CheckCircle } from 'lucide-react'

// // =============================================
// // TYPES
// // =============================================

// interface JournalDetail {
//   lineId: number
//   coaId: number
//   description: string
//   recieptNo?: string
//   currencyId?: number | null
//   rate?: number
//   ownDb?: number
//   ownCr?: number
//   amountDb: number
//   amountCr: number
//   idCard?: string
//   bank?: string
//   bankDate?: string | null
//   status: boolean
//   rate_raw?: string
//   ownDb_raw?: string
//   ownCr_raw?: string
//   amountDb_raw?: string
//   amountCr_raw?: string
//   isCurrencyLocked?: boolean
//   coaTypeId?: string | number
// }

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: { master: any; details: any[] }
// }

// // =============================================
// // EMPTY DETAIL TEMPLATE
// // =============================================

// const createEmptyDetail = (lineId: number): JournalDetail => ({
//   lineId,
//   coaId: 0,
//   description: '',
//   recieptNo: '',
//   currencyId: null,
//   rate: 0,
//   ownDb: 0,
//   ownCr: 0,
//   amountDb: 0,
//   amountCr: 0,
//   idCard: '',
//   bank: '',
//   bankDate: null,
//   status: true
// })

// // =============================================
// // COMPONENT
// // =============================================

// export const VoucherForm: React.FC<VoucherFormProps> = ({
//   mode,
//   voucherType,
//   initialData
// }) => {
//   const router = useRouter()

//   console.log('🚀 VoucherForm Mounted:', { mode, voucherType, hasInitialData: !!initialData })

//   // =============================================
//   // CONFIG
//   // =============================================

//   const config = useMemo(() => {
//     const configs = {
//       journal: {
//         title: 'Journal Voucher',
//         type: 10,
//         coaFilter: 'isJvBalance',
//         balanceLabel: 'Journal Balance Account',
//         prefix: 'JV-',
//         listPath: '/vouchers/journal'
//       },
//       pettycash: {
//         title: 'Petty Cash Voucher',
//         type: 14,
//         coaFilter: 'isPettyCash',
//         balanceLabel: 'Petty Cash Account',
//         prefix: 'PC-',
//         listPath: '/vouchers/petty'
//       }
//     }
//     console.log('📋 Config loaded for:', voucherType, configs[voucherType])
//     return configs[voucherType]
//   }, [voucherType])

//   // =============================================
//   // STATE
//   // =============================================

//   const [duplicateReceipts, setDuplicateReceipts] = useState<string[]>([])

//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false
//   })

//   const [isOpening, setIsOpening] = useState(false)
//   const [linkedJournalId, setLinkedJournalId] = useState<number | null>(null)
//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([createEmptyDetail(1)])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [apiError, setApiError] = useState<string | null>(null)

//   const [confirmModal, setConfirmModal] = useState<{
//     isOpen: boolean
//     type: 'save' | 'cancel' | null
//     message: string
//   }>({
//     isOpen: false,
//     type: null,
//     message: ''
//   })

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()
//   const { data: coaData = [], isLoading: coaLoading } = useGetCoaAccountsQuery()
//   const { data: currencyData = [], isLoading: currencyLoading } = useGetCurrenciesQuery()

//   // ✅ Fetch BF when balancing COA is selected
//   const {
//     data: bfData,
//     isLoading: bfLoading,
//     refetch: refetchBF
//   } = useGetBFRFQuery(formData.coaId, {
//     skip: !formData.coaId || (voucherType !== 'journal' && voucherType !== 'pettycash')
//   })

//   // =============================================
//   // MEMOIZED DATA
//   // =============================================

//   const allCoaAccounts = useMemo(() => {
//     return coaData.map((coa: any) => ({
//       id: coa.id,
//       label: `${coa.acCode} - ${coa.acName}`,
//       acCode: coa.acCode || `COA-${coa.id}`,
//       acName: coa.acName || 'Unknown'
//     }))
//   }, [coaData])

//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencyData)) return []
//     return currencyData.map((currency: any) => ({
//       id: currency.id,
//       label: currency.currencyName || currency.name,
//       currencyName: currency.currencyName || currency.name
//     }))
//   }, [currencyData])

//   const totals = useMemo(() => {
//     const validEntries = journalDetails.filter(d =>
//       d.coaId > 0 && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     const debitTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountDb)) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountCr)) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     const result = {
//       debitTotal: Math.round(debitTotal * 100) / 100,
//       creditTotal: Math.round(creditTotal * 100) / 100,
//       difference: Math.round(difference * 100) / 100
//     }

//     console.log('💰 Totals calculated:', result)
//     return result
//   }, [journalDetails])

//   // ✅ Calculate BF and CF
//   const { bf, cf } = useMemo(() => {
//     const bfValue = bfData?.bf || 0

//     let cfValue = bfValue

//     if (totals.difference > 0 && formData.coaId) {
//       if (totals.debitTotal > totals.creditTotal) {
//         // Auto balance is Credit → Add to BF
//         cfValue = bfValue + totals.difference
//       } else {
//         // Auto balance is Debit → Subtract from BF
//         cfValue = bfValue - totals.difference
//       }
//     }

//     console.log('📊 BF/CF calculated:', { bf: bfValue, cf: cfValue, bfData })
//     return { bf: bfValue, cf: cfValue }
//   }, [bfData, totals, formData.coaId])

//   // =============================================
//   // EFFECTS
//   // =============================================

//   // Initialize for create mode
//   useEffect(() => {
//     if (mode === 'create') {
//       console.log('🆕 Initializing create mode')
//       setFormData(prev => ({
//         ...prev,
//         voucherNo: config.prefix
//       }))
//       setJournalDetails([createEmptyDetail(1)])
//       setIsOpening(false)
//       setLinkedJournalId(null)
//     }
//   }, [mode, config.prefix])

//   // Load data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialData) {
//       console.log('📝 Loading edit data:', initialData)

//       setFormData({
//         voucherNo: initialData.master.voucherNo || config.prefix,
//         date: initialData.master.date
//           ? initialData.master.date.split('T')[0]
//           : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status || false
//       })

//       setIsOpening(initialData.master.isOpening || false)
//       setLinkedJournalId(initialData.master.linkedJournalId || null)

//       // Filter out auto-balance entries
//       const manualEntries = initialData.details.filter((detail: any) => {
//         const description = detail.description?.toLowerCase().trim() || ''
//         return !['auto balancing entry', 'auto balance entry', 'balancing entry', 'system generated']
//           .some(match => description.includes(match))
//       })

//       if (manualEntries.length > 0) {
//         setJournalDetails(manualEntries.map((detail: any, index: number) => ({
//           lineId: index + 1,
//           coaId: detail.coaId || 0,
//           description: detail.description || '',
//           recieptNo: detail.recieptNo || '',
//           currencyId: detail.currencyId || null,
//           rate: detail.rate || 0,
//           ownDb: detail.ownDb || 0,
//           ownCr: detail.ownCr || 0,
//           amountDb: detail.amountDb || 0,
//           amountCr: detail.amountCr || 0,
//           idCard: detail.idCard || '',
//           bank: detail.bank || '',
//           bankDate: detail.bankDate || null,
//           status: detail.status !== undefined ? detail.status : true
//         })))
//       } else {
//         setJournalDetails([createEmptyDetail(1)])
//       }
//     }
//   }, [mode, initialData, config.prefix])

//   // Track duplicate receipts
//   useEffect(() => {
//     const receiptCounts: { [key: string]: number } = {}

//     journalDetails.forEach(detail => {
//       const receipt = detail.recieptNo?.trim()
//       if (receipt) {
//         receiptCounts[receipt] = (receiptCounts[receipt] || 0) + 1
//       }
//     })

//     const duplicates = Object.entries(receiptCounts)
//       .filter(([_, count]) => count > 1)
//       .map(([receipt, _]) => receipt)

//     if (duplicates.length > 0) {
//       console.log('⚠️ Duplicate receipts found:', duplicates)
//     }
//     setDuplicateReceipts(duplicates)
//   }, [journalDetails])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   // ✅ Handle form data change (for VoucherHeader)
//   const handleFormDataChange = useCallback((field: string, value: any) => {
//     console.log('📝 Form Data Change:', field, value)

//     if (field === 'voucherNo') {
//       let newValue = value
//       const prefix = config.prefix

//       if (!newValue.startsWith(prefix)) {
//         const withoutAnyPrefix = newValue.replace(/^(JV-|PC-)/i, '')
//         newValue = prefix + withoutAnyPrefix
//       }

//       setFormData(prev => ({ ...prev, voucherNo: newValue }))
//     } else {
//       setFormData(prev => ({ ...prev, [field]: value }))
//     }

//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
//     if (apiError) setApiError(null)
//   }, [config.prefix, errors, apiError])

//   // ✅ Handle COA change
//   const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     console.log('📝 COA Change:', selectedId, selectedOption)
//     setFormData(prev => ({
//       ...prev,
//       coaId: selectedId ? Number(selectedId) : null
//     }))
//     if (errors.coaId) setErrors(prev => ({ ...prev, coaId: '' }))
//   }, [errors.coaId])

//   // ✅ Handle linked journal change
//   const handleLinkedJournalChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     console.log('📝 Linked Journal Change:', selectedId, selectedOption)
//     setLinkedJournalId(selectedId ? Number(selectedId) : null)
//     if (errors.linkedJournalId) setErrors(prev => ({ ...prev, linkedJournalId: '' }))
//   }, [errors])

//   // ✅ Handle opening change
//   const handleIsOpeningChange = useCallback((checked: boolean) => {
//     console.log('📝 Is Opening Change:', checked)
//     setIsOpening(checked)
//   }, [])

//   // ✅ Handle detail change
//   const handleDetailChange = useCallback((index: number, field: string, value: any) => {
//     console.log('📝 Detail Change - Row:', index, 'Field:', field, 'Value:', value)
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }, [])

//   // ✅ Handle add row
//   const handleAddRow = useCallback(() => {
//     console.log('➕ Adding new row')
//     setJournalDetails(prev => [...prev, createEmptyDetail(prev.length + 1)])
//   }, [])

//   // ✅ Handle remove row
//   const handleRemoveRow = useCallback((index: number) => {
//     if (journalDetails.length <= 1) {
//       console.log('⚠️ Cannot remove last row')
//       return
//     }
//     console.log('🗑️ Removing row:', index)
//     setJournalDetails(prev => {
//       const updated = prev.filter((_, i) => i !== index)
//       return updated.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [journalDetails.length])

//   // ✅ Handle clone row
//   const handleCloneRow = useCallback((index: number) => {
//     console.log('📋 Cloning row:', index)
//     setJournalDetails(prev => {
//       const rowToClone = prev[index]

//       let newReceiptNo = rowToClone.recieptNo || ''
//       if (newReceiptNo) {
//         newReceiptNo = newReceiptNo + 'R'
//       }

//       const clonedRow: JournalDetail = {
//         ...rowToClone,
//         lineId: prev.length + 1,
//         recieptNo: newReceiptNo,
//         // Reverse Debit and Credit
//         amountDb: rowToClone.amountCr || 0,
//         amountCr: rowToClone.amountDb || 0,
//         ownDb: rowToClone.ownCr || 0,
//         ownCr: rowToClone.ownDb || 0,
//         // Clear raw values
//         amountDb_raw: undefined,
//         amountCr_raw: undefined,
//         ownDb_raw: undefined,
//         ownCr_raw: undefined,
//       }

//       const newDetails = [...prev]
//       newDetails.splice(index + 1, 0, clonedRow)

//       return newDetails.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validateForm = useCallback(() => {
//     console.log('🔍 Validating form...')
//     const newErrors: { [key: string]: string } = {}
//     const newValidationErrors: string[] = []

//     // Header validation
//     if (!formData.voucherNo || formData.voucherNo === config.prefix) {
//       newErrors.voucherNo = 'Voucher number is required'
//       newValidationErrors.push('Voucher number is required')
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//       newValidationErrors.push('Date is required')
//     }

//     if (!formData.coaId) {
//       newErrors.coaId = `${config.balanceLabel} is required`
//       newValidationErrors.push(`${config.balanceLabel} is required`)
//     }

//     // Linked Journal (Petty Cash only)
//     if (voucherType === 'pettycash' && !linkedJournalId) {
//       newErrors.linkedJournalId = 'Link to Journal Voucher is required'
//       newValidationErrors.push('Petty Cash must be linked to a Journal Voucher')
//     }

//     // Duplicate receipts within form
//     if (duplicateReceipts.length > 0) {
//       newValidationErrors.push(`Duplicate receipt numbers in form: ${duplicateReceipts.join(', ')}`)
//     }

//     // Details validation
//     const entriesWithData = journalDetails.filter(d =>
//       d.coaId > 0 ||
//       (d.description && d.description.trim() !== '') ||
//       (d.amountDb && d.amountDb > 0) ||
//       (d.amountCr && d.amountCr > 0)
//     )

//     entriesWithData.forEach((detail, idx) => {
//       const actualIndex = journalDetails.findIndex(d => d.lineId === detail.lineId)
//       const rowNum = actualIndex + 1

//       if (!detail.coaId || detail.coaId === 0) {
//         newValidationErrors.push(`Row ${rowNum}: Account is required`)
//       }

//       if (!detail.description || detail.description.trim() === '') {
//         newValidationErrors.push(`Row ${rowNum}: Description is required`)
//       }

//       const hasDebit = detail.amountDb && detail.amountDb > 0
//       const hasCredit = detail.amountCr && detail.amountCr > 0

//       if (!hasDebit && !hasCredit) {
//         newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
//       }
//     })

//     // Must have at least one complete entry
//     const completeEntries = journalDetails.filter(d =>
//       d.coaId > 0 &&
//       d.description &&
//       d.description.trim() !== '' &&
//       ((d.amountDb && d.amountDb > 0) || (d.amountCr && d.amountCr > 0))
//     )

//     if (completeEntries.length === 0) {
//       newValidationErrors.push('At least one complete entry is required')
//     }

//     setErrors(newErrors)
//     setValidationErrors(newValidationErrors)

//     const isValid = newValidationErrors.length === 0

//     if (!isValid) {
//       console.log('❌ Validation Failed:', newValidationErrors)
//     } else {
//       console.log('✅ Validation Passed')
//     }

//     return isValid
//   }, [formData, journalDetails, config, voucherType, linkedJournalId, duplicateReceipts])

//   // =============================================
//   // SUBMISSION
//   // =============================================

//   const prepareSubmissionData = useCallback(() => {
//     const validEntries = journalDetails.filter(d =>
//       d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     let finalEntries = validEntries.map((entry, index) => ({
//       lineId: index + 1,
//       coaId: entry.coaId,
//       description: entry.description,
//       recieptNo: entry.recieptNo || null,
//       currencyId: entry.currencyId || null,
//       rate: entry.rate || 0,
//       ownDb: entry.ownDb || 0,
//       ownCr: entry.ownCr || 0,
//       amountDb: parseFloat(String(entry.amountDb)) || 0,
//       amountCr: parseFloat(String(entry.amountCr)) || 0,
//       idCard: entry.idCard || null,
//       bank: entry.bank || null,
//       bankDate: entry.bankDate || null,
//       status: entry.status !== undefined ? entry.status : true
//     }))

//     // Add auto-balance entry if needed
//     if (totals.difference > 0 && formData.coaId) {
//       console.log('➕ Adding auto-balance entry:', totals.difference)
//       finalEntries.push({
//         lineId: finalEntries.length + 1,
//         coaId: formData.coaId,
//         description: 'Auto Balancing Entry',
//         recieptNo: null,
//         currencyId: null,
//         rate: 0,
//         ownDb: 0,
//         ownCr: 0,
//         amountDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
//         amountCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
//         idCard: null,
//         bank: null,
//         bankDate: null,
//         status: true
//       })
//     }

//     const submissionData = {
//       master: {
//         voucherNo: formData.voucherNo,
//         date: formData.date,
//         balacingId: formData.coaId,
//         voucherTypeId: config.type,
//         status: formData.status,
//         isOpening: isOpening,
//         linkedJournalId: voucherType === 'pettycash' ? linkedJournalId : null
//       },
//       details: finalEntries
//     }

//     console.log('📤 Prepared submission data:', submissionData)
//     return submissionData
//   }, [formData, journalDetails, totals, config.type, isOpening, voucherType, linkedJournalId])

//   const handleSaveClick = useCallback(() => {
//     console.log('💾 Save clicked')
//     if (!validateForm()) return

//     setConfirmModal({
//       isOpen: true,
//       type: 'save',
//       message: mode === 'create'
//         ? `Are you sure you want to create ${config.title} "${formData.voucherNo}"?`
//         : `Are you sure you want to update ${config.title} "${formData.voucherNo}"?`
//     })
//   }, [validateForm, mode, config.title, formData.voucherNo])

//   const handleCancelClick = useCallback(() => {
//     console.log('❌ Cancel clicked')
//     const hasChanges = formData.voucherNo !== config.prefix ||
//       journalDetails.some(d => d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0)

//     if (hasChanges) {
//       setConfirmModal({
//         isOpen: true,
//         type: 'cancel',
//         message: 'You have unsaved changes. Are you sure you want to cancel?'
//       })
//     } else {
//       router.push(config.listPath)
//     }
//   }, [formData.voucherNo, config.prefix, config.listPath, journalDetails, router])

//   const handleSubmit = async () => {
//     console.log('🚀 Submitting...')
//     setApiError(null)
//     setConfirmModal({ isOpen: false, type: null, message: '' })

//     const submissionData = prepareSubmissionData()

//     try {
//       if (mode === 'create') {
//         const result = await createVoucher(submissionData).unwrap()
//         console.log('✅ Created successfully:', result)
//         router.push(config.listPath)
//       } else {
//         const result = await updateVoucher({
//           id: initialData?.master.id,
//           ...submissionData
//         }).unwrap()
//         console.log('✅ Updated successfully:', result)
//         router.push(config.listPath)
//       }
//     } catch (error: any) {
//       console.error('❌ Submit Error:', error)

//       if (error?.data?.errorCode === 'DUPLICATE_VOUCHER_NO') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, voucherNo: error.data.message }))
//       } else if (error?.data?.errorCode === 'DUPLICATE_RECEIPT_NO') {
//         setApiError(error.data.message)
//       } else if (error?.data?.errorCode === 'LINKED_JOURNAL_REQUIRED') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
//       } else if (error?.data?.errorCode === 'INVALID_LINKED_JOURNAL') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
//       } else if (error?.data?.message) {
//         setApiError(error.data.message)
//       } else {
//         setApiError('Failed to save voucher. Please try again.')
//       }
//     }
//   }

//   const handleConfirmAction = useCallback(() => {
//     if (confirmModal.type === 'save') {
//       handleSubmit()
//     } else if (confirmModal.type === 'cancel') {
//       router.push(config.listPath)
//     }
//   }, [confirmModal.type, config.listPath, router])

//   const handleCloseModal = useCallback(() => {
//     setConfirmModal({ isOpen: false, type: null, message: '' })
//   }, [])

//   // =============================================
//   // LOADING STATE
//   // =============================================

//   if (coaLoading || currencyLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3] mx-auto mb-4" />
//           <p className="text-gray-500">Loading form data...</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-full sm:max-w-6xl md:max-w-6xl lg:max-w-8xl xl:max-w-9xl 2xl:max-w-9xl mx-auto p-2">
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           {mode === 'create' ? `Create ${config.title}` : `Edit ${config.title}`}
//         </h1>
//         <p className="text-gray-500 mt-1">
//           {mode === 'create'
//             ? `Fill in the details to create a new ${config.title.toLowerCase()}`
//             : `Update the ${config.title.toLowerCase()} details`
//           }
//         </p>
//       </div>

//       {/* Debug Info */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono">
//           <p><strong>Debug:</strong> voucherType={voucherType} | coaId={formData.coaId} | BF={bf} | CF={cf} | bfLoading={String(bfLoading)}</p>
//         </div>
//       )}

//       {/* API Error */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <p className="text-red-700 font-medium">{apiError}</p>
//           </div>
//         </div>
//       )}

//       {/* Validation Errors */}
//       {validationErrors.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             Please fix the following errors:
//           </h3>
//           <ul className="list-disc list-inside text-red-700 space-y-1">
//             {validationErrors.map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* ✅ Voucher Header - FIXED PROPS */}
//       <VoucherHeader
//         voucherType={voucherType}
//         formData={formData}
//         config={config}                          // ✅ ADDED
//         errors={errors}
//         isOpening={isOpening}
//         linkedJournalId={linkedJournalId}
//         onFormDataChange={handleFormDataChange}  // ✅ RENAMED
//         onCoaChange={handleCoaChange}
//         onIsOpeningChange={handleIsOpeningChange} // ✅ RENAMED
//         onLinkedJournalChange={handleLinkedJournalChange}
//         bf={bf}
//         cf={cf}
//         bfLoading={bfLoading}
//       />

//       {/* Voucher Details */}
//       <VoucherDetails
//         voucherType={voucherType}
//         journalDetails={journalDetails}
//         currencyOptions={currencyOptions}
//         totals={totals}
//         balancingCoaId={formData.coaId}
//         duplicateReceipts={duplicateReceipts}
//         onDetailChange={handleDetailChange}
//         onAddRow={handleAddRow}
//         onRemoveRow={handleRemoveRow}
//         onCloneRow={handleCloneRow}
//       />

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
//         <Button
//           variant="outline"
//           onClick={handleCancelClick}
//           disabled={isCreating || isUpdating}
//           icon={<X className="w-4 h-4" />}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={handleSaveClick}
//           disabled={isCreating || isUpdating}
//           icon={isCreating || isUpdating
//             ? <RefreshCw className="w-4 h-4 animate-spin" />
//             : <Save className="w-4 h-4" />
//           }
//         >
//           {isCreating || isUpdating
//             ? 'Saving...'
//             : mode === 'create'
//               ? `Create ${config.title}`
//               : `Update ${config.title}`
//           }
//         </Button>
//       </div>

//       {/* Confirmation Modal */}
//       {confirmModal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
//             <div className="flex items-center gap-3 mb-4">
//               {confirmModal.type === 'save' ? (
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <CheckCircle className="w-6 h-6 text-blue-600" />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-yellow-100 rounded-full">
//                   <AlertCircle className="w-6 h-6 text-yellow-600" />
//                 </div>
//               )}
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {confirmModal.type === 'save' ? 'Confirm Save' : 'Confirm Cancel'}
//               </h3>
//             </div>

//             <p className="text-gray-600 mb-6">{confirmModal.message}</p>

//             {confirmModal.type === 'save' && totals.difference > 0 && formData.coaId && (
//               <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-sm text-blue-700">
//                   <strong>Note:</strong> An auto-balancing entry of{' '}
//                   <span className="font-mono font-bold">{totals.difference.toLocaleString()}</span>{' '}
//                   will be added to balance the voucher.
//                 </p>
//               </div>
//             )}

//             <div className="flex justify-end gap-3">
//               <Button variant="outline" onClick={handleCloseModal}>
//                 No, Go Back
//               </Button>
//               <Button
//                 variant={confirmModal.type === 'save' ? 'primary' : 'danger'}
//                 onClick={handleConfirmAction}
//               >
//                 {confirmModal.type === 'save' ? 'Yes, Save' : 'Yes, Cancel'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherForm





















































// // components/vouchers/VoucherForm.tsx

// 'use client'
// import React, { useState, useEffect, useMemo, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/Button'
// import VoucherHeader from './VoucherHeader'
// import VoucherDetails from './VoucherDetails'
// import {
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
//   useGetBFRFQuery
// } from '@/store/slice/journalVoucherSlice'
// import { AlertCircle, RefreshCw, Save, X, CheckCircle } from 'lucide-react'

// // =============================================
// // TYPES
// // =============================================

// interface JournalDetail {
//   lineId: number
//   coaId: number
//   description: string
//   recieptNo?: string
//   currencyId?: number | null
//   rate?: number
//   ownDb?: number
//   ownCr?: number
//   amountDb: number
//   amountCr: number
//   idCard?: string
//   bank?: string
//   bankDate?: string | null
//   status: boolean
//   rate_raw?: string
//   ownDb_raw?: string
//   ownCr_raw?: string
//   amountDb_raw?: string
//   amountCr_raw?: string
//   isCurrencyLocked?: boolean
//   coaTypeId?: string | number
// }

// interface VoucherFormProps {
//   mode: 'create' | 'edit'
//   voucherType: 'journal' | 'pettycash'
//   initialData?: { master: any; details: any[] }
// }

// // =============================================
// // EMPTY DETAIL TEMPLATE
// // =============================================

// const createEmptyDetail = (lineId: number): JournalDetail => ({
//   lineId,
//   coaId: 0,
//   description: '',
//   recieptNo: '',
//   currencyId: null,
//   rate: 0,
//   ownDb: 0,
//   ownCr: 0,
//   amountDb: 0,
//   amountCr: 0,
//   idCard: '',
//   bank: '',
//   bankDate: null,
//   status: true
// })

// // =============================================
// // COMPONENT
// // =============================================

// export const VoucherForm: React.FC<VoucherFormProps> = ({
//   mode,
//   voucherType,
//   initialData
// }) => {
//   const router = useRouter()

//   console.log('🚀 VoucherForm Mounted:', { mode, voucherType, hasInitialData: !!initialData })

//   // =============================================
//   // CONFIG
//   // =============================================

//   const config = useMemo(() => {
//     const configs = {
//       journal: {
//         title: 'Journal Voucher',
//         type: 10,
//         coaFilter: 'isJvBalance',
//         balanceLabel: 'Journal Balance Account',
//         prefix: 'JV-',
//         listPath: '/vouchers/journal'
//       },
//       pettycash: {
//         title: 'Petty Cash Voucher',
//         type: 14,
//         coaFilter: 'isPettyCash',
//         balanceLabel: 'Petty Cash Account',
//         prefix: 'PC-',
//         listPath: '/vouchers/petty'
//       }
//     }
//     console.log('📋 Config loaded for:', voucherType, configs[voucherType])
//     return configs[voucherType]
//   }, [voucherType])

//   // =============================================
//   // STATE
//   // =============================================

//   const [duplicateReceipts, setDuplicateReceipts] = useState<string[]>([])

//   const [formData, setFormData] = useState({
//     voucherNo: '',
//     date: new Date().toISOString().split('T')[0],
//     coaId: null as number | null,
//     status: false
//   })

//   const [isOpening, setIsOpening] = useState(false)
//   const [linkedJournalId, setLinkedJournalId] = useState<number | null>(null)
//   const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([createEmptyDetail(1)])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [apiError, setApiError] = useState<string | null>(null)

//   const [confirmModal, setConfirmModal] = useState<{
//     isOpen: boolean
//     type: 'save' | 'cancel' | null
//     message: string
//   }>({
//     isOpen: false,
//     type: null,
//     message: ''
//   })

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
//   const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()
//   const { data: coaData = [], isLoading: coaLoading } = useGetCoaAccountsQuery()
//   const { data: currencyData = [], isLoading: currencyLoading } = useGetCurrenciesQuery()

//   // ✅ Fetch BF when balancing COA is selected
//   const {
//     data: bfData,
//     isLoading: bfLoading,
//     refetch: refetchBF
//   } = useGetBFRFQuery(formData.coaId, {
//     skip: !formData.coaId || (voucherType !== 'journal' && voucherType !== 'pettycash')
//   })

//   // =============================================
//   // MEMOIZED DATA
//   // =============================================

//   const allCoaAccounts = useMemo(() => {
//     return coaData.map((coa: any) => ({
//       id: coa.id,
//       label: `${coa.acCode} - ${coa.acName}`,
//       acCode: coa.acCode || `COA-${coa.id}`,
//       acName: coa.acName || 'Unknown'
//     }))
//   }, [coaData])

//   const currencyOptions = useMemo(() => {
//     if (!Array.isArray(currencyData)) return []
//     return currencyData.map((currency: any) => ({
//       id: currency.id,
//       label: currency.currencyName || currency.name,
//       currencyName: currency.currencyName || currency.name
//     }))
//   }, [currencyData])

//   const totals = useMemo(() => {
//     const validEntries = journalDetails.filter(d =>
//       d.coaId > 0 && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     const debitTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountDb)) || 0), 0)
//     const creditTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountCr)) || 0), 0)
//     const difference = Math.abs(debitTotal - creditTotal)

//     const result = {
//       debitTotal: Math.round(debitTotal * 100) / 100,
//       creditTotal: Math.round(creditTotal * 100) / 100,
//       difference: Math.round(difference * 100) / 100
//     }

//     console.log('💰 Totals calculated:', result)
//     return result
//   }, [journalDetails])

//   // ✅ Calculate BF, CF, allTotals, coaTotals
//   const { bf, cf, allTotals, coaTotals } = useMemo(() => {
//     // Default values
//     const defaultAllTotals = { debit: 0, credit: 0, difference: 0 }
//     const defaultCoaTotals = null

//     // Get values from API response
//     const bfValue = bfData?.bf || 0
//     const allTotalsValue = bfData?.allTotals || defaultAllTotals
//     const coaTotalsValue = bfData?.coaTotals || defaultCoaTotals

//     // Calculate CF
//     let cfValue = bfValue

//     if (totals.difference > 0 && formData.coaId) {
//       if (totals.debitTotal > totals.creditTotal) {
//         // Auto balance is Credit → Add to BF
//         cfValue = bfValue + totals.difference
//       } else {
//         // Auto balance is Debit → Subtract from BF
//         cfValue = bfValue - totals.difference
//       }
//     }

//     console.log('📊 BF/CF calculated:', {
//       bf: bfValue,
//       cf: cfValue,
//       allTotals: allTotalsValue,
//       coaTotals: coaTotalsValue
//     })

//     return {
//       bf: bfValue,
//       cf: cfValue,
//       allTotals: allTotalsValue,
//       coaTotals: coaTotalsValue
//     }
//   }, [bfData, totals, formData.coaId])

//   // =============================================
//   // EFFECTS
//   // =============================================

//   // Initialize for create mode
//   useEffect(() => {
//     if (mode === 'create') {
//       console.log('🆕 Initializing create mode')
//       setFormData(prev => ({
//         ...prev,
//         voucherNo: config.prefix
//       }))
//       setJournalDetails([createEmptyDetail(1)])
//       setIsOpening(false)
//       setLinkedJournalId(null)
//     }
//   }, [mode, config.prefix])

//   // Load data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialData) {
//       console.log('📝 Loading edit data:', initialData)

//       setFormData({
//         voucherNo: initialData.master.voucherNo || config.prefix,
//         date: initialData.master.date
//           ? initialData.master.date.split('T')[0]
//           : new Date().toISOString().split('T')[0],
//         coaId: initialData.master.balacingId || null,
//         status: initialData.master.status || false
//       })

//       setIsOpening(initialData.master.isOpening || false)
//       setLinkedJournalId(initialData.master.linkedJournalId || null)

//       // Filter out auto-balance entries
//       const manualEntries = initialData.details.filter((detail: any) => {
//         const description = detail.description?.toLowerCase().trim() || ''
//         return !['auto balancing entry', 'auto balance entry', 'balancing entry', 'system generated']
//           .some(match => description.includes(match))
//       })

//       if (manualEntries.length > 0) {
//         setJournalDetails(manualEntries.map((detail: any, index: number) => ({
//           lineId: index + 1,
//           coaId: detail.coaId || 0,
//           description: detail.description || '',
//           recieptNo: detail.recieptNo || '',
//           currencyId: detail.currencyId || null,
//           rate: detail.rate || 0,
//           ownDb: detail.ownDb || 0,
//           ownCr: detail.ownCr || 0,
//           amountDb: detail.amountDb || 0,
//           amountCr: detail.amountCr || 0,
//           idCard: detail.idCard || '',
//           bank: detail.bank || '',
//           bankDate: detail.bankDate || null,
//           status: detail.status !== undefined ? detail.status : true
//         })))
//       } else {
//         setJournalDetails([createEmptyDetail(1)])
//       }
//     }
//   }, [mode, initialData, config.prefix])

//   // Track duplicate receipts
//   useEffect(() => {
//     const receiptCounts: { [key: string]: number } = {}

//     journalDetails.forEach(detail => {
//       const receipt = detail.recieptNo?.trim()
//       if (receipt) {
//         receiptCounts[receipt] = (receiptCounts[receipt] || 0) + 1
//       }
//     })

//     const duplicates = Object.entries(receiptCounts)
//       .filter(([_, count]) => count > 1)
//       .map(([receipt, _]) => receipt)

//     if (duplicates.length > 0) {
//       console.log('⚠️ Duplicate receipts found:', duplicates)
//     }
//     setDuplicateReceipts(duplicates)
//   }, [journalDetails])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   // ✅ Handle form data change (for VoucherHeader)
//   const handleFormDataChange = useCallback((field: string, value: any) => {
//     console.log('📝 Form Data Change:', field, value)

//     if (field === 'voucherNo') {
//       let newValue = value
//       const prefix = config.prefix

//       if (!newValue.startsWith(prefix)) {
//         const withoutAnyPrefix = newValue.replace(/^(JV-|PC-)/i, '')
//         newValue = prefix + withoutAnyPrefix
//       }

//       setFormData(prev => ({ ...prev, voucherNo: newValue }))
//     } else {
//       setFormData(prev => ({ ...prev, [field]: value }))
//     }

//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
//     if (apiError) setApiError(null)
//   }, [config.prefix, errors, apiError])

//   // ✅ Handle COA change
//   const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     console.log('📝 COA Change:', selectedId, selectedOption)
//     setFormData(prev => ({
//       ...prev,
//       coaId: selectedId ? Number(selectedId) : null
//     }))
//     if (errors.coaId) setErrors(prev => ({ ...prev, coaId: '' }))
//   }, [errors.coaId])

//   // ✅ Handle linked journal change
//   const handleLinkedJournalChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     console.log('📝 Linked Journal Change:', selectedId, selectedOption)
//     setLinkedJournalId(selectedId ? Number(selectedId) : null)
//     if (errors.linkedJournalId) setErrors(prev => ({ ...prev, linkedJournalId: '' }))
//   }, [errors])

//   // ✅ Handle opening change
//   const handleIsOpeningChange = useCallback((checked: boolean) => {
//     console.log('📝 Is Opening Change:', checked)
//     setIsOpening(checked)
//   }, [])

//   // ✅ Handle detail change
//   const handleDetailChange = useCallback((index: number, field: string, value: any) => {
//     console.log('📝 Detail Change - Row:', index, 'Field:', field, 'Value:', value)
//     setJournalDetails(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }, [])

//   // ✅ Handle add row
//   const handleAddRow = useCallback(() => {
//     console.log('➕ Adding new row')
//     setJournalDetails(prev => [...prev, createEmptyDetail(prev.length + 1)])
//   }, [])

//   // ✅ Handle remove row
//   const handleRemoveRow = useCallback((index: number) => {
//     if (journalDetails.length <= 1) {
//       console.log('⚠️ Cannot remove last row')
//       return
//     }
//     console.log('🗑️ Removing row:', index)
//     setJournalDetails(prev => {
//       const updated = prev.filter((_, i) => i !== index)
//       return updated.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [journalDetails.length])

//   // ✅ Handle clone row
//   const handleCloneRow = useCallback((index: number) => {
//     console.log('📋 Cloning row:', index)
//     setJournalDetails(prev => {
//       const rowToClone = prev[index]

//       let newReceiptNo = rowToClone.recieptNo || ''
//       if (newReceiptNo) {
//         newReceiptNo = newReceiptNo + 'R'
//       }

//       const clonedRow: JournalDetail = {
//         ...rowToClone,
//         lineId: prev.length + 1,
//         recieptNo: newReceiptNo,
//         // Reverse Debit and Credit
//         amountDb: rowToClone.amountCr || 0,
//         amountCr: rowToClone.amountDb || 0,
//         ownDb: rowToClone.ownCr || 0,
//         ownCr: rowToClone.ownDb || 0,
//         // Clear raw values
//         amountDb_raw: undefined,
//         amountCr_raw: undefined,
//         ownDb_raw: undefined,
//         ownCr_raw: undefined,
//       }

//       const newDetails = [...prev]
//       newDetails.splice(index + 1, 0, clonedRow)

//       return newDetails.map((detail, i) => ({ ...detail, lineId: i + 1 }))
//     })
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validateForm = useCallback(() => {
//     console.log('🔍 Validating form...')
//     const newErrors: { [key: string]: string } = {}
//     const newValidationErrors: string[] = []

//     // Header validation
//     if (!formData.voucherNo || formData.voucherNo === config.prefix) {
//       newErrors.voucherNo = 'Voucher number is required'
//       newValidationErrors.push('Voucher number is required')
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//       newValidationErrors.push('Date is required')
//     }

//     if (!formData.coaId) {
//       newErrors.coaId = `${config.balanceLabel} is required`
//       newValidationErrors.push(`${config.balanceLabel} is required`)
//     }

//     // Linked Journal (Petty Cash only)
//     if (voucherType === 'pettycash' && !linkedJournalId) {
//       newErrors.linkedJournalId = 'Link to Journal Voucher is required'
//       newValidationErrors.push('Petty Cash must be linked to a Journal Voucher')
//     }

//     // Duplicate receipts within form
//     if (duplicateReceipts.length > 0) {
//       newValidationErrors.push(`Duplicate receipt numbers in form: ${duplicateReceipts.join(', ')}`)
//     }

//     // Details validation
//     const entriesWithData = journalDetails.filter(d =>
//       d.coaId > 0 ||
//       (d.description && d.description.trim() !== '') ||
//       (d.amountDb && d.amountDb > 0) ||
//       (d.amountCr && d.amountCr > 0)
//     )

//     entriesWithData.forEach((detail, idx) => {
//       const actualIndex = journalDetails.findIndex(d => d.lineId === detail.lineId)
//       const rowNum = actualIndex + 1

//       if (!detail.coaId || detail.coaId === 0) {
//         newValidationErrors.push(`Row ${rowNum}: Account is required`)
//       }

//       if (!detail.description || detail.description.trim() === '') {
//         newValidationErrors.push(`Row ${rowNum}: Description is required`)
//       }

//       const hasDebit = detail.amountDb && detail.amountDb > 0
//       const hasCredit = detail.amountCr && detail.amountCr > 0

//       if (!hasDebit && !hasCredit) {
//         newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
//       }
//     })

//     // Must have at least one complete entry
//     const completeEntries = journalDetails.filter(d =>
//       d.coaId > 0 &&
//       d.description &&
//       d.description.trim() !== '' &&
//       ((d.amountDb && d.amountDb > 0) || (d.amountCr && d.amountCr > 0))
//     )

//     if (completeEntries.length === 0) {
//       newValidationErrors.push('At least one complete entry is required')
//     }

//     setErrors(newErrors)
//     setValidationErrors(newValidationErrors)

//     const isValid = newValidationErrors.length === 0

//     if (!isValid) {
//       console.log('❌ Validation Failed:', newValidationErrors)
//     } else {
//       console.log('✅ Validation Passed')
//     }

//     return isValid
//   }, [formData, journalDetails, config, voucherType, linkedJournalId, duplicateReceipts])

//   // =============================================
//   // SUBMISSION
//   // =============================================

//   const prepareSubmissionData = useCallback(() => {
//     const validEntries = journalDetails.filter(d =>
//       d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
//     )

//     let finalEntries = validEntries.map((entry, index) => ({
//       lineId: index + 1,
//       coaId: entry.coaId,
//       description: entry.description,
//       recieptNo: entry.recieptNo || null,
//       currencyId: entry.currencyId || null,
//       rate: entry.rate || 0,
//       ownDb: entry.ownDb || 0,
//       ownCr: entry.ownCr || 0,
//       amountDb: parseFloat(String(entry.amountDb)) || 0,
//       amountCr: parseFloat(String(entry.amountCr)) || 0,
//       idCard: entry.idCard || null,
//       bank: entry.bank || null,
//       bankDate: entry.bankDate || null,
//       status: entry.status !== undefined ? entry.status : true
//     }))

//     // Add auto-balance entry if needed
//     if (totals.difference > 0 && formData.coaId) {
//       console.log('➕ Adding auto-balance entry:', totals.difference)
//       finalEntries.push({
//         lineId: finalEntries.length + 1,
//         coaId: formData.coaId,
//         description: 'Auto Balancing Entry',
//         recieptNo: null,
//         currencyId: null,
//         rate: 0,
//         ownDb: 0,
//         ownCr: 0,
//         amountDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
//         amountCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
//         idCard: null,
//         bank: null,
//         bankDate: null,
//         status: true
//       })
//     }

//     const submissionData = {
//       master: {
//         voucherNo: formData.voucherNo,
//         date: formData.date,
//         balacingId: formData.coaId,
//         voucherTypeId: config.type,
//         status: formData.status,
//         isOpening: isOpening,
//         linkedJournalId: voucherType === 'pettycash' ? linkedJournalId : null
//       },
//       details: finalEntries
//     }

//     console.log('📤 Prepared submission data:', submissionData)
//     return submissionData
//   }, [formData, journalDetails, totals, config.type, isOpening, voucherType, linkedJournalId])

//   const handleSaveClick = useCallback(() => {
//     console.log('💾 Save clicked')
//     if (!validateForm()) return

//     setConfirmModal({
//       isOpen: true,
//       type: 'save',
//       message: mode === 'create'
//         ? `Are you sure you want to create ${config.title} "${formData.voucherNo}"?`
//         : `Are you sure you want to update ${config.title} "${formData.voucherNo}"?`
//     })
//   }, [validateForm, mode, config.title, formData.voucherNo])

//   const handleCancelClick = useCallback(() => {
//     console.log('❌ Cancel clicked')
//     const hasChanges = formData.voucherNo !== config.prefix ||
//       journalDetails.some(d => d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0)

//     if (hasChanges) {
//       setConfirmModal({
//         isOpen: true,
//         type: 'cancel',
//         message: 'You have unsaved changes. Are you sure you want to cancel?'
//       })
//     } else {
//       router.push(config.listPath)
//     }
//   }, [formData.voucherNo, config.prefix, config.listPath, journalDetails, router])

//   const handleSubmit = async () => {
//     console.log('🚀 Submitting...')
//     setApiError(null)
//     setConfirmModal({ isOpen: false, type: null, message: '' })

//     const submissionData = prepareSubmissionData()

//     try {
//       if (mode === 'create') {
//         const result = await createVoucher(submissionData).unwrap()
//         console.log('✅ Created successfully:', result)
//         router.push(config.listPath)
//       } else {
//         const result = await updateVoucher({
//           id: initialData?.master.id,
//           ...submissionData
//         }).unwrap()
//         console.log('✅ Updated successfully:', result)
//         router.push(config.listPath)
//       }
//     } catch (error: any) {
//       console.error('❌ Submit Error:', error)

//       if (error?.data?.errorCode === 'DUPLICATE_VOUCHER_NO') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, voucherNo: error.data.message }))
//       } else if (error?.data?.errorCode === 'DUPLICATE_RECEIPT_NO') {
//         setApiError(error.data.message)
//       } else if (error?.data?.errorCode === 'LINKED_JOURNAL_REQUIRED') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
//       } else if (error?.data?.errorCode === 'INVALID_LINKED_JOURNAL') {
//         setApiError(error.data.message)
//         setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
//       } else if (error?.data?.message) {
//         setApiError(error.data.message)
//       } else {
//         setApiError('Failed to save voucher. Please try again.')
//       }
//     }
//   }

//   const handleConfirmAction = useCallback(() => {
//     if (confirmModal.type === 'save') {
//       handleSubmit()
//     } else if (confirmModal.type === 'cancel') {
//       router.push(config.listPath)
//     }
//   }, [confirmModal.type, config.listPath, router])

//   const handleCloseModal = useCallback(() => {
//     setConfirmModal({ isOpen: false, type: null, message: '' })
//   }, [])

//   // =============================================
//   // LOADING STATE
//   // =============================================

//   if (coaLoading || currencyLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3] mx-auto mb-4" />
//           <p className="text-gray-500">Loading form data...</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-full sm:max-w-6xl md:max-w-6xl lg:max-w-8xl xl:max-w-9xl 2xl:max-w-9xl mx-auto p-2">
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           {mode === 'create' ? `Create ${config.title}` : `Edit ${config.title}`}
//         </h1>
//         <p className="text-gray-500 mt-1">
//           {mode === 'create'
//             ? `Fill in the details to create a new ${config.title.toLowerCase()}`
//             : `Update the ${config.title.toLowerCase()} details`
//           }
//         </p>
//       </div>

//       {/* Debug Info */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono">
//           <p><strong>Debug:</strong> voucherType={voucherType} | coaId={formData.coaId} | BF={bf} | CF={cf} | bfLoading={String(bfLoading)}</p>
//         </div>
//       )}

//       {/* API Error */}
//       {apiError && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <p className="text-red-700 font-medium">{apiError}</p>
//           </div>
//         </div>
//       )}

//       {/* Validation Errors */}
//       {validationErrors.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             Please fix the following errors:
//           </h3>
//           <ul className="list-disc list-inside text-red-700 space-y-1">
//             {validationErrors.map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* ✅ Voucher Header */}
//       <VoucherHeader
//         voucherType={voucherType}
//         formData={formData}
//         config={config}
//         errors={errors}
//         isOpening={isOpening}
//         linkedJournalId={linkedJournalId}
//         onFormDataChange={handleFormDataChange}
//         onCoaChange={handleCoaChange}
//         onIsOpeningChange={handleIsOpeningChange}
//         onLinkedJournalChange={handleLinkedJournalChange}
//         bf={bf}
//         cf={cf}
//         bfLoading={bfLoading}
//         allTotals={allTotals}
//         coaTotals={coaTotals}
//       />

//       {/* Voucher Details */}
//       <VoucherDetails
//         voucherType={voucherType}
//         journalDetails={journalDetails}
//         currencyOptions={currencyOptions}
//         totals={totals}
//         balancingCoaId={formData.coaId}
//         duplicateReceipts={duplicateReceipts}
//         onDetailChange={handleDetailChange}
//         onAddRow={handleAddRow}
//         onRemoveRow={handleRemoveRow}
//         onCloneRow={handleCloneRow}
//       />

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
//         <Button
//           variant="outline"
//           onClick={handleCancelClick}
//           disabled={isCreating || isUpdating}
//           icon={<X className="w-4 h-4" />}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={handleSaveClick}
//           disabled={isCreating || isUpdating}
//           icon={isCreating || isUpdating
//             ? <RefreshCw className="w-4 h-4 animate-spin" />
//             : <Save className="w-4 h-4" />
//           }
//         >
//           {isCreating || isUpdating
//             ? 'Saving...'
//             : mode === 'create'
//               ? `Create ${config.title}`
//               : `Update ${config.title}`
//           }
//         </Button>
//       </div>

//       {/* Confirmation Modal */}
//       {confirmModal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
//             <div className="flex items-center gap-3 mb-4">
//               {confirmModal.type === 'save' ? (
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <CheckCircle className="w-6 h-6 text-blue-600" />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-yellow-100 rounded-full">
//                   <AlertCircle className="w-6 h-6 text-yellow-600" />
//                 </div>
//               )}
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {confirmModal.type === 'save' ? 'Confirm Save' : 'Confirm Cancel'}
//               </h3>
//             </div>

//             <p className="text-gray-600 mb-6">{confirmModal.message}</p>

//             {confirmModal.type === 'save' && totals.difference > 0 && formData.coaId && (
//               <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-sm text-blue-700">
//                   <strong>Note:</strong> An auto-balancing entry of{' '}
//                   <span className="font-mono font-bold">{totals.difference.toLocaleString()}</span>{' '}
//                   will be added to balance the voucher.
//                 </p>
//               </div>
//             )}

//             <div className="flex justify-end gap-3">
//               <Button variant="outline" onClick={handleCloseModal}>
//                 No, Go Back
//               </Button>
//               <Button
//                 variant={confirmModal.type === 'save' ? 'primary' : 'danger'}
//                 onClick={handleConfirmAction}
//               >
//                 {confirmModal.type === 'save' ? 'Yes, Save' : 'Yes, Cancel'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherForm





















































// components/vouchers/VoucherForm.tsx

'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import VoucherHeader from './VoucherHeader'
import VoucherDetails from './VoucherDetails'
import {
  useCreateJournalVoucherMutation,
  useUpdateJournalVoucherMutation,
  useGetCoaAccountsQuery,
  useGetCurrenciesQuery,
  useGetBFRFQuery
} from '@/store/slice/journalVoucherSlice'
import { AlertCircle, RefreshCw, Save, X, CheckCircle } from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface JournalDetail {
  lineId: number
  coaId: number
  description: string
  recieptNo?: string
  currencyId?: number | null
  rate?: number
  ownDb?: number
  ownCr?: number
  amountDb: number
  amountCr: number
  idCard?: string
  bank?: string
  bankDate?: string | null
  status: boolean
  rate_raw?: string
  ownDb_raw?: string
  ownCr_raw?: string
  amountDb_raw?: string
  amountCr_raw?: string
  isCurrencyLocked?: boolean
  coaTypeId?: string | number
}

interface VoucherFormProps {
  mode: 'create' | 'edit'
  voucherType: 'journal' | 'pettycash'
  initialData?: { master: any; details: any[] }
}

// =============================================
// EMPTY DETAIL TEMPLATE
// =============================================

const createEmptyDetail = (lineId: number): JournalDetail => ({
  lineId,
  coaId: 0,
  description: '',
  recieptNo: '',
  currencyId: null,
  rate: 0,
  ownDb: 0,
  ownCr: 0,
  amountDb: 0,
  amountCr: 0,
  idCard: '',
  bank: '',
  bankDate: null,
  status: true
})

// =============================================
// COMPONENT
// =============================================

export const VoucherForm: React.FC<VoucherFormProps> = ({
  mode,
  voucherType,
  initialData
}) => {
  const router = useRouter()

  console.log('🚀 VoucherForm Mounted:', { mode, voucherType, hasInitialData: !!initialData })

  // =============================================
  // CONFIG
  // =============================================

  const config = useMemo(() => {
    const configs = {
      journal: {
        title: 'Journal Voucher',
        type: 10,
        coaFilter: 'isJvBalance',
        balanceLabel: 'Journal Balance Account',
        prefix: 'JV-',
        listPath: '/vouchers/journal'
      },
      pettycash: {
        title: 'Petty Cash Voucher',
        type: 14,
        coaFilter: 'isPettyCash',
        balanceLabel: 'Petty Cash Account',
        prefix: 'PC-',
        listPath: '/vouchers/petty'
      }
    }
    console.log('📋 Config loaded for:', voucherType, configs[voucherType])
    return configs[voucherType]
  }, [voucherType])

  // =============================================
  // STATE
  // =============================================

  const [duplicateReceipts, setDuplicateReceipts] = useState<string[]>([])

  const [formData, setFormData] = useState({
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    coaId: null as number | null,
    status: false
  })

  const [isOpening, setIsOpening] = useState(false)
  const [linkedJournalId, setLinkedJournalId] = useState<number | null>(null)
  const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([createEmptyDetail(1)])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [apiError, setApiError] = useState<string | null>(null)

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: 'save' | 'cancel' | null
    message: string
  }>({
    isOpen: false,
    type: null,
    message: ''
  })

  // =============================================
  // RTK QUERY
  // =============================================

  const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
  const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()
  const { data: coaData = [], isLoading: coaLoading } = useGetCoaAccountsQuery()
  const { data: currencyData = [], isLoading: currencyLoading } = useGetCurrenciesQuery()

  // ✅ Build BF/RF query params based on mode
  const bfQueryParams = useMemo(() => {
    if (!formData.coaId) return null;

    if (mode === 'create') {
      return {
        coaId: formData.coaId,
        mode: 'create'
      };
    }

    if (mode === 'edit' && initialData?.master) {
      return {
        coaId: formData.coaId,
        mode: 'edit',
        upToDate: formData.date,
        excludeId: initialData.master.id
      };
    }

    return null;
  }, [formData.coaId, formData.date, mode, initialData?.master?.id])

  // ✅ Fetch BF when balancing COA is selected
  const {
    data: bfData,
    isLoading: bfLoading,
    refetch: refetchBF
  } = useGetBFRFQuery(bfQueryParams, {
    skip: !bfQueryParams || (voucherType !== 'journal' && voucherType !== 'pettycash')
  })

  // =============================================
  // MEMOIZED DATA
  // =============================================

  const allCoaAccounts = useMemo(() => {
    return coaData.map((coa: any) => ({
      id: coa.id,
      label: `${coa.acCode} - ${coa.acName}`,
      acCode: coa.acCode || `COA-${coa.id}`,
      acName: coa.acName || 'Unknown'
    }))
  }, [coaData])

  const currencyOptions = useMemo(() => {
    if (!Array.isArray(currencyData)) return []
    return currencyData.map((currency: any) => ({
      id: currency.id,
      label: currency.currencyName || currency.name,
      currencyName: currency.currencyName || currency.name
    }))
  }, [currencyData])

  const totals = useMemo(() => {
    const validEntries = journalDetails.filter(d =>
      d.coaId > 0 && (d.amountDb > 0 || d.amountCr > 0)
    )

    const debitTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountDb)) || 0), 0)
    const creditTotal = validEntries.reduce((sum, d) => sum + (parseFloat(String(d.amountCr)) || 0), 0)
    const difference = Math.abs(debitTotal - creditTotal)

    const result = {
      debitTotal: Math.round(debitTotal * 100) / 100,
      creditTotal: Math.round(creditTotal * 100) / 100,
      difference: Math.round(difference * 100) / 100
    }

    console.log('💰 Totals calculated:', result)
    return result
  }, [journalDetails])

  // ✅ Calculate BF, CF, allTotals, coaTotals
  const { bf, cf, allTotals, coaTotals } = useMemo(() => {
    const defaultAllTotals = { debit: 0, credit: 0, difference: 0 }
    const defaultCoaTotals = null

    const bfValue = bfData?.bf || 0
    const allTotalsValue = bfData?.allTotals || defaultAllTotals
    const coaTotalsValue = bfData?.coaTotals || defaultCoaTotals

    let cfValue = bfValue

    if (totals.difference > 0 && formData.coaId) {
      if (totals.debitTotal > totals.creditTotal) {
        cfValue = bfValue + totals.difference
      } else {
        cfValue = bfValue - totals.difference
      }
    }

    console.log('📊 BF/CF calculated:', {
      mode,
      bf: bfValue,
      cf: cfValue,
      allTotals: allTotalsValue,
      coaTotals: coaTotalsValue,
      bfQueryParams
    })

    return {
      bf: bfValue,
      cf: cfValue,
      allTotals: allTotalsValue,
      coaTotals: coaTotalsValue
    }
  }, [bfData, totals, formData.coaId, mode, bfQueryParams])

  // =============================================
  // EFFECTS
  // =============================================

  // Initialize for create mode
  useEffect(() => {
    if (mode === 'create') {
      console.log('🆕 Initializing create mode')
      setFormData(prev => ({
        ...prev,
        voucherNo: config.prefix
      }))
      setJournalDetails([createEmptyDetail(1)])
      setIsOpening(false)
      setLinkedJournalId(null)
    }
  }, [mode, config.prefix])

  // Load data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('📝 Loading edit data:', initialData)

      setFormData({
        voucherNo: initialData.master.voucherNo || config.prefix,
        date: initialData.master.date
          ? initialData.master.date.split('T')[0]
          : new Date().toISOString().split('T')[0],
        coaId: initialData.master.balacingId || null,
        status: initialData.master.status || false
      })

      setIsOpening(initialData.master.isOpening || false)
      setLinkedJournalId(initialData.master.linkedJournalId || null)

      const manualEntries = initialData.details.filter((detail: any) => {
        const description = detail.description?.toLowerCase().trim() || ''
        return !['auto balancing entry', 'auto balance entry', 'balancing entry', 'system generated']
          .some(match => description.includes(match))
      })

      if (manualEntries.length > 0) {
        setJournalDetails(manualEntries.map((detail: any, index: number) => ({
          lineId: index + 1,
          coaId: detail.coaId || 0,
          description: detail.description || '',
          recieptNo: detail.recieptNo || '',
          currencyId: detail.currencyId || null,
          rate: detail.rate || 0,
          ownDb: detail.ownDb || 0,
          ownCr: detail.ownCr || 0,
          amountDb: detail.amountDb || 0,
          amountCr: detail.amountCr || 0,
          idCard: detail.idCard || '',
          bank: detail.bank || '',
          bankDate: detail.bankDate || null,
          status: detail.status !== undefined ? detail.status : true
        })))
      } else {
        setJournalDetails([createEmptyDetail(1)])
      }
    }
  }, [mode, initialData, config.prefix])

  // Track duplicate receipts
  useEffect(() => {
    const receiptCounts: { [key: string]: number } = {}

    journalDetails.forEach(detail => {
      const receipt = detail.recieptNo?.trim()
      if (receipt) {
        receiptCounts[receipt] = (receiptCounts[receipt] || 0) + 1
      }
    })

    const duplicates = Object.entries(receiptCounts)
      .filter(([_, count]) => count > 1)
      .map(([receipt, _]) => receipt)

    if (duplicates.length > 0) {
      console.log('⚠️ Duplicate receipts found:', duplicates)
    }
    setDuplicateReceipts(duplicates)
  }, [journalDetails])

  // =============================================
  // HANDLERS
  // =============================================

  const handleFormDataChange = useCallback((field: string, value: any) => {
    console.log('📝 Form Data Change:', field, value)

    if (field === 'voucherNo') {
      let newValue = value
      const prefix = config.prefix

      if (!newValue.startsWith(prefix)) {
        const withoutAnyPrefix = newValue.replace(/^(JV-|PC-)/i, '')
        newValue = prefix + withoutAnyPrefix
      }

      setFormData(prev => ({ ...prev, voucherNo: newValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    if (apiError) setApiError(null)
  }, [config.prefix, errors, apiError])

  const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
    console.log('📝 COA Change:', selectedId, selectedOption)
    setFormData(prev => ({
      ...prev,
      coaId: selectedId ? Number(selectedId) : null
    }))
    if (errors.coaId) setErrors(prev => ({ ...prev, coaId: '' }))
  }, [errors.coaId])

  const handleLinkedJournalChange = useCallback((selectedId: string | number, selectedOption: any) => {
    console.log('📝 Linked Journal Change:', selectedId, selectedOption)
    setLinkedJournalId(selectedId ? Number(selectedId) : null)
    if (errors.linkedJournalId) setErrors(prev => ({ ...prev, linkedJournalId: '' }))
  }, [errors])

  const handleIsOpeningChange = useCallback((checked: boolean) => {
    console.log('📝 Is Opening Change:', checked)
    setIsOpening(checked)
  }, [])

  const handleDetailChange = useCallback((index: number, field: string, value: any) => {
    console.log('📝 Detail Change - Row:', index, 'Field:', field, 'Value:', value)
    setJournalDetails(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const handleAddRow = useCallback(() => {
    console.log('➕ Adding new row')
    setJournalDetails(prev => [...prev, createEmptyDetail(prev.length + 1)])
  }, [])

  const handleRemoveRow = useCallback((index: number) => {
    if (journalDetails.length <= 1) {
      console.log('⚠️ Cannot remove last row')
      return
    }
    console.log('🗑️ Removing row:', index)
    setJournalDetails(prev => {
      const updated = prev.filter((_, i) => i !== index)
      return updated.map((detail, i) => ({ ...detail, lineId: i + 1 }))
    })
  }, [journalDetails.length])

  const handleCloneRow = useCallback((index: number) => {
    console.log('📋 Cloning row:', index)
    setJournalDetails(prev => {
      const rowToClone = prev[index]

      let newReceiptNo = rowToClone.recieptNo || ''
      if (newReceiptNo) {
        newReceiptNo = newReceiptNo + 'R'
      }

      const clonedRow: JournalDetail = {
        ...rowToClone,
        lineId: prev.length + 1,
        recieptNo: newReceiptNo,
        amountDb: rowToClone.amountCr || 0,
        amountCr: rowToClone.amountDb || 0,
        ownDb: rowToClone.ownCr || 0,
        ownCr: rowToClone.ownDb || 0,
        amountDb_raw: undefined,
        amountCr_raw: undefined,
        ownDb_raw: undefined,
        ownCr_raw: undefined,
      }

      const newDetails = [...prev]
      newDetails.splice(index + 1, 0, clonedRow)

      return newDetails.map((detail, i) => ({ ...detail, lineId: i + 1 }))
    })
  }, [])

  // =============================================
  // VALIDATION
  // =============================================

  const validateForm = useCallback(() => {
    console.log('🔍 Validating form...')
    const newErrors: { [key: string]: string } = {}
    const newValidationErrors: string[] = []

    if (!formData.voucherNo || formData.voucherNo === config.prefix) {
      newErrors.voucherNo = 'Voucher number is required'
      newValidationErrors.push('Voucher number is required')
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
      newValidationErrors.push('Date is required')
    }

    if (!formData.coaId) {
      newErrors.coaId = `${config.balanceLabel} is required`
      newValidationErrors.push(`${config.balanceLabel} is required`)
    }

    if (voucherType === 'pettycash' && !linkedJournalId) {
      newErrors.linkedJournalId = 'Link to Journal Voucher is required'
      newValidationErrors.push('Petty Cash must be linked to a Journal Voucher')
    }

    if (duplicateReceipts.length > 0) {
      newValidationErrors.push(`Duplicate receipt numbers in form: ${duplicateReceipts.join(', ')}`)
    }

    const entriesWithData = journalDetails.filter(d =>
      d.coaId > 0 ||
      (d.description && d.description.trim() !== '') ||
      (d.amountDb && d.amountDb > 0) ||
      (d.amountCr && d.amountCr > 0)
    )

    entriesWithData.forEach((detail, idx) => {
      const actualIndex = journalDetails.findIndex(d => d.lineId === detail.lineId)
      const rowNum = actualIndex + 1

      if (!detail.coaId || detail.coaId === 0) {
        newValidationErrors.push(`Row ${rowNum}: Account is required`)
      }

      if (!detail.description || detail.description.trim() === '') {
        newValidationErrors.push(`Row ${rowNum}: Description is required`)
      }

      const hasDebit = detail.amountDb && detail.amountDb > 0
      const hasCredit = detail.amountCr && detail.amountCr > 0

      if (!hasDebit && !hasCredit) {
        newValidationErrors.push(`Row ${rowNum}: Enter Debit or Credit amount`)
      }
    })

    const completeEntries = journalDetails.filter(d =>
      d.coaId > 0 &&
      d.description &&
      d.description.trim() !== '' &&
      ((d.amountDb && d.amountDb > 0) || (d.amountCr && d.amountCr > 0))
    )

    if (completeEntries.length === 0) {
      newValidationErrors.push('At least one complete entry is required')
    }

    setErrors(newErrors)
    setValidationErrors(newValidationErrors)

    const isValid = newValidationErrors.length === 0

    if (!isValid) {
      console.log('❌ Validation Failed:', newValidationErrors)
    } else {
      console.log('✅ Validation Passed')
    }

    return isValid
  }, [formData, journalDetails, config, voucherType, linkedJournalId, duplicateReceipts])

  // =============================================
  // SUBMISSION
  // =============================================

  const prepareSubmissionData = useCallback(() => {
    const validEntries = journalDetails.filter(d =>
      d.coaId > 0 && d.description && (d.amountDb > 0 || d.amountCr > 0)
    )

    let finalEntries = validEntries.map((entry, index) => ({
      lineId: index + 1,
      coaId: entry.coaId,
      description: entry.description,
      recieptNo: entry.recieptNo || null,
      currencyId: entry.currencyId || null,
      rate: entry.rate || 0,
      ownDb: entry.ownDb || 0,
      ownCr: entry.ownCr || 0,
      amountDb: parseFloat(String(entry.amountDb)) || 0,
      amountCr: parseFloat(String(entry.amountCr)) || 0,
      idCard: entry.idCard || null,
      bank: entry.bank || null,
      bankDate: entry.bankDate || null,
      status: entry.status !== undefined ? entry.status : true
    }))

    if (totals.difference > 0 && formData.coaId) {
      console.log('➕ Adding auto-balance entry:', totals.difference)
      finalEntries.push({
        lineId: finalEntries.length + 1,
        coaId: formData.coaId,
        description: 'Auto Balancing Entry',
        recieptNo: null,
        currencyId: null,
        rate: 0,
        ownDb: 0,
        ownCr: 0,
        amountDb: totals.creditTotal > totals.debitTotal ? totals.difference : 0,
        amountCr: totals.debitTotal > totals.creditTotal ? totals.difference : 0,
        idCard: null,
        bank: null,
        bankDate: null,
        status: true
      })
    }

    const submissionData = {
      master: {
        voucherNo: formData.voucherNo,
        date: formData.date,
        balacingId: formData.coaId,
        voucherTypeId: config.type,
        status: formData.status,
        isOpening: isOpening,
        linkedJournalId: voucherType === 'pettycash' ? linkedJournalId : null
      },
      details: finalEntries
    }

    console.log('📤 Prepared submission data:', submissionData)
    return submissionData
  }, [formData, journalDetails, totals, config.type, isOpening, voucherType, linkedJournalId])

  const handleSaveClick = useCallback(() => {
    console.log('💾 Save clicked')
    if (!validateForm()) return

    setConfirmModal({
      isOpen: true,
      type: 'save',
      message: mode === 'create'
        ? `Are you sure you want to create ${config.title} "${formData.voucherNo}"?`
        : `Are you sure you want to update ${config.title} "${formData.voucherNo}"?`
    })
  }, [validateForm, mode, config.title, formData.voucherNo])

  const handleCancelClick = useCallback(() => {
    console.log('❌ Cancel clicked')
    const hasChanges = formData.voucherNo !== config.prefix ||
      journalDetails.some(d => d.coaId > 0 || d.description || d.amountDb > 0 || d.amountCr > 0)

    if (hasChanges) {
      setConfirmModal({
        isOpen: true,
        type: 'cancel',
        message: 'You have unsaved changes. Are you sure you want to cancel?'
      })
    } else {
      router.push(config.listPath)
    }
  }, [formData.voucherNo, config.prefix, config.listPath, journalDetails, router])

  const handleSubmit = async () => {
    console.log('🚀 Submitting...')
    setApiError(null)
    setConfirmModal({ isOpen: false, type: null, message: '' })

    const submissionData = prepareSubmissionData()

    try {
      if (mode === 'create') {
        const result = await createVoucher(submissionData).unwrap()
        console.log('✅ Created successfully:', result)
        router.push(config.listPath)
      } else {
        const result = await updateVoucher({
          id: initialData?.master.id,
          ...submissionData
        }).unwrap()
        console.log('✅ Updated successfully:', result)
        router.push(config.listPath)
      }
    } catch (error: any) {
      console.error('❌ Submit Error:', error)

      if (error?.data?.errorCode === 'DUPLICATE_VOUCHER_NO') {
        setApiError(error.data.message)
        setErrors(prev => ({ ...prev, voucherNo: error.data.message }))
      } else if (error?.data?.errorCode === 'DUPLICATE_RECEIPT_NO') {
        setApiError(error.data.message)
      } else if (error?.data?.errorCode === 'LINKED_JOURNAL_REQUIRED') {
        setApiError(error.data.message)
        setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
      } else if (error?.data?.errorCode === 'INVALID_LINKED_JOURNAL') {
        setApiError(error.data.message)
        setErrors(prev => ({ ...prev, linkedJournalId: error.data.message }))
      } else if (error?.data?.message) {
        setApiError(error.data.message)
      } else {
        setApiError('Failed to save voucher. Please try again.')
      }
    }
  }

  const handleConfirmAction = useCallback(() => {
    if (confirmModal.type === 'save') {
      handleSubmit()
    } else if (confirmModal.type === 'cancel') {
      router.push(config.listPath)
    }
  }, [confirmModal.type, config.listPath, router])

  const handleCloseModal = useCallback(() => {
    setConfirmModal({ isOpen: false, type: null, message: '' })
  }, [])

  // =============================================
  // LOADING STATE
  // =============================================

  if (coaLoading || currencyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3] mx-auto mb-4" />
          <p className="text-gray-500">Loading form data...</p>
        </div>
      </div>
    )
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="max-w-full sm:max-w-6xl md:max-w-6xl lg:max-w-8xl xl:max-w-9xl 2xl:max-w-9xl mx-auto p-2">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? `Create ${config.title}` : `Edit ${config.title}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {mode === 'create'
            ? `Fill in the details to create a new ${config.title.toLowerCase()}`
            : `Update the ${config.title.toLowerCase()} details`
          }
        </p>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono">
          <p><strong>Debug:</strong> mode={mode} | voucherType={voucherType} | coaId={formData.coaId} | date={formData.date}</p>
          <p><strong>BF Query:</strong> {JSON.stringify(bfQueryParams)}</p>
          <p><strong>BF={bf} | CF={cf} | bfLoading={String(bfLoading)}</strong></p>
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-medium">{apiError}</p>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Voucher Header */}
      <VoucherHeader
        voucherType={voucherType}
        formData={formData}
        config={config}
        errors={errors}
        isOpening={isOpening}
        linkedJournalId={linkedJournalId}
        onFormDataChange={handleFormDataChange}
        onCoaChange={handleCoaChange}
        onIsOpeningChange={handleIsOpeningChange}
        onLinkedJournalChange={handleLinkedJournalChange}
        bf={bf}
        cf={cf}
        bfLoading={bfLoading}
        allTotals={allTotals}
        coaTotals={coaTotals}
      />

      {/* Voucher Details */}
      <VoucherDetails
        voucherType={voucherType}
        journalDetails={journalDetails}
        currencyOptions={currencyOptions}
        totals={totals}
        balancingCoaId={formData.coaId}
        duplicateReceipts={duplicateReceipts}
        onDetailChange={handleDetailChange}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
        onCloneRow={handleCloneRow}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleCancelClick}
          disabled={isCreating || isUpdating}
          icon={<X className="w-4 h-4" />}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveClick}
          disabled={isCreating || isUpdating}
          icon={isCreating || isUpdating
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />
          }
        >
          {isCreating || isUpdating
            ? 'Saving...'
            : mode === 'create'
              ? `Create ${config.title}`
              : `Update ${config.title}`
          }
        </Button>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              {confirmModal.type === 'save' ? (
                <div className="p-2 bg-blue-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              ) : (
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {confirmModal.type === 'save' ? 'Confirm Save' : 'Confirm Cancel'}
              </h3>
            </div>

            <p className="text-gray-600 mb-6">{confirmModal.message}</p>

            {confirmModal.type === 'save' && totals.difference > 0 && formData.coaId && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> An auto-balancing entry of{' '}
                  <span className="font-mono font-bold">{totals.difference.toLocaleString()}</span>{' '}
                  will be added to balance the voucher.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
                No, Go Back
              </Button>
              <Button
                variant={confirmModal.type === 'save' ? 'primary' : 'danger'}
                onClick={handleConfirmAction}
              >
                {confirmModal.type === 'save' ? 'Yes, Save' : 'Yes, Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoucherForm
