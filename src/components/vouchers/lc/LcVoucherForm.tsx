// components/lc-voucher/LcVoucherForm.tsx

'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useLazyGetZlcvTemplateQuery,
  useGetLcVoucherByIdQuery,
  useCreateLcVoucherMutation,
  useUpdateLcVoucherMutation
} from '@/store/slice/lcVoucherSlice'
// import { useGetCurrencyOptionsQuery } from '@/store/slice/journalVoucherSlice'
import {
 
  useGetCurrenciesQuery,
  
} from '@/store/slice/journalVoucherSlice'
import LcVoucherHeader from './LcVoucherHeader'
import LcVoucherDetails from './LcVoucherDetails'
import { Button } from '@/components/ui/Button'
import {ConfirmationModal} from '@/components/common/ConfirmationModal'
import { Save, X, RefreshCw, AlertCircle } from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface LcVoucherDetail {
  lineId: number
  coaId: number | null
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
  isCost: boolean
  isDb: boolean
  rate_raw?: string
  ownDb_raw?: string
  ownCr_raw?: string
  amountDb_raw?: string
  amountCr_raw?: string
  isCurrencyLocked?: boolean
  coaTypeId?: number | string
}

interface LcVoucherFormProps {
  mode: 'create' | 'edit'
  id?: number
}

// =============================================
// COMPONENT
// =============================================

