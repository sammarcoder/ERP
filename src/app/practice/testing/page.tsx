







'use client'

import { useState } from "react"
import { SearchableInput } from "@/components/common/SearchableInput"

import { CurrencySearchableInput } from "@/components/common/SearchableInput/CurrencySearchableInput"

// ✅ More realistic ERP data structure
const OrderForm = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    itemId: '',
    transporterId: ''
  })

  // ✅ Sample ERP data
  const customers = [
    {
      id: 'CUST001',
      name: 'Malik Traders',
      description: 'Karachi - Credit Limit: ₹500,000'
    },
    {
      id: 'CUST002',
      name: 'Hassan Electronics',
      description: 'Lahore - Credit Limit: ₹200,000'
    },
    {
      id: 'CUST003',
      name: 'Modern Stores',
      description: 'Islamabad - Credit Limit: ₹300,000'
    },
    {
      id: 'CUST004',
      name: 'Malik Traders',
      description: 'Karachi - Credit Limit: ₹500,000'
    },
    {
      id: 'CUST005',
      name: 'Hassan Electronics',
      description: 'Lahore - Credit Limit: ₹200,000'
    },
    {
      id: 'CUST006',
      name: 'Modern Stores',
      description: 'Islamabad - Credit Limit: ₹300,000'
    },
    {
      id: 'CUST007',
      name: 'Malik Traders',
      description: 'Karachi - Credit Limit: ₹500,000'
    },
    {
      id: 'CUST008',
      name: 'Hassan Electronics',
      description: 'Lahore - Credit Limit: ₹200,000'
    },
    {
      id: 'CUST003',
      name: 'Modern Stores',
      description: 'Islamabad - Credit Limit: ₹300,000'
    },
    {
      id: 'CUST009',
      name: 'Malik Traders',
      description: 'Karachi - Credit Limit: ₹500,000'
    },
    {
      id: 'CUST0010',
      name: 'Hassan Electronics',
      description: 'Lahore - Credit Limit: ₹200,000'
    },
    {
      id: 'CUST0011',
      name: 'Modern Stores',
      description: 'Islamabad - Credit Limit: ₹300,000'
    },
    {
      id: 'CUST0012',
      name: 'Malik Traders',
      description: 'Karachi - Credit Limit: ₹500,000'
    },
    {
      id: 'CUST0013',
      name: 'Hassan Electronics',
      description: 'Lahore - Credit Limit: ₹200,000'
    },
    {
      id: 'CUST0014',
      name: 'Modern Stores',
      description: 'Islamabad - Credit Limit: ₹300,000'
    }
  ]

  const items = [
    {
      id: 'ITEM001',
      name: 'Samsung Galaxy S24',
      description: 'Mobile - Stock: 25 units - ₹75,000'
    },
    {
      id: 'ITEM002',
      name: 'iPhone 15',
      description: 'Mobile - Stock: 12 units - ₹150,000'
    },
    {
      id: 'ITEM003',
      name: 'HP Laptop Core i7',
      description: 'Computer - Stock: 8 units - ₹95,000'
    }
  ]

  const transporters = [
    {
      id: 'TRANS001',
      name: 'TCS Express',
      description: 'Nationwide - Rate: ₹15/kg'
    },
    {
      id: 'TRANS002',
      name: 'Leopards Courier',
      description: 'Major Cities - Rate: ₹12/kg'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Sales Order Creation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Customer Selection */}
        <SearchableInput
          label="Customer *"
          placeholder="Search customers..."
          options={customers}
          value={formData.customerId}
          onChange={(id, option) => {
            setFormData(prev => ({ ...prev, customerId: id as string }))
            console.log('Selected Customer:', option)
          }}
          variant="default"
          size="md"
          helperText="Select customer for this order"
        />

        {/* ✅ Item Selection */}
        <SearchableInput
          label="Product Item *"
          placeholder="Search products..."
          options={items}
          value={formData.itemId}
          onChange={(id, option) => {
            setFormData(prev => ({ ...prev, itemId: id as string }))
            console.log('Selected Item:', option)
          }}
          variant="default"
          size="md"
          helperText="Choose product for order line"
        />

        {/* ✅ Transporter Selection */}
        <SearchableInput
          label="Transporter"
          placeholder="Search transporters..."
          options={transporters}
          value={formData.transporterId}
          onChange={(id, option) => {
            setFormData(prev => ({ ...prev, transporterId: id as string }))
            console.log('Selected Transporter:', option)
          }}
          variant="filled"
          size="md"
          helperText="Optional - for delivery"
        />
      </div>

      {/* ✅ Form Data Display */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">Order Form Data:</h3>
        <pre className="text-sm text-blue-700">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      <CurrencySearchableInput />
    </div>
  )
}

export default OrderForm






