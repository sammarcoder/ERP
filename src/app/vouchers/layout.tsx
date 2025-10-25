import { Metadata } from 'next'

export const metadata: Metadata = {
  // title: 'Voucher Management | ERP System',
  // description: 'Manage sales and purchase vouchers',
  title: '',
  description: '',
}

export default function VouchersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Voucher Management</h1>
            <div className="text-sm text-gray-500">
              Create and manage sales & purchase vouchers
            </div>
          </div>
        </div>
      </div> */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
