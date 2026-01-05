
'use client'
import React from 'react'
import { Input } from '@/components/ui/Input'
import SelectableTable from '@/components/SelectableTable'
import { formatDisplayDate } from '@/utils/formatters'
import { FileText, Calendar, Building2, AlertCircle } from 'lucide-react'

interface VoucherHeaderProps {
  voucherType: 'journal' | 'pettycash'
  formData: {
    voucherNo: string
    date: string
    coaId: number | null
    status: boolean
  }
  filteredCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
  errors: { [key: string]: string }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCoaChange: (name: string, value: number | null) => void
}

const VoucherHeader: React.FC<VoucherHeaderProps> = ({
  voucherType,
  formData,
  filteredCoaAccounts,
  errors,
  onInputChange,
  onCoaChange
}) => {
  const config = {
    journal: { 
      title: 'Journal Voucher', 
      coaLabel: 'Journal Balance Account',
      icon: FileText
    },
    pettycash: { 
      title: 'Petty Cash Voucher', 
      coaLabel: 'Petty Cash Account',
      icon: Building2
    }
  }

  const IconComponent = config[voucherType].icon

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-6">
        <IconComponent className="w-6 h-6 mr-3 text-[#509ee3]" />
        <h2 className="text-xl font-semibold text-gray-900">
          {config[voucherType].title} Information
        </h2>
        <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {filteredCoaAccounts.length} accounts available
        </div>
         <div className="flex items-center space-x-2 ml-4">
            <input
              type="checkbox"
              id="opening"
              // checked={isOpening}
              // onChange={(e) => setIsOpening(e.target.checked)}
              className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
            />
            <label htmlFor="opening" className="text-sm font-medium text-gray-700">
              Opening
            </label>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Voucher Number"
          name="voucherNo"
          value={formData.voucherNo}
          onChange={onInputChange}
          placeholder="Enter voucher number"
          error={errors.voucherNo}
          icon={<FileText className="w-4 h-4" />}
          required
        />
        
        <div>
          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={onInputChange}
            error={errors.date}
            icon={<Calendar className="w-4 h-4" />}
            required
          />
          {formData.date && (
            <div className="mt-1 text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Display: {formatDisplayDate(formData.date)}
            </div>
          )}
        </div>

        <SelectableTable
          label={config[voucherType].coaLabel}
          name="coaId"
          value={formData.coaId}
          onChange={onCoaChange}
          options={filteredCoaAccounts}
          placeholder={`Select ${config[voucherType].coaLabel.toLowerCase()}`}
          displayKey="label"
          columns={[
            { key: 'acCode', label: 'Code', width: '30%' },
            { key: 'acName', label: 'Name', width: '70%' }
          ]}
          required
        />
      </div>

      {filteredCoaAccounts.length === 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            No {config[voucherType].coaLabel.toLowerCase()} accounts found. Please check your COA setup.
          </p>
        </div>
      )}

      {errors.coaId && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.coaId}
          </p>
        </div>
      )}
    </div>
  )
}

export default VoucherHeader

































