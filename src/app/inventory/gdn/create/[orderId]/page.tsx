// app/inventoryy/gdn/create/[orderId]/page.tsx

'use client'
import { useParams } from 'next/navigation'
import GDNForm from '@/components/inventory/gdn/GDNForm'

export default function CreateGDNPage() {
  const params = useParams()
  const orderId = params.orderId as string

  return <GDNForm orderId={orderId} />
}
