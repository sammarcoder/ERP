'use client'
import { useParams } from 'next/navigation'
import GRNEditForm from '@/components/inventoryy/grn/GRNEditForm'

export default function GRNEditPage() {
  const params = useParams()
  const grnId = params.id as string

  return <GRNEditForm grnId={grnId} />
}
