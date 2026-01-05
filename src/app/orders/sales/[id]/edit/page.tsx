// app/orders/sales/[id]/edit/page.tsx - WITH CONFIRMATION MODAL
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '@/store/slice/orderApi'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import OrderHeader from '@/components/orders/OrderHeader'
import OrderDetails from '@/components/orders/OrderDetails'
import { ArrowLeft, Save, RotateCcw } from 'lucide-react'

export default function EditSalesOrderPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  // ✅ State for header and line items
  const [headerData, setHeaderData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    COA_ID: '',
    Transporter_ID: '',
    Stock_Type_ID: 12,
    discountA: '',
    discountB: '',
    discountC: '',
    freight_crt: '',
    labour_crt: '',
    bility_expense: '',
    other_expense: '',
    foreign_currency: '',
    sub_customer: '',
    sub_city: '',
    str: ''
  })
  const [lineItems, setLineItems] = useState<any[]>([])

  // ✅ ADD: Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // ✅ API hooks
  const { data: existingOrder, isLoading, error } = useGetOrderByIdQuery(orderId)
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()

  // ✅ Pre-populate header data from existing order
  useEffect(() => {
    if (existingOrder?.data) {
      console.log('📋 Pre-populating header data from existing order:', existingOrder.data)
      
      const order = existingOrder.data
      setHeaderData({
        date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
        COA_ID: order.COA_ID || '',
        Transporter_ID: order.Transporter_ID || '',
        Stock_Type_ID: 12, // Sales order
        
        // ✅ Financial fields - preserve existing or empty
        freight_crt: order.freight_crt || '',
        labour_crt: order.labour_crt || '',
        bility_expense: order.bility_expense || '',
        other_expense: order.other_expense || '',
        foreign_currency: order.foreign_currency || '',
        sub_customer: order.sub_customer || '',
        sub_city: order.sub_city || '',
        str: order.str || '',
        
        // ✅ Discount fields from account data (critical for line items)
        discountA: order.account?.discountA ? parseFloat(order.account.discountA) : '',
        discountB: order.account?.discountB ? parseFloat(order.account.discountB) : '',
        discountC: order.account?.discountC ? parseFloat(order.account.discountC) : ''
      })
    }
  }, [existingOrder])

  // ✅ UPDATED: Show confirmation modal instead of direct update
  const handleUpdateButtonClick = () => {
    if (!headerData.COA_ID) {
      alert('Please select a customer account')
      return
    }

    if (lineItems.length === 0) {
      alert('Please add at least one item to the order')
      return
    }

    // ✅ Show confirmation modal
    setShowConfirmModal(true)
  }

  // ✅ Actual update order submission (called after confirmation)
  const handleConfirmUpdate = async () => {
    try {
      console.group('💾 Updating Sales Order')
      console.log('Order ID:', orderId)
      console.log('Header Data:', headerData)
      console.log('Line Items:', lineItems)

      // ✅ Prepare master data
      const masterData = {
        Date: headerData.date,
        COA_ID: headerData.COA_ID,
        Stock_Type_ID: 12, // Sales order
        Next_Status: 'Incomplete',
        GRN_Status: 'Pending',
        Transporter_ID: headerData.Transporter_ID || null,
        freight_crt: headerData.freight_crt || null,
        labour_crt: headerData.labour_crt || null,
        bility_expense: headerData.bility_expense || null,
        other_expense: headerData.other_expense || null,
        foreign_currency: headerData.foreign_currency || null,
        sub_customer: headerData.sub_customer || null,
        sub_city: headerData.sub_city || null,
        str: headerData.str ? parseInt(headerData.str) : null,
        is_Note_generated: false
      }

      // ✅ Prepare details data
      const detailsData = lineItems.map((item, index) => ({
        Line_Id: item.lineNo,
        Item_ID: item.Item_ID,
        Price: '0.00',
        Stock_In_UOM: null,
        Stock_In_UOM_Qty: '0.000',
        Stock_SKU_Price: '0.00',
        Stock_In_SKU_UOM: null,
        Stock_In_SKU_UOM_Qty: '0.000',
        Stock_out_UOM: null,
        Stock_out_UOM_Qty: '0.000',
        Stock_out_SKU_UOM: null,
        Stock_out_SKU_UOM_Qty: '0.000',
        uom1_qty: item.uom1_qty ? item.uom1_qty.toString() : '0',
        uom2_qty: item.uom2_qty ? item.uom2_qty.toString() : '0',
        uom3_qty: item.uom3_qty ? item.uom3_qty.toString() : '0',
        sale_unit: item.sale_unit ? item.sale_unit.toString() : '3',
        Discount_A: item.Discount_A ? item.Discount_A.toString() : '0',
        Discount_B: item.Discount_B ? item.Discount_B.toString() : '0',
        Discount_C: item.Discount_C ? item.Discount_C.toString() : '0',
        Goods: null,
        Remarks: null,
        trade: false,
        Uom_Id: item.Uom_Id
      }))

      console.log('📦 Master Data:', masterData)
      console.log('📋 Details Data:', detailsData)

      // ✅ Call update API
      await updateOrder({
        id: orderId,
        master: masterData,
        details: detailsData
      }).unwrap()

      console.log('✅ Order updated successfully!')
      console.groupEnd()

      // ✅ Close modal and redirect
      setShowConfirmModal(false)
      // alert('Sales order updated successfully!')
      router.push('/orders/sales')

    } catch (error) {
      console.error('❌ Failed to update order:', error)
      console.groupEnd()
      
      // ✅ Close modal and show error
      setShowConfirmModal(false)
      const errorMessage = error?.data?.message || error?.message || 'Unknown error occurred'
      alert(`Failed to update order: ${errorMessage}`)
    }
  }

  // ✅ Loading states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading order data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <div className="text-center">
          <p className="text-lg font-medium mb-4">Failed to load order data</p>
          <Button onClick={() => router.back()} className="bg-blue-500 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* ✅ Page Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Sales Order #{existingOrder?.data?.Number}
            </h1>
            <p className="text-gray-600 mt-1">
              Modify order details and update when ready
            </p>
          </div>
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            className="flex items-center gap-2"
            disabled={isUpdating}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Changes
          </Button>
          
          <Button
            onClick={handleUpdateButtonClick}
            disabled={isUpdating || !headerData.COA_ID || lineItems.length === 0}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isUpdating ? 'Updating Order...' : 'Update Order'}
          </Button>
        </div>
      </div>

      {/* ✅ Order Status Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Current Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              existingOrder?.data?.Next_Status === 'Complete' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {existingOrder?.data?.Next_Status || 'Incomplete'}
            </span>
            
            <span className="font-medium">Items:</span>
            <span className="text-blue-600 font-medium">
              {existingOrder?.data?.details?.length || 0} original → {lineItems.length} current
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Created: {existingOrder?.data?.createdAt ? new Date(existingOrder.data.createdAt).toLocaleDateString() : 'Unknown'}
          </div>
        </div>
      </div>

      {/* ✅ Order Header Component */}
      <OrderHeader
        mode="edit"
        orderType="sales"
        value={headerData}
        onChange={setHeaderData}
        initialData={existingOrder?.data}
      />

      {/* ✅ Order Details Component */}
      <OrderDetails
        mode="edit"
        headerData={headerData}
        isPurchase={false}
        onChange={setLineItems}
        initialLineItems={existingOrder?.data?.details || []}
      />

      {/* ✅ Footer Summary */}
      {lineItems.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Ready to update? Make sure all information is correct.</p>
              <p className="mt-1">Changes will be saved to order #{existingOrder?.data?.Number}</p>
            </div>
            
            <Button
              onClick={handleUpdateButtonClick}
              disabled={isUpdating || !headerData.COA_ID || lineItems.length === 0}
              className="bg-green-600 text-white px-8 py-3 font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isUpdating ? 'Updating...' : 'Update Order'}
            </Button>
          </div>
        </div>
      )}

      {/* ✅ CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Sales Order"
        message={`Are you sure you want to update Sales Order #${existingOrder?.data?.Number}? This will save all your changes to the database.`}
        confirmText="Update Order"
        cancelText="Cancel"
        type="warning"
        loading={isUpdating}
      />
    </div>
  )
}
