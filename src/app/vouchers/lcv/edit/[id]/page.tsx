import ZlcvForm from '@/components/vouchers/zlcv/ZlcvForm'

export default function EditZlcvPage({ params }: { params: { id: string } }) {
  return <ZlcvForm mode="edit" id={parseInt(params.id)} />
}
