// app/mgrn/edit/[id]/page.tsx

'use client'
import MgrnForm from '@/components/mgrn/MgrnForm'

export default function EditMgrnPage({ params }: { params: { id: string } }) {
  return <MgrnForm mode="edit" id={parseInt(params.id)} />
}
