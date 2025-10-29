'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import ClassDropdown from './ClassDropdown'
import UOMDropdown from './UOMDropdown'
import AccountDropdown from './AccountDropdown'

interface ItemFormData {
  itemName: string;
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
  skuUOM: number | null;
  uom2: number | null;
  uom2_qty: number | null;
  uom3: number | null;
  uom3_qty: number | null;
  assessmentUOM: number | null;
  weight_per_pcs: number | null;
  barCode: string | null;
  sellingPrice: number | null;
  purchasePricePKR: number | null;
  purchasePriceFC: number |null;
  assessedPrice: number | null;
  hsCode: string | null;
  cd: number | null;
  ftaCd: number | null;
  acd: number | null;
  rd: number | null;
  salesTax: number | null;
  addSalesTax: number | null;
  itaxImport: number | null;
  furtherTax: number | null;
  supplier: number | null;
  purcahseAccount: number | null; // Note: matching your model's typo
  salesAccount: number | null;
  salesTaxAccount: number | null;
  wastageItem: boolean;
  isNonInventory: boolean;
}

const ZItemsForm = () => {


const router = useRouter();


  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  
  const [formData, setFormData] = useState<ItemFormData>({
    itemName: "",
    // itemName: "Test Product ABC123",
    itemClass1: null,
    itemClass2: null,
    itemClass3: null,
    itemClass4: null,
    skuUOM: null,
    uom2: null,
    uom2_qty: null,
    uom3: null,
    uom3_qty: null,
    assessmentUOM: null,
    weight_per_pcs: null,
    // weight_per_pcs: 0.5,
    barCode: "",
    // barCode: "1234567890123",
    sellingPrice: null,
    purchasePricePKR: null,
    purchasePriceFC: null,
    assessedPrice: null,
    // sellingPrice: 99.99,
    // purchasePricePKR: 75.00,
    // purchasePriceFC: 1.50,
    // assessedPrice: 2.00,
    hsCode: "",
    // hsCode: "8501.10",
    cd: null,
    ftaCd:null,
    acd:null,
    rd:null,
    salesTax:null,
    addSalesTax:null,
    itaxImport:null,
    furtherTax:null,
    // cd: 10,
    // ftaCd: 5,
    // acd: 2,
    // rd: 3,
    // salesTax: 17,
    // addSalesTax: 3,
    // itaxImport: 5.5,
    // furtherTax: 1,
    supplier: null,
    purcahseAccount: null, // matching the typo in your model
    salesAccount: null,
    salesTaxAccount: null,
    wastageItem: false,
    isNonInventory: false
  })

  const handleDropdownChange = (name: string, value: number | null) => {
    // Map purchaseAccount to purcahseAccount to match your model
    const fieldName = name === 'purchaseAccount' ? 'purcahseAccount' : name
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? (value ? parseFloat(value) : 0) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage('')
      setErrorDetails('')
      
      console.log('Submitting form data:', formData)
      
      const response = await fetch(
        `http://${window.location.hostname}:4000/api/z-items/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        // Extract error message from API response
        const errorMsg = result.message || result.error || result.err || 'Failed to save item'
        setMessage(`Error: ${errorMsg}`)
        
        // Show validation errors if any
        if (result.errors) {
          setErrorDetails(JSON.stringify(result.errors, null, 2))
        }
        
        console.error('API Error:', result)
        return
      }
      
      console.log('Success:', result)
      setMessage('Item created successfully!')
      
      // Optionally reset form after success
      setTimeout(() => {
        setMessage('')
        router.push('item-form')
      
      }, 4000)
      
    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Network error or server is not responding')
      setErrorDetails(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Create New Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barCode"
                    value={formData.barCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight per Piece
                  </label>
                  <input
                    type="number"
                    name="weight_per_pcs"
                    value={formData.weight_per_pcs}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HS Code
                  </label>
                  <input
                    type="text"
                    name="hsCode"
                    value={formData.hsCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Class Dropdowns */}
            <ClassDropdown
              values={{
                itemClass1: formData.itemClass1,
                itemClass2: formData.itemClass2,
                itemClass3: formData.itemClass3,
                itemClass4: formData.itemClass4
              }}
              onChange={handleDropdownChange}
            />

            {/* UOM Dropdowns */}
            <UOMDropdown
              values={{
                skuUOM: formData.skuUOM,
                uom2: formData.uom2,
                uom3: formData.uom3,
                assessmentUOM: formData.assessmentUOM
              }}
              onChange={handleDropdownChange}
            />

            {/* UOM Quantities */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">UOM Quantities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UOM 2 Quantity
                  </label>
                  <input
                    type="number"
                    name="uom2_qty"
                    value={formData.uom2_qty}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UOM 3 Quantity
                  </label>
                  <input
                    type="number"
                    name="uom3_qty"
                    value={formData.uom3_qty}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price (PKR)
                  </label>
                  <input
                    type="number"
                    name="purchasePricePKR"
                    value={formData.purchasePricePKR}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price (FC)
                  </label>
                  <input
                    type="number"
                    name="purchasePriceFC"
                    value={formData.purchasePriceFC}
                    onChange={handleInputChange}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessed Price
                  </label>
                  <input
                    type="number"
                    name="assessedPrice"
                    value={formData.assessedPrice}
                    onChange={handleInputChange}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax & Duty Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Duty (%)
                  </label>
                  <input
                    type="number"
                    name="cd"
                    value={formData.cd}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FTA Custom Duty (%)
                  </label>
                  <input
                    type="number"
                    name="ftaCd"
                    value={formData.ftaCd}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Custom Duty (%)
                  </label>
                  <input
                    type="number"
                    name="acd"
                    value={formData.acd}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulatory Duty (%)
                  </label>
                  <input
                    type="number"
                    name="rd"
                    value={formData.rd}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sales Tax (%)
                  </label>
                  <input
                    type="number"
                    name="salesTax"
                    value={formData.salesTax}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Sales Tax (%)
                  </label>
                  <input
                    type="number"
                    name="addSalesTax"
                    value={formData.addSalesTax}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Income Tax Import (%)
                  </label>
                  <input
                    type="number"
                    name="itaxImport"
                    value={formData.itaxImport}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Further Tax (%)
                  </label>
                  <input
                    type="number"
                    name="furtherTax"
                    value={formData.furtherTax}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Account Dropdowns - Note: purchaseAccount will be mapped to purcahseAccount */}
            <AccountDropdown
              values={{
                purchaseAccount: formData.purcahseAccount, // using the typo field
                salesAccount: formData.salesAccount,
                salesTaxAccount: formData.salesTaxAccount,
                supplier: formData.supplier
              }}
              onChange={handleDropdownChange}
            />

            {/* Item Settings */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Settings</h3>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="wastageItem"
                    checked={formData.wastageItem}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Wastage Item</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNonInventory"
                    checked={formData.isNonInventory}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Non-Inventory Item</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Creating Item...' : 'Create Item'}
            </button>
          </form>
          
          {/* Success/Error Messages */}
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm
              ${message.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
          
          {/* Detailed Error Display */}
          {errorDetails && (
            <div className="mt-2 p-3 bg-gray-100 rounded-md">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {errorDetails}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ZItemsForm
