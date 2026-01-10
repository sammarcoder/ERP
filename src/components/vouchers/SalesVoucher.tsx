'use client'
import React, { useState, useEffect } from 'react'
import UomConverter from '@/components/UomConverter'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { VoucherData, VoucherItem, CarriageAccount } from '@/lib/types'

interface SalesVoucherProps {
  dispatchId: number
  mode: 'create' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

export function SalesVoucher({ dispatchId, mode, onClose, onSuccess }: SalesVoucherProps) {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [voucherData, setVoucherData] = useState<VoucherData>({
    Number: '',
    Date: '',
    Customer: '',
    Status: '',
    Carriage_Amount: 0,
    Carriage_ID: undefined,
    Transporter: ''
  })

  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])
  const [batchGroups, setBatchGroups] = useState<any>({})
  const [carriageAccounts, setCarriageAccounts] = useState<CarriageAccount[]>([])

  useEffect(() => {
    if (dispatchId) {
      loadDispatchData()
      loadCarriageAccounts()
    }
  }, [dispatchId])

  // LOAD CARRIAGE ACCOUNTS
  const loadCarriageAccounts = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/by-coa-type-carriage`)
      const result = await response.json()

      if (result.success && result.data) {
        console.log('🚚 Loaded carriage accounts:', result.data)
        setCarriageAccounts(result.data)
      }
    } catch (error) {
      console.error('Error loading carriage accounts:', error)
    }
  }

  const loadDispatchData = async () => {
    setFetchLoading(true)
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`)
      const result = await response.json()

      if (result.success) {
        const dispatch = result.data

        setVoucherData({
          Number: dispatch.Number,
          Date: dispatch.Date.split('T')[0],
          Customer: dispatch.account?.acName || '',
          Status: dispatch.Status,
          Carriage_Amount: parseFloat(dispatch.Carriage_Amount) || 0,
          Carriage_ID: dispatch.Carriage_ID || undefined,
          Transporter: dispatch.Transporter || ''
        })

        const items: VoucherItem[] = dispatch.details?.map((detail: any) => ({
          ID: detail.ID,
          Line_Id: detail.Line_Id,
          Batch_Number: detail.batchno || '',
          Item_Name: detail.item?.itemName || '',
          Item_ID: detail.Item_ID,
          uom1_qty: detail.Stock_out_UOM_Qty || 0,
          uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
          uom3_qty: detail.Stock_out_UOM3_Qty || 0,
          sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
          Stock_Price: detail.Stock_Price || 0,
          item: detail.item,
          originalPrice: detail.Stock_Price || 0,
          Discount_A: parseFloat(detail.Discount_A) || 0,
          Discount_B: parseFloat(detail.Discount_B) || 0,
          Discount_C: parseFloat(detail.Discount_C) || 0,
          originalDiscountA: parseFloat(detail.Discount_A) || 0,
          originalDiscountB: parseFloat(detail.Discount_B) || 0,
          originalDiscountC: parseFloat(detail.Discount_C) || 0,
          is_Voucher_Generated: dispatch.is_Voucher_Generated || false,
          Carriage_ID: detail.Carriage_ID || undefined,
          Carriage_Amount: parseFloat(detail.Carriage_Amount) || 0
        })) || []

        setVoucherItems(items)
        groupItemsByBatch(items)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load dispatch data' })
    } finally {
      setFetchLoading(false)
    }
  }

  const groupItemsByBatch = (items: VoucherItem[]) => {
    const groups = items.reduce((acc: any, item) => {
      const batch = item.Batch_Number || 'No Batch'
      if (!acc[batch]) acc[batch] = []
      acc[batch].push(item)
      return acc
    }, {})
    setBatchGroups(groups)
  }

  const getSaleUnitRadioValue = (saleUnitId: string, item: any) => {
    if (!saleUnitId || !item) return 'uom1'
    const id = parseInt(saleUnitId)
    if (id === item?.uom1?.id) return 'uom1'
    if (id === item?.uomTwo?.id) return 'uomTwo'
    if (id === item?.uomThree?.id) return 'uomThree'
    return 'uom1'
  }

  const getSaleUnitId = (saleUnit: string, item: any) => {
    if (!saleUnit || !item) return null
    switch (saleUnit) {
      case 'uom1': return item?.uom1?.id || null
      case 'uomTwo': return item?.uomTwo?.id || null
      case 'uomThree': return item?.uomThree?.id || null
      default: return item?.uom1?.id || null
    }
  }

  const handleUomChange = (itemId: number, values: any) => {
    const updated = voucherItems.map(item =>
      item.ID === itemId ? { ...item, ...values } : item
    )
    setVoucherItems(updated)
    groupItemsByBatch(updated)
  }

  const updateField = (itemId: number, field: string, value: any) => {
    const updated = voucherItems.map(item =>
      item.ID === itemId
        ? { ...item, [field]: parseFloat(value) || 0 }
        : item
    )
    setVoucherItems(updated)
    groupItemsByBatch(updated)
  }

  const calculateItemGross = (item: VoucherItem): number => {
    const price = parseFloat(item.Stock_Price.toString()) || 0
    let qty = 0

    switch (item.sale_unit) {
      case 'uom1': qty = parseFloat(item.uom1_qty.toString()) || 0; break
      case 'uomTwo': qty = parseFloat(item.uom2_qty.toString()) || 0; break
      case 'uomThree': qty = parseFloat(item.uom3_qty.toString()) || 0; break
      default: qty = parseFloat(item.uom1_qty.toString()) || 0
    }

    return price * qty
  }

  const calculateItemNet = (item: VoucherItem): number => {
    const gross = calculateItemGross(item)
    const discA = gross * (item.Discount_A || 0) / 100
    const afterA = gross - discA
    const discB = afterA * (item.Discount_B || 0) / 100
    const afterB = afterA - discB
    const discC = afterB * (item.Discount_C || 0) / 100
    return afterB - discC
  }

  const calculateBatchGross = (batchItems: VoucherItem[]): number => {
    return batchItems.reduce((sum, item) => sum + calculateItemGross(item), 0)
  }

  const calculateBatchNet = (batchItems: VoucherItem[]): number => {
    return batchItems.reduce((sum, item) => sum + calculateItemNet(item), 0)
  }

  const calculateGrandGross = (): number => {
    return Object.values(batchGroups).reduce((total: number, batchItems: any) =>
      total + calculateBatchGross(batchItems), 0)
  }

  const calculateGrandNet = (): number => {
    return Object.values(batchGroups).reduce((total: number, batchItems: any) =>
      total + calculateBatchNet(batchItems), 0)
  }

  // FINAL TOTAL WITH CARRIAGE
  const calculateFinalTotal = (): number => {
    return calculateGrandNet() + (parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0)
  }

  const handleSubmitClick = () => setShowConfirmation(true)


