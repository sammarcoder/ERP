// app/inventoryy/gdn/[id]/edit/page.tsx

'use client'
import { useParams } from 'next/navigation'
import GDNEditForm from '@/components/inventory/gdn/GDNEditForm'

export default function GDNEditPage() {
  const params = useParams()
  const gdnId = params.id as string

  return <GDNEditForm gdnId={gdnId} />
}
