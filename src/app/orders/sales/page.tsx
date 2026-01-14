

// app/orders/purchase/page.tsx
import OrdersListComponent from '@/components/orders/OrdersListComponent'

export default function PurchaseOrdersPage() {
  return (
    <OrdersListComponent 
      orderType="sales" 
      stockTypeId="12" 
    />
  )
}