// In the handleConfirmSubmit function - ADD JOURNAL CALLS

const handleConfirmSubmit = async () => {
  setShowConfirmation(false)
  setLoading(true)

  try {
    // STEP 1: Update stock details
    await Promise.all(voucherItems.map(item =>
      fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
          Stock_out_UOM_Qty: item.uom1_qty || 0,
          Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
          Stock_out_UOM3_Qty: item.uom3_qty || 0,
          Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
          Discount_A: parseFloat(item.Discount_A.toString()) || 0,
          Discount_B: parseFloat(item.Discount_B.toString()) || 0,
          Discount_C: parseFloat(item.Discount_C.toString()) || 0
        })
      })
    ))

    // STEP 2: Update stock main
    await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_Voucher_Generated: mode === 'create' ? true : undefined,
        Carriage_Amount: parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0,
        Carriage_ID: voucherData.Carriage_ID || null
      })
    })

    // STEP 3: AUTO CREATE/EDIT JOURNAL
    const journalMode = mode === 'create' ? 'create' : 'edit';
    const journalResponse = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${dispatchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: journalMode })
    })

    const journalResult = await journalResponse.json()

    if (journalResult.success) {
      setMessage({ 
        type: 'success', 
        text: mode === 'create' 
          ? 'Voucher generated & journal created (UnPost)!' 
          : 'Voucher & journal updated successfully!' 
      })
    } else {
      setMessage({ 
        type: 'success', 
        text: mode === 'create' ? 'Voucher generated (journal warning)!' : 'Voucher updated (journal warning)!' 
      })
      console.warn('Journal warning:', journalResult.error)
    }

    setTimeout(() => { onSuccess(); onClose() }, 1500)

  } catch (error) {
    console.error('Voucher operation error:', error)
    setMessage({ type: 'error', text: 'Operation failed' })
  } finally {
    setLoading(false)
  }
}

  
  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center">
          <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full mr-3"></div>
          <span className="text-gray-700 font-medium">Loading voucher data...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Sales Voucher</h2>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span>#{voucherData.Number}</span>
                    <span>{voucherData.Date}</span>
                    <span>{voucherData.Customer}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`mx-4 mt-3 p-3 rounded-lg border-l-4 flex items-center flex-shrink-0 ${message.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'
              }`}>
              {message.text}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">

            {/* Left: Items (70%) */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {Object.entries(batchGroups).map(([batchNumber, batchItems]: [string, any]) => (
                  <div key={batchNumber} className="bg-white border border-gray-300 rounded-lg shadow-sm">

                    {/* Batch Header */}
                    <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {batchNumber}
                        </span>
                        <span className="text-sm text-gray-700">{batchItems.length} items</span>
                      </div>
                      <div className="flex space-x-3 text-sm">
                        <span>Gross: <strong>{calculateBatchGross(batchItems).toFixed(2)}</strong></span>
                        <span className="text-green-600">Net: <strong>{calculateBatchNet(batchItems).toFixed(2)}</strong></span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-3 space-y-3">
                      {batchItems.map((item: VoucherItem) => (
                        <div key={item.ID} className="bg-gray-50 rounded-lg p-3 border">

                          {/* Item Header with Net/Gross */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">#{item.Line_Id}</span>
                              <span className="font-medium text-gray-800">{item.Item_Name}</span>
                            </div>
                            <div className="flex space-x-3 text-sm">
                              <span>Gross: <strong>{calculateItemGross(item).toFixed(2)}</strong></span>
                              <span className="text-green-600">Net: <strong>{calculateItemNet(item).toFixed(2)}</strong></span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="grid grid-cols-10 gap-3 items-end">

                            {/* UOM - 5 cols */}
                            <div className="col-span-5">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity & Unit</label>
                              <UomConverter
                                itemId={item.Item_ID}
                                onChange={(values) => handleUomChange(item.ID, values)}
                                initialValues={{
                                  uom1_qty: item.uom1_qty.toString(),
                                  uom2_qty: item.uom2_qty.toString(),
                                  uom3_qty: item.uom3_qty.toString(),
                                  sale_unit: item.sale_unit
                                }}
                                isPurchase={false}
                              />
                            </div>

                            {/* Price - 2 cols */}
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Price</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Stock_Price || ''}
                                  onChange={(e) => updateField(item.ID, 'Stock_Price', e.target.value)}
                                  className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            {/* Discounts - 3 cols */}
                            <div className="col-span-3">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Discounts (%)</label>
                              <div className="grid grid-cols-3 gap-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_A || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_A', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
                                  placeholder="A%"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_B || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_B', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
                                  placeholder="B%"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_C || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_C', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
                                  placeholder="C%"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary & Carriage (30%) */}
            <div className="w-96 bg-gray-50 border-l p-4 overflow-y-auto">

              {/* CARRIAGE SECTION */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  Carriage & Transport
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Transporter</label>
                    <select
                      value={voucherData.Carriage_ID || ''}
                      onChange={(e) => {
                        const selectedAccount = carriageAccounts.find(acc => acc.id === parseInt(e.target.value))
                        setVoucherData(prev => ({
                          ...prev,
                          Carriage_ID: parseInt(e.target.value) || undefined,
                          Transporter: selectedAccount?.acName || ''
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Transporter</option>
                      {carriageAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.acName} - {account.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Carriage Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        value={voucherData.Carriage_Amount || ''}
                        onChange={(e) => setVoucherData(prev => ({
                          ...prev,
                          Carriage_Amount: parseFloat(e.target.value) || 0
                        }))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Summary */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                <h4 className="font-bold text-sm text-gray-800 mb-3">Batch Summary</h4>
                <div className="space-y-2">
                  {Object.entries(batchGroups).map(([batch, items]: [string, any]) => (
                    <div key={batch} className="bg-gray-50 rounded p-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">{batch} ({items.length})</span>
                        <div className="flex space-x-2">
                          <span>G: <strong>{calculateBatchGross(items).toFixed(2)}</strong></span>
                          <span className="text-green-600">N: <strong>{calculateBatchNet(items).toFixed(2)}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total Card */}
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
                <h4 className="font-bold text-sm text-gray-800 mb-3">Total Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-bold">{voucherItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batches:</span>
                    <span className="font-bold">{Object.keys(batchGroups).length}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span>Gross Amount:</span>
                    <span className="font-bold">₨ {calculateGrandGross().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Amount:</span>
                    <span className="font-bold text-green-600">₨ {calculateGrandNet().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carriage:</span>
                    <span className="font-bold text-orange-600">₨ {(voucherData.Carriage_Amount || 0).toFixed(2)}</span>
                  </div>
                  <hr className="border-2 border-blue-200" />
                  <div className="flex justify-between text-lg bg-blue-50 p-2 rounded">
                    <span className="font-bold">Final Total:</span>
                    <span className="font-bold text-blue-700">₨ {calculateFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t p-4 flex justify-end space-x-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border hover:bg-gray-50 text-gray-700 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitClick}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        title={mode === 'create' ? 'Generate Sales Voucher' : 'Update Sales Voucher'}
        message={`${mode === 'create' ? 'Generate' : 'Update'} voucher with Final Total: ₨${calculateFinalTotal().toFixed(2)} (including carriage)?`}
        confirmText={mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
        type="info"
        loading={loading}
      />
    </>
  )
}
