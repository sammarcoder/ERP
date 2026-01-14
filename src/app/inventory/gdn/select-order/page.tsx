// // app/inventoryy/gdn/select-order/page.tsx

// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Search, Loader2, Truck, ShoppingCart, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
// import { useGetAllOrdersQuery } from '@/store/slice/orderApi'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'

// export default function SelectOrderForGDN() {
//   const router = useRouter()
//   const [search, setSearch] = useState('')

//   // Fetch Sales Orders (Stock_Type_ID = 12)
//   const { data, isLoading } = useGetAllOrdersQuery({
//     stockTypeId: 12,  // Sales Orders
//     // limit: 100
//   })

//   const orders = data?.data || []

//   // Filter orders that are approved and don't have GDN yet
//   const filteredOrders = orders.filter((order: any) => {
//     const matchesSearch = !search || 
//       order.Number?.toLowerCase().includes(search.toLowerCase()) ||
//       order.account?.acName?.toLowerCase().includes(search.toLowerCase())
    
//     return matchesSearch
//   })

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return '-'
//     return new Date(dateStr).toLocaleDateString('en-GB')
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//           <Truck className="w-7 h-7 text-emerald-600" />
//           Create GDN - Select Sales Order
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Select a sales order to create a Goods Dispatch Note
//         </p>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <Input
//           label="Search Orders"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by order number or customer name..."
//           icon={<Search className="w-4 h-4" />}
//         />
//       </div>

//       {/* Loading */}
//       {isLoading && (
//         <div className="flex justify-center py-12">
//           <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
//         </div>
//       )}

//       {/* Orders List */}
//       {!isLoading && (
//         <div className="space-y-3">
//           {filteredOrders.length === 0 ? (
//             <div className="text-center py-12 bg-gray-50 rounded-xl">
//               <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-gray-500">No sales orders found</p>
//             </div>
//           ) : (
//             filteredOrders.map((order: any) => {
//               const isApproved = order.approved === true || order.approved === 1
//               const hasGDN = order.is_Note_generated === true || order.is_Note_generated === 1
//               const canCreateGDN = isApproved && !hasGDN

//               return (
//                 <div
//                   key={order.ID}
//                   className={`bg-white border rounded-xl p-4 transition-all ${
//                     canCreateGDN 
//                       ? 'border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer' 
//                       : 'border-gray-200 opacity-60'
//                   }`}
//                   onClick={() => canCreateGDN && router.push(`/inventory/gdn/create/${order.ID}`)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className={`p-3 rounded-xl ${canCreateGDN ? 'bg-emerald-100' : 'bg-gray-100'}`}>
//                         <ShoppingCart className={`w-6 h-6 ${canCreateGDN ? 'text-emerald-600' : 'text-gray-400'}`} />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <span className="font-semibold text-lg text-gray-900">{order.Number}</span>
//                           {isApproved ? (
//                             <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
//                               <CheckCircle className="w-3 h-3" /> Approved
//                             </span>
//                           ) : (
//                             <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
//                               <XCircle className="w-3 h-3" /> Not Approved
//                             </span>
//                           )}
//                           {hasGDN && (
//                             <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
//                               GDN Created
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
//                           <span>{formatDate(order.Date)}</span>
//                           <span>•</span>
//                           <span className="font-medium text-gray-700">{order.account?.acName || 'N/A'}</span>
//                           <span>•</span>
//                           <span>{order.details?.length || 0} items</span>
//                         </div>
//                       </div>
//                     </div>

//                     {canCreateGDN && (
//                       <Button
//                         variant="success"
//                         size="sm"
//                         icon={<ArrowRight className="w-4 h-4" />}
//                       >
//                         Create GDN
//                       </Button>
//                     )}

//                     {!canCreateGDN && (
//                       <span className="text-sm text-gray-400">
//                         {!isApproved ? 'Needs Approval' : 'GDN Exists'}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )
//             })
//           )}
//         </div>
//       )}
//     </div>
//   )
// }



















































// app/inventoryy/gdn/select-order/page.tsx

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Truck, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react'
import { useGetAllOrdersQuery } from '@/store/slice/orderApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SelectOrderForGDN() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  // Fetch Sales Orders (Stock_Type_ID = 12)
  const { data, isLoading } = useGetAllOrdersQuery({
    stockTypeId: 12,
  })

  const orders = data?.data || []

  // ✅ Only show approved orders without GDN
  const filteredOrders = orders.filter((order: any) => {
    const isApproved = order.approved === true || order.approved === 1
    const hasGDN = order.is_Note_generated === true || order.is_Note_generated === 1
    const canCreateGDN = isApproved && !hasGDN

    const matchesSearch = !search || 
      order.Number?.toLowerCase().includes(search.toLowerCase()) ||
      order.account?.acName?.toLowerCase().includes(search.toLowerCase())
    
    return canCreateGDN && matchesSearch
  })

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-GB')
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Truck className="w-7 h-7 text-emerald-600" />
          Create GDN - Select Sales Order
        </h1>
        <p className="text-gray-500 mt-2">
          Select a sales order to create a Goods Dispatch Note
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          label="Search Orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number or customer name..."
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Orders List */}
      {!isLoading && (
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No eligible sales orders found</p>
              <p className="text-sm text-gray-400 mt-1">Orders must be approved and without existing GDN</p>
            </div>
          ) : (
            filteredOrders.map((order: any) => (
              <div
                key={order.ID}
                className="bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer rounded-xl p-4 transition-all"
                onClick={() => router.push(`/inventory/gdn/create/${order.ID}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100">
                      <ShoppingCart className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-900">{order.Number}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{formatDate(order.Date)}</span>
                        <span>•</span>
                        <span className="font-medium text-gray-700">{order.account?.acName || 'N/A'}</span>
                        <span>•</span>
                        <span>{order.details?.length || 0} items</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="success"
                    size="sm"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create GDN
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

