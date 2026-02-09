// components/lc-voucher/LcVoucherHeader.tsx

'use client'
import React from 'react'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { Button } from '@/components/ui/Button'
import { useLazyCheckCoaUsageQuery } from '@/store/slice/lcVoucherSlice'
import { FileText, Calendar, Download, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
// =============================================
// TYPES
// =============================================

interface LcVoucherHeaderProps {
  voucherNo: string
  date: string
  coaId: number | null
  coaName?: string
  mode: 'create' | 'edit'
  editId?: number
  onVoucherNoChange: (value: string) => void  // ✅ Added
  onDateChange: (date: string) => void
  onCoaChange: (coaId: number | null, coaName?: string) => void
  onGetTemplate: () => void
  isLoadingTemplate?: boolean
  coaError?: string
  setCoaError: (error: string) => void
}

// =============================================
// COMPONENT
// =============================================

const LcVoucherHeader: React.FC<LcVoucherHeaderProps> = ({
  voucherNo,
  date,
  coaId,
  coaName,
  mode,
  editId,
  onVoucherNoChange,  // ✅ Added
  onDateChange,
  onCoaChange,
  onGetTemplate,
  isLoadingTemplate = false,
  coaError,
  setCoaError
}) => {
  // =============================================
  // RTK QUERY
  // =============================================

  const [checkCoaUsage] = useLazyCheckCoaUsageQuery()

  // =============================================
  // HANDLERS
  // =============================================

  const handleCoaSelect = async (selectedId: string | number, selectedOption: any) => {
    const numericId = selectedId ? Number(selectedId) : null

    if (!numericId) {
      onCoaChange(null, '')
      setCoaError('')
      return
    }

    // Check if COA is already used in another LC voucher
    try {
      const result = await checkCoaUsage({
        coaId: numericId,
        excludeId: mode === 'edit' ? editId : undefined
      }).unwrap()

      if (result.isUsed) {
        setCoaError(result.message)
        onCoaChange(null, '')
      } else {
        setCoaError('')
        onCoaChange(numericId, selectedOption?.name || selectedOption?.acName || '')
      }
    } catch (error) {
      console.error('Error checking COA:', error)
      onCoaChange(numericId, selectedOption?.name || selectedOption?.acName || '')
    }
  }

  // ✅ Handle voucher number input - only allow numbers after prefix
  const handleVoucherNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Remove prefix if user tries to delete it
    if (!value.startsWith('LCV-')) {
      onVoucherNoChange('LCV-')
      return
    }
    // Only allow numbers after prefix
    const numberPart = value.replace('LCV-', '')
    if (numberPart === '' || /^\d+$/.test(numberPart)) {
      onVoucherNoChange(value)
    }
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 mr-2 text-[#509ee3]" />
        <h2 className="text-lg font-semibold text-gray-900">LC Voucher Header</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* ✅ Voucher No - Editable with LCV- prefix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voucher No <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={voucherNo}
            onChange={handleVoucherNoChange}
            placeholder="LCV-001"
            disabled={mode === 'edit'}  // Disable in edit mode
            size="md"
          />
        </div>

        <Input
          type="date"
          label={`Date *`}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          // error={errors.date}
          icon={<Calendar className="w-4 h-4" />}
          variant="default"
          size="md"
          required
        />


        {/* Date */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
          />
        </div> */}

        {/* Balance Account (COA) - LC Mode (coaTypeId = 2) */}
        <div>
          <CoaSearchableInput
            orderType="lc"
            value={coaId || ''}
            onChange={handleCoaSelect}
            label="Balance Account"
            placeholder="Select LC Account..."
            required
            clearable
            size="md"
            showFilter={false}
            error={coaError}
          />
        </div>

        {/* Get Template Button */}
        <div>
          <Button
            variant="primary"
            onClick={onGetTemplate}
            disabled={!coaId || isLoadingTemplate || !!coaError}
            icon={<Download className="w-4 h-4" />}
            className="w-full h-10"
          >
            {isLoadingTemplate ? 'Loading...' : 'Get Template'}
          </Button>
        </div>
      </div>

      {/* COA Error Display */}
      {coaError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{coaError}</p>
        </div>
      )}
    </div>
  )
}

export default LcVoucherHeader
