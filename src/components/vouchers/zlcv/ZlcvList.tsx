// components/zlcv/ZlcvList.tsx

'use client'
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetZlcvListQuery,
  useDeleteZlcvMutation,
  useBulkDeleteZlcvMutation
} from '@/store/slice/zlcvSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowUpDown
} from 'lucide-react'

const ZlcvList: React.FC = () => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterIsDb, setFilterIsDb] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [sortBy, setSortBy] = useState('order')  // ✅ Changed
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: number | null
    type: 'single' | 'bulk'
  }>({
    isOpen: false,
    id: null,
    type: 'single'
  })

  // =============================================
  // RTK QUERY
  // =============================================

  const {
    data: zlcvData,
    isLoading,
    isFetching,
    refetch
  } = useGetZlcvListQuery({
    search,
    isDb: filterIsDb,
    status: filterStatus,
    sortBy,
    sortOrder
  })

  const [deleteZlcv, { isLoading: isDeleting }] = useDeleteZlcvMutation()
  const [bulkDeleteZlcv, { isLoading: isBulkDeleting }] = useBulkDeleteZlcvMutation()

  // =============================================
  // HANDLERS
  // =============================================

  const handleSearch = useCallback(() => {
    setSearch(searchInput)
  }, [searchInput])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortOrder('ASC')
    }
  }, [sortBy])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked && zlcvData?.data) {
      setSelectedIds(zlcvData.data.map(item => item.id))
    } else {
      setSelectedIds([])
    }
  }, [zlcvData?.data])

  const handleSelectRow = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id))
    }
  }, [])

  const handleDeleteClick = useCallback((id: number) => {
    setDeleteModal({ isOpen: true, id, type: 'single' })
  }, [])

  const handleBulkDeleteClick = useCallback(() => {
    setDeleteModal({ isOpen: true, id: null, type: 'bulk' })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (deleteModal.type === 'single' && deleteModal.id) {
        await deleteZlcv(deleteModal.id).unwrap()
      } else if (deleteModal.type === 'bulk' && selectedIds.length > 0) {
        await bulkDeleteZlcv(selectedIds).unwrap()
        setSelectedIds([])
      }
      setDeleteModal({ isOpen: false, id: null, type: 'single' })
    } catch (error) {
      console.error('Delete error:', error)
    }
  }, [deleteModal, deleteZlcv, bulkDeleteZlcv, selectedIds])

  const handleCloseModal = useCallback(() => {
    setDeleteModal({ isOpen: false, id: null, type: 'single' })
  }, [])

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ZLCV Management</h1>
          <p className="text-gray-500 mt-1">Manage your ZLCV records</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/vouchers/lcv/create')}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search by description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                icon={<Search className="w-4 h-4" />}
              />
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={filterIsDb}
              onChange={(e) => setFilterIsDb(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
            >
              <option value="">All Types</option>
              <option value="true">Debit</option>
              <option value="false">Credit</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedIds.length} item(s) selected
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDeleteClick}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-[#509ee3]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === zlcvData?.data?.length && zlcvData?.data?.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('order')}  // ✅ Changed
                  >
                    <div className="flex items-center gap-1">
                      Order
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Account
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center gap-1">
                      Description
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Is Cost
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-24">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {zlcvData?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  zlcvData?.data?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {item.order}  {/* ✅ Changed */}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isDb
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.isDb ? 'Debit' : 'Credit'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.coa
                          ? `${item.coa.acName}`
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.isCost ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => router.push(`/vouchers/lcv/edit/${item.id}`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
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
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={deleteModal.type === 'bulk' ? 'Delete Selected Records' : 'Delete Record'}
        message={
          deleteModal.type === 'bulk'
            ? `Are you sure you want to delete ${selectedIds.length} selected record(s)? This action cannot be undone.`
            : 'Are you sure you want to delete this record? This action cannot be undone.'
        }
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeleting || isBulkDeleting}
      />
    </div>
  )
}

export default ZlcvList
