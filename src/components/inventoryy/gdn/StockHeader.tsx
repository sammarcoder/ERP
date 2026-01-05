// components/inventory/StockHeader.tsx - COMPLETE WITH SUB CUSTOMER & SUB CITY
'use client'
import React from 'react'
import { Input } from '@/components/ui/Input'
import { TransporterSearchableInput } from '@/components/common/transpoter/TransporterSearchableInput'
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  Package, 
  User, 
  MapPin, 
  Truck, 
  Building2,
  CreditCard,
  MessageSquare,
  BarChart3
} from 'lucide-react'

const StockHeader = ({ 
  headerData, 
  onHeaderChange, 
  mode = 'create',
  sourceOrder = null,
  customers = [],
  isFromOrder = false 
}) => {

  // ✅ Calculate total additional costs
  const totalAdditionalCosts = (
    parseFloat(headerData.labour_crt || 0) + 
    parseFloat(headerData.freight_crt || 0) + 
    parseFloat(headerData.other_expense || 0)
  )

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 p-6 rounded-xl border border-blue-200 shadow-lg">
      {/* ✅ Header Title */}
      <div className="flex items-center gap-3 mb-6">
       
      </div>

      {/* ✅ FIRST ROW - MAIN IDENTIFICATION FIELDS */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <Input
          type="text"
          label="Sales Order"
          value={headerData.Sales_Order_Number || (mode === 'create' ? 'Standalone Dispatch' : 'N/A')}
          readOnly
          icon={<FileText className="w-4 h-4" />}
          className="bg-gray-50"
        />

    

        <Input
          type="text"
          label="Customer *"
          value={headerData.Name_of_Customer || ''}
          readOnly={isFromOrder}
          icon={<User className="w-4 h-4" />}
          className={isFromOrder ? "bg-gray-50" : ""}
          placeholder={isFromOrder ? "Auto-populated" : "Select customer from dropdown"}
        />

        <Input
          type="date"
          label="Dispatch Date *"
          value={headerData.Date}
          onChange={(e) => onHeaderChange('Date', e.target.value)}
          icon={<Calendar className="w-4 h-4" />}
          required
        />
      {/* </div> */}

      {/* ✅ SECOND ROW - SUB CUSTOMER & SUB CITY (MISSING UTILITY FIELDS) */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> */}
        <Input
          type="text"
          label="Sub Customer"
          value={sourceOrder?.sub_customer || headerData.sub_customer || ''}
          onChange={(e) => onHeaderChange('sub_customer', e.target.value)}
          icon={<Building2 className="w-4 h-4" />}
          placeholder="Enter sub customer name..."
          className="bg-white"
        />

        <Input
          type="text"
          label="Sub City"
          value={sourceOrder?.sub_city || headerData.sub_city || ''}
          onChange={(e) => onHeaderChange('sub_city', e.target.value)}
          icon={<MapPin className="w-4 h-4" />}
          placeholder="Enter sub city name..."
          className="bg-white"
        />

       

        {/* ✅ Status with Icon */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChart3 className="w-4 h-4" />
            Status
          </label>
          <select
            value={headerData.Status || 'UnPost'}
            onChange={(e) => onHeaderChange('Status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="UnPost">UnPost</option>
            <option value="Post">Post</option>
          </select>
        </div>
      </div>

      {/* ✅ THIRD ROW - COST BREAKDOWN */}
      <div className="bg-white rounded-lg  p-2 mb-6">
       
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Truck className="w-4 h-4" />
            Transporter
          </label>
          <TransporterSearchableInput
            value={headerData.Transporter_ID?.toString() || ''}
            onChange={(transporterId, transporter) => {
              onHeaderChange('Transporter_ID', transporterId)
              onHeaderChange('Transporter_Name', transporter?.name || '')
            }}
            placeholder="Select transporter..."
            className="w-full"
          />
        </div>
          <Input
            type="number"
            label="Labor Cost"
            value={headerData.labour_crt || ''}
            onChange={(e) => onHeaderChange('labour_crt', e.target.value)}
            placeholder="0.00"
            step="0.01"
            icon={<User className="w-4 h-4" />}
          />

          <Input
            type="number"
            label="Freight Cost"
            value={headerData.freight_crt || ''}
            onChange={(e) => onHeaderChange('freight_crt', e.target.value)}
            placeholder="0.00"
            step="0.01"
            icon={<Truck className="w-4 h-4" />}
          />

          <Input
            type="number"
            label="Other Expense"
            value={headerData.other_expense || ''}
            onChange={(e) => onHeaderChange('other_expense', e.target.value)}
            placeholder="0.00"
            step="0.01"
            icon={<CreditCard className="w-4 h-4" />}
          />
        </div>

        
      </div>

      {/* ✅ FOURTH ROW - REMARKS & DISPATCH TYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      
        <Input
          type="text"
          label="Remarks"
          value={headerData.remarks || ''}
          onChange={(e) => onHeaderChange('remarks', e.target.value)}
          placeholder="Enter dispatch remarks..."
          icon={<MessageSquare className="w-4 h-4" />}
        />
      </div>

      {/* ✅ SOURCE ORDER INFORMATION PANEL (if from order) */}
      {sourceOrder && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-3">
            <FileText className="w-4 h-4" />
            Source Order Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600 mb-1">Order Number</div>
              <div className="font-semibold text-blue-800">{sourceOrder.Number}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600 mb-1">Order Date</div>
              <div className="font-semibold">{new Date(sourceOrder.Date).toLocaleDateString()}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600 mb-1">Items Count</div>
              <div className="font-semibold text-green-600">{sourceOrder.details?.length || 0}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600 mb-1">Customer</div>
              <div className="font-semibold text-xs truncate">{sourceOrder.account?.acName || 'N/A'}</div>
            </div>
          </div>
          
          {/* Additional Order Details */}
          {(sourceOrder.sub_customer || sourceOrder.sub_city) && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {sourceOrder.sub_customer && (
                  <div className="bg-white p-2 rounded border">
                    <div className="text-xs text-gray-600">Sub Customer</div>
                    <div className="font-medium">{sourceOrder.sub_customer}</div>
                  </div>
                )}
                {sourceOrder.sub_city && (
                  <div className="bg-white p-2 rounded border">
                    <div className="text-xs text-gray-600">Sub City</div>
                    <div className="font-medium">{sourceOrder.sub_city}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StockHeader
