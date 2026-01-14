'use client'
import { useParams } from 'next/navigation'
import { useGetMouldingByIdQuery } from '@/store/slice/mouldingApi'
import { MouldingForm } from '@/components/moulding/MouldingForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MouldingEditPage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  const { data: moulding, isLoading, error } = useGetMouldingByIdQuery(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading moulding record...</p>
        </div>
      </div>
    )
  }

  if (error || !moulding) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Record Not Found</h2>
          <p className="text-gray-600 mb-6">
            The moulding record you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            href="/moulding"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Moulding List
          </Link>
        </div>
      </div>
    )
  }

  return <MouldingForm mode="edit" initialData={moulding} mouldingId={id} />
}
