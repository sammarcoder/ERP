// components/orders/OrderHeader.tsx - YOUR EXACT UI + EDIT FUNCTIONALITY ONLY
'use client'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { TransporterSearchableInput } from '@/components/common/transpoter/TransporterSearchableInput'
import { Calendar, FileText, DollarSign, Package } from 'lucide-react'

interface OrderHeaderData {
  date: string
  COA_ID: string | number
  Transporter_ID: string | number
  Stock_Type_ID: number

  // ✅ Financial fields from COA (visible)
  freight_crt: number
  labour_crt: number
  bility_expense: number
  other_expense: number
  foreign_currency: string
  sub_customer: string
  sub_city: string
  str: number

  // ✅ Hidden discount variables (for order details)
  discountA: number
  discountB: number
  discountC: number
}

interface OrderHeaderProps {
  mode?: 'create' | 'edit'          // ✅ ADD: Mode support
  orderType: 'purchase' | 'sales'
  value: OrderHeaderData
  onChange: (data: OrderHeaderData) => void
  initialData?: any                 // ✅ ADD: Initial data for edit mode
  errors?: {
    date?: string
    COA_ID?: string
    Transporter_ID?: string
    freight_crt?: string
    labour_crt?: string
    bility_expense?: string
    other_expense?: string
  }
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  mode = 'create',                  // ✅ ADD: Default to create
  orderType,
  value,
  onChange,
  initialData,                      // ✅ ADD: Initial data
  errors = {}
}) => {
  const coaLabel = orderType === 'purchase' ? 'Supplier' : 'Customer'
  const dateLabel = orderType === 'purchase' ? 'PO Date' : 'SO Date'
  const headerTitle = orderType === 'purchase' ? 'Purchase Order Header' : 'Sales Order Header'

  // ✅ ADD: Pre-populate data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.group('📝 OrderHeader: Edit Mode - Pre-populating data')
      console.log('Initial Order Data:', initialData)

      const populatedData: OrderHeaderData = {
        date: initialData.Date ? initialData.Date.split('T')[0] : new Date().toISOString().split('T')[0],
        COA_ID: initialData.COA_ID || initialData.account?.id || '',
        Transporter_ID: initialData.Transporter_ID || '',
        Stock_Type_ID: orderType === 'purchase' ? 11 : 12,

        // ✅ Financial fields - NO DEFAULT VALUES, EMPTY IF NOT EXISTS
        freight_crt: initialData.freight_crt ? parseFloat(initialData.freight_crt) : '',
        labour_crt: initialData.labour_crt ? parseFloat(initialData.labour_crt) : '',
        bility_expense: initialData.bility_expense ? parseFloat(initialData.bility_expense) : '',
        other_expense: initialData.other_expense ? parseFloat(initialData.other_expense) : '',
        foreign_currency: initialData.foreign_currency || '',
        sub_customer: initialData.sub_customer || '',
        sub_city: initialData.sub_city || '',
        str: initialData.str ? parseInt(initialData.str) : '',

        // ✅ Discount fields - NO DEFAULT VALUES
        discountA: initialData.discountA ? parseFloat(initialData.discountA) : '',
        discountB: initialData.discountB ? parseFloat(initialData.discountB) : '',
        discountC: initialData.discountC ? parseFloat(initialData.discountC) : ''
      }

      console.log('✅ Pre-populated Header Data (No defaults, empty if not exists):', populatedData)
      console.groupEnd()

      onChange(populatedData)
    }
  }, [mode, initialData, orderType, onChange])

  // ✅ Helper to update specific field - HANDLE EMPTY VALUES PROPERLY
  const updateField = (field: keyof OrderHeaderData, newValue: any) => {
    // ✅ Don't convert empty strings to 0 for number fields
    let processedValue = newValue

    if (field === 'freight_crt' || field === 'labour_crt' || field === 'bility_expense' ||
      field === 'other_expense' || field === 'str' || field === 'discountA' ||
      field === 'discountB' || field === 'discountC') {
      // For number fields: keep empty string if empty, otherwise parse
      processedValue = newValue === '' ? '' : (parseFloat(newValue) || '')
    }

    const updatedData = {
      ...value,
      [field]: processedValue,
      Stock_Type_ID: orderType === 'purchase' ? 11 : 12
    }

    console.log(`🔄 OrderHeader: ${field} updated to:`, processedValue, '(type:', typeof processedValue, ')')
    onChange(updatedData)
  }

  // ✅ Enhanced COA selection handler - PRESERVE EDIT MODE VALUES
  const handleCoaSelect = (id: string | number, option: any) => {
    console.log('🔄 OrderHeader COA Change:', { id, option, mode })

    // ✅ Handle clear action
    if (!id || id === '' || id === 0) {
      console.log('🗑️ COA Cleared')
      const clearedData = {
        ...value,
        COA_ID: '',
        Transporter_ID: '', // Reset transporter when COA is cleared
        // ✅ In edit mode, preserve existing values; in create mode, reset to empty
        ...(mode === 'create' ? {
          freight_crt: '',
          labour_crt: '',
          bility_expense: '',
          other_expense: '',
          foreign_currency: '',
          sub_customer: '',
          sub_city: '',
          str: '',
          discountA: '',
          discountB: '',
          discountC: ''
        } : {}),
        Stock_Type_ID: orderType === 'purchase' ? 11 : 12
      }
      onChange(clearedData)
      return
    }

    // ✅ Handle normal selection
    const coaData = option.originalData || option.extractedData || {}

    console.group(`👤 ${coaLabel} Selected - Data Extraction (${mode} mode)`)
    console.log('Selected COA:', { id, name: option.name, description: option.description })

    // ✅ Extract COA data, but in edit mode preserve existing values if COA has no data
    const extractedData = {
      Transporter_ID: coaData.Transporter_ID || value.Transporter_ID || '',

      // ✅ Financial fields - empty if no data, preserve existing in edit mode
      freight_crt: coaData.freight_crt ? parseFloat(coaData.freight_crt) : (mode === 'edit' ? value.freight_crt : ''),
      labour_crt: coaData.labour_crt ? parseFloat(coaData.labour_crt) : (mode === 'edit' ? value.labour_crt : ''),
      bility_expense: coaData.bility_expense ? parseFloat(coaData.bility_expense) : (mode === 'edit' ? value.bility_expense : ''),
      other_expense: coaData.other_expense ? parseFloat(coaData.other_expense) : (mode === 'edit' ? value.other_expense : ''),
      foreign_currency: coaData.foreign_currency || (mode === 'edit' ? value.foreign_currency : ''),
      sub_customer: coaData.sub_customer || (mode === 'edit' ? value.sub_customer : ''),
      sub_city: coaData.sub_city || (mode === 'edit' ? value.sub_city : ''),
      str: coaData.str ? parseInt(coaData.str) : (mode === 'edit' ? value.str : ''),

      // ✅ Discount fields - PRESERVE IN EDIT MODE, THESE ARE CRITICAL FOR LINE ITEMS
      discountA: coaData.discountA ? parseFloat(coaData.discountA) : (mode === 'edit' ? value.discountA : ''),
      discountB: coaData.discountB ? parseFloat(coaData.discountB) : (mode === 'edit' ? value.discountB : ''),
      discountC: coaData.discountC ? parseFloat(coaData.discountC) : (mode === 'edit' ? value.discountC : '')
    }

    console.log('💰 Extracted Financial Data:', {
      freight: extractedData.freight_crt,
      labour: extractedData.labour_crt,
      billing: extractedData.bility_expense,
      other: extractedData.other_expense,
      preserveMode: mode === 'edit' ? 'Preserving existing values' : 'Using COA defaults'
    })

    console.log('🎯 Discount Variables (CRITICAL FOR LINE ITEMS):', {
      discountA: extractedData.discountA,
      discountB: extractedData.discountB,
      discountC: extractedData.discountC,
      note: 'These will auto-apply to new line items'
    })

    console.groupEnd()

    // ✅ Update all fields
    const updatedData = {
      ...value,
      COA_ID: id,
      ...extractedData,
      Stock_Type_ID: orderType === 'purchase' ? 11 : 12
    }

    onChange(updatedData)
  }

  // ✅ Enhanced transporter handler
  const handleTransporterSelect = (id: string | number, option: any) => {
    console.group(`🚚 Transporter Selection (${mode} mode)`)
    console.log('Previous Transporter ID:', value.Transporter_ID || 'None')
    console.log('New Transporter ID:', id || 'Cleared')

    if (option && option.name) {
      console.log('Transporter Details:', {
        name: option.name,
        description: option.description
      })
    }
    console.groupEnd()

    updateField('Transporter_ID', id || '')
  }

  // ✅ Calculate totals for display - HANDLE EMPTY VALUES
  const getNumericValue = (val: any) => typeof val === 'string' ? (parseFloat(val) || 0) : (val || 0)

  const totalDiscount = (getNumericValue(value.discountA) + getNumericValue(value.discountB) + getNumericValue(value.discountC)).toFixed(1)
  const totalExpenses = getNumericValue(value.freight_crt) + getNumericValue(value.labour_crt) + getNumericValue(value.bility_expense) + getNumericValue(value.other_expense)

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-md">
      {/* ✅ Main 4 Fields - YOUR EXACT LAYOUT */}
      <div className="h-18 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          type="date"
          label={`${dateLabel} *`}
          value={value.date}
          onChange={(e) => {
            console.log('📅 Date changed:', e.target.value)
            updateField('date', e.target.value)
          }}
          error={errors.date}
          icon={<Calendar className="w-4 h-4" />}
          variant="default"
          size="md"
          required
        />

        {/* ✅ COA Selection */}
        <CoaSearchableInput
          orderType={orderType}
          value={value.COA_ID}
          onChange={handleCoaSelect}
          error={errors.COA_ID}
          variant="default"
          size="md"
          required
          showFilter={true}
          clearable={true}
        />
        {orderType === 'sales' && (
          <>
            <Input
              type="text"
              label="Sub Customer"
              value={value.sub_customer}
              onChange={(e) => updateField('sub_customer', e.target.value)}
              placeholder="Sub customer"
            />

            <Input
              type="text"
              label="Sub City"
              value={value.sub_city}
              onChange={(e) => updateField('sub_city', e.target.value)}
              placeholder="Sub city"
            />

          </>



        )}
      </div>

      {/* ✅ Financial Fields Section - YOUR EXACT LAYOUT */}
      <div className="">
       

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
          <div className=''>
            <label className='block text-sm font-medium text-gray-700'>Transporter</label>
            <TransporterSearchableInput
              value={value.Transporter_ID}
              onChange={handleTransporterSelect}
              error={errors.Transporter_ID}
              variant="default"
              size="md"
              clearable={true}
              helperText={
                mode === 'edit'
                  ? "Current transporter (can be changed)"
                  : value.Transporter_ID && value.COA_ID
                    ? "Auto-selected from customer (can be changed)"
                    : "Optional - for delivery"
              }
            />
          </div>

          {/* ✅ Cost Fields - NO DEFAULT VALUES, TRULY EMPTY */}
          <Input
            type="number"
            label="Freight Cost"
            value={value.freight_crt}
            onChange={(e) => updateField('freight_crt', e.target.value)}
            error={errors.freight_crt}
            placeholder="Enter freight cost"
            step="0.01"
          />

          <Input
            type="number"
            label="Labour Cost"
            value={value.labour_crt}
            onChange={(e) => updateField('labour_crt', e.target.value)}
            error={errors.labour_crt}
            placeholder="Enter labour cost"
            step="0.01"
          />

          <Input
            type="number"
            label="Billing Expense"
            value={value.bility_expense}
            onChange={(e) => updateField('bility_expense', e.target.value)}
            error={errors.bility_expense}
            placeholder="Enter bility expense"
            step="0.01"
          />

          <Input
            type="number"
            label="Other Expense"
            value={value.other_expense}
            onChange={(e) => updateField('other_expense', e.target.value)}
            error={errors.other_expense}
            placeholder="Enter other expenses"
            step="0.01"
          />
        </div>
      </div>
    </div>
  )
}

export default OrderHeader
