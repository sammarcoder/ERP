// // Working good withput add the print


// // components/lc-main/LcMainForm.tsx

// 'use client'
// import React, { useState, useEffect, useCallback, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   useGetLcMainByIdQuery,
//   useCreateLcMainMutation,
//   useUpdateLcMainMutation,
//   useSyncDetailsMutation,
//   useGetUsedCoaIdsQuery,
//   useLazyGetAllGdnQuery,
//   useLazyGetGdnQuery,
//   useLazyGetJournalDetailsByCoaQuery,
//   useUpdateJournalDetailsMutation,
//   GdnDetailData
// } from '@/store/slice/lcMainSlice'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { Loading } from '@/components/ui/Loading'
// import LcCoaSearchableInput from '@/components/common/SearchableInput/LcCoaSearchableInput'
// import { CurrencySearchableInput } from '@/components/common/SearchableInput/CurrencySearchableInput'
// import { MasterTypeSearchableInput } from '@/components/common/SearchableInput/MasterTypeSearchableInput'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import LcDutyStructure, { DutyStructureItem } from './LcDutyStructure'
// import LcDetailsTab from './LcDetailsTab'
// import LcCalculationTab from './LcCalculationTab'
// import LcExpensesTab, { ExpenseItem } from './LcExpensesTab'
// import {
//   Save, ArrowLeft, AlertCircle, Landmark, FileText, Calendar,
//   DollarSign, Package, Hash, Receipt, FileSpreadsheet, Calculator, Wallet
// } from 'lucide-react'
// import { clsx } from 'clsx'

// // =============================================
// // TYPES
// // =============================================

