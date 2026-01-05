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

  const [formData, setFormData] = useState({
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    coaId: null as number | null,
    status: false
  })

  const [journalDetails, setJournalDetails] = useState<JournalDetail[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [validationErrors, setValidationErrors] = useState<string[]>([]) // ✅ NEW: Separate validation errors

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

  const { data: coaData = [] } = useGetCoaAccountsQuery()
  const { data: currencyData = [] } = useGetCurrenciesQuery()
  const [createVoucher, { isLoading: isCreating }] = useCreateJournalVoucherMutation()
  const [updateVoucher, { isLoading: isUpdating }] = useUpdateJournalVoucherMutation()

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

  const currencyOptions = useMemo(() => {
    return currencyData.map(currency => ({
      id: currency.id,
      label: `${currency.currencyName}`,
      currencyName: currency.currencyName
    }))
  }, [currencyData])

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
        rate: 0,
        amountDb: Number(detail.amountDb) || 0,
        amountCr: Number(detail.amountCr) || 0,
        isCost: Boolean(detail.isCost),
        currencyId: Number(detail.currencyId) || null,
        status: Boolean(detail.status),
        idCard: detail.idCard || '',
        bank: detail.bank || '',
        bankDate: detail.bankDate || ''
      }))

      setJournalDetails(mappedEntries)

    } else {
      setJournalDetails([{
        lineId: 1,
        coaId: 0,
        description: '',
        chqNo: '',
        recieptNo: '',
        ownDb: 0,
        ownCr: 0,
        rate: 0,
        amountDb: 0,
        amountCr: 0,
        isCost: false,
        currencyId: null,
        status: false,
        idCard: '',
        bank: '',
        bankDate: ''
      }])
    }
  }, [mode, initialData])

  const totals = useMemo(() => {
    const validEntries = journalDetails.filter(detail =>
      detail.coaId > 0 && (detail.amountDb > 0 || detail.amountCr > 0)
    )

    const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountDb) || 0), 0)
    const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountCr) || 0), 0)
    const difference = Math.abs(debitTotal - creditTotal)

    return { debitTotal, creditTotal, difference }
  }, [journalDetails])

  const prepareSubmissionData = () => {
    const validEntries = journalDetails.filter(detail => {
      const hasValidCoa = detail.coaId > 0
      const hasValidAmount = (Number(detail.amountDb) > 0 || Number(detail.amountCr) > 0)
      const hasDescription = detail.description && detail.description.trim() !== ''
      const isNotAutoBalance = !isAutoBalanceEntry(detail)

      return hasValidCoa && hasValidAmount && hasDescription && isNotAutoBalance
    })

    const debitTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountDb) || 0), 0)
    const creditTotal = validEntries.reduce((sum, detail) => sum + (Number(detail.amountCr) || 0), 0)
    const difference = Math.abs(debitTotal - creditTotal)

    let finalEntries = validEntries.map((detail, index) => ({
      lineId: index + 1,
      coaId: Number(detail.coaId),
      description: String(detail.description || ''),
      chqNo: String(detail.chqNo || ''),
      recieptNo: String(detail.recieptNo || ''),
      ownDb: Number(detail.ownDb || 0),
      ownCr: Number(detail.ownCr || 0),
      rate: Number(detail.rate || 0),
      amountDb: Number(detail.amountDb || 0),
      amountCr: Number(detail.amountCr || 0),
      isCost: Boolean(detail.isCost),
      currencyId: detail.currencyId ? Number(detail.currencyId) : null,
      status: Boolean(detail.status),
      idCard: detail.idCard || null,
      bank: detail.bank || null,
      bankDate: detail.bankDate || null
    }))

    if (difference > 0 && formData.coaId) {
      const autoBalanceEntry = {
        lineId: finalEntries.length + 1,
        coaId: Number(formData.coaId),
        description: 'Auto Balancing Entry',
        chqNo: '',
        recieptNo: '',
        ownDb: 0,
        ownCr: 0,
        rate: 0,
        amountDb: creditTotal > debitTotal ? difference : 0,
        amountCr: debitTotal > creditTotal ? difference : 0,
        isCost: false,
        currencyId: null,
        status: true,
        idCard: null,
        bank: null,
        bankDate: null
      }

      finalEntries.push(autoBalanceEntry)
    }

    return finalEntries
  }

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
    
    // ✅ Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
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
      rate: 0,
      amountDb: 0,
      amountCr: 0,
      isCost: false,
      currencyId: null,
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

  // ✅ BULLETPROOF: Comprehensive validation function
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    console.log('🔍 Starting validation...')
    
    const validationErrors: string[] = []
    const newErrors: { [key: string]: string } = {}

    // ✅ Header validation
    if (!formData.voucherNo || !formData.voucherNo.trim()) {
      newErrors.voucherNo = 'Voucher number is required'
      validationErrors.push('Voucher number is required')
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
      validationErrors.push('Date is required')
    }
    if (!formData.coaId) {
      newErrors.coaId = `${config.balanceLabel} is required`
      validationErrors.push(`${config.balanceLabel} is required`)
    }

    // ✅ Details validation - Check EVERY row
    let hasCompleteRows = false
    
    journalDetails.forEach((detail, index) => {
      const rowNum = index + 1
      console.log(`🔍 Checking Row ${rowNum}:`, {
        coaId: detail.coaId,
        description: detail.description?.trim(),
        amountDb: detail.amountDb,
        amountCr: detail.amountCr
      })
      
      // ✅ Check if row has ANY data
      const hasAnyData = (
        (detail.coaId && detail.coaId > 0) ||
        (detail.description && detail.description.trim() !== '') ||
        (detail.amountDb && detail.amountDb > 0) ||
        (detail.amountCr && detail.amountCr > 0) ||
        (detail.ownDb && detail.ownDb > 0) ||
        (detail.ownCr && detail.ownCr > 0) ||
        (detail.recieptNo && detail.recieptNo.trim() !== '') ||
        (detail.chqNo && detail.chqNo.trim() !== '') ||
        (detail.idCard && detail.idCard.trim() !== '') ||
        (detail.bank && detail.bank.trim() !== '') ||
        detail.bankDate ||
        detail.currencyId
      )
      
      console.log(`🔍 Row ${rowNum} hasAnyData:`, hasAnyData)
      
      if (hasAnyData) {
        // ✅ Row has data, validate required fields
        let rowHasErrors = false
        
        if (!detail.coaId || detail.coaId === 0) {
          validationErrors.push(`Row ${rowNum}: Please select an Account`)
          rowHasErrors = true
        }
        
        if (!detail.description || detail.description.trim() === '') {
          validationErrors.push(`Row ${rowNum}: Please enter Description`)
          rowHasErrors = true
        }
        
        if ((!detail.amountDb || detail.amountDb === 0) && (!detail.amountCr || detail.amountCr === 0)) {
          validationErrors.push(`Row ${rowNum}: Please enter Debit or Credit amount`)
          rowHasErrors = true
        }
        
        // ✅ Check if this row is complete
        if (!rowHasErrors) {
          hasCompleteRows = true
        }
        
        console.log(`🔍 Row ${rowNum} validation:`, { rowHasErrors, hasCompleteRows })
      }
    })

    // ✅ Must have at least one complete row
    if (!hasCompleteRows) {
      validationErrors.push('At least one complete journal entry is required (Account + Description + Debit OR Credit)')
    }

    console.log('🔍 Validation result:', { 
      validationErrors, 
      isValid: validationErrors.length === 0 
    })

    setErrors(newErrors)
    setValidationErrors(validationErrors)

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors
    }
  }

  // ✅ FIXED: Bulletproof save handler
  const handleSaveClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault() // ✅ Prevent any default behavior
      e.stopPropagation()
    }
    
    console.log('🔍 Save button clicked!')
    console.log('🔍 Current journal details:', journalDetails)
    
    // ✅ STRICT validation
    const validation = validateForm()
    
    console.log('🔍 Validation complete:', validation)
    
    if (!validation.isValid) {
      console.log('❌ VALIDATION FAILED - Showing errors and STAYING on page')
      console.log('❌ Validation errors:', validation.errors)
      
      // ✅ Force scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      return false // ✅ STOP EXECUTION
    }

    console.log('✅ Validation passed - showing confirmation')
    
    setConfirmModal({
      isOpen: true,
      action: 'save',
      title: `${mode === 'create' ? 'Create' : 'Update'} ${config.title}`,
      message: `Are you sure you want to ${mode === 'create' ? 'create this new' : 'update this'} ${config.title.toLowerCase()}?`
    })
  }

  const handleCancelClick = () => {
    setConfirmModal({
      isOpen: true,
      action: 'cancel',
      title: 'Cancel Changes',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.'
    })
  }

  const handleSubmit = async () => {
    try {
      console.log('🔍 Final submission attempt...')
      
      // ✅ Final validation check
      const validation = validateForm()
      if (!validation.isValid) {
        console.log('❌ Final validation failed - aborting')
        return
      }

      const finalDetails = prepareSubmissionData()
      
      if (finalDetails.length === 0) {
        console.log('❌ No valid details to submit')
        setErrors({ general: 'No valid journal entries to submit' })
        setValidationErrors(['No valid journal entries found'])
        return
      }

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

      // ✅ Only redirect after successful submission
      const redirectPath = voucherType === 'journal' ? '/vouchers/journal' : '/vouchers/petty'
      console.log('🔍 Success - redirecting to:', redirectPath)
      router.push(redirectPath)

    } catch (err: any) {
      console.error('❌ Submit failed:', err)
      setErrors({ general: err?.data?.message || `Failed to ${mode} voucher` })
      setValidationErrors([err?.data?.message || `Failed to ${mode} voucher`])
    }
  }

  const handleConfirmAction = async () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))

    if (confirmModal.action === 'save') {
      await handleSubmit()
    } else if (confirmModal.action === 'cancel') {
      const redirectPath = voucherType === 'journal' ? '/vouchers/journal' : '/vouchers/petty'
      console.log('🔍 Canceling, redirecting to:', redirectPath)
      router.push(redirectPath)
    }
  }

  const handleCancelConfirmation = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* ✅ FIXED: Prominent validation errors display */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg">
            {/* <div className="flex items-center mb-2">
              <div className="text-red-600 font-bold text-lg">⚠️ Validation Errors</div>
            </div> */}
            <div className="text-red-700">
              <div className="text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">
              <strong>Error:</strong> {errors.general}
            </div>
          </div>
        )}

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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            {/* ✅ FIXED: Explicit button handler */}
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
