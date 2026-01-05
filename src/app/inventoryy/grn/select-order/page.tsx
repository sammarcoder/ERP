// app/inventoryy/grn/select-order/page.tsx

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Package, ShoppingBag, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { useGetAllOrdersQuery } from '@/store/slice/orderApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SelectOrderForGRN() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  // ✅ Fetch Purchase Orders (Stock_Type_ID = 11)
  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    stockTypeId: 11,  // ✅ Purchase Orders
    limit: 100
  })

  const orders = data?.data || []

  // Filter orders by search
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = !search || 
      order.Number?.toLowerCase().includes(search.toLowerCase()) ||
      order.account?.acName?.toLowerCase().includes(search.toLowerCase())
    
    return matchesSearch
  })

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-GB')
  }

  // Calculate order total
  const calculateOrderTotal = (details: any[]) => {
    if (!details || details.length === 0) return 0
    return details.reduce((sum, d) => {
      const qty = parseFloat(d.uom1_qty) || 0
      const price = parseFloat(d.Stock_Price) || 0
      return sum + (qty * price)
    }, 0)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="w-7 h-7 text-[#4c96dc]" />
          Create GRN - Select Purchase Order
        </h1>
        <p className="text-gray-500 mt-2">
          Select a purchase order to create a Goods Received Note
        </p>
      </div>

      {/* Search & Refresh */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            label="Search Orders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or supplier name..."
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-end">
          <Button variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <span className="text-xs text-blue-600">Total Orders</span>
          <p className="text-xl font-bold text-blue-700">{orders.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <span className="text-xs text-green-600">Approved</span>
          <p className="text-xl font-bold text-green-700">
            {orders.filter((o: any) => o.approved === true || o.approved === 1).length}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <span className="text-xs text-amber-600">Pending GRN</span>
          <p className="text-xl font-bold text-amber-700">
            {orders.filter((o: any) => 
              (o.approved === true || o.approved === 1) && 
              !(o.is_Note_generated === true || o.is_Note_generated === 1)
            ).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <span className="text-xs text-purple-600">GRN Created</span>
          <p className="text-xl font-bold text-purple-700">
            {orders.filter((o: any) => o.is_Note_generated === true || o.is_Note_generated === 1).length}
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4c96dc]" />
        </div>
      )}

      {/* Orders List */}
      {!isLoading && (
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No purchase orders found</p>
              <p className="text-gray-400 text-sm mt-1">Create a purchase order first</p>
            </div>
          ) : (
            filteredOrders.map((order: any) => {
              const isApproved = order.approved === true || order.approved === 1
              const hasGRN = order.is_Note_generated === true || order.is_Note_generated === 1
              const canCreateGRN = isApproved && !hasGRN
              const orderTotal = calculateOrderTotal(order.details)

              return (
                <div
                  key={order.ID}
                  className={`bg-white border rounded-xl p-4 transition-all ${
                    canCreateGRN 
                      ? 'border-[#4c96dc]/30 hover:border-[#4c96dc] hover:shadow-md cursor-pointer' 
                      : 'border-gray-200 opacity-60'
                  }`}
                  onClick={() => canCreateGRN && router.push(`/inventoryy/grn/create/${order.ID}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${canCreateGRN ? 'bg-[#4c96dc]/10' : 'bg-gray-100'}`}>
                        <ShoppingBag className={`w-6 h-6 ${canCreateGRN ? 'text-[#4c96dc]' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-lg text-gray-900">{order.Number}</span>
                          
                          {/* Approval Status */}
                          {isApproved ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                              <XCircle className="w-3 h-3" /> Not Approved
                            </span>
                          )}
                          
                          {/* GRN Status */}
                          {hasGRN && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                              GRN Created
                            </span>
                          )}

                          {/* Order Status */}
                          {order.Next_Status && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              order.Next_Status === 'Complete' 
                                ? 'bg-green-100 text-green-700'
                                : order.Next_Status === 'Partial'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.Next_Status}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{formatDate(order.Date)}</span>
                          <span>•</span>
                          <span className="font-medium text-gray-700">{order.account?.acName || 'N/A'}</span>
                          <span>•</span>
                          <span>{order.details?.length || 0} items</span>
                          {orderTotal > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-[#4c96dc]">
                                {orderTotal.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-3">
                      {canCreateGRN ? (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ArrowRight className="w-4 h-4" />}
                        >
                          Create GRN
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-400 px-3">
                          {!isApproved ? 'Needs Approval' : 'GRN Exists'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="font-semibold text-blue-800 mb-2">💡 How to create a GRN:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Create a Purchase Order (PO) first</li>
          <li>Approve the Purchase Order</li>
          <li>Click "Create GRN" on an approved order</li>
          <li>Enter received quantities and select batch</li>
          <li>Save the GRN to update stock</li>
        </ol>
      </div>
    </div>
  )
}
