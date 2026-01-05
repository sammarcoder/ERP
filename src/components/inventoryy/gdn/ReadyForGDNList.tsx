// // components/dispatch/ReadyForGDNList.tsx - ORDERS READY FOR GDN
'use client'
import React, { useState } from 'react'
import { useGetAllOrdersQuery } from '@/store/slice/orderApi'
import { Button } from '@/components/ui/Button'
import { ChevronDown, ChevronUp, Eye, Package, ArrowRight, Truck } from 'lucide-react'
import Link from 'next/link'

export default function ReadyForGDNList() {
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())

  // ✅ Fetch Sales Orders ready for GDN
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch
  } = useGetAllOrdersQuery({
    stockTypeId: '12', // ✅ Sales orders
    limit: 50
  })

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  // ✅ Filter orders ready for GDN: approved = true AND is_Note_generated = false
  const readyForGDNOrders = (ordersResponse?.data || []).filter((order: any) => 
    order.approved === true && 
    order.is_Note_generated === false && 
    order.Next_Status === 'Incomplete'
  )

  // ✅ UOM Logic Helper
  const getOrderLineDisplay = (detail: any) => {
    const saleUnit = parseInt(detail.sale_unit)
    let quantity = 0
    let uomName = 'Unknown'

    if (saleUnit === 1 && detail.uom1_qty) {
      quantity = parseFloat(detail.uom1_qty)
      uomName = detail.item?.uom1?.uom || 'Pcs'
    } else if (saleUnit === 2 && detail.uom2_qty) {
      quantity = parseFloat(detail.uom2_qty)
      uomName = detail.item?.uomTwo?.uom || 'Box'
    } else if (saleUnit === 3 && detail.uom3_qty) {
      quantity = parseFloat(detail.uom3_qty)
      uomName = detail.item?.uomThree?.uom || 'Crt'
    }

    return { quantity, uomName }
  }

  if (isLoading) return <div className="p-8 text-center">Loading sales orders...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error loading orders</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ready for GDN Generation</h1>
          <p className="text-gray-600 text-sm">
            Showing {readyForGDNOrders.length} approved sales orders awaiting dispatch
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Refresh Orders
          </Button>
          
          <Link href="/orders/sales">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              View All Sales Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* ✅ Ready Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {readyForGDNOrders.map((order: any) => (
          <div key={order.ID} className="border-b last:border-b-0">
            {/* Main Order Row */}
            <div className="flex items-center px-4 py-4 hover:bg-blue-50 transition-colors">
              {/* Order Number */}
              <div className="w-48">
                <Link 
                  href={`/orders/sales/${order.ID}`} 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {order.Number}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(order.Date).toLocaleDateString('en-GB')}
                </div>
              </div>

              {/* Approval Status */}
              <div className="w-32">
                <span className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded font-medium">
                  ✓ Approved
                </span>
              </div>

              {/* Customer Name */}
              <div className="flex-1 text-sm text-gray-900 font-medium">
                <div className="flex items-center gap-2">
                  <span>{order.account?.acName || 'Unknown Customer'}</span>
                  <span className="text-xs text-gray-500">• Customer</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {order.details?.length || 0} items to dispatch
                </div>
              </div>

              {/* Order Value Estimate */}
              {/* <div className="w-32 text-sm text-center">
                <div className="text-xs text-gray-500">Est. Value</div>
                <div className="font-medium text-blue-600">
                  Rs {((order.details?.length || 0) * 1500).toLocaleString()}
                </div>
              </div> */}

              {/* ✅ GDN Generation Button */}
              <div className="w-48 flex items-center justify-end gap-2">
                <Link href={`/inventoryy/gdn/create?orderId=${order.ID}`}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium flex items-center gap-2 shadow-sm">
                    <Truck className="w-4 h-4" />
                    GDN
                    {/* <ArrowRight className="w-3 h-3" /> */}
                  </Button>
                </Link>

                {/* Quick Actions */}
                <Link href={`/orders/sales/${order.ID}`}>
                  <button className="p-2 text-gray-400 hover:text-blue-600" title="View Order">
                    <Eye className="w-4 h-4" />
                  </button>
                </Link>
                
                <button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Show Items"
                  onClick={() => toggleOrderExpansion(order.ID)}
                >
                  {expandedOrders.has(order.ID) ?
                    <ChevronUp className="w-4 h-4" /> :
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* ✅ Expandable Order Items Preview */}
            {expandedOrders.has(order.ID) && (
              <div className="bg-orange-50 px-4 py-3 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Items to Dispatch:</h4>
                  <Link href={`/inventory/gdn/create?orderId=${order.ID}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded">
                      Proceed to GDN →
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.details?.slice(0, 4).map((detail: any) => {
                    const { quantity, uomName } = getOrderLineDisplay(detail)
                    const unitPrice = parseFloat(detail.item?.sellingPrice || 0)

                    return (
                      <div key={detail.ID} className="bg-white rounded border p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                            #{detail.Line_Id}
                          </span>
                          <div>
                            <div className="font-medium text-sm text-gray-800">
                              {detail.item?.itemName || 'Unknown Item'}
                            </div>
                            <div className="text-xs text-gray-500">
                              Ordered: {quantity} {uomName}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500">Unit Price</div>
                          <div className="font-medium text-sm">Rs {unitPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {(order.details?.length || 0) > 4 && (
                    <div className="bg-white rounded border p-3 flex items-center justify-center text-gray-500">
                      <span className="text-sm">
                        +{(order.details?.length || 0) - 4} more items...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {readyForGDNOrders.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No Orders Ready for GDN</p>
            <p className="text-sm mb-4">
              All approved sales orders either have GDN generated or are not yet approved.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/orders/sales/create">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  Create Sales Order
                </Button>
              </Link>
              <Link href="/orders/sales">
                <Button variant="ghost" className="border border-gray-300">
                  View All Sales Orders
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Quick Stats */}
      {/* {readyForGDNOrders.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg text-orange-600">{readyForGDNOrders.length}</div>
                <div className="text-gray-600">Orders Ready</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-blue-600">
                  {readyForGDNOrders.reduce((sum, order) => sum + (order.details?.length || 0), 0)}
                </div>
                <div className="text-gray-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-green-600">
                  Rs {(readyForGDNOrders.length * 35000).toLocaleString()}
                </div>
                <div className="text-gray-600">Est. Total Value</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">Next Step:</span> Generate GDN to dispatch goods
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
