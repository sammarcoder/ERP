'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, AlertTriangle, CheckCircle, Loader2, Package, RefreshCw } from 'lucide-react'
import UomConverter from '@/components/inventoryy/testing/UomConverter'
import { getApiBaseUrl } from '@/lib/apiConfig';

interface Props {
  row: any
  rowIndex: number
  totalRows: number
  mode: 'create' | 'edit'
  dispatchId?: number
  onUpdate: (updatedRow: any) => void
  onRemove: () => void
  showRemoveButton?: boolean
}

// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   }
//   return 'http://localhost:4000/api'
// }

export default function GDN_Item_Row({
  row,
  rowIndex,
  totalRows,
  mode,
  dispatchId,
  onUpdate,
  onRemove,
  showRemoveButton = false
}: Props) {
  const [selectedBatch, setSelectedBatch] = useState<number | null>(row.batchno)
  const [availableBatches, setAvailableBatches] = useState<any[]>([])
  const [batchQty, setBatchQty] = useState<number>(row.selectedBatchQty || 0)
  const [dispatchQty, setDispatchQty] = useState(row.dispatchQty)
  const [unitPrice, setUnitPrice] = useState(row.unitPrice || 0)
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)
  
  // Discount states - auto-populated from order, editable
  const [discountA, setDiscountA] = useState<number>(row.Discount_A || 0)
  const [discountB, setDiscountB] = useState<number>(row.Discount_B || 0)
  const [discountC, setDiscountC] = useState<number>(row.Discount_C || 0)

  // ✅ Sync discounts when row prop changes (auto-populate from order)
  useEffect(() => {
    if (row.Discount_A !== undefined) setDiscountA(row.Discount_A || 0)
    if (row.Discount_B !== undefined) setDiscountB(row.Discount_B || 0)
    if (row.Discount_C !== undefined) setDiscountC(row.Discount_C || 0)
  }, [row.Discount_A, row.Discount_B, row.Discount_C])

  // ═══════════════════════════════════════════════════════════════
  // FETCH BATCHES USING NATIVE FETCH
  // ═══════════════════════════════════════════════════════════════
  // useEffect(() => {
  //   const fetchBatches = async () => {
  //     if (!row.Item_ID) return

  //     setIsLoadingBatches(true)
  //     setBatchError(null)

  //     try {
  //       const baseUrl = getApiBaseUrl()
  //       let url: string

  //       if (mode === 'edit' && dispatchId) {
  //         url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`
  //       } else {
  //         url = `${baseUrl}/dispatch/available-batches/${row.Item_ID}`
  //       }

  //       console.log(`📡 Fetching batches for Item ${row.Item_ID}:`, url)

  //       const response = await fetch(url)

  //       if (!response.ok) {
  //         throw new Error(`HTTP ${response.status}`)
  //       }

  //       const result = await response.json()

  //       if (result.success && Array.isArray(result.data)) {
  //         console.log(`✅ Found ${result.data.length} batch(es) for Item ${row.Item_ID}`)
  //         setAvailableBatches(result.data)
  //       } else {
  //         setAvailableBatches([])
  //       }

  //     } catch (error: any) {
  //       console.error('❌ Batch fetch error:', error)
  //       setBatchError(error.message)
  //       setAvailableBatches([])
  //     } finally {
  //       setIsLoadingBatches(false)
  //     }
  //   }

  //   fetchBatches()
  // }, [row.Item_ID, mode, dispatchId])


  // ✅ Refresh available qty - keeps entered data, only updates batches
  // const handleRefreshBatches = useCallback(async () => {
  //   if (!row.Item_ID) return

  //   setIsLoadingBatches(true)
  //   setBatchError(null)

  //   try {
  //     const baseUrl = getApiBaseUrl()
  //     let url: string

  //     if (mode === 'edit' && dispatchId) {
  //       url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`
  //     } else {
  //       url = `${baseUrl}/dispatch/available-batches/${row.Item_ID}`
  //     }

  //     console.log(`🔄 Refreshing batches for Item ${row.Item_ID}`)

  //     const response = await fetch(url)

  //     if (!response.ok) {
  //       throw new Error(`HTTP ${response.status}`)
  //     }

  //     const result = await response.json()

  //     if (result.success && Array.isArray(result.data)) {
  //       console.log(`✅ Refreshed: ${result.data.length} batch(es) for Item ${row.Item_ID}`)
  //       setAvailableBatches(result.data)

  //       // ✅ Update selected batch qty if batch is already selected
  //       if (selectedBatch) {
  //         const updatedBatch = result.data.find((b: any) => b.batchno === selectedBatch)
  //         if (updatedBatch) {
  //           setBatchQty(updatedBatch.available_qty_uom1 || 0)
  //         }
  //       }
  //     } else {
  //       setAvailableBatches([])
  //     }

  //   } catch (error: any) {
  //     console.error('❌ Refresh error:', error)
  //     setBatchError(error.message)
  //   } finally {
  //     setIsLoadingBatches(false)
  //   }
  // }, [row.Item_ID, mode, dispatchId, selectedBatch])





