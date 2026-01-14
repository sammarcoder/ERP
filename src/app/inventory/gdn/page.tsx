// app/inventoryy/gdn/page.tsx - COMPLETE

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Search, Trash2, Edit, Eye, Loader2,
  RefreshCw, AlertCircle, CheckCircle, Clock, Truck, Printer
} from 'lucide-react'
import { useGetAllGDNsQuery, useDeleteGDNMutation } from '@/store/test/gdnApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { Pagination } from '@/components/common/Pagination'
import DispatchPrintModal from '@/components/DispatchPrintModal'

import formattedDate from '@/components/ui/date'


export default function GDNListPage() {
  const router = useRouter()

  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [deleteModal, setDeleteModal] = useState({ open: false, gdn: null as any })
  const [printModal, setPrintModal] = useState({ open: false, gdn: null as any })

  const { data, isLoading, error, refetch } = useGetAllGDNsQuery({
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo
  })

  const [deleteGDN, { isLoading: isDeleting }] = useDeleteGDNMutation()

  const gdns = data?.data || []

  const handleDelete = async () => {
    if (!deleteModal.gdn) return

    try {
      await deleteGDN(deleteModal.gdn.ID).unwrap()
      setDeleteModal({ open: false, gdn: null })
      refetch()
    } catch (err: any) {
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  const filteredGDNs = gdns.filter((gdn: any) => {
    if (!filters.search) return true
    const search = filters.search.toLowerCase()
    return (
      gdn.Number?.toLowerCase().includes(search) ||
      gdn.account?.acName?.toLowerCase().includes(search) ||
      gdn.order?.Number?.toLowerCase().includes(search)
    )
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredGDNs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGDNs = filteredGDNs.slice(startIndex, endIndex)
  const unpostCount = filteredGDNs.filter((g: any) => g.Status === 'UnPost').length

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-GB')
  }

  const calculateTotal = (details: any[]) => {
    if (!details) return 0
    return details.reduce((sum, d) => {
      const qty = parseFloat(d.Stock_out_UOM_Qty || d.uom1_qty) || 0
      const price = parseFloat(d.Stock_Price) || 0
      return sum + (qty * price)
    }, 0)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-7 h-7 text-emerald-600" />
            Goods Dispatch Notes (GDN)
          </h1>
          <p className="text-gray-500 mt-1">{filteredGDNs.length} dispatch records</p>
        </div>
        <Button
          variant="success"
          onClick={() => router.push('/inventory/gdn/select-order')}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New GDN
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by GDN#, Customer, Order#..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="Post">Posted</option>
              <option value="UnPost">UnPost</option>
            </select>
          </div>
          <Input
            type="date"
            label="From"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange({ ...filters, dateFrom: e.target.value })}
          />
          <Input
            type="date"
            label="To"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange({ ...filters, dateTo: e.target.value })}
          />
          <Button
            variant="secondary"
            onClick={() => refetch()}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          Error loading GDNs
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">GDN #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Customer</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-emerald-800">Sub Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Items</th>
                  {/* <th className="px-4 py-3 text-right text-sm font-semibold text-emerald-800">Total</th> */}
                  <th className="px-4 py-3 text-center text-sm font-semibold text-emerald-800">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-emerald-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGDNs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Truck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No GDNs found</p>
                      <p className="text-gray-400 text-sm">Create a new GDN to get started</p>
                    </td>
                  </tr>
                ) : (
                  paginatedGDNs.map((gdn: any, index: number) => (
                    <tr key={gdn.ID} className={`hover:bg-emerald-50/30 transition-colors ${index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}`}>
                      {/* GDN Number */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600">{gdn.Number}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formattedDate(formatDate(gdn.Date))}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{gdn.account?.acName || '-'}</div>
                        {/* <div className="text-xs text-gray-500">{gdn.account?.city || 'No City'}</div> */}
                      </td>
                      <td className="px-4 py-3 w-32">
                        <span className="text-teal-600 font-medium">{gdn.order?.sub_customer || '-'}</span>
                      </td>

                      {/* Order Number */}
                      <td className="px-4 py-3 text-sm">
                        <span className="text-teal-600 font-medium">{gdn.order?.Number || '-'}</span>
                      </td>

                      {/* Items Count */}
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          {gdn.details?.length || 0} items
                        </span>
                      </td>

                      {/* Total */}
                      {/* <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-gray-900">
                          {calculateTotal(gdn.details).toLocaleString()}
                        </span>
                      </td> */}

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${gdn.Status === 'Post'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                          }`}>
                          {gdn.Status === 'Post' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {gdn.Status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => router.push(`/inventory/gdn/${gdn.ID}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View GDN"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => router.push(`/inventory/gdn/${gdn.ID}/edit`)}
                            disabled={gdn.Status === 'Post'}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={gdn.Status === 'Post' ? 'Cannot edit Posted GDN' : 'Edit GDN'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Print */}
                          <button
                            onClick={() => setPrintModal({ open: true, gdn })}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Print GDN"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteModal({ open: true, gdn })}
                            disabled={gdn.Status === 'Post'}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={gdn.Status === 'Post' ? 'Cannot delete Posted GDN' : 'Delete GDN'}
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

          {/* Pagination */}
          {filteredGDNs.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="px-4 py-2 bg-gray-50 flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  Total: <span className="font-medium">{filteredGDNs.length}</span> dispatch notes
                </span>
                <span className="font-semibold text-gray-700">
                  UnPost: <span className="text-amber-600">{unpostCount}</span>
                </span>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredGDNs.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, gdn: null })}
        onConfirm={handleDelete}
        title="Delete GDN"
        message={`Are you sure you want to delete ${deleteModal.gdn?.Number}? This will restore the stock back to inventory.`}
        confirmText="Delete GDN"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />

      {/* Print Modal */}
      {printModal.open && printModal.gdn && (
        <DispatchPrintModal
          dispatch={printModal.gdn}
          onClose={() => setPrintModal({ open: false, gdn: null })}
        />
      )}
    </div>
  )
}