// interface LcMainFormProps {
//   mode: 'create' | 'edit'
//   id?: number
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcMainForm: React.FC<LcMainFormProps> = ({ mode, id }) => {
//   const router = useRouter()

//   // =============================================
//   // STATE
//   // =============================================

//   const [activeTab, setActiveTab] = useState<'main' | 'duty' | 'details' | 'calculation' | 'expenses'>('main')

//   const [formData, setFormData] = useState({
//     lcId: null as number | null,
//     gdnId: null as number | null,
//     shipperId: null as number | null,
//     consigneeId: null as number | null,
//     bankNameId: null as number | null,
//     contactTypeId: null as number | null,
//     bl: '',
//     container: '',
//     containerCount: '',
//     containerSize: '',
//     inv: '',
//     currencyId: null as number | null,
//     amount: '',
//     clearingAgentId: null as number | null,
//     gd: '',
//     gdDate: '',
//     exchangeRateDuty: '',
//     exchangeRateDocuments: '',
//     totalExp: '',
//     averageDollarRate: '',
//     paymentDate: '',
//     itemDescription: '',
//     landedCost: ''
//   })

//   const [dutyItems, setDutyItems] = useState<DutyStructureItem[]>([])
//   const [gdnDetails, setGdnDetails] = useState<GdnDetailData[]>([])
//   const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([])

//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [apiError, setApiError] = useState('')
//   const [showConfirm, setShowConfirm] = useState(false)

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const { data: editData, isLoading: isLoadingEdit } = useGetLcMainByIdQuery(id!, {
//     skip: mode !== 'edit' || !id
//   })

//   const { data: usedCoaIds = [] } = useGetUsedCoaIdsQuery(mode === 'edit' ? id : undefined)

//   const [triggerGetAllGdn, { data: gdnList = [], isLoading: isLoadingGdn }] = useLazyGetAllGdnQuery()
//   const [triggerGetGdn, { isLoading: isLoadingGdnDetail }] = useLazyGetGdnQuery()
//   const [triggerGetJournalDetails, { isLoading: isLoadingJournalDetails }] = useLazyGetJournalDetailsByCoaQuery()

//   const [createLcMain, { isLoading: isCreating }] = useCreateLcMainMutation()
//   const [updateLcMain, { isLoading: isUpdating }] = useUpdateLcMainMutation()
//   const [syncDetails, { isLoading: isSyncing }] = useSyncDetailsMutation()
//   const [updateJournalDetails, { isLoading: isUpdatingJournal }] = useUpdateJournalDetailsMutation()

//   // =============================================
//   // AUTO-CALCULATE FROM EXPENSES (REAL-TIME)
//   // =============================================

//   // Total Expense = SUM of ownDb where isCost = true
//   const calculatedTotalExp = useMemo(() => {
//     return expenseItems
//       .filter(item => item.isCost === true)
//       .reduce((sum, item) => sum + (parseFloat(item.amountDb) || 0), 0)
//   }, [expenseItems])

//   // Exchange Rate Documents = rate where description = 'Documents'
//   const calculatedExchangeRateDocuments = useMemo(() => {
//     const documentsRow = expenseItems.find(
//       item => item.description?.toLowerCase() === 'documents'
//     )
//     return documentsRow ? parseFloat(documentsRow.rate) || 0 : 0
//   }, [expenseItems])

//   // Use calculated values (override form values)
//   const effectiveTotalExp = calculatedTotalExp || parseFloat(formData.totalExp) || 0
//   const effectiveExchangeRateDocuments = calculatedExchangeRateDocuments || parseFloat(formData.exchangeRateDocuments) || 0
//   // const effectiveExchangeRateDuty = parseFloat(formData.exchangeRateDuty) || 0
//   // If duty rate is often same as documents rate
//   const effectiveExchangeRateDuty = parseFloat(formData.exchangeRateDuty) || effectiveExchangeRateDocuments || 0

//   // alert(effectiveExchangeRateDuty)
//   // =============================================
//   // HANDLE LC CHANGE
//   // =============================================

//   const handleLcChange = useCallback(async (lcId: number | null) => {
//     setFormData(prev => ({ ...prev, lcId, gdnId: null }))
//     setErrors(prev => ({ ...prev, lcId: '' }))
//     setApiError('')
//     setDutyItems([])
//     setGdnDetails([])
//     setExpenseItems([])

//     if (lcId) {
//       // Fetch GDN
//       try {
//         const result = await triggerGetAllGdn(lcId).unwrap()
//         if (result && result.length > 0) {
//           const gdnId = result[0].ID
//           setFormData(prev => ({ ...prev, gdnId }))
//           handleGdnSelect(gdnId)
//         }
//       } catch (error) {
//         console.error('Error fetching GDN:', error)
//       }

//       // Fetch Journal Details (Expenses)
//       try {
//         const journalResult = await triggerGetJournalDetails(lcId).unwrap()
//         if (journalResult && journalResult.length > 0) {
//           const expenses: ExpenseItem[] = journalResult.map(j => ({
//             id: j.id,
//             jmId: j.jmId,
//             lineId: j.lineId,
//             coaId: j.coaId,
//             description: j.description || '',
//             rate: j.rate?.toString() || '0',
//             ownDb: j.ownDb?.toString() || '0',
//             amountDb: j.amountDb || 0,
//             isCost: j.isCost || false
//           }))
//           setExpenseItems(expenses)
//           console.log(`✅ Loaded ${expenses.length} expense items`)
//         }
//       } catch (error) {
//         console.error('Error fetching journal details:', error)
//       }
//     }
//   }, [triggerGetAllGdn, triggerGetJournalDetails])

//   // =============================================
//   // HANDLE GDN SELECT
//   // =============================================

//   const handleGdnSelect = useCallback(async (gdnId: number) => {
//     try {
//       const result = await triggerGetGdn(gdnId).unwrap()

//       if (result && result.length > 0 && result[0].details) {
//         const details = result[0].details
//         setGdnDetails(details)

//         // Initialize duty items from GDN
//         const duty: DutyStructureItem[] = details.map(d => ({
//           itemId: d.item?.id || d.Item_ID,
//           itemName: d.item?.itemName || '',
//           cd: d.item?.cd || '0',
//           acd: d.item?.acd || '0',
//           rd: d.item?.rd || '0',
//           salesTax: d.item?.salesTax || '0',
//           addSalesTax: d.item?.addSalesTax || '0',
//           itaxImport: d.item?.itaxImport || '0',
//           furtherTax: d.item?.furtherTax || '0',
//           incomeTaxWithheld: d.item?.incomeTaxWithheld || '0',
//           assessedPrice: d.item?.assessedPrice || '0',
//           assessedQty: '0',
//           priceFC: d.item?.purchasePriceFC || '0'
//         }))

//         setDutyItems(duty)
//       }
//     } catch (error) {
//       console.error('Error fetching GDN details:', error)
//     }
//   }, [triggerGetGdn])

//   // =============================================
//   // POPULATE FORM IN EDIT MODE
//   // =============================================

//   useEffect(() => {
//     if (mode === 'edit' && editData) {
//       setFormData({
//         lcId: editData.lcId,
//         gdnId: editData.gdnId,
//         shipperId: editData.shipperId,
//         consigneeId: editData.consigneeId,
//         bankNameId: editData.bankNameId,
//         contactTypeId: editData.contactTypeId,
//         bl: editData.bl || '',
//         container: editData.container || '',
//         containerCount: editData.containerCount?.toString() || '',
//         containerSize: editData.containerSize || '',
//         inv: editData.inv || '',
//         currencyId: editData.currencyId,
//         amount: editData.amount?.toString() || '',
//         clearingAgentId: editData.clearingAgentId,
//         gd: editData.gd || '',
//         gdDate: editData.gdDate || '',
//         exchangeRateDuty: editData.exchangeRateDuty?.toString() || '',
//         exchangeRateDocuments: editData.exchangeRateDocuments?.toString() || '',
//         totalExp: editData.totalExp?.toString() || '',
//         averageDollarRate: editData.averageDollarRate?.toString() || '',
//         paymentDate: editData.paymentDate || '',
//         itemDescription: editData.itemDescription || '',
//         landedCost: editData.landedCost?.toString() || ''
//       })

//       // Get existing details from DB
//       const existingDetails = editData.details || []

//       // Fetch fresh GDN and MERGE
//       if (editData.gdnId) {
//         triggerGetGdn(editData.gdnId).then(result => {
//           if (result.data && result.data.length > 0 && result.data[0].details) {
//             const freshGdnDetails = result.data[0].details
//             setGdnDetails(freshGdnDetails)

//             // MERGE: Fresh GDN + Existing DB Data
//             const mergedDutyItems: DutyStructureItem[] = freshGdnDetails.map(gdn => {
//               const itemId = gdn.item?.id || gdn.Item_ID
//               const itemName = gdn.item?.itemName || ''

//               // Check if item exists in DB
//               const existingItem = existingDetails.find(d => d.itemId === itemId)

//               if (existingItem) {
//                 // EXISTING ITEM - Use DB values (user's saved data)
//                 return {
//                   id: existingItem.id,
//                   itemId,
//                   itemName,
//                   cd: existingItem.cd?.toString() || '0',
//                   acd: existingItem.acd?.toString() || '0',
//                   rd: existingItem.rd?.toString() || '0',
//                   salesTax: existingItem.salesTax?.toString() || '0',
//                   addSalesTax: existingItem.addSalesTax?.toString() || '0',
//                   itaxImport: existingItem.itaxImport?.toString() || '0',
//                   furtherTax: existingItem.furtherTax?.toString() || '0',
//                   incomeTaxWithheld: existingItem.incomeTaxWithheld?.toString() || '0',
//                   assessedPrice: existingItem.assessedPrice?.toString() || '0',
//                   assessedQty: existingItem.assessedQty?.toString() || '0',
//                   priceFC: existingItem.priceFC?.toString() || '0'
//                 }
//               } else {
//                 // NEW ITEM - Use GDN defaults
//                 return {
//                   itemId,
//                   itemName,
//                   cd: gdn.item?.cd || '0',
//                   acd: gdn.item?.acd || '0',
//                   rd: gdn.item?.rd || '0',
//                   salesTax: gdn.item?.salesTax || '0',
//                   addSalesTax: gdn.item?.addSalesTax || '0',
//                   itaxImport: gdn.item?.itaxImport || '0',
//                   furtherTax: gdn.item?.furtherTax || '0',
//                   incomeTaxWithheld: gdn.item?.incomeTaxWithheld || '0',
//                   assessedPrice: gdn.item?.assessedPrice || '0',
//                   assessedQty: '0',
//                   priceFC: gdn.item?.purchasePriceFC || '0'
//                 }
//               }
//             })

//             setDutyItems(mergedDutyItems)
//           }
//         })
//       }

//       // Fetch Journal Details for edit mode
//       if (editData.lcId) {
//         triggerGetJournalDetails(editData.lcId).then(result => {
//           if (result.data && result.data.length > 0) {
//             const expenses: ExpenseItem[] = result.data.map(j => ({
//               id: j.id,
//               jmId: j.jmId,
//               lineId: j.lineId,
//               coaId: j.coaId,
//               description: j.description || '',
//               rate: j.rate?.toString() || '0',
//               ownDb: j.ownDb?.toString() || '0',
//               amountDb: j.amountDb || 0,
//               isCost: j.isCost || false
//             }))
//             setExpenseItems(expenses)
//           }
//         })
//       }
//     }
//   }, [mode, editData, triggerGetGdn, triggerGetJournalDetails])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   const handleChange = useCallback((field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//     setErrors(prev => ({ ...prev, [field]: '' }))
//     setApiError('')
//   }, [])

//   const handleDutyItemChange = useCallback((index: number, field: string, value: string) => {
//     setDutyItems(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }, [])

//   const handlePriceFCChange = useCallback((itemId: number, value: string) => {
//     setDutyItems(prev => {
//       const index = prev.findIndex(d => d.itemId === itemId)
//       if (index === -1) return prev
//       const updated = [...prev]
//       updated[index] = { ...updated[index], priceFC: value }
//       return updated
//     })
//   }, [])

//   const handleExpenseItemChange = useCallback((index: number, field: string, value: string | boolean) => {
//     setExpenseItems(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [field]: value }
//       return updated
//     })
//   }, [])

//   // =============================================
//   // VALIDATION
//   // =============================================

//   const validate = useCallback(() => {
//     const newErrors: Record<string, string> = {}
//     if (!formData.lcId) newErrors.lcId = 'LC is required'
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData])

//   const handleSaveClick = useCallback(() => {
//     if (validate()) setShowConfirm(true)
//   }, [validate])

//   // =============================================
//   // PREPARE DETAILS FOR SAVE
//   // =============================================

//   const prepareDetails = useCallback(() => {
//     return dutyItems.map(duty => ({
//       itemId: duty.itemId,
//       cd: parseFloat(duty.cd) || 0,
//       acd: parseFloat(duty.acd) || 0,
//       rd: parseFloat(duty.rd) || 0,
//       salesTax: parseFloat(duty.salesTax) || 0,
//       addSalesTax: parseFloat(duty.addSalesTax) || 0,
//       itaxImport: parseFloat(duty.itaxImport) || 0,
//       furtherTax: parseFloat(duty.furtherTax) || 0,
//       incomeTaxWithheld: parseFloat(duty.incomeTaxWithheld) || 0,
//       assessedPrice: parseFloat(duty.assessedPrice) || 0,
//       priceFC: parseFloat(duty.priceFC || '0') || 0,
//       assessedQty: parseFloat(duty.assessedQty) || 0
//     }))
//   }, [dutyItems])

//   // =============================================
//   // SAVE
//   // =============================================

//   const handleConfirmSave = useCallback(async () => {
//     setShowConfirm(false)

//     const payload = {
//       lcId: formData.lcId!,
//       gdnId: formData.gdnId || null,
//       shipperId: formData.shipperId || null,
//       consigneeId: formData.consigneeId || null,
//       bankNameId: formData.bankNameId || null,
//       contactTypeId: formData.contactTypeId || null,
//       bl: formData.bl || null,
//       container: formData.container || null,
//       containerCount: parseInt(formData.containerCount) || 0,
//       containerSize: formData.containerSize || null,
//       inv: formData.inv || null,
//       currencyId: formData.currencyId || null,
//       amount: parseInt(formData.amount) || 0,
//       clearingAgentId: formData.clearingAgentId || null,
//       gd: formData.gd || null,
//       gdDate: formData.gdDate || null,
//       exchangeRateDuty: parseFloat(formData.exchangeRateDuty) || 0,
//       exchangeRateDocuments: effectiveExchangeRateDocuments,
//       totalExp: effectiveTotalExp,
//       averageDollarRate: parseFloat(formData.averageDollarRate) || 0,
//       paymentDate: formData.paymentDate || null,
//       itemDescription: formData.itemDescription || null,
//       landedCost: parseFloat(formData.landedCost) || 0,
//       details: prepareDetails()
//     }

//     try {
//       if (mode === 'create') {
//         await createLcMain(payload).unwrap()
//       } else {
//         await updateLcMain({ id: id!, ...payload }).unwrap()
//         await syncDetails({ id: id!, details: prepareDetails() }).unwrap()
//       }

//       // Update Journal Details (Expenses)
//       if (expenseItems.length > 0) {
//         const updates = expenseItems.map(item => ({
//           id: item.id,
//           description: item.description,
//           rate: parseFloat(item.rate) || 0,
//           ownDb: parseFloat(item.ownDb) || 0,
//           isCost: item.isCost
//         }))
//         await updateJournalDetails({ updates }).unwrap()
//         console.log('✅ Journal details updated')
//       }

//       router.push('/lc-main')
//     } catch (error: any) {
//       setApiError(error?.data?.message || 'Failed to save LC Main')
//     }
//   }, [mode, id, formData, effectiveExchangeRateDocuments, effectiveTotalExp, prepareDetails, expenseItems, createLcMain, updateLcMain, syncDetails, updateJournalDetails, router])

//   // =============================================
//   // LOADING
//   // =============================================

//   if (mode === 'edit' && isLoadingEdit) {
//     return <Loading size="lg" text="Loading LC Main..." />
//   }

//   // =============================================
//   // TABS
//   // =============================================

//   const tabs = [
//     { id: 'main', label: 'Main Details', icon: FileText },
//     { id: 'details', label: 'Details', icon: FileSpreadsheet },
//     { id: 'duty', label: 'Duty Structure', icon: Receipt },
//     { id: 'calculation', label: 'Calculation', icon: Calculator },
//     { id: 'expenses', label: 'Expenses', icon: Wallet }
//   ]

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Landmark className="w-8 h-8 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {mode === 'create' ? 'Create New LC Main' : 'Edit LC Main'}
//               </h1>
//               <p className="text-blue-100 mt-1">
//                 {mode === 'create' ? 'Fill in the details below' : `Editing LC Main #${id}`}
//               </p>
//             </div>
//           </div>
//           <Button
//             variant="secondary"
//             onClick={() => router.push('/lc-main')}
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

//       {/* Tabs */}
//       <div className="bg-white rounded-lg border border-gray-200 mb-6">
//         <div className="flex border-b border-gray-200 overflow-x-auto">
//           {tabs.map((tab) => {
//             const Icon = tab.icon
//             const isActive = activeTab === tab.id
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as any)}
//                 className={clsx(
//                   'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
//                   isActive
//                     ? 'border-[#509ee3] text-[#509ee3] bg-blue-50/50'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 )}
//               >
//                 <Icon className={clsx('w-5 h-5 mr-2', isActive ? 'text-[#509ee3]' : 'text-gray-400')} />
//                 {tab.label}
//               </button>
//             )
//           })}
//         </div>

