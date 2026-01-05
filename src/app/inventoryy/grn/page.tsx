// app/inventoryy/grn/page.tsx

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, Search, Trash2, Edit, Eye, Loader2, 
  Calendar, Filter, RefreshCw, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import { useGetAllGRNsQuery, useDeleteGRNMutation } from '@/store/slice/grnApi'

export default function GRNListPage() {
  const router = useRouter()
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  // Fetch GRNs
  const { data, isLoading, error, refetch } = useGetAllGRNsQuery({
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo
  })

  const [deleteGRN, { isLoading: isDeleting }] = useDeleteGRNMutation()

  const grns = data?.data || []

  // Handle Delete
  const handleDelete = async (grn: any) => {
    if (grn.Status === 'Post') {
      alert('Cannot delete a Posted GRN. Please UnPost first.')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete GRN ${grn.Number}?\n\n` +
      `This will also reset the order status to "Incomplete".`
    )

    if (!confirmed) return

    try {
      await deleteGRN(grn.ID).unwrap()
      alert('✅ GRN deleted successfully')
      refetch()
    } catch (err: any) {
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  // Filter GRNs by search
  const filteredGRNs = grns.filter((grn: any) => {
    if (!filters.search) return true
    const search = filters.search.toLowerCase()
    return (
      grn.Number?.toLowerCase().includes(search) ||
      grn.account?.acName?.toLowerCase().includes(search) ||
      grn.order?.Number?.toLowerCase().includes(search)
    )
  })

  // Status Badge
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'Post') {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" /> Posted
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
        <Clock className="w-3 h-3" /> UnPost
      </span>
    )
  }

  // Order Status Badge
  const OrderStatusBadge = ({ status }: { status: string }) => {
    const colors: any = {
      Complete: 'bg-green-100 text-green-800',
      Partial: 'bg-yellow-100 text-yellow-800',
      Incomplete: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status] || colors.Incomplete}`}>
        {status}
      </span>
    )
  }

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-GB')
  }

  // Calculate total
  const calculateTotal = (details: any[]) => {
    if (!details) return 0
    return details.reduce((sum, d) => {
      const qty = parseFloat(d.uom1_qty) || 0
      const price = parseFloat(d.Stock_Price) || 0
      return sum + (qty * price)
    }, 0)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">📥 Goods Received Notes (GRN)</h1>
          <p className="text-gray-500">{filteredGRNs.length} records found</p>
        </div>
        <button
          onClick={() => router.push('/inventoryy/grn/select-order')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Create New GRN
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-500">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by GRN#, Supplier, Order#..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-1 block border rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="Post">Posted</option>
              <option value="UnPost">UnPost</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-sm text-gray-500">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="mt-1 block border rounded-lg px-3 py-2"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-sm text-gray-500">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="mt-1 block border rounded-lg px-3 py-2"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          Error loading GRNs
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">GRN #</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Supplier</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Order Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredGRNs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No GRNs found
                    </td>
                  </tr>
                ) : (
                  filteredGRNs.map((grn: any) => (
                    <tr key={grn.ID} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-blue-600">{grn.Number}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(grn.Date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{grn.account?.acName || '-'}</div>
                        <div className="text-xs text-gray-500">{grn.account?.city || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {grn.order?.Number || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {grn.details?.length || 0} items
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {calculateTotal(grn.details).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={grn.Status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <OrderStatusBadge status={grn.order?.Next_Status || '-'} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => router.push(`/inventoryy/grn/${grn.ID}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Edit - Only if UnPost */}
                          <button
                            onClick={() => router.push(`/inventoryy/grn/${grn.ID}/edit`)}
                            disabled={grn.Status === 'Post'}
                            className="p-2 text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title={grn.Status === 'Post' ? 'Cannot edit Posted GRN' : 'Edit'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {/* Delete - Only if UnPost */}
                          <button
                            onClick={() => handleDelete(grn)}
                            disabled={grn.Status === 'Post' || isDeleting}
                            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title={grn.Status === 'Post' ? 'Cannot delete Posted GRN' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
