
// components/grn/GRNEditForm.tsx
'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Loader2, Save, ArrowLeft, AlertCircle, Package, 
  Trash2, Plus, X, Tag, FileText, Calendar, CheckCircle
} from 'lucide-react'
import { useGetGRNByIdQuery, useUpdateGRNMutation } from '@/store/slice/grnApi'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
import UomConverter from '../testing/UomConverter'

interface Props {
  grnId: string
}

export default function GRNEditForm({ grnId }: Props) {
  const router = useRouter()

  // API Hooks
  const { data: grnResponse, isLoading, error } = useGetGRNByIdQuery(grnId)
  const [updateGRN, { isLoading: isUpdating }] = useUpdateGRNMutation()
  const { data: itemsResponse, isLoading: itemsLoading } = useGetAllItemsQuery({ limit: 1000 })

  const grnData = grnResponse?.data
  const allItems = itemsResponse?.data || []

  // State
  const [headerForm, setHeaderForm] = useState({
    Date: '',
    Status: 'UnPost',
    Purchase_Type: 'Local',
    COA_ID: null as number | null,
    COA_Name: '',
    batchno: null as number | null,
    remarks: ''
  })

  const [detailRows, setDetailRows] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItemsForModal, setSelectedItemsForModal] = useState<any[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Build UOM Structure Helper
  const buildUomStructure = useCallback((item: any) => {
    const secondaryQty = parseFloat(item?.uom2_qty || item?.qty_2 || 0)
    const tertiaryQty = parseFloat(item?.uom3_qty || item?.qty_3 || 0)

    const uomStructure: any = {
      primary: {
        id: item?.skuUOM || item?.uom1?.id || 1,
        name: item?.uom1?.uom || 'Pcs',
        qty: 1
      }
    }

    if ((item?.uom2 || item?.uomTwo) && secondaryQty > 0) {
      uomStructure.secondary = {
        id: item?.uom2 || item?.uomTwo?.id || 2,
        name: item?.uomTwo?.uom || 'Box',
        qty: secondaryQty
      }
    }

    if ((item?.uom3 || item?.uomThree) && tertiaryQty > 0) {
      uomStructure.tertiary = {
        id: item?.uom3 || item?.uomThree?.id || 6,
        name: item?.uomThree?.uom || 'Crt',
        qty: tertiaryQty
      }
    }

    return uomStructure
  }, [])

  // Initialize form
  useEffect(() => {
    if (grnData && allItems.length > 0 && !isInitialized) {
      setHeaderForm({
        Date: grnData.Date?.split('T')[0] || new Date().toISOString().split('T')[0],
        Status: grnData.Status || 'UnPost',
        Purchase_Type: grnData.Purchase_Type || 'Local',
        COA_ID: grnData.COA_ID,
        COA_Name: grnData.account?.acName || '',
        batchno: grnData.COA_ID,
        remarks: grnData.remarks || ''
      })

      if (grnData.details?.length > 0) {
        const rows = grnData.details.map((detail: any, idx: number) => {
          const fullItem = allItems.find((item: any) => item.id === detail.Item_ID)
          const itemForUom = fullItem || detail.item || {}
          const uomStructure = buildUomStructure(itemForUom)

          return {
            lineIndex: idx,
            Item_ID: detail.Item_ID,
            itemName: fullItem?.itemName || detail.item?.itemName || `Item ${detail.Item_ID}`,
            unitPrice: parseFloat(detail.Stock_Price) || 0,
            uomStructure,
            batchNumber: detail.batchno,
            grnQty: {
              uom1_qty: parseFloat(detail.uom1_qty) || 0,
              uom2_qty: parseFloat(detail.uom2_qty) || 0,
              uom3_qty: parseFloat(detail.uom3_qty) || 0,
              sale_unit: parseInt(detail.Sale_Unit) || 1,
              Uom_Id: detail.sale_Uom || 0
            }
          }
        })

        setDetailRows(rows)
        const selectedIds = grnData.details.map((d: any) => d.Item_ID)
        setSelectedItemsForModal(allItems.filter((item: any) => selectedIds.includes(item.id)))
      }

      setIsInitialized(true)
    }
  }, [grnData, allItems, isInitialized, buildUomStructure])

  // Handlers
  const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
    const coaIdInt = selectedId ? parseInt(String(selectedId), 10) : null
    setHeaderForm(prev => ({
      ...prev,
      COA_ID: coaIdInt,
      COA_Name: selectedOption?.name || '',
      batchno: coaIdInt
    }))
  }, [])

  const handleUomChange = useCallback((itemId: number, uomData: any) => {
    setDetailRows(prev => prev.map(row =>
      row.Item_ID === itemId ? { ...row, grnQty: uomData } : row
    ))
  }, [])

  const handlePriceChange = useCallback((itemId: number, price: string) => {
    setDetailRows(prev => prev.map(row =>
      row.Item_ID === itemId ? { ...row, unitPrice: parseFloat(price) || 0 } : row
    ))
  }, [])

  const handleDeleteRow = useCallback((itemId: number) => {
    setDetailRows(prev => prev.filter(row => row.Item_ID !== itemId))
    setSelectedItemsForModal(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const handleAddItemsFromModal = useCallback(() => {
    const existingIds = detailRows.map(r => r.Item_ID)
    const newItems = selectedItemsForModal.filter(item => !existingIds.includes(item.id))

    const newRows = newItems.map((item, idx) => {
      const uomStructure = buildUomStructure(item)

      return {
        lineIndex: detailRows.length + idx,
        Item_ID: item.id,
        itemName: item.itemName,
        unitPrice: parseFloat(item.purchasePricePKR) || parseFloat(item.sellingPrice) || 0,
        uomStructure,
        batchNumber: headerForm.batchno,
        grnQty: {
          uom1_qty: 0,
          uom2_qty: 0,
          uom3_qty: 0,
          sale_unit: uomStructure.tertiary ? 3 : uomStructure.secondary ? 2 : 1,
          Uom_Id: 0
        }
      }
    })

    setDetailRows(prev => [...prev, ...newRows])
    setIsModalOpen(false)
  }, [detailRows, selectedItemsForModal, headerForm.batchno, buildUomStructure])

  // Submit
  const handleSubmit = async () => {
    setShowConfirmModal(false)

    const validItems = detailRows.filter(row => row.grnQty?.uom1_qty > 0)
    if (validItems.length === 0) {
      alert('Please enter quantities!')
      return
    }

    if (!headerForm.COA_ID) {
      alert('Please select a supplier!')
      return
    }

    const batchnoInt = parseInt(String(headerForm.COA_ID), 10)

    try {
      const payload = {
        id: grnId,
        stockMain: {
          COA_ID: headerForm.COA_ID,
          Date: headerForm.Date,
          Status: headerForm.Status,
          Purchase_Type: headerForm.Purchase_Type,
          remarks: headerForm.remarks
        },
        stockDetails: validItems.map((row, idx) => ({
          Line_Id: idx + 1,
          Item_ID: row.Item_ID,
          batchno: batchnoInt,
          uom1_qty: row.grnQty.uom1_qty,
          uom2_qty: row.grnQty.uom2_qty,
          uom3_qty: row.grnQty.uom3_qty,
          Sale_Unit: row.grnQty.sale_unit,
          sale_Uom: row.grnQty.Uom_Id,
          Stock_Price: row.unitPrice || 0,
          Stock_In_UOM: row.uomStructure?.primary?.id || 1,
          Stock_In_UOM_Qty: row.grnQty.uom1_qty,
          Stock_In_SKU_UOM: row.uomStructure?.secondary?.id || null,
          Stock_In_SKU_UOM_Qty: row.grnQty.uom2_qty,
          Stock_In_UOM3_Qty: row.grnQty.uom3_qty
        }))
      }

      await updateGRN(payload).unwrap()
      alert('✅ GRN updated successfully!')
      router.push('/inventoryy/grn')
    } catch (err: any) {
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  // Calculations
  const grandTotal = useMemo(() => {
    return detailRows.reduce((sum, row) => sum + ((row.grnQty?.uom1_qty || 0) * (row.unitPrice || 0)), 0)
  }, [detailRows])

  const canSubmit = useMemo(() => {
    return detailRows.length > 0 && headerForm.COA_ID && detailRows.some(row => row.grnQty?.uom1_qty > 0)
  }, [detailRows, headerForm.COA_ID])

  // Loading
  if (isLoading || itemsLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#4c96dc]" />
        <span className="text-gray-600">{isLoading ? 'Loading GRN...' : 'Loading items...'}</span>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-semibold text-red-800 mb-2">Error Loading GRN</h2>
          <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  // Posted - Cannot Edit
  if (grnData?.Status === 'Post') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-yellow-800 text-center mb-2">Cannot Edit Posted GRN</h2>
          <p className="text-yellow-700 text-center text-sm mb-4">
            GRN <strong>{grnData.Number}</strong> is Posted. Please UnPost first to edit.
          </p>
          <div className="text-center">
            <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit GRN</h1>
            <p className="text-gray-500">{grnData?.Number}</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowConfirmModal(true)}
          disabled={!canSubmit}
          loading={isUpdating}
          icon={<Save className="w-5 h-5" />}
        >
          Save Changes
        </Button>
      </div>

      {/* Order Info */}
      {grnData?.order && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Linked Order
          </h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Order #:</span>
              <p className="font-medium">{grnData.order.Number}</p>
            </div>
            <div>
              <span className="text-blue-600">Status:</span>
              <p className="font-medium">{grnData.order.Next_Status}</p>
            </div>
            <div>
              <span className="text-blue-600">Approved:</span>
              <p className="font-medium">{grnData.order.approved ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Form */}
      <div className="bg-white border h-40 border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">GRN Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <CoaSearchableInput
              orderType="purchase"
              value={headerForm.COA_ID || ''}
              onChange={handleCoaChange}
              label="Supplier"
              required
              showFilter={true}
            />
          </div>
          {/* <div className="lg:col-span-2 bg-green-50 border border-green-200 rounded-xl p-4">
            <label className="text-sm text-green-700">Batch Number</label>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-bold text-green-800">{headerForm.batchno || '-'}</span>
              <span className="text-green-600">{headerForm.COA_Name}</span>
            </div>
          </div> */}
          <Input
            type="date"
            label="Date"
            value={headerForm.Date}
            onChange={(e) => setHeaderForm({ ...headerForm, Date: e.target.value })}
          />
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={headerForm.Status}
              onChange={(e) => setHeaderForm({ ...headerForm, Status: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="UnPost">UnPost</option>
              <option value="Post">Posted</option>
            </select>
          </div> */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Type</label>
            <select
              value={headerForm.Purchase_Type}
              onChange={(e) => setHeaderForm({ ...headerForm, Purchase_Type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Local">Local</option>
              <option value="Foreign">Foreign</option>
              <option value="Mfg">Manufacturing</option>
            </select>
          </div> */}
          <Input
            label="Remarks"
            value={headerForm.remarks}
            onChange={(e) => setHeaderForm({ ...headerForm, remarks: e.target.value })}
            placeholder="Optional..."
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">📦 Items ({detailRows.length})</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Items
          </Button>
        </div>

        {headerForm.batchno && (
          <div className="px-5 py-3 bg-green-50 border-b flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">
              Batch <strong>{headerForm.batchno}</strong> ({headerForm.COA_Name})
            </span>
          </div>
        )}

        <div className="p-5">
          {detailRows.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No items</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">Batch</th>
                    {/* <th className="px-4 py-3 text-right text-xs font-semibold">Price</th> */}
                    {/* <th className="px-4 py-3 text-right text-xs font-semibold">Total</th> */}
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {detailRows.map((row, index) => (
                    <tr key={row.Item_ID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{row.itemName}</div>
                        <div className="text-xs text-gray-500">ID: {row.Item_ID}</div>
                      </td>
                      <td className="px-4 py-3">
                        <UomConverter
                          key={`uom-edit-${row.Item_ID}`}
                          uomData={row.uomStructure}
                          lineIndex={index}
                          itemId={row.Item_ID}
                          onChange={(data) => handleUomChange(row.Item_ID, data)}
                          initialValues={{
                            uom1_qty: String(row.grnQty?.uom1_qty || ''),
                            uom2_qty: String(row.grnQty?.uom2_qty || ''),
                            uom3_qty: String(row.grnQty?.uom3_qty || ''),
                            sale_unit: String(row.grnQty?.sale_unit || '1')
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {headerForm.batchno || '-'}
                        </span>
                      </td>
                      {/* <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          value={row.unitPrice || ''}
                          onChange={(e) => handlePriceChange(row.Item_ID, e.target.value)}
                          className="w-24 border rounded px-2 py-1 text-right"
                        />
                      </td> */}
                      {/* <td className="px-4 py-3 text-right font-semibold">
                        {((row.grnQty?.uom1_qty || 0) * (row.unitPrice || 0)).toLocaleString()}
                      </td> */}
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteRow(row.Item_ID)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right font-semibold">Grand Total:</td>
                    <td className="px-4 py-3 text-right font-bold text-xl text-emerald-600">
                      {grandTotal.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot> */}
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Select Items</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MultiSelectItemTable
                isPurchase={true}
                preSelectedIds={detailRows.map(r => r.Item_ID)}
                onSelectionChange={setSelectedItemsForModal}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="success" onClick={handleAddItemsFromModal}>
                Add Selected ({selectedItemsForModal.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Save Changes"
        message={`Save changes to GRN ${grnData?.Number}?`}
        confirmText="Save"
        type="info"
        loading={isUpdating}
      />
    </div>
  )
}
