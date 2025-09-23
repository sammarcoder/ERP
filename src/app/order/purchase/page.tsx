// import OrderList from '@/components/OrderList'
// import React from 'react'

// const page = () => {
//   return (
//     <div>
//         <OrderList />
//     </div>
//   )
// }

// export default page




























// app/order/purchase/page.tsx
import OrderList from '@/components/OrderList'

export default function Page() {
  return (
    <div>
      <OrderList orderType='purchase' />
    </div>
  )
}
