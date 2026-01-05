// app/inventoryy/grn/create/[orderId]/page.tsx

'use client'
import { useParams } from 'next/navigation'
import GRNForm from '@/components/inventoryy/testing/GRNForm'

export default function CreateGRNPage() {
  const params = useParams()
  const orderId = params.orderId as string

  return <GRNForm orderId={orderId} />
}
