// app/order/purchase/edit/page.tsx
import UnifiedOrderForm from '@/components/UnifiedOrderForm'
// import UnifiedOrderForm from '@/components/order/UnifiedOrderForm'

export default function Page() {
  return (
    <div>
      <UnifiedOrderForm orderType="purchase" />
    </div>
  )
}
