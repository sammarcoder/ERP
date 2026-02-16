// app/mgrn/page.tsx

'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllMgrnsQuery, useDeleteMgrnMutation } from '@/store/slice/mgrnSlice'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import {ConfirmationModal} from '@/components/common/ConfirmationModal'
import {
  Plus, Search, Edit, Trash2, Eye, FileText,
  Package, Calendar, RefreshCw, AlertCircle
} from 'lucide-react'

const toNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function MgrnListPage() {
  const router = useRouter()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // RTK Query
  const { data: mgrns = [], isLoading, refetch, isFetching } = useGetAllMgrnsQuery()
  const [deleteMgrn, { isLoading: isDeleting }] = useDeleteMgrnMutation()

  // Filter MGRNs
  const filteredMgrns = useMemo(() => {
    if (!searchTerm) return mgrns

    const search = searchTerm.toLowerCase()
    return mgrns.filter(mgrn =>
      mgrn.Number?.toLowerCase().includes(search) ||
      mgrn.coa?.acName?.toLowerCase().includes(search) ||
      mgrn.details?.some(d => d.item?.itemName?.toLowerCase().includes(search))
    )
  }, [mgrns, searchTerm])

  // Handlers
  const handleCreate = () => {
    router.push('/mgrn/create')
  }

  const handleEdit = (id: number) => {
    router.push(`/mgrn/edit/${id}`)
  }

  const handleView = (id: number) => {
    router.push(`/mgrn/view/${id}`)
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return

    try {
      await deleteMgrn(deleteId).unwrap()
      setShowDeleteModal(false)
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  // Calculate totals for each MGRN
  const getTotalQty = (details: any[]) => {
    return details?.reduce((sum, d) => sum + toNumber(d.Stock_In_SKU_UOM_Qty || d.uom2_qty), 0) || 0
  }

  const getItemCount = (details: any[]) => {
    return details?.length || 0
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading MGRNs..." />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#28a745] to-[#20c997] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">MGRN List</h1>
              <p className="text-green-100 mt-1">Manufacturing Goods Receipt Notes</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleCreate}
            icon={<Plus className="w-4 h-4" />}
            className="bg-white text-[#28a745] hover:bg-gray-100"
          >
            Create MGRN
          </Button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by MGRN number, account, or product..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              icon={<RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />}
              disabled={isFetching}
            >
              Refresh
            </Button>
            <span className="text-sm text-gray-500">
              {filteredMgrns.length} MGRN(s)
            </span>
          </div>
        </div>
      </div>

      {/* MGRN Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredMgrns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No MGRNs Found</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Try different search terms' : 'Create your first MGRN'}
            </p>
            {!searchTerm && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleCreate}
                icon={<Plus className="w-4 h-4" />}
              >
                Create MGRN
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">MGRN #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Account</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Products</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Total Qty</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMgrns.map((mgrn) => (
                  <tr key={mgrn.ID} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-green-600">{mgrn.Number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(mgrn.Date)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{mgrn.coa?.acName || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {getItemCount(mgrn.details)} item(s)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {getTotalQty(mgrn.details).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mgrn.Status === 'Post'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {mgrn.Status || 'UnPost'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(mgrn.ID)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(mgrn.ID)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(mgrn.ID)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete MGRN"
        message="Are you sure you want to delete this MGRN? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={isDeleting}
      />
    </div>
  )
}