// Import at the top of your component file


// ═══════════════════════════════════════════════════════════════
// useEffect - Fetch Batches
// ═══════════════════════════════════════════════════════════════
useEffect(() => {
  const fetchBatches = async () => {
    if (!row.Item_ID) return;

    setIsLoadingBatches(true);
    setBatchError(null);

    try {
      const baseUrl = getApiBaseUrl();  // ✅ Uses dynamic port (4000 or 4001)
      let url: string;

      if (mode === 'edit' && dispatchId) {
        url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`;
      } else {
        url = `${baseUrl}/dispatch/available-batches/${row.Item_ID}`;
      }

      console.log(`📡 Fetching batches for Item ${row.Item_ID}:`, url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        console.log(`✅ Found ${result.data.length} batch(es) for Item ${row.Item_ID}`);
        setAvailableBatches(result.data);
      } else {
        setAvailableBatches([]);
      }

    } catch (error: any) {
      console.error('❌ Batch fetch error:', error);
      setBatchError(error.message);
      setAvailableBatches([]);
    } finally {
      setIsLoadingBatches(false);
    }
  };

  fetchBatches();
}, [row.Item_ID, mode, dispatchId]);

// ═══════════════════════════════════════════════════════════════
// handleRefreshBatches
// ═══════════════════════════════════════════════════════════════
const handleRefreshBatches = useCallback(async () => {
  if (!row.Item_ID) return;

  setIsLoadingBatches(true);
  setBatchError(null);

  try {
    const baseUrl = getApiBaseUrl();  // ✅ Uses dynamic port (4000 or 4001)
    let url: string;

    if (mode === 'edit' && dispatchId) {
      url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`;
    } else {
      url = `${baseUrl}/dispatch/available-batches/${row.Item_ID}`;
    }

    console.log(`🔄 Refreshing batches for Item ${row.Item_ID}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      console.log(`✅ Refreshed: ${result.data.length} batch(es) for Item ${row.Item_ID}`);
      setAvailableBatches(result.data);

      // ✅ Update selected batch qty if batch is already selected
      if (selectedBatch) {
        const updatedBatch = result.data.find((b: any) => b.batchno === selectedBatch);
        if (updatedBatch) {
          setBatchQty(updatedBatch.available_qty_uom1 || 0);
        }
      }
    } else {
      setAvailableBatches([]);
    }

  } catch (error: any) {
    console.error('❌ Refresh error:', error);
    setBatchError(error.message);
  } finally {
    setIsLoadingBatches(false);
  }
}, [row.Item_ID, mode, dispatchId, selectedBatch]);












  // Handle batch selection
  const handleBatchSelect = useCallback((batchno: number) => {
    const batch = availableBatches.find(b => b.batchno === batchno)
    const availableQty = batch?.available_qty_uom1 || 0

    setSelectedBatch(batchno)
    setBatchQty(availableQty)

    onUpdate({
      ...row,
      batchno,
      selectedBatchQty: availableQty,
      dispatchQty,
      unitPrice,
      Discount_A: discountA,
      Discount_B: discountB,
      Discount_C: discountC
    })
  }, [availableBatches, row, dispatchQty, unitPrice, discountA, discountB, discountC, onUpdate])



  // Handle UOM change
  const handleUomChange = useCallback((uomData: any) => {
    setDispatchQty(uomData)

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty: uomData,
      unitPrice,
      Discount_A: discountA,
      Discount_B: discountB,
      Discount_C: discountC
    })
  }, [row, selectedBatch, batchQty, unitPrice, discountA, discountB, discountC, onUpdate])

  const handlePriceChange = useCallback((price: string) => {
    const priceNum = parseFloat(price) || 0
    setUnitPrice(priceNum)

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty,
      unitPrice: priceNum,
      Discount_A: discountA,
      Discount_B: discountB,
      Discount_C: discountC
    })
  }, [row, selectedBatch, batchQty, dispatchQty, discountA, discountB, discountC, onUpdate])

  // Handle discount changes
  const handleDiscountChange = useCallback((field: 'A' | 'B' | 'C', value: string) => {
    const numValue = parseFloat(value) || 0
    
    let newDiscountA = discountA
    let newDiscountB = discountB
    let newDiscountC = discountC
    
    if (field === 'A') {
      setDiscountA(numValue)
      newDiscountA = numValue
    } else if (field === 'B') {
      setDiscountB(numValue)
      newDiscountB = numValue
    } else {
      setDiscountC(numValue)
      newDiscountC = numValue
    }

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty,
      unitPrice,
      Discount_A: newDiscountA,
      Discount_B: newDiscountB,
      Discount_C: newDiscountC
    })
  }, [row, selectedBatch, batchQty, dispatchQty, unitPrice, discountA, discountB, discountC, onUpdate])

  // Calculations
  const isOverDispatch = selectedBatch && dispatchQty.uom1_qty > batchQty && batchQty > 0
  const rowTotal = (dispatchQty.uom1_qty || 0) * unitPrice
  const batchesWithStock = availableBatches.filter(b => b.available_qty_uom1 > 0)

  return (
    <div className={`p ${row.isDuplicateRow ? 'bg-teal' : 'bg-white'}`}>

      <div className="grid grid-cols-12 gap-4 items-start">
        {/* ✅ Refresh Button */}

        {/* Batch Selection */}
        <div className="col-span-5 px-5 py-1">
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
            <div className="flexitems-center gap-2 text-emerald-600 text-sm py-3 bg-emerald-50 rounded-lg px-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading batches...
            </div>
          ) : batchError ? (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {batchError}
            </div>
          ) : batchesWithStock.length === 0 ? (
            <div className="text-orange-700 text-sm bg-orange-50 px-3 py-2 rounded-lg">
              <Package className="w-4 h-4 inline mr-1" />
              No stock available
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
                      p-1 rounded-lg border text-[10px] transition-all min-w-[110px]
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
                        {batch.available_qty_uom1?.toLocaleString()} avl
                      </span> */}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Available Qty */}
        <div className="col-span-1">
          {/* <label className="text-xs text-gray-600 mb-1.5 block">Available</label> */}
          <div className={`text-lg font-semibold ${batchQty > 0 ? 'text-emerald-600' : 'text-gray-300'} flex items-baseline gap-1`}>
            <p >{batchQty.toLocaleString()}</p><span className="text-xs text-gray-500">{row.uomStructure?.primary?.name || 'Pcs'}</span>
          </div>
          {/* <span className="text-xs text-gray-500">{row.uomStructure?.primary?.name || 'Pcs'}</span> */}
        </div>

        {/* Dispatch Qty */}
        <div className="col-span-4 mx-auto">
          {/* <label className="text-xs text-gray-600 mb-1.5 block">Dispatch Qty</label> */}
          <UomConverter
            uomData={row.uomStructure}
            lineIndex={rowIndex}
            itemId={row.Item_ID}
            onChange={handleUomChange}
            initialValues={row.orderQty || undefined}
          />
          {isOverDispatch && (
            <div className="text-red-600 text-xs flex items-center gap-1 mt-1.5 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Exceeds available!
            </div>
          )}
        </div>

        {/* Discount Fields */}
        {/* <div className="col-span-1 flex gap-1">
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 block mb-0.5">Disc A%</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={discountA}
              onChange={(e) => handleDiscountChange('A', e.target.value)}
              className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 block mb-0.5">Disc B%</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={discountB}
              onChange={(e) => handleDiscountChange('B', e.target.value)}
              className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 block mb-0.5">Disc C%</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={discountC}
              onChange={(e) => handleDiscountChange('C', e.target.value)}
              className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div> */}

        {/* Remove Button */}
        <div className="col-span-1 flex items-center justify-center pt-6">
          {showRemoveButton && (
            <button
              onClick={onRemove}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
              title="Remove this batch row"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
