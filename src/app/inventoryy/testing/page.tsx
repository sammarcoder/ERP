// app/inventoryy/gdn/create/page.tsx
'use client'
import { useState } from 'react'
// import GDNForm from '@/components/inventoryy/testing/GDNForm'
import GRNForm from '@/components/inventoryy/testing/GRNForm'

export default function CreateGDNPage() {
  const [orderId, setOrderId] = useState('')
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
        <GRNForm orderId={'47'} />
    </div>
  )
}