//         <div className="p-6">
//           {/* TAB 1: Main Details */}
//           {activeTab === 'main' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* LC */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Landmark className="w-4 h-4 inline mr-1" />
//                   LC <span className="text-red-500">*</span>
//                 </label>
//                 <LcCoaSearchableInput
//                   value={formData.lcId}
//                   onChange={(id) => handleLcChange(id)}
//                   excludeIds={usedCoaIds}
//                   placeholder="Select LC..."
//                   clearable
//                 />
//                 {errors.lcId && <p className="mt-1 text-sm text-red-600">{errors.lcId}</p>}
//                 {isLoadingGdn && <p className="mt-2 text-sm text-gray-500">Loading GDN...</p>}
//                 {gdnList.length > 0 && (
//                   <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
//                     <p className="text-sm text-green-700">GDN: <strong>{gdnList[0]?.Number}</strong></p>
//                   </div>
//                 )}
//               </div>

//               {/* Shipper */}
//               <MasterTypeSearchableInput
//                 type={1}
//                 value={formData.shipperId}
//                 onChange={(id) => handleChange('shipperId', id)}
//                 label="Shipper"
//                 clearable
//               />

//               {/* Consignee */}
//               <MasterTypeSearchableInput
//                 type={2}
//                 value={formData.consigneeId}
//                 onChange={(id) => handleChange('consigneeId', id)}
//                 label="Consignee"
//                 clearable
//               />

//               {/* Bank Name */}
//               <MasterTypeSearchableInput
//                 type={3}
//                 value={formData.bankNameId}
//                 onChange={(id) => handleChange('bankNameId', id)}
//                 label="Bank Name"
//                 clearable
//               />

//               {/* Contact Type */}
//               <MasterTypeSearchableInput
//                 type={4}
//                 value={formData.contactTypeId}
//                 onChange={(id) => handleChange('contactTypeId', id)}
//                 label="Contact Type"
//                 clearable
//               />

//               {/* B/L */}
//               <Input
//                 label="B/L"
//                 value={formData.bl}
//                 onChange={(e) => handleChange('bl', e.target.value)}
//                 icon={<FileText className="w-4 h-4" />}
//               />

//               {/* Container */}
//               <Input
//                 label="Container"
//                 value={formData.container}
//                 onChange={(e) => handleChange('container', e.target.value)}
//                 icon={<Package className="w-4 h-4" />}
//               />

//               {/* Container Count */}
//               <Input
//                 label="Container Count"
//                 value={formData.containerCount}
//                 onChange={(e) => handleChange('containerCount', e.target.value)}
//                 icon={<Hash className="w-4 h-4" />}
//               />

//               {/* Container Size */}
//               <Input
//                 label="Container Size"
//                 value={formData.containerSize}
//                 onChange={(e) => handleChange('containerSize', e.target.value)}
//                 icon={<Package className="w-4 h-4" />}
//               />

//               {/* Invoice */}
//               <Input
//                 label="Invoice"
//                 value={formData.inv}
//                 onChange={(e) => handleChange('inv', e.target.value)}
//                 icon={<FileText className="w-4 h-4" />}
//               />

//               {/* Currency */}
//               <CurrencySearchableInput
//                 value={formData.currencyId}
//                 onChange={(id) => handleChange('currencyId', id)}
//                 label="Currency"
//                 clearable
//               />

