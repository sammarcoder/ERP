'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useGetJournalVoucherByIdQuery } from '@/store/slice/journalVoucherSlice'
import VoucherForm from '@/components/journalVoucher/VoucherForm'
import { Loading } from '@/components/ui/Loading'

export default function EditJournalVoucherPage() {
  const params = useParams()
  const id = params.id as string
  const voucherId = parseInt(id)

  const { 
    data: voucherData, 
    isLoading, 
    error 
  } = useGetJournalVoucherByIdQuery(voucherId)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Loading size="lg" text="Loading Journal Voucher..." />
      </div>
    )
  }

  if (error || !voucherData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Voucher</h3>
          <p className="text-red-600">Failed to load journal voucher with ID: {id}</p>
          <p className="text-sm text-red-500 mt-2">Please check if the voucher exists and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <VoucherForm
      mode="edit"
      voucherType="pettycash"
      initialData={{
        master: voucherData,
        details: voucherData.details || []
      }}
    />
  )
}
