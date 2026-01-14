// components/gdn/GDN_Edit_Row.tsx - WITH UOM DEBUG DISPLAY

'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, AlertTriangle, CheckCircle, Loader2, Package, Bug, RefreshCw } from 'lucide-react'
import UomConverter from '@/components/inventoryy/testing/UomConverter'

interface Props {
  row: any
  rowIndex: number
  totalRows: number
  dispatchId: number
  onUpdate: (updatedRow: any) => void
  onDelete: () => void
  showDeleteButton?: boolean
}

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  }
  return 'http://localhost:4000/api'
}

export default function GDN_Edit_Row({
  row,
  rowIndex,
  totalRows,
  dispatchId,
  onUpdate,
  onDelete,
  showDeleteButton = false
}: Props) {
  const [selectedBatch, setSelectedBatch] = useState<number | null>(row.batchno || null)
  const [availableBatches, setAvailableBatches] = useState<any[]>([])
  const [batchQty, setBatchQty] = useState<number>(row.selectedBatchQty || 0)
  const [dispatchQty, setDispatchQty] = useState(row.dispatchQty || {
    uom1_qty: 0,
    uom2_qty: 0,
    uom3_qty: 0,
    sale_unit: 1
  })
  const [unitPrice, setUnitPrice] = useState(row.unitPrice || 0)
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showDebug, setShowDebug] = useState(true) // Debug section toggle

  // ✅ Calculate available qty in all 3 UOMs
  const availableInAllUoms = useMemo(() => {
    const uom1Qty = batchQty // Primary (Pcs)
    const uom2Conversion = row.uomStructure?.secondary?.qty || 0
    const uom3Conversion = row.uomStructure?.tertiary?.qty || 0

    return {
      uom1: {
        qty: uom1Qty,
        name: row.uomStructure?.primary?.name || 'Pcs'
      },
      uom2: {
        qty: uom2Conversion > 0 ? Math.floor(uom1Qty / uom2Conversion) : 0,
        name: row.uomStructure?.secondary?.name || 'Box',
        conversion: uom2Conversion
      },
      uom3: {
        qty: uom3Conversion > 0 ? Math.floor(uom1Qty / uom3Conversion) : 0,
        name: row.uomStructure?.tertiary?.name || 'Crt',
        conversion: uom3Conversion
      }
    }
  }, [batchQty, row.uomStructure])



  // ✅ Refresh batches without losing entered data
  const handleRefreshBatches = useCallback(async () => {
    if (!row.Item_ID) return

    setIsLoadingBatches(true)
    setBatchError(null)

    try {
      const baseUrl = getApiBaseUrl()
      const url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`

      console.log(`🔄 Refreshing batches for Item ${row.Item_ID}`)
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        console.log(`✅ Refreshed: ${result.data.length} batch(es)`)
        setAvailableBatches(result.data)

        // Update selected batch qty if already selected
        if (selectedBatch) {
          const updated = result.data.find((b: any) => b.batchno === selectedBatch)
          if (updated) setBatchQty(updated.available_qty_uom1 || 0)
        }
      }
    } catch (error: any) {
      console.error('❌ Refresh error:', error)
      setBatchError(error.message)
    } finally {
      setIsLoadingBatches(false)
    }
  }, [row.Item_ID, dispatchId, selectedBatch])

  // ✅ Calculate dispatch qty based on selected UOM
  const dispatchInSelectedUom = useMemo(() => {
    const saleUnit = dispatchQty.sale_unit || 1

    if (saleUnit === 3 && row.uomStructure?.tertiary) {
      return {
        qty: dispatchQty.uom3_qty || 0,
        name: row.uomStructure.tertiary.name,
        inPrimary: (dispatchQty.uom3_qty || 0) * (row.uomStructure.tertiary.qty || 1)
      }
    } else if (saleUnit === 2 && row.uomStructure?.secondary) {
      return {
        qty: dispatchQty.uom2_qty || 0,
        name: row.uomStructure.secondary.name,
        inPrimary: (dispatchQty.uom2_qty || 0) * (row.uomStructure.secondary.qty || 1)
      }
    } else {
      return {
        qty: dispatchQty.uom1_qty || 0,
        name: row.uomStructure?.primary?.name || 'Pcs',
        inPrimary: dispatchQty.uom1_qty || 0
      }
    }
  }, [dispatchQty, row.uomStructure])

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      if (!row.Item_ID) return

      setIsLoadingBatches(true)
      setBatchError(null)

      try {
        const baseUrl = getApiBaseUrl()
        const url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`

        console.log(`📡 [Edit] Fetching batches for Item ${row.Item_ID}`)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          console.log(`✅ [Edit] Found ${result.data.length} batch(es)`)
          setAvailableBatches(result.data)

          if (row.batchno && !isInitialized) {
            const existingBatch = result.data.find((b: any) => b.batchno === row.batchno)
            if (existingBatch) {
              setBatchQty(existingBatch.available_qty_uom1 || 0)
            }
            setIsInitialized(true)
          }
        } else {
          setAvailableBatches([])
        }

      } catch (error: any) {
        console.error('❌ Batch fetch error:', error)
        setBatchError(error.message)
        setAvailableBatches([])
      } finally {
        setIsLoadingBatches(false)
      }
    }

    fetchBatches()
  }, [row.Item_ID, dispatchId])

  // Handle batch selection
  const handleBatchSelect = useCallback((batchno: number) => {
    const batch = availableBatches.find(b => b.batchno === batchno)
    const availableQty = batch?.available_qty_uom1 || 0

    setSelectedBatch(batchno)
    setBatchQty(availableQty)

    // Check if current dispatch qty exceeds new batch qty
    const isOver = dispatchQty.uom1_qty > availableQty && availableQty > 0

    onUpdate({
      ...row,
      batchno,
      selectedBatchQty: availableQty,
      dispatchQty,
      unitPrice,
      isOverDispatch: isOver
    })
  }, [availableBatches, row, dispatchQty, unitPrice, onUpdate])

  // Handle UOM change
  const handleUomChange = useCallback((uomData: any) => {
    setDispatchQty(uomData)

    // Check if dispatch qty exceeds available batch qty
    const isOver = selectedBatch && uomData.uom1_qty > batchQty && batchQty > 0

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty: uomData,
      unitPrice,
      isOverDispatch: isOver
    })
  }, [row, selectedBatch, batchQty, unitPrice, onUpdate])

  // Handle price change
  const handlePriceChange = useCallback((price: string) => {
    const priceNum = parseFloat(price) || 0
    setUnitPrice(priceNum)

    // Check if dispatch qty exceeds available batch qty
    const isOver = selectedBatch && dispatchQty.uom1_qty > batchQty && batchQty > 0

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty,
      unitPrice: priceNum,
      isOverDispatch: isOver
    })
  }, [row, selectedBatch, batchQty, dispatchQty, onUpdate])

  // Calculations
  const isOverDispatch = selectedBatch && dispatchQty.uom1_qty > batchQty && batchQty > 0
  const rowTotal = (dispatchQty.uom1_qty || 0) * unitPrice
  const batchesWithStock = availableBatches.filter(b => b.available_qty_uom1 > 0 || b.batchno === selectedBatch)

  return (
    <div className={`p-4 ${row.isDuplicate ? 'bg-teal-50/30' : row.isExistingRow ? 'bg-white' : 'bg-blue-50/30'}`}>
      <div className="grid grid-cols-12 gap-4 items-start">

        {/* Row Indicator */}
        {/* <div className="col-span-1 flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">Row</span>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${row.isDuplicate ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
            {rowIndex + 1}
          </span>
        </div> */}
        

        {/* Batch Selection */}
        <div className="col-span-5">
          {/* <label className="text-xs text-gray-600 mb-1.5 block font-medium">
            Select Batch <span className="text-red-500">*</span>
          </label> */}
          {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefreshBatches}
          disabled={isLoadingBatches}
          className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          title="Refresh available quantity"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingBatches ? 'animate-spin' : ''}`} />
          {isLoadingBatches ? 'Loading...' : 'Refresh'}
        </button>

          {isLoadingBatches ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm py-3 bg-emerald-50 rounded-lg px-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : batchError ? (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {batchError}
            </div>
          ) : batchesWithStock.length === 0 ? (
            <div className="text-orange-700 text-sm bg-orange-50 px-3 py-2 rounded-lg">
              <Package className="w-4 h-4 inline mr-1" />
              No batches
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {batchesWithStock.map(batch => {
                const isSelected = selectedBatch === batch.batchno

                return (
                  <button
                    key={batch.batchno}
                    type="button"
                    onClick={() => handleBatchSelect(batch.batchno)}
                    className={`
                      p-1 rounded-lg border text-xs transition-all min-w-[110px]
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500'
                        : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }
                    `}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">#{batch.batchName}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      {/* <span className="text-xs text-green-600 font-semibold mt-0.5">
                        {batch.available_qty_uom1?.toLocaleString()} {row.uomStructure?.primary?.name || 'Pcs'}
                      </span> */}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ✅ Available Qty - ALL 3 UOMs */}
        <div className="col-span-2">
          <label className="text-xs text-gray-600 mb-1.5 block font-medium">Available Stock</label>
          <div className="space-y-1">
            {/* Primary UOM */}
            <div className="flex justify-between items-center bg-emerald-50 px-2 py-1 rounded">
              <span className="text-xs text-emerald-600">{availableInAllUoms.uom1.name}:</span>
              <span className="font-bold text-emerald-700">{availableInAllUoms.uom1.qty.toLocaleString()}</span>
            </div>

            {/* Secondary UOM (if exists) */}
            {/* {row.uomStructure?.secondary && (
              <div className="flex justify-between items-center bg-blue-50 px-2 py-1 rounded">
                <span className="text-xs text-blue-600">{availableInAllUoms.uom2.name}:</span>
                <span className="font-bold text-blue-700">{availableInAllUoms.uom2.qty.toLocaleString()}</span>
              </div>
            )} */}

            {/* Tertiary UOM (if exists) */}
            {/* {row.uomStructure?.tertiary && (
              <div className="flex justify-between items-center bg-purple-50 px-2 py-1 rounded">
                <span className="text-xs text-purple-600">{availableInAllUoms.uom3.name}:</span>
                <span className="font-bold text-purple-700">{availableInAllUoms.uom3.qty.toLocaleString()}</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Dispatch Qty */}
        <div className="col-span-4">
          <label className="text-xs text-gray-600 mb-1.5 block font-medium">Dispatch Qty</label>
          <UomConverter
            uomData={row.uomStructure}
            lineIndex={rowIndex}
            itemId={row.Item_ID}
            onChange={handleUomChange}
            initialValues={{
              uom1_qty: String(dispatchQty.uom1_qty || ''),
              uom2_qty: String(dispatchQty.uom2_qty || ''),
              uom3_qty: String(dispatchQty.uom3_qty || ''),
              sale_unit: String(dispatchQty.sale_unit || '1')
            }}
          />
          {isOverDispatch && (
            <div className="text-red-600 text-xs flex items-center gap-1 mt-1.5 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Exceeds available!
            </div>
          )}
        </div>

        {/* Price */}
        {/* <div className="col-span-2">
          <label className="text-xs text-gray-600 mb-1.5 block font-medium">Price</label>
          <input
            type="number"
            value={unitPrice || ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-1.5 text-right text-sm focus:ring-2 focus:ring-emerald-500"
          />
          <div className="text-right mt-1.5">
            <span className="text-xs text-gray-500">Total: </span>
            <span className="font-bold text-emerald-700">{rowTotal.toLocaleString()}</span>
          </div>
        </div> */}

        {/* Delete Button */}
        <div className="col-span-1 flex items-center justify-center pt-6">
          {showDeleteButton && (
            <button
              onClick={onDelete}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ✅ DEBUG SECTION - UOM Conversion Details */}
      {/* {showDebug && selectedBatch && (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <Bug className="w-3 h-3" /> DEBUG: UOM Conversion
            </span>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Hide
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-700 mb-1">UOM Structure</div>
              <div className="text-gray-600">
                <div>1 {row.uomStructure?.primary?.name} = 1</div>
                {row.uomStructure?.secondary && (
                  <div>1 {row.uomStructure.secondary.name} = {row.uomStructure.secondary.qty} {row.uomStructure.primary?.name}</div>
                )}
                {row.uomStructure?.tertiary && (
                  <div>1 {row.uomStructure.tertiary.name} = {row.uomStructure.tertiary.qty} {row.uomStructure.primary?.name}</div>
                )}
              </div>
            </div>

           
            <div className="bg-emerald-50 p-2 rounded">
              <div className="font-semibold text-emerald-700 mb-1">API Available (UOM1)</div>
              <div className="text-2xl font-bold text-emerald-600">{batchQty.toLocaleString()}</div>
              <div className="text-emerald-500">{row.uomStructure?.primary?.name}</div>
            </div>

           
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-semibold text-blue-700 mb-1">Converted Available</div>
              <div className="space-y-0.5">
                <div>{availableInAllUoms.uom1.qty.toLocaleString()} {availableInAllUoms.uom1.name}</div>
                {row.uomStructure?.secondary && (
                  <div>{availableInAllUoms.uom2.qty.toLocaleString()} {availableInAllUoms.uom2.name}</div>
                )}
                {row.uomStructure?.tertiary && (
                  <div>{availableInAllUoms.uom3.qty.toLocaleString()} {availableInAllUoms.uom3.name}</div>
                )}
              </div>
            </div>

            <div className="bg-orange-50 p-2 rounded">
              <div className="font-semibold text-orange-700 mb-1">Dispatching</div>
              <div className="space-y-0.5">
                <div>UOM1: {dispatchQty.uom1_qty || 0}</div>
                <div>UOM2: {dispatchQty.uom2_qty || 0}</div>
                <div>UOM3: {dispatchQty.uom3_qty || 0}</div>
                <div className="font-semibold">Sale Unit: {dispatchQty.sale_unit}</div>
              </div>
            </div>
          </div>
        </div>
      )} */}


      {/* {selectedBatch && !showDebug && (
        <div className="mt-3 pt-3 border-t flex items-center gap-3 text-xs flex-wrap">
          <span className="px-2.5 py-1 bg-gray-100 rounded-md">Batch: <strong>#{selectedBatch}</strong></span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md">
            Avl: <strong>{batchQty.toLocaleString()} {row.uomStructure?.primary?.name}</strong>
          </span>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md">
            Dispatch: <strong>{dispatchInSelectedUom.qty.toLocaleString()} {dispatchInSelectedUom.name}</strong>
          </span>
          <button 
            onClick={() => setShowDebug(true)}
            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md flex items-center gap-1"
          >
            <Bug className="w-3 h-3" /> Debug
          </button>
        </div>
      )} */}
    </div>
  )
}
