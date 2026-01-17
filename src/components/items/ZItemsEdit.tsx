'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ClassDropdown from '../ClassDropdown'
import UOMDropdown from '../UOMDropdown'
import AccountDropdown from '../AccountDropdown'

interface ItemFormData {
  itemName: string;
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
  skuUOM: number | null;
  uom2: number | null;
  uom2_qty: number;
  uom3: number | null;
  uom3_qty: number;
  assessmentUOM: number | null;
  weight_per_pcs: number;
  barCode: number | string;
  sellingPrice: number;
  purchasePricePKR: number;
  purchasePriceFC: number;
  assessedPrice: number;
  hsCode: string;
  cd: number;
  ftaCd: number;
  acd: number;
  rd: number;
  salesTax: number;
  addSalesTax: number;
  itaxImport: number;
  furtherTax: number;
  supplier: number | null;
  purcahseAccount: number | null;
  salesAccount: number | null;
  salesTaxAccount: number | null;
  wastageItem: boolean;
  isNonInventory: boolean;
}

const ZItemsEdit = () => {
  const router = useRouter()
  const params = useParams()
  
  // Convert ID to string since params.id could be a string array or undefined
  const itemId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  
  const [formData, setFormData] = useState<ItemFormData>({
    itemName: "",
    itemClass1: null,
    itemClass2: null,
    itemClass3: null,
    itemClass4: null,
    skuUOM: null,
    uom2: null,
    uom2_qty: 12,
    uom3: null,
    uom3_qty: 144,
    assessmentUOM: null,
    weight_per_pcs: 0,
    barCode: 0,
    sellingPrice: 0,
    purchasePricePKR: 0,
    purchasePriceFC: 0,
    assessedPrice: 0,
    hsCode: "",
    cd: 0,
    ftaCd: 0,
    acd: 0,
    rd: 0,
    salesTax: 0,
    addSalesTax: 0,
    itaxImport: 0,
    furtherTax: 0,
    supplier: null,
    purcahseAccount: null,
    salesAccount: null,
    salesTaxAccount: null,
    wastageItem: false,
    isNonInventory: false
  })

  // Fetch item data when component mounts
  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) {
        console.error('No item ID provided in URL params')
        setMessage('Error: No item ID provided')
        setFetchLoading(false)
        return
      }
      
      console.log('Fetching item with ID:', itemId)
      
      try {
        setFetchLoading(true)
        const apiUrl = `http://${window.location.hostname}:4000/api/z-items/items/${itemId}`
        
        console.log('API URL for fetch:', apiUrl)
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API error response:', errorText)
          throw new Error(`Failed to fetch item: ${response.status} ${response.statusText}`)
        }
        
        const item = await response.json()
        
        console.log('Received item data:', item)
        
        if (!item || typeof item !== 'object') {
          throw new Error('Invalid response format: expected item object')
        }
        
        // Check if the API returns the item directly or nested inside a data property
        const itemData = item.data ? item.data : item
        
        // Fix any potential mismatches in data structure
        const preparedData = {
          itemName: itemData.itemName || "",
          itemClass1: itemData.itemClass1 || null,
          itemClass2: itemData.itemClass2 || null,
          itemClass3: itemData.itemClass3 || null,
          itemClass4: itemData.itemClass4 || null,
          skuUOM: itemData.skuUOM || null,
          uom2: itemData.uom2 || null,
          uom2_qty: itemData.uom2_qty ?? 12,
          uom3: itemData.uom3 || null,
          uom3_qty: itemData.uom3_qty ?? 144,
          assessmentUOM: itemData.assessmentUOM || null,
          weight_per_pcs: itemData.weight_per_pcs ?? 0,
          barCode: itemData.barCode || "",
          sellingPrice: itemData.sellingPrice ?? 0,
          purchasePricePKR: itemData.purchasePricePKR ?? 0,
          purchasePriceFC: itemData.purchasePriceFC ?? 0,
          assessedPrice: itemData.assessedPrice ?? 0,
          hsCode: itemData.hsCode || "",
          cd: itemData.cd ?? 0,
          ftaCd: itemData.ftaCd ?? 0,
          acd: itemData.acd ?? 0,
          rd: itemData.rd ?? 0,
          salesTax: itemData.salesTax ?? 0,
          addSalesTax: itemData.addSalesTax ?? 0,
          itaxImport: itemData.itaxImport ?? 0,
          furtherTax: itemData.furtherTax ?? 0,
          supplier: itemData.supplier || null,
          purcahseAccount: itemData.purcahseAccount || null,
          salesAccount: itemData.salesAccount || null,
          salesTaxAccount: itemData.salesTaxAccount || null,
          wastageItem: Boolean(itemData.wastageItem),
          isNonInventory: Boolean(itemData.isNonInventory)
        }
        
        console.log('Prepared form data:', preparedData)
        setFormData(preparedData)
      } catch (error) {
        console.error('Error fetching item:', error)
        setMessage(`Error: Failed to load item data - ${error instanceof Error ? error.message : 'Unknown error'}`)
        setErrorDetails(error instanceof Error ? error.stack || error.message : 'Unknown error')
      } finally {
        setFetchLoading(false)
      }
    }
    
    fetchItem()
  }, [itemId])

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
    
    if (!itemId) {
      setMessage('Error: No item ID available for update')
      return
    }
    
    try {
      setLoading(true)
      setMessage('')
      setErrorDetails('')
      
      console.log('Updating item with ID:', itemId)
      console.log('Submitting form data:', formData)
      
      const apiUrl = `http://${window.location.hostname}:4000/api/z-items/items/${itemId}`
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMsg = result.message || result.error || result.err || 'Failed to update item'
        setMessage(`Error: ${errorMsg}`)
        
        if (result.errors) {
          setErrorDetails(JSON.stringify(result.errors, null, 2))
        }
        
        console.error('API Error:', result)
        return
      }
      
      setMessage('Item updated successfully!')
      
      // Navigate back to list after successful update
      setTimeout(() => {
        router.push('/item-form')
      }, 2000)
      
    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Network error or server is not responding')
      setErrorDetails(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading item data...</p>
          <p className="mt-2 text-sm text-gray-500">Item ID: {itemId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Edit Item {formData.itemName && `- ${formData.itemName}`}
          </h2>

          {/* Show message if there was an error */}
          {message && message.includes('Error') && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              <p className="font-medium">{message}</p>
              {errorDetails && (
                <pre className="mt-2 text-xs whitespace-pre-wrap">{errorDetails}</pre>
              )}
              <div className="mt-4">
                <button
                  onClick={() => router.push('/items')}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition-colors"
                >
                  Back to Items
                </button>
              </div>
            </div>
          )}

          {/* Only show the form if there's no error message */}
          {(!message || !message.includes('Error')) && (
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

              {/* Account Dropdowns */}
              <AccountDropdown
                values={{
                  purchaseAccount: formData.purcahseAccount,
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

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/item-form')}
                  className="w-1/2 py-3 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-1/2 py-3 px-4 rounded-md text-white font-medium transition-colors
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {loading ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </form>
          )}
          
          {/* Success Message */}
          {message && !message.includes('Error') && (
            <div className="mt-4 p-3 rounded-md bg-green-100 text-green-700 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ZItemsEdit
