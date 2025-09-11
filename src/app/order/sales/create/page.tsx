// app/order/sales/create/page.tsx
import UnifiedOrderForm from '@/components/UnifiedOrderForm'

export default function Page() {
  return (
    <div>
      <UnifiedOrderForm orderType="sales" />
    </div>
  )
}