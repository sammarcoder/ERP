
// // app/inventory/gdn/create/page.tsx - MAIN GDN PAGE
// 'use client'
// import { Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import ReadyForGDNList from '@/components/inventoryy/gdn/ReadyForGDNList'
// import GDNForm from '@/components/inventoryy/gdn/GDNForm'

// function GDNCreateContent() {
//   const searchParams = useSearchParams()
//   const orderId = searchParams.get('orderId')

//   if (orderId) {
//     return <GDNForm orderId={orderId} />
//   }

//   return <ReadyForGDNList />
// }

// export default function CreateGDNPage() {
//   return (
//     <Suspense fallback={<div className="p-8 text-center">Loading GDN...</div>}>
//       <GDNCreateContent />
//     </Suspense>
//   )
// }







































// app/inventory/gdn/create/page.tsx - FIXED WITH CORRECT PATHS
'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import GDNForm from '@/components/inventoryy/gdn/GDNForm'

function GDNCreateContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    // Redirect back to main page if no orderId
    window.location.href = '/inventoryy/gdn'
    return (
      <div className="p-8 text-center">
        <p>No order selected. Redirecting...</p>
      </div>
    )
  }

  return <GDNForm orderId={orderId} />
}

export default function CreateGDNPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading GDN form...</p>
      </div>
    }>
      <GDNCreateContent />
    </Suspense>
  )
}