//               {/* Amount */}
//               <Input
//                 label="Amount"
//                 value={formData.amount}
//                 onChange={(e) => handleChange('amount', e.target.value)}
//                 icon={<DollarSign className="w-4 h-4" />}
//               />

//               {/* Clearing Agent */}
//               <MasterTypeSearchableInput
//                 type={5}
//                 value={formData.clearingAgentId}
//                 onChange={(id) => handleChange('clearingAgentId', id)}
//                 label="Clearing Agent"
//                 clearable
//               />

//               {/* GD */}
//               <Input
//                 label="GD"
//                 value={formData.gd}
//                 onChange={(e) => handleChange('gd', e.target.value)}
//                 icon={<FileText className="w-4 h-4" />}
//               />

//               {/* GD Date */}
//               <Input
//                 label="GD Date"
//                 type="date"
//                 value={formData.gdDate}
//                 onChange={(e) => handleChange('gdDate', e.target.value)}
//                 icon={<Calendar className="w-4 h-4" />}
//               />

//               {/* Exchange Rate Duty */}
//               <Input
//                 label="Exchange Rate Duty"
//                 value={formData.exchangeRateDuty}
//                 onChange={(e) => handleChange('exchangeRateDuty', e.target.value)}
//                 icon={<DollarSign className="w-4 h-4" />}
//               />

//               {/* Exchange Rate Documents (Auto-calculated) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <DollarSign className="w-4 h-4 inline mr-1" />
//                   Exchange Rate Documents
//                   {calculatedExchangeRateDocuments > 0 && (
//                     <span className="ml-2 text-xs text-green-600">(Auto from Expenses)</span>
//                   )}
//                 </label>
//                 <input
//                   type="text"
//                   value={effectiveExchangeRateDocuments.toFixed(4)}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//                 />
//               </div>

//               {/* Total Expenses (Auto-calculated) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <DollarSign className="w-4 h-4 inline mr-1" />
//                   Total Expenses
//                   {calculatedTotalExp > 0 && (
//                     <span className="ml-2 text-xs text-green-600">(Auto from Expenses)</span>
//                   )}
//                 </label>
//                 <input
//                   type="text"
//                   value={effectiveTotalExp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//                 />
//               </div>

//               {/* Average Dollar Rate */}
//               <Input
//                 label="Average Dollar Rate"
//                 value={formData.averageDollarRate}
//                 onChange={(e) => handleChange('averageDollarRate', e.target.value)}
//                 icon={<DollarSign className="w-4 h-4" />}
//               />

//               {/* Payment Date */}
//               <Input
//                 label="Payment Date"
//                 type="date"
//                 value={formData.paymentDate}
//                 onChange={(e) => handleChange('paymentDate', e.target.value)}
//                 icon={<Calendar className="w-4 h-4" />}
//               />

//               {/* Landed Cost */}
//               <Input
//                 label="Landed Cost"
//                 value={formData.landedCost}
//                 onChange={(e) => handleChange('landedCost', e.target.value)}
//                 icon={<DollarSign className="w-4 h-4" />}
//               />

//               {/* Item Description */}
//               <div className="md:col-span-2 lg:col-span-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Item Description</label>
//                 <textarea
//                   value={formData.itemDescription}
//                   onChange={(e) => handleChange('itemDescription', e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
//                 />
//               </div>
//             </div>
//           )}

//           {/* TAB 3: Details */}
//           {activeTab === 'details' && (
//             <LcDetailsTab
//               gdnDetails={gdnDetails}
//               dutyItems={dutyItems}
//               exchangeRateDocuments={effectiveExchangeRateDocuments}
//               totalExp={effectiveTotalExp}
//               exchangeRateDuty={effectiveExchangeRateDuty}
//               landedCost={parseFloat(formData.landedCost) || 1.01}
//               onPriceFCChange={handlePriceFCChange}
//             />
//           )}

//           {/* TAB 2: Duty Structure */}
//           {activeTab === 'duty' && (
//             <LcDutyStructure
//               items={dutyItems}
//               onItemChange={handleDutyItemChange}
//             />
//           )}



//           {/* TAB 4: Calculation Summary */}
//           {activeTab === 'calculation' && (
//             <LcCalculationTab
//               gdnDetails={gdnDetails}
//               dutyItems={dutyItems}
//               exchangeRate={effectiveExchangeRateDocuments}
//               exchangeRateDuty={effectiveExchangeRateDuty}
//               landedCost={parseFloat(formData.landedCost) || 1.01}
//             />
//           )}

//           {/* TAB 5: Expenses */}
//           {activeTab === 'expenses' && (
//             <LcExpensesTab
//               items={expenseItems}
//               onItemChange={handleExpenseItemChange}
//             />
//           )}
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4">
//         <div className="flex items-center justify-between">
//           <div className="text-lg text-gray-500">
//             {expenseItems.length > 0 && (
//               <>
//                 <span>
//                   Total Exp: <strong className="text-orange-600">{effectiveTotalExp.toLocaleString()}</strong>

//                 </span>
//                 <div>
//                   Ex. Rate Doc: <strong className="text-blue-600">{effectiveExchangeRateDocuments.toFixed(4)}</strong>
//                 </div>
//               </>


//             )}
//           </div>
//           <div className="flex items-center gap-4">
//             <Button variant="outline" onClick={() => router.push('/lc-main')}>Cancel</Button>
//             <Button
//               variant="primary"
//               onClick={handleSaveClick}
//               loading={isCreating || isUpdating || isSyncing || isUpdatingJournal}
//               icon={<Save className="w-4 h-4" />}
//             >
//               {mode === 'create' ? 'Create LC Main' : 'Update LC Main'}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleConfirmSave}
//         title={mode === 'create' ? 'Create LC Main' : 'Update LC Main'}
//         message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this LC Main record?`}
//         confirmText={mode === 'create' ? 'Create' : 'Update'}
//         type="info"
//         loading={isCreating || isUpdating || isSyncing || isUpdatingJournal}
//       />
//     </div>
//   )
// }

// export default LcMainForm





































































// components/lc-main/LcMainForm.tsx

'use client'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetLcMainByIdQuery,
  useCreateLcMainMutation,
  useUpdateLcMainMutation,
  useSyncDetailsMutation,
  useGetUsedCoaIdsQuery,
  useLazyGetAllGdnQuery,
  useLazyGetGdnQuery,
  useLazyGetJournalDetailsByCoaQuery,
  useUpdateJournalDetailsMutation,
  GdnDetailData
} from '@/store/slice/lcMainSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import LcCoaSearchableInput from '@/components/common/SearchableInput/LcCoaSearchableInput'
import { CurrencySearchableInput } from '@/components/common/SearchableInput/CurrencySearchableInput'
import { MasterTypeSearchableInput } from '@/components/common/SearchableInput/MasterTypeSearchableInput'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import LcDutyStructure, { DutyStructureItem } from './LcDutyStructure'
import LcDetailsTab from './LcDetailsTab'
import LcCalculationTab from './LcCalculationTab'
import LcExpensesTab, { ExpenseItem } from './LcExpensesTab'
import LcDetailsPrint from './LcDetailsPrint'
import {
  Save, ArrowLeft, AlertCircle, Landmark, FileText, Calendar,
  DollarSign, Package, Hash, Receipt, FileSpreadsheet, Calculator,
  Wallet, Printer
} from 'lucide-react'
import { clsx } from 'clsx'

// =============================================
// TYPES
// =============================================

interface LcMainFormProps {
  mode: 'create' | 'edit'
  id?: number
}

// =============================================
// COMPONENT
// =============================================