const LcVoucherForm: React.FC<LcVoucherFormProps> = ({ mode, id }) => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [voucherNo, setVoucherNo] = useState('LCV-')  // ✅ Default prefix
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [headerCoaId, setHeaderCoaId] = useState<number | null>(null)
  const [headerCoaName, setHeaderCoaName] = useState('')
  const [details, setDetails] = useState<LcVoucherDetail[]>([])
  const [coaError, setCoaError] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState(false)

  // =============================================
  // RTK QUERY
  // =============================================

  const [getZlcvTemplate, { isLoading: isLoadingTemplate }] = useLazyGetZlcvTemplateQuery()

  const { data: existingVoucher, isLoading: isLoadingVoucher } = useGetLcVoucherByIdQuery(id!, {
    skip: mode !== 'edit' || !id
  })

  const { data: currencyData } = useGetCurrenciesQuery

  const [createLcVoucher, { isLoading: isCreating }] = useCreateLcVoucherMutation()
  const [updateLcVoucher, { isLoading: isUpdating }] = useUpdateLcVoucherMutation()

  // =============================================
  // CURRENCY OPTIONS
  // =============================================

  const currencyOptions = useMemo(() => {
    if (!currencyData?.data) return []
    return currencyData.data.map((c: any) => ({
      id: c.id,
      label: c.currencyName || c.name,
      currencyName: c.currencyName || c.name
    }))
  }, [currencyData])

  // =============================================
  // LOAD EXISTING VOUCHER (Edit Mode)
  // =============================================

  useEffect(() => {
    if (mode === 'edit' && existingVoucher?.data) {
      const voucher = existingVoucher.data
      setVoucherNo(voucher.voucherNo)
      setDate(voucher.date?.split('T')[0] || '')
      setHeaderCoaId(voucher.coaId)
      setDetails(voucher.details?.map((d: any, i: number) => ({
        ...d,
        lineId: i + 1,
        status: d.status || false,
        isCost: d.isCost || false,
        isDb: d.amountDb > 0
      })) || [])
    }
  }, [mode, existingVoucher])

  // =============================================
  // CALCULATE TOTALS
  // =============================================

  const totals = useMemo(() => {
    const debitTotal = details.reduce((sum, d) => sum + (parseFloat(String(d.amountDb)) || 0), 0)
    const creditTotal = details.reduce((sum, d) => sum + (parseFloat(String(d.amountCr)) || 0), 0)
    const difference = Math.abs(debitTotal - creditTotal)
    return { debitTotal, creditTotal, difference }
  }, [details])

  // =============================================
  // GET TEMPLATE - ✅ Fixed status to false
  // =============================================

  const handleGetTemplate = useCallback(async () => {
    if (!headerCoaId) return

    try {
      const result = await getZlcvTemplate().unwrap()

      if (result.success && result.data?.length > 0) {
        const templateDetails = result.data.map((zlcv: any, index: number) => ({
          lineId: index + 1,
          coaId: zlcv.isDb ? headerCoaId : zlcv.coaId,
          description: zlcv.description || '',
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
          status: false,  // ✅ FIXED: Always false so user can edit
          isCost: zlcv.isCost || false,
          isDb: zlcv.isDb || false,
          isCurrencyLocked: false,
          coaTypeId: undefined
        }))
        setDetails(templateDetails)
        setApiError(null)
      } else {
        setApiError('No template rows found. Please add ZLCV records first.')
      }
    } catch (error) {
      console.error('Error loading template:', error)
      setApiError('Failed to load template')
    }
  }, [headerCoaId, getZlcvTemplate])

  // =============================================
  // HANDLE DETAIL CHANGE
  // =============================================

  const handleDetailChange = useCallback((index: number, field: string, value: any) => {
    setDetails(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  // =============================================
  // HANDLE COA CHANGE
  // =============================================

  const handleCoaChange = useCallback((coaId: number | null, coaName?: string) => {
    setHeaderCoaId(coaId)
    setHeaderCoaName(coaName || '')

    // Update all debit rows with new header COA
    if (coaId) {
      setDetails(prev => prev.map(d => ({
        ...d,
        coaId: d.isDb || (parseFloat(String(d.amountDb)) || 0) > 0 ? coaId : d.coaId
      })))
    }
  }, [])

  // =============================================
  // ✅ ADD ROW - Fixed
  // =============================================

  const handleAddRow = useCallback(() => {
    console.log('Adding new row...')  // Debug log
    setDetails(prev => {
      const newRow: LcVoucherDetail = {
        lineId: prev.length + 1,
        coaId: null,
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
        status: false,  // ✅ Default false
        isCost: false,
        isDb: false,
        isCurrencyLocked: false
      }
      return [...prev, newRow]
    })
  }, [])

  // =============================================
  // REMOVE ROW
  // =============================================

  const handleRemoveRow = useCallback((index: number) => {
    setDetails(prev => {
      const updated = prev.filter((_, i) => i !== index)
      return updated.map((d, i) => ({ ...d, lineId: i + 1 }))
    })
  }, [])

  // =============================================
  // CLONE ROW
  // =============================================

  const handleCloneRow = useCallback((index: number) => {
    setDetails(prev => {
      const rowToClone = prev[index]
      const clonedRow: LcVoucherDetail = {
        ...rowToClone,
        lineId: prev.length + 1,
        coaId: null,  // Don't copy account
        recieptNo: rowToClone.recieptNo ? `${rowToClone.recieptNo}R` : '',
        // Reverse Debit and Credit
        amountDb: rowToClone.amountCr || 0,
        amountCr: rowToClone.amountDb || 0,
        ownDb: rowToClone.ownCr || 0,
        ownCr: rowToClone.ownDb || 0,
        // Clear raw values
        amountDb_raw: undefined,
        amountCr_raw: undefined,
        ownDb_raw: undefined,
        ownCr_raw: undefined,
        rate_raw: undefined,
        status: false,  // ✅ Default false
        isCost: rowToClone.amountCr > 0 ? rowToClone.isCost : false,
        isDb: rowToClone.amountCr > 0
      }

      const newDetails = [...prev]
      newDetails.splice(index + 1, 0, clonedRow)
      return newDetails.map((d, i) => ({ ...d, lineId: i + 1 }))
    })
  }, [])

  // =============================================
  // VALIDATION
  // =============================================

  const validateForm = useCallback(() => {
    // Check voucher number
    if (!voucherNo || voucherNo === 'LCV-') {
      setApiError('Please enter a voucher number')
      return false
    }

    // Check header COA
    if (!headerCoaId) {
      setApiError('Please select a Balance Account')
      return false
    }

    // Check COA error
    if (coaError) {
      setApiError(coaError)
      return false
    }

    // Check date
    if (!date) {
      setApiError('Please select a date')
      return false
    }

    // Check if details exist
    if (details.length === 0) {
      setApiError('Please add at least one detail row')
      return false
    }

    // Check balance - LC vouchers MUST balance (no auto-balance)
    if (totals.difference !== 0) {
      setApiError(`Voucher is not balanced. Difference: ${totals.difference.toFixed(2)}`)
      return false
    }

    // Check if any amounts entered
    const hasAmounts = details.some(d => 
      (parseFloat(String(d.amountDb)) || 0) > 0 || 
      (parseFloat(String(d.amountCr)) || 0) > 0
    )
    if (!hasAmounts) {
      setApiError('Please enter at least one debit or credit amount')
      return false
    }

    // Check credit rows have COA
    const invalidCreditRow = details.find(d => {
      const hasCredit = (parseFloat(String(d.amountCr)) || 0) > 0
      return hasCredit && !d.coaId
    })
    if (invalidCreditRow) {
      setApiError('Please select an account for all credit entries')
      return false
    }

    setApiError(null)
    return true
  }, [voucherNo, headerCoaId, coaError, date, details, totals])

  // =============================================
  // SAVE
  // =============================================

  const handleSaveClick = useCallback(() => {
    if (!validateForm()) return
    setConfirmModal(true)
  }, [validateForm])

  const handleConfirmSave = useCallback(async () => {
    setConfirmModal(false)

    // Filter only rows with amounts
    const validDetails = details.filter(d => 
      (parseFloat(String(d.amountDb)) || 0) > 0 || 
      (parseFloat(String(d.amountCr)) || 0) > 0
    )

    const payload = {
      voucherNo,
      date,
      coaId: headerCoaId!,
      voucherTypeId: 13,  // LC Voucher type
      status: 0,
      details: validDetails.map(d => ({
        coaId: d.coaId || headerCoaId,  // Ensure debit rows have header COA
        description: d.description,
        recieptNo: d.recieptNo || null,
        currencyId: d.currencyId || null,
        rate: d.rate || 0,
        ownDb: d.ownDb || 0,
        ownCr: d.ownCr || 0,
        amountDb: parseFloat(String(d.amountDb)) || 0,
        amountCr: parseFloat(String(d.amountCr)) || 0,
        idCard: d.idCard || null,
        bank: d.bank || null,
        bankDate: d.bankDate || null,
        isCost: d.isCost,
        status: d.status
      }))
    }

    try {
      if (mode === 'create') {
        await createLcVoucher(payload).unwrap()
      } else {
        await updateLcVoucher({ id: id!, ...payload }).unwrap()
      }
      router.push('/vouchers/lc')
    } catch (error: any) {
      console.error('Save error:', error)
      setApiError(error?.data?.message || 'Failed to save voucher')
    }
  }, [mode, id, voucherNo, date, headerCoaId, details, createLcVoucher, updateLcVoucher, router])

  // =============================================
  // LOADING
  // =============================================

  if (mode === 'edit' && isLoadingVoucher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3]" />
      </div>
    )
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create LC Voucher' : 'Edit LC Voucher'}
        </h1>
        <p className="text-gray-500 mt-1">
          {mode === 'create' ? 'Create a new LC voucher' : 'Update LC voucher details'}
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{apiError}</p>
        </div>
      )}

      {/* Header */}
      <LcVoucherHeader
        voucherNo={voucherNo}
        date={date}
        coaId={headerCoaId}
        coaName={headerCoaName}
        mode={mode}
        editId={id}
        onVoucherNoChange={setVoucherNo}  // ✅ Added
        onDateChange={setDate}
        onCoaChange={handleCoaChange}
        onGetTemplate={handleGetTemplate}
        isLoadingTemplate={isLoadingTemplate}
        coaError={coaError}
        setCoaError={setCoaError}
      />

      {/* Details */}
      <LcVoucherDetails
        details={details}
        headerCoaId={headerCoaId}
        headerCoaName={headerCoaName}
        currencyOptions={currencyOptions}
        totals={totals}
        onDetailChange={handleDetailChange}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
        onCloneRow={handleCloneRow}
      />

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/lc-voucher')}
          icon={<X className="w-4 h-4" />}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveClick}
          disabled={isCreating || isUpdating || totals.difference !== 0}
          icon={isCreating || isUpdating
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />
          }
        >
          {isCreating || isUpdating ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title={mode === 'create' ? 'Create LC Voucher' : 'Update LC Voucher'}
        message={
          mode === 'create'
            ? 'Are you sure you want to create this LC voucher?'
            : 'Are you sure you want to update this LC voucher?'
        }
        confirmText={mode === 'create' ? 'Create' : 'Update'}
        confirmVariant="primary"
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

export default LcVoucherForm
