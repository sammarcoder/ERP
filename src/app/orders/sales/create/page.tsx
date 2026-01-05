// app/sales/create/page.tsx - WITH CONFIRMATION MODAL & FORM RESET
'use client'
import React, { useState } from 'react'
import { OrderHeader } from '@/components/orders/OrderHeader'
import { OrderDetails } from '@/components/orders/OrderDetails'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { formatOrderForApi } from '@/utils/orderDataFormatter'
import { useCreateOrderMutation } from '@/store/slice/orderApi'

export default function CreateSalesOrderPage() {
  // ✅ Initial state structure
  const getInitialHeaderData = () => ({
    date: new Date().toISOString().split('T')[0],
    COA_ID: '',
    Transporter_ID: '',
    Stock_Type_ID: 12,
    freight_crt: 0,
    labour_crt: 0,
    bility_expense: 0,
    other_expense: 0,
    foreign_currency: '',
    sub_customer: '',
    sub_city: '',
    str: 0,
    discountA: 0,
    discountB: 0,
    discountC: 0
  })

  const [headerData, setHeaderData] = useState(getInitialHeaderData())
  const [orderDetails, setOrderDetails] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [createOrder, { isLoading }] = useCreateOrderMutation()

  // ✅ Reset form to initial state
  const resetForm = () => {
    console.log('🔄 Resetting form to initial state')
    setHeaderData(getInitialHeaderData())
    setOrderDetails([])
    setShowConfirmModal(false)
  }

  const handleSubmitOrder = async () => {
    console.group('🚀 Sales Order Submission')
    
    try {
      const apiData = formatOrderForApi(headerData, orderDetails)
      console.log('📤 Submitting to API:', apiData)
      
      const result = await createOrder(apiData).unwrap()
      
      console.log('✅ Order Created Successfully:', result)
      console.log('📝 Order Number:', result.data?.Number)
      console.log('🆔 Order ID:', result.data?.ID)
      
      // ✅ Success - reset form
      resetForm()
      
      // Show success modal or notification here if needed
      console.log('🎉 Form reset - ready for new order')
      
    } catch (error: any) {
      console.error('❌ Order Submission Failed:', error)
      const errorMessage = error.data?.message || error.message || 'Unknown error occurred'
      // Error handling - don't reset form, let user fix and retry
    }
    
    console.groupEnd()
  }

  const isFormValid = () => {
    const hasRequiredHeader = !!(headerData.date && headerData.COA_ID)
    const hasOrderDetails = orderDetails.length > 0
    return hasRequiredHeader && hasOrderDetails
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Sales Order</h1>
        {/* <p className="text-gray-600 mt-2">Complete order management with bulk item selection</p> */}
      </div>

      {/* ✅ Order Header with clear button support */}
      <OrderHeader
        orderType="sales"
        value={headerData}
        onChange={setHeaderData}
      />

      <OrderDetails
        headerData={headerData}
        isPurchase={false}
        
        onChange={setOrderDetails}
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {orderDetails.length > 0 && (
            <div className="space-y-1">
              <p><strong>✅ Ready for Submission:</strong></p>
              <p>• Customer: {headerData.COA_ID || 'Not selected'}</p>
              <p>• Items: {orderDetails.length}</p>
              <p>• Total Value: Rs {orderDetails.reduce((sum, item) => sum + (item.grossTotal || 0), 0).toFixed(2)}</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          {/* ✅ Reset Button */}
          {/* <Button
            variant="ghost"
            onClick={resetForm}
            disabled={isLoading}
          >
            Reset Form
          </Button>
           */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowConfirmModal(true)}
            disabled={!isFormValid() || isLoading}
            className="min-w-[100px]"
          >
            {isLoading 
              ? ' Creating Order...' 
              : ` Submit  Order`
            }
          </Button>
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmitOrder}
        title="Confirm Order Submission"
        message={`Are you sure you want to submit this sales order with ${orderDetails.length} items? This action cannot be undone.`}
        confirmText="Submit Order"
        cancelText="Cancel"
        type="info"
        loading={isLoading}
      />
    </div>
  )
}