const LcMainForm: React.FC<LcMainFormProps> = ({ mode, id }) => {
  const router = useRouter()

  // =============================================
  // REFS
  // =============================================

  const printRef = useRef<HTMLDivElement>(null)

  // =============================================
  // STATE
  // =============================================

  const [activeTab, setActiveTab] = useState<'main' | 'duty' | 'details' | 'calculation' | 'expenses'>('main')

  const [formData, setFormData] = useState({
    lcId: null as number | null,
    gdnId: null as number | null,
    shipperId: null as number | null,
    consigneeId: null as number | null,
    bankNameId: null as number | null,
    contactTypeId: null as number | null,
    bl: '',
    container: '',
    containerCount: '',
    containerSize: '',
    inv: '',
    currencyId: null as number | null,
    amount: '',
    clearingAgentId: null as number | null,
    gd: '',
    gdDate: '',
    exchangeRateDuty: '',
    exchangeRateDocuments: '',
    totalExp: '',
    averageDollarRate: '',
    paymentDate: '',
    itemDescription: '',
    landedCost: ''
  })

  const [dutyItems, setDutyItems] = useState<DutyStructureItem[]>([])
  const [gdnDetails, setGdnDetails] = useState<GdnDetailData[]>([])
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: editData, isLoading: isLoadingEdit } = useGetLcMainByIdQuery(id!, {
    skip: mode !== 'edit' || !id
  })

  const { data: usedCoaIds = [] } = useGetUsedCoaIdsQuery(mode === 'edit' ? id : undefined)

  const [triggerGetAllGdn, { data: gdnList = [], isLoading: isLoadingGdn }] = useLazyGetAllGdnQuery()
  const [triggerGetGdn, { isLoading: isLoadingGdnDetail }] = useLazyGetGdnQuery()
  const [triggerGetJournalDetails, { isLoading: isLoadingJournalDetails }] = useLazyGetJournalDetailsByCoaQuery()

  const [createLcMain, { isLoading: isCreating }] = useCreateLcMainMutation()
  const [updateLcMain, { isLoading: isUpdating }] = useUpdateLcMainMutation()
  const [syncDetails, { isLoading: isSyncing }] = useSyncDetailsMutation()
  const [updateJournalDetails, { isLoading: isUpdatingJournal }] = useUpdateJournalDetailsMutation()

  // =============================================
  // AUTO-CALCULATE FROM EXPENSES (REAL-TIME)
  // =============================================

  const calculatedTotalExp = useMemo(() => {
    return expenseItems
      .filter(item => item.isCost === true)
      .reduce((sum, item) => sum + (parseFloat(item.amountDb) || 0), 0)
  }, [expenseItems])

  const calculatedExchangeRateDocuments = useMemo(() => {
    const documentsRow = expenseItems.find(
      item => item.description?.toLowerCase() === 'documents'
    )
    return documentsRow ? parseFloat(documentsRow.rate) || 0 : 0
  }, [expenseItems])

  const effectiveTotalExp = calculatedTotalExp || parseFloat(formData.totalExp) || 0
  const effectiveExchangeRateDocuments = calculatedExchangeRateDocuments || parseFloat(formData.exchangeRateDocuments) || 0
  const effectiveExchangeRateDuty = parseFloat(formData.exchangeRateDuty) || effectiveExchangeRateDocuments || 0

  // =============================================
  // HANDLE LC CHANGE
  // =============================================

  const handleLcChange = useCallback(async (lcId: number | null) => {
    setFormData(prev => ({ ...prev, lcId, gdnId: null }))
    setErrors(prev => ({ ...prev, lcId: '' }))
    setApiError('')
    setDutyItems([])
    setGdnDetails([])
    setExpenseItems([])

    if (lcId) {
      try {
        const result = await triggerGetAllGdn(lcId).unwrap()
        if (result && result.length > 0) {
          const gdnId = result[0].ID
          setFormData(prev => ({ ...prev, gdnId }))
          handleGdnSelect(gdnId)
        }
      } catch (error) {
        console.error('Error fetching GDN:', error)
      }

      try {
        const journalResult = await triggerGetJournalDetails(lcId).unwrap()
        if (journalResult && journalResult.length > 0) {
          const expenses: ExpenseItem[] = journalResult.map(j => ({
            id: j.id,
            jmId: j.jmId,
            lineId: j.lineId,
            coaId: j.coaId,
            description: j.description || '',
            rate: j.rate?.toString() || '0',
            ownDb: j.ownDb?.toString() || '0',
            amountDb: j.amountDb || 0,
            isCost: j.isCost || false
          }))
          setExpenseItems(expenses)
          console.log(`✅ Loaded ${expenses.length} expense items`)
        }
      } catch (error) {
        console.error('Error fetching journal details:', error)
      }
    }
  }, [triggerGetAllGdn, triggerGetJournalDetails])

  // =============================================
  // HANDLE GDN SELECT
  // =============================================

  const handleGdnSelect = useCallback(async (gdnId: number) => {
    try {
      const result = await triggerGetGdn(gdnId).unwrap()

      if (result && result.length > 0 && result[0].details) {
        const details = result[0].details
        setGdnDetails(details)

        const duty: DutyStructureItem[] = details.map(d => ({
          itemId: d.item?.id || d.Item_ID,
          itemName: d.item?.itemName || '',
          cd: d.item?.cd || '0',
          acd: d.item?.acd || '0',
          rd: d.item?.rd || '0',
          salesTax: d.item?.salesTax || '0',
          addSalesTax: d.item?.addSalesTax || '0',
          itaxImport: d.item?.itaxImport || '0',
          furtherTax: d.item?.furtherTax || '0',
          incomeTaxWithheld: d.item?.incomeTaxWithheld || '0',
          assessedPrice: d.item?.assessedPrice || '0',
          assessedQty: '0',
          priceFC: d.item?.purchasePriceFC || '0'
        }))

        setDutyItems(duty)
      }
    } catch (error) {
      console.error('Error fetching GDN details:', error)
    }
  }, [triggerGetGdn])

  // =============================================
  // POPULATE FORM IN EDIT MODE
  // =============================================

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({
        lcId: editData.lcId,
        gdnId: editData.gdnId,
        shipperId: editData.shipperId,
        consigneeId: editData.consigneeId,
        bankNameId: editData.bankNameId,
        contactTypeId: editData.contactTypeId,
        bl: editData.bl || '',
        container: editData.container || '',
        containerCount: editData.containerCount?.toString() || '',
        containerSize: editData.containerSize || '',
        inv: editData.inv || '',
        currencyId: editData.currencyId,
        amount: editData.amount?.toString() || '',
        clearingAgentId: editData.clearingAgentId,
        gd: editData.gd || '',
        gdDate: editData.gdDate || '',
        exchangeRateDuty: editData.exchangeRateDuty?.toString() || '',
        exchangeRateDocuments: editData.exchangeRateDocuments?.toString() || '',
        totalExp: editData.totalExp?.toString() || '',
        averageDollarRate: editData.averageDollarRate?.toString() || '',
        paymentDate: editData.paymentDate || '',
        itemDescription: editData.itemDescription || '',
        landedCost: editData.landedCost?.toString() || ''
      })

      const existingDetails = editData.details || []

      if (editData.gdnId) {
        triggerGetGdn(editData.gdnId).then(result => {
          if (result.data && result.data.length > 0 && result.data[0].details) {
            const freshGdnDetails = result.data[0].details
            setGdnDetails(freshGdnDetails)

            const mergedDutyItems: DutyStructureItem[] = freshGdnDetails.map(gdn => {
              const itemId = gdn.item?.id || gdn.Item_ID
              const itemName = gdn.item?.itemName || ''
              const existingItem = existingDetails.find(d => d.itemId === itemId)

              if (existingItem) {
                return {
                  id: existingItem.id,
                  itemId,
                  itemName,
                  cd: existingItem.cd?.toString() || '0',
                  acd: existingItem.acd?.toString() || '0',
                  rd: existingItem.rd?.toString() || '0',
                  salesTax: existingItem.salesTax?.toString() || '0',
                  addSalesTax: existingItem.addSalesTax?.toString() || '0',
                  itaxImport: existingItem.itaxImport?.toString() || '0',
                  furtherTax: existingItem.furtherTax?.toString() || '0',
                  incomeTaxWithheld: existingItem.incomeTaxWithheld?.toString() || '0',
                  assessedPrice: existingItem.assessedPrice?.toString() || '0',
                  assessedQty: existingItem.assessedQty?.toString() || '0',
                  priceFC: existingItem.priceFC?.toString() || '0'
                }
              } else {
                return {
                  itemId,
                  itemName,
                  cd: gdn.item?.cd || '0',
                  acd: gdn.item?.acd || '0',
                  rd: gdn.item?.rd || '0',
                  salesTax: gdn.item?.salesTax || '0',
                  addSalesTax: gdn.item?.addSalesTax || '0',
                  itaxImport: gdn.item?.itaxImport || '0',
                  furtherTax: gdn.item?.furtherTax || '0',
                  incomeTaxWithheld: gdn.item?.incomeTaxWithheld || '0',
                  assessedPrice: gdn.item?.assessedPrice || '0',
                  assessedQty: '0',
                  priceFC: gdn.item?.purchasePriceFC || '0'
                }
              }
            })

            setDutyItems(mergedDutyItems)
          }
        })
      }

      if (editData.lcId) {
        triggerGetJournalDetails(editData.lcId).then(result => {
          if (result.data && result.data.length > 0) {
            const expenses: ExpenseItem[] = result.data.map(j => ({
              id: j.id,
              jmId: j.jmId,
              lineId: j.lineId,
              coaId: j.coaId,
              description: j.description || '',
              rate: j.rate?.toString() || '0',
              ownDb: j.ownDb?.toString() || '0',
              amountDb: j.amountDb || 0,
              isCost: j.isCost || false
            }))
            setExpenseItems(expenses)
          }
        })
      }
    }
  }, [mode, editData, triggerGetGdn, triggerGetJournalDetails])

  // =============================================
  // HANDLERS
  // =============================================

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }, [])

  const handleDutyItemChange = useCallback((index: number, field: string, value: string) => {
    setDutyItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const handlePriceFCChange = useCallback((itemId: number, value: string) => {
    setDutyItems(prev => {
      const index = prev.findIndex(d => d.itemId === itemId)
      if (index === -1) return prev
      const updated = [...prev]
      updated[index] = { ...updated[index], priceFC: value }
      return updated
    })
  }, [])

  const handleExpenseItemChange = useCallback((index: number, field: string, value: string | boolean) => {
    setExpenseItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  // =============================================
  // PRINT HANDLER
  // =============================================

  // const handlePrintDetails = useCallback(() => {
  //   const printContent = printRef.current
  //   if (!printContent) {
  //     console.error('Print content not found')
  //     return
  //   }

  //   const printWindow = window.open('', '_blank', 'width=1200,height=800')
  //   if (!printWindow) {
  //     alert('Please allow popups to print')
  //     return
  //   }

  //   const lcName = editData?.lc?.acName || `LC-${formData.lcId}`

  //   printWindow.document.write(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>LC Details - ${lcName}</title>
  //         <style>
  //           @page {
  //             size: A4 landscape;
  //             margin: 8mm;
  //           }

  //           * {
  //             margin: 0;
  //             padding: 0;
  //             box-sizing: border-box;
  //           }

  //           body {
  //             font-family: Arial, sans-serif;
  //             font-size: 10px;
  //             color: #333;
  //             -webkit-print-color-adjust: exact !important;
  //             print-color-adjust: exact !important;
  //           }

  //           .print-container {
  //             width: 100%;
  //             padding: 10px;
  //           }

  //           .print-header {
  //             text-align: center;
  //             margin-bottom: 15px;
  //             padding-bottom: 10px;
  //             border-bottom: 2px solid #333;
  //           }

  //           .print-title {
  //             font-size: 18px;
  //             font-weight: bold;
  //             margin-bottom: 5px;
  //             color: #1a1a1a;
  //           }

  //           .print-subtitle {
  //             font-size: 11px;
  //             color: #666;
  //           }

  //           .print-info {
  //             display: flex;
  //             flex-wrap: wrap;
  //             justify-content: space-between;
  //             margin-bottom: 15px;
  //             font-size: 10px;
  //             gap: 10px;
  //             background: #f5f5f5;
  //             padding: 10px;
  //             border-radius: 4px;
  //           }

  //           .print-info-item {
  //             display: inline-block;
  //           }

  //           .print-info-label {
  //             font-weight: bold;
  //             color: #333;
  //           }

  //           .print-table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             font-size: 9px;
  //             margin-bottom: 15px;
  //           }

  //           .print-table th {
  //             background-color: #e8e8e8 !important;
  //             border: 1px solid #333;
  //             padding: 6px 4px;
  //             text-align: center;
  //             font-weight: bold;
  //             font-size: 8px;
  //             text-transform: uppercase;
  //             color: #333;
  //           }

  //           .print-table td {
  //             border: 1px solid #333;
  //             padding: 5px 4px;
  //             vertical-align: middle;
  //           }

  //           .print-table tbody tr:nth-child(even) {
  //             background-color: #fafafa !important;
  //           }

  //           .print-table tfoot td {
  //             background-color: #d9d9d9 !important;
  //             font-weight: bold;
  //             border: 1px solid #333;
  //             font-size: 9px;
  //           }

  //           .text-right { text-align: right; }
  //           .text-center { text-align: center; }
  //           .text-left { text-align: left; }
  //           .font-bold { font-weight: bold; }

  //           .text-green { color: #16a34a !important; }
  //           .text-purple { color: #7c3aed !important; }
  //           .text-orange { color: #ea580c !important; }
  //           .text-teal { color: #0d9488 !important; }
  //           .text-indigo { color: #4f46e5 !important; }
  //           .text-blue { color: #2563eb !important; }

  //           .print-footer {
  //             margin-top: 15px;
  //             padding-top: 10px;
  //             border-top: 1px solid #ccc;
  //             font-size: 9px;
  //             text-align: center;
  //             color: #666;
  //           }

  //           .print-table thead { display: table-header-group; }
  //           .print-table tfoot { display: table-footer-group; }
  //           .print-table tbody { display: table-row-group; }
  //           .print-table tr { page-break-inside: avoid; }

  //           .uom-label {
  //             font-size: 7px;
  //             color: #888;
  //             margin-left: 2px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContent.innerHTML}
  //       </body>
  //     </html>
  //   `)

  //   printWindow.document.close()
  //   printWindow.focus()

  //   setTimeout(() => {
  //     printWindow.print()
  //     printWindow.close()
  //   }, 300)
  // }, [formData.lcId, editData])







  const handlePrintDetails = useCallback(() => {
    const printContent = printRef.current
    if (!printContent) {
      console.error('Print content not found')
      return
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) {
      alert('Please allow popups to print')
      return
    }

    const lcName = editData?.lc?.acName || `LC-${formData.lcId}`

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LC Details - ${lcName}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #333;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-container {
            width: 100%;
            padding: 10px;
          }

          .print-header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }

          .print-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1a1a1a;
          }

          .print-subtitle {
            font-size: 11px;
            color: #666;
          }

          .print-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 10px;
            gap: 10px;
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
          }

          .print-info-item {
            display: inline-block;
          }

          .print-info-label {
            font-weight: bold;
            color: #333;
          }

          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin-bottom: 15px;
          }

          .print-table th {
            background-color: #e8e8e8 !important;
            border: 1px solid #333;
            padding: 6px 4px;
            text-align: center;
            font-weight: bold;
            font-size: 8px;
            text-transform: uppercase;
            color: #333;
          }

          .print-table td {
            border: 1px solid #333;
            padding: 5px 4px;
            vertical-align: middle;
          }

          .print-table tbody tr:nth-child(even) {
            background-color: #fafafa !important;
          }

          .print-table tfoot td {
            background-color: #d9d9d9 !important;
            font-weight: bold;
            border: 1px solid #333;
            font-size: 9px;
          }

          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .font-bold { font-weight: bold; }

          .text-green { color: #16a34a !important; }
          .text-purple { color: #7c3aed !important; }
          .text-orange { color: #ea580c !important; }
          .text-teal { color: #0d9488 !important; }
          .text-indigo { color: #4f46e5 !important; }
          .text-blue { color: #2563eb !important; }

          .print-footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            font-size: 9px;
            text-align: center;
            color: #666;
          }

          .print-table thead { display: table-header-group; }
          .print-table tfoot { display: table-footer-group; }
          .print-table tbody { display: table-row-group; }
          .print-table tr { page-break-inside: avoid; }

          .uom-label {
            font-size: 7px;
            color: #888;
            margin-left: 2px;
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // ✅ Wait for content to fully load before printing
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      // ✅ Don't auto-close - let user close manually after printing
    }

    // ✅ Fallback if onload doesn't fire
    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.focus()
        printWindow.print()
      }
    }, 500)

  }, [formData.lcId, editData])















  // =============================================
  // VALIDATION
  // =============================================

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.lcId) newErrors.lcId = 'LC is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSaveClick = useCallback(() => {
    if (validate()) setShowConfirm(true)
  }, [validate])

  // =============================================
  // PREPARE DETAILS FOR SAVE
  // =============================================

  const prepareDetails = useCallback(() => {
    return dutyItems.map(duty => ({
      itemId: duty.itemId,
      cd: parseFloat(duty.cd) || 0,
      acd: parseFloat(duty.acd) || 0,
      rd: parseFloat(duty.rd) || 0,
      salesTax: parseFloat(duty.salesTax) || 0,
      addSalesTax: parseFloat(duty.addSalesTax) || 0,
      itaxImport: parseFloat(duty.itaxImport) || 0,
      furtherTax: parseFloat(duty.furtherTax) || 0,
      incomeTaxWithheld: parseFloat(duty.incomeTaxWithheld) || 0,
      assessedPrice: parseFloat(duty.assessedPrice) || 0,
      priceFC: parseFloat(duty.priceFC || '0') || 0,
      assessedQty: parseFloat(duty.assessedQty) || 0
    }))
  }, [dutyItems])

  // =============================================
  // SAVE
  // =============================================

  const handleConfirmSave = useCallback(async () => {
    setShowConfirm(false)

    const payload = {
      lcId: formData.lcId!,
      gdnId: formData.gdnId || null,
      shipperId: formData.shipperId || null,
      consigneeId: formData.consigneeId || null,
      bankNameId: formData.bankNameId || null,
      contactTypeId: formData.contactTypeId || null,
      bl: formData.bl || null,
      container: formData.container || null,
      containerCount: parseInt(formData.containerCount) || 0,
      containerSize: formData.containerSize || null,
      inv: formData.inv || null,
      currencyId: formData.currencyId || null,
      amount: parseInt(formData.amount) || 0,
      clearingAgentId: formData.clearingAgentId || null,
      gd: formData.gd || null,
      gdDate: formData.gdDate || null,
      exchangeRateDuty: parseFloat(formData.exchangeRateDuty) || 0,
      exchangeRateDocuments: effectiveExchangeRateDocuments,
      totalExp: effectiveTotalExp,
      averageDollarRate: parseFloat(formData.averageDollarRate) || 0,
      paymentDate: formData.paymentDate || null,
      itemDescription: formData.itemDescription || null,
      landedCost: parseFloat(formData.landedCost) || 0,
      details: prepareDetails()
    }

    try {
      if (mode === 'create') {
        await createLcMain(payload).unwrap()
      } else {
        await updateLcMain({ id: id!, ...payload }).unwrap()
        await syncDetails({ id: id!, details: prepareDetails() }).unwrap()
      }

      if (expenseItems.length > 0) {
        const updates = expenseItems.map(item => ({
          id: item.id,
          description: item.description,
          rate: parseFloat(item.rate) || 0,
          ownDb: parseFloat(item.ownDb) || 0,
          isCost: item.isCost
        }))
        await updateJournalDetails({ updates }).unwrap()
        console.log('✅ Journal details updated')
      }

      router.push('/lc-main')
    } catch (error: any) {
      setApiError(error?.data?.message || 'Failed to save LC Main')
    }
  }, [mode, id, formData, effectiveExchangeRateDocuments, effectiveTotalExp, prepareDetails, expenseItems, createLcMain, updateLcMain, syncDetails, updateJournalDetails, router])

  // =============================================
  // LOADING
  // =============================================

  if (mode === 'edit' && isLoadingEdit) {
    return <Loading size="lg" text="Loading LC Main..." />
  }

  // =============================================
  // TABS
  // =============================================

  const tabs = [
    { id: 'main', label: 'Main Details', icon: FileText },
    { id: 'details', label: 'Details', icon: FileSpreadsheet },
    { id: 'duty', label: 'Duty Structure', icon: Receipt },
    { id: 'calculation', label: 'Calculation', icon: Calculator },
    { id: 'expenses', label: 'Expenses', icon: Wallet }
  ]

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Landmark className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'Create New LC Main' : 'Edit LC Main'}
              </h1>
              <p className="text-blue-100 mt-1">
                {mode === 'create' ? 'Fill in the details below' : `Editing LC Main #${id}`}
              </p>
            </div>
          </div>

          {/* Header Buttons */}
          <div className="flex items-center gap-3">
            {gdnDetails.length > 0 && (
              <Button
                variant="secondary"
                onClick={handlePrintDetails}
                icon={<Printer className="w-4 h-4" />}
                className="bg-white text-[#509ee3] hover:bg-gray-100"
              >
                Print Details
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => router.push('/lc-main')}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="bg-white text-[#509ee3] hover:bg-gray-100"
            >
              Back to List
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{apiError}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-[#509ee3] text-[#509ee3] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className={clsx('w-5 h-5 mr-2', isActive ? 'text-[#509ee3]' : 'text-gray-400')} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {/* TAB 1: Main Details */}
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* LC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Landmark className="w-4 h-4 inline mr-1" />
                  LC <span className="text-red-500">*</span>
                </label>
                <LcCoaSearchableInput
                  value={formData.lcId}
                  onChange={(id) => handleLcChange(id)}
                  excludeIds={usedCoaIds}
                  placeholder="Select LC..."
                  clearable
                />
                {errors.lcId && <p className="mt-1 text-sm text-red-600">{errors.lcId}</p>}
                {isLoadingGdn && <p className="mt-2 text-sm text-gray-500">Loading GDN...</p>}
                {gdnList.length > 0 && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-sm text-green-700">GDN: <strong>{gdnList[0]?.Number}</strong></p>
                  </div>
                )}
              </div>

              {/* Shipper */}
              <MasterTypeSearchableInput
                type={1}
                value={formData.shipperId}
                onChange={(id) => handleChange('shipperId', id)}
                label="Shipper"
                clearable
              />

              {/* Consignee */}
              <MasterTypeSearchableInput
                type={2}
                value={formData.consigneeId}
                onChange={(id) => handleChange('consigneeId', id)}
                label="Consignee"
                clearable
              />

              {/* Bank Name */}
              <MasterTypeSearchableInput
                type={3}
                value={formData.bankNameId}
                onChange={(id) => handleChange('bankNameId', id)}
                label="Bank Name"
                clearable
              />

              {/* Contact Type */}
              <MasterTypeSearchableInput
                type={4}
                value={formData.contactTypeId}
                onChange={(id) => handleChange('contactTypeId', id)}
                label="Contact Type"
                clearable
              />

              {/* B/L */}
              <Input
                label="B/L"
                value={formData.bl}
                onChange={(e) => handleChange('bl', e.target.value)}
                icon={<FileText className="w-4 h-4" />}
              />

              {/* Container */}
              <Input
                label="Container"
                value={formData.container}
                onChange={(e) => handleChange('container', e.target.value)}
                icon={<Package className="w-4 h-4" />}
              />

              {/* Container Count */}
              <Input
                label="Container Count"
                value={formData.containerCount}
                onChange={(e) => handleChange('containerCount', e.target.value)}
                icon={<Hash className="w-4 h-4" />}
              />

              {/* Container Size */}
              <Input
                label="Container Size"
                value={formData.containerSize}
                onChange={(e) => handleChange('containerSize', e.target.value)}
                icon={<Package className="w-4 h-4" />}
              />

              {/* Invoice */}
              <Input
                label="Invoice"
                value={formData.inv}
                onChange={(e) => handleChange('inv', e.target.value)}
                icon={<FileText className="w-4 h-4" />}
              />

              {/* Currency */}
              <CurrencySearchableInput
                value={formData.currencyId}
                onChange={(id) => handleChange('currencyId', id)}
                label="Currency"
                clearable
              />

              {/* Amount */}
              <Input
                label="Amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                icon={<DollarSign className="w-4 h-4" />}
              />

              {/* Clearing Agent */}
              <MasterTypeSearchableInput
                type={5}
                value={formData.clearingAgentId}
                onChange={(id) => handleChange('clearingAgentId', id)}
                label="Clearing Agent"
                clearable
              />

              {/* GD */}
              <Input
                label="GD"
                value={formData.gd}
                onChange={(e) => handleChange('gd', e.target.value)}
                icon={<FileText className="w-4 h-4" />}
              />

              {/* GD Date */}
              <Input
                label="GD Date"
                type="date"
                value={formData.gdDate}
                onChange={(e) => handleChange('gdDate', e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
              />

              {/* Exchange Rate Duty */}
              <Input
                label="Exchange Rate Duty"
                value={formData.exchangeRateDuty}
                onChange={(e) => handleChange('exchangeRateDuty', e.target.value)}
                icon={<DollarSign className="w-4 h-4" />}
              />

              {/* Exchange Rate Documents (Auto-calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Exchange Rate Documents
                  {calculatedExchangeRateDocuments > 0 && (
                    <span className="ml-2 text-xs text-green-600">(Auto from Expenses)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={effectiveExchangeRateDocuments.toFixed(4)}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* Total Expenses (Auto-calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Total Expenses
                  {calculatedTotalExp > 0 && (
                    <span className="ml-2 text-xs text-green-600">(Auto from Expenses)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={effectiveTotalExp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* Average Dollar Rate */}
              <Input
                label="Average Dollar Rate"
                value={formData.averageDollarRate}
                onChange={(e) => handleChange('averageDollarRate', e.target.value)}
                icon={<DollarSign className="w-4 h-4" />}
              />

              {/* Payment Date */}
              <Input
                label="Payment Date"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
              />

              {/* Landed Cost */}
              <Input
                label="Landed Cost"
                value={formData.landedCost}
                onChange={(e) => handleChange('landedCost', e.target.value)}
                icon={<DollarSign className="w-4 h-4" />}
              />

              {/* Item Description */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Description</label>
                <textarea
                  value={formData.itemDescription}
                  onChange={(e) => handleChange('itemDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Details */}
          {activeTab === 'details' && (
            <LcDetailsTab
              gdnDetails={gdnDetails}
              dutyItems={dutyItems}
              exchangeRateDocuments={effectiveExchangeRateDocuments}
              totalExp={effectiveTotalExp}
              exchangeRateDuty={effectiveExchangeRateDuty}
              landedCost={parseFloat(formData.landedCost) || 1.01}
              onPriceFCChange={handlePriceFCChange}
            />
          )}

          {/* TAB 3: Duty Structure */}
          {activeTab === 'duty' && (
            <LcDutyStructure
              items={dutyItems}
              onItemChange={handleDutyItemChange}
            />
          )}

          {/* TAB 4: Calculation Summary */}
          {activeTab === 'calculation' && (
            <LcCalculationTab
              gdnDetails={gdnDetails}
              dutyItems={dutyItems}
              exchangeRate={effectiveExchangeRateDocuments}
              exchangeRateDuty={effectiveExchangeRateDuty}
              landedCost={parseFloat(formData.landedCost) || 1.01}
            />
          )}

          {/* TAB 5: Expenses */}
          {activeTab === 'expenses' && (
            <LcExpensesTab
              items={expenseItems}
              onItemChange={handleExpenseItemChange}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg text-gray-500">
            {expenseItems.length > 0 && (
              <>
                <span>
                  Total Exp: <strong className="text-orange-600">{effectiveTotalExp.toLocaleString()}</strong>
                </span>
                <div>
                  Ex. Rate Doc: <strong className="text-blue-600">{effectiveExchangeRateDocuments.toFixed(4)}</strong>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/lc-main')}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleSaveClick}
              loading={isCreating || isUpdating || isSyncing || isUpdatingJournal}
              icon={<Save className="w-4 h-4" />}
            >
              {mode === 'create' ? 'Create LC Main' : 'Update LC Main'}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden Print Component */}
      {/* <div className="hidden">
        <LcDetailsPrint
          ref={printRef}
          lcNumber={editData?.lc?.acName || `LC-${formData.lcId}`}
          lcDate={formData.gdDate}
          partyName={editData?.shipper?.name || ''}
          gdnDetails={gdnDetails}
          dutyItems={dutyItems}
          exchangeRateDocuments={effectiveExchangeRateDocuments}
          exchangeRateDuty={effectiveExchangeRateDuty}
          totalExp={effectiveTotalExp}
          landedCost={parseFloat(formData.landedCost) || 1.01}
        />
      </div> */}





      {/* Hidden Print Component */}
      <div className="hidden">
        <LcDetailsPrint
          ref={printRef}
          lcNumber={editData?.lc?.acName || `LC-${formData.lcId}`}
          lcDate={formData.gdDate}
          partyName={editData?.shipper?.actualName || ''}  // ✅ Fixed
          gdnDetails={gdnDetails}
          dutyItems={dutyItems}
          exchangeRateDocuments={effectiveExchangeRateDocuments}
          exchangeRateDuty={effectiveExchangeRateDuty}
          totalExp={effectiveTotalExp}
          landedCost={parseFloat(formData.landedCost) || 1.01}
        />
      </div>


      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title={mode === 'create' ? 'Create LC Main' : 'Update LC Main'}
        message={`Are you sure you want to ${mode === 'create' ? 'create' : 'update'} this LC Main record?`}
        confirmText={mode === 'create' ? 'Create' : 'Update'}
        type="info"
        loading={isCreating || isUpdating || isSyncing || isUpdatingJournal}
      />
    </div>
  )
}

export default LcMainForm
