// components/gin/GinList.tsx

'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetAllGinsQuery,
  useDeleteGinMutation,
  useUpdateGinStatusMutation
} from '@/store/slice/ginSlice'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import {ConfirmationModal} from '@/components/common/ConfirmationModal'
import {
  Plus, Edit2, Trash2, Eye, Search, FileText, 
  CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react'

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: Clock },
  close: { label: 'Closed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle }
}

const GinList: React.FC = () => {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: gins = [], isLoading, isError } = useGetAllGinsQuery()
  const [deleteGin, { isLoading: isDeleting }] = useDeleteGinMutation()

  const filteredGins = useMemo(() => {
    return gins.filter(gin => {
      // Search filter
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase()
        const matchesSearch = 
          gin.gin_number?.toLowerCase().includes(search) ||
          gin.item?.itemName?.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter && gin.status !== statusFilter) return false

      return true
    })
  }, [gins, searchTerm, statusFilter])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteGin(deleteId).unwrap()
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading GINs..." />
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Goods Issue Notes</h1>
              <p className="text-blue-100 mt-1">Manage material issue for production</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/gin/create')}
            icon={<Plus className="w-4 h-4" />}
            className="bg-white text-[#509ee3] hover:bg-gray-100"
          >
            Create GIN
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by GIN number or product..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="close">Closed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredGins.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No GINs Found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first GIN to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GIN #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Qty Planned</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Components</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Employees</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGins.map((gin) => {
                const statusConfig = STATUS_CONFIG[gin.status]
                const StatusIcon = statusConfig.icon

                return (
                  <tr key={gin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#509ee3]">{gin.gin_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{gin.item?.itemName || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {gin.qty_planned}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {gin.details?.length || 0} items
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {gin.employees?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/gin/${gin.id}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/gin/edit/${gin.id}`)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(gin.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete GIN"
        message="Are you sure you want to delete this GIN? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={isDeleting}
      />
    </div>
  )
}

export default GinList
