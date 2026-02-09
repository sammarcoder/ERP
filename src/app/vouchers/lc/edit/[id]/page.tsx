import LcVoucherForm from '@/components/vouchers/lc/LcVoucherForm'

export default function EditLcVoucherPage({ params }: { params: { id: string } }) {
  return <LcVoucherForm mode="edit" id={parseInt(params.id)} />
}
