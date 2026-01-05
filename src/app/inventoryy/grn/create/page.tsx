// // // app/grn/create/page.tsx - CREATE GRN PAGE WITH READY ORDERS
// // 'use client'
// // import { Suspense } from 'react'
// // import ReadyForGRNList from '@/components/inventoryy/grn/ReadyForGRNList'

// // export default function CreateGRNPage() {
// //   return (
// //     <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
// //       <ReadyForGRNList />
// //     </Suspense>
// //   )
// // }


















// // // app/grn/create/page.tsx - FIXED ROUTING
// // 'use client'
// // import { Suspense } from 'react'
// // import { useSearchParams } from 'next/navigation'
// // import ReadyForGRNList from '@/components/inventoryy/grn/ReadyForGRNList'
// // import GRNForm from '@/components/inventoryy/grn/GRNForm'

// // function GRNCreateContent() {
// //   const searchParams = useSearchParams()
// //   const orderId = searchParams.get('orderId')

// //   console.log('🔍 GRN Create - OrderId from URL:', orderId)

// //   // ✅ If orderId exists, show GRN Form
// //   if (orderId) {
// //     return <GRNForm />
// //   }

// //   // ✅ Otherwise, show list of orders ready for GRN
// //   return <ReadyForGRNList />
// // }

// // export default function CreateGRNPage() {
// //   return (
// //     <Suspense fallback={
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
// //           <p className="text-lg font-medium">Loading GRN...</p>
// //         </div>
// //       </div>
// //     }>
// //       <GRNCreateContent />
// //     </Suspense>
// //   )
// // }



































// // // app/grn/create/page.tsx - COMPLETE WITH ORDERID HANDLING
// // 'use client'
// // import { Suspense } from 'react'
// // import { useSearchParams } from 'next/navigation'
// // import ReadyForGRNList from '@/components/inventoryy/grn/ReadyForGRNList'
// // import GRNForm from '@/components/inventoryy/grn/GRNForm'

// // function GRNCreateContent() {
// //   const searchParams = useSearchParams()
// //   const orderId = searchParams.get('orderId')

// //   console.log('🔍 GRN Create Page - OrderId from URL:', orderId)
// //   console.log('🔍 Full URL Search Params:', searchParams.toString())

// //   // ✅ If orderId exists, show GRN Form for that specific order
// //   if (orderId) {
// //     console.log('📋 Showing GRN Form for Order ID:', orderId)
// //     return (
// //       <div>
// //         {/* Debug info - remove in production */}
// //         <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4">
// //           <p className="text-xs text-blue-600">
// //             🔍 Debug: Creating GRN for Order ID: {orderId}
// //           </p>
// //         </div>
// //         <GRNForm />
// //       </div>
// //     )
// //   }

// //   // ✅ No orderId, show list of orders ready for GRN
// //   console.log('📋 Showing Ready for GRN List')
// //   return (
// //     <div>
// //       {/* Debug info - remove in production */}
// //       <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
// //         <p className="text-xs text-green-600">
// //           🔍 Debug: Showing orders ready for GRN generation
// //         </p>
// //       </div>
// //       <ReadyForGRNList />
// //     </div>
// //   )
// // }

// // export default function CreateGRNPage() {
// //   return (
// //     <Suspense fallback={
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
// //           <p className="text-lg font-medium">Loading GRN...</p>
// //         </div>
// //       </div>
// //     }>
// //       <GRNCreateContent />
// //     </Suspense>
// //   )
// // }









































// // app/inventory/grn/create/page.tsx - GRN FORM PAGE
// 'use client'
// import { Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import GRNForm from '@/components/inventoryy/grn/GRNForm'
// import ReadyForGRNList from '@/components/inventoryy/grn/ReadyForGRNList'

// function GRNCreateContent() {
//   const searchParams = useSearchParams()
//   const orderId = searchParams.get('orderId')

//   if (orderId) {
//     return <GRNForm orderId={orderId} />
//   }

//   return <ReadyForGRNList />
// }

// export default function CreateGRNPage() {
//   return (
//     <Suspense fallback={<div className="p-8 text-center">Loading GRN...</div>}>
//       <GRNCreateContent />
//     </Suspense>
//   )
// }





'use client'
import React, { useState } from 'react'
// let count = 2
const page = () => {
  const [count, setCount] = useState(1);
  const increment = () => {
  setCount(count+1)
}
  return (
    <>
    <select >
      <option value={1}>1</option>
    </select>
      <div>this is pratice page</div>
      <p>{count}</p>
      <button onClick={increment}>click</button>
    </>
  )
}

export default page



