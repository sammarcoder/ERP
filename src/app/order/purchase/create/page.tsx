// app/order/purchase/create/page.tsx
import UnifiedOrderForm from '@/components/UnifiedOrderForm'

export default function Page() {
  return (
    <div>
      <UnifiedOrderForm orderType="purchase" />
    </div>
  )
}
