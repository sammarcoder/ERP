// app/lc-main/edit/[id]/page.tsx
import LcMainForm from '@/components/lcMain/LcMainForm'

export default function EditLcMainPage({ params }: { params: { id: string } }) {
  return <LcMainForm mode="edit" id={parseInt(params.id)} />
}
