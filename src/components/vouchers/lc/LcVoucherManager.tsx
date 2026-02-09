// components/lc-voucher/LcVoucherManager.tsx

'use client'
import React, { useState, useMemo } from 'react'
import {
  useGetLcVouchersQuery,
  useDeleteLcVoucherMutation,
  usePostUnpostLcVoucherMutation
} from '@/store/slice/lcVoucherSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { useRouter } from 'next/navigation'
import { formatDisplayDate, formatAmount } from '@/utils/formatters'
import {
  Search,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Receipt,
  Star,
  User,
  Building,
  Calendar,
  Landmark,
  DollarSign
} from 'lucide-react'

export const LcVoucherManager: React.FC = () => {
  const router = useRouter()
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'draft'>('all')

  // ✅ Get LC Vouchers (voucherTypeId = 13)
  const { data: lcVouchers = [], isLoading, refetch } = useGetLcVouchersQuery()

  const [deleteVoucher, { isLoading: isDeleting }] = useDeleteLcVoucherMutation()
  const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostLcVoucherMutation()

  // ✅ Filter vouchers
  const filteredVouchers = useMemo(() => {
    let filtered = [...lcVouchers]

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())

    if (statusFilter !== 'all') {
      filtered = filtered.filter(voucher => {
        if (statusFilter === 'posted') return voucher.status === 1 || voucher.status === true
        if (statusFilter === 'draft') return voucher.status === 0 || voucher.status === false
        return true
      })
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(voucher =>
        voucher.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.id?.toString().includes(searchTerm)
      )
    }

    return filtered
  }, [lcVouchers, searchTerm, statusFilter])

  // ✅ Toggle row expansion
  const toggleRowExpansion = (voucherId: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(voucherId)) {
      newExpanded.delete(voucherId)
    } else {
      newExpanded.add(voucherId)
    }
    setExpandedRows(newExpanded)
  }

  // ✅ Status counts
  const getStatusCounts = () => {
    const total = lcVouchers.length
    const posted = lcVouchers.filter(v => v.status === 1 || v.status === true).length
    const draft = lcVouchers.filter(v => v.status === 0 || v.status === false).length
    return { total, posted, draft }
  }

  // ✅ Calculate voucher totals
  const calculateVoucherTotals = (details: any[]) => {
    if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }
    const debit = details.reduce((sum, detail) => sum + (detail.amountDb || 0), 0)
    const credit = details.reduce((sum, detail) => sum + (detail.amountCr || 0), 0)
    return { debit, credit }
  }

  // ✅ Handlers
  const handleCreate = () => {
    router.push('/vouchers/lc/create')
  }

  const handleEdit = (voucher: any) => {
    router.push(`/vouchers/lc/edit/${voucher.id}`)
  }

  const handleDeleteClick = (voucherId: number) => {
    setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
  }

  const handlePostUnpostClick = (voucherId: number, currentStatus: number | boolean) => {
    const isPosted = currentStatus === 1 || currentStatus === true
    setConfirmModal({
      isOpen: true,
      voucherId,
      type: isPosted ? 'unpost' : 'post'
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmModal.voucherId || !confirmModal.type) return

    try {
      if (confirmModal.type === 'delete') {
        await deleteVoucher(confirmModal.voucherId).unwrap()
      } else if (confirmModal.type === 'post' || confirmModal.type === 'unpost') {
        await postUnpostVoucher(confirmModal.voucherId).unwrap()
      }
      setConfirmModal({ isOpen: false })
    } catch (err) {
      console.error(`Failed to ${confirmModal.type} voucher:`, err)
      setConfirmModal({ isOpen: false })
    }
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return <Loading size="lg" text="Loading LC Vouchers..." />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Landmark className="w-8 h-8 mr-3" />
              LC Vouchers Management
            </h1>
            <p className="text-blue-100 mt-2">
              Manage Letter of Credit voucher entries • {filteredVouchers.length} total vouchers
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              icon={<RefreshCw className="w-4 h-4" />}
              className="bg-white text-[#509ee3] hover:bg-gray-100"
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              onClick={handleCreate}
              icon={<Plus className="w-4 h-4" />}
              className="bg-white text-[#509ee3] hover:bg-gray-100"
            >
              Create LC Voucher
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 max-w-[300px]">
            <Input
              className="w-96"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vouchers by number or ID..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex space-x-2 mr-10">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All ({statusCounts.total})
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'warning' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
            >
              Draft ({statusCounts.draft})
            </Button>
            <Button
              variant={statusFilter === 'posted' ? 'success' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter('posted')}
            >
              Posted ({statusCounts.posted})
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredVouchers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Landmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No LC Vouchers Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'No vouchers match your search criteria'
              : 'Get started by creating your first LC voucher'}
          </p>
          <Button
            variant="primary"
            onClick={handleCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Create LC Voucher
          </Button>
        </div>
      )}

      {/* Table */}
      {filteredVouchers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-800"># Sr</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Voucher No</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Date</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Account</th>
                {/* <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Amount</th> */}
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Status</th>
                <th className="px-4 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredVouchers.map((voucher: any, index: number) => {
                const totals = calculateVoucherTotals(voucher.details || [])
                const serialNumber = index + 1
                const isExpanded = expandedRows.has(voucher.id)
                const isPosted = voucher.status === 1 || voucher.status === true

                return (
                  <React.Fragment key={voucher.id}>
                    {/* Main Row */}
                    <tr className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ${isExpanded ? 'bg-blue-50' : ''}`}>
                      {/* Serial Number */}
                      <td className="px-4 py-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                          {serialNumber}
                        </div>
                      </td>

                      {/* Voucher No */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">{voucher.voucherNo}</div>
                        {/* <div className="text-xs text-gray-500">ID: {voucher.id}</div> */}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDisplayDate(voucher.date)}
                        </div>
                      </td>

                      {/* Balance Account */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {voucher.coa?.acName || `${voucher.coaId}`}
                        </div>
                      </td>

                      {/* Amount */}
                      {/* <td className="px-4 py-4">
                        <div className="flex space-x-4">
                          <div className="text-sm">
                            <span className="text-red-600 font-medium">Dr:</span> {formatAmount(totals.debit)}
                          </div>
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">Cr:</span> {formatAmount(totals.credit)}
                          </div>
                        </div>
                      </td> */}

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${
                          isPosted
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                          {isPosted ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              POSTED
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              DRAFT
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 w-[280px]">
                        <div className="flex items-center justify-between space-x-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleRowExpansion(voucher.id)}
                            icon={isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            {isExpanded ? 'Hide' : 'View'}
                          </Button>

                          <Button
                            variant={isPosted ? "warning" : "success"}
                            size="sm"
                            onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
                            loading={isPostingUnposting}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            {isPosted ? 'Unpost' : 'Post'}
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(voucher)}
                            icon={<Edit className="w-3 h-3" />}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(voucher.id)}
                            icon={<Trash2 className="w-3 h-3" />}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Details Row */}
                    {isExpanded && (
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                        <td colSpan={7} className="px-4 py-6">
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center mb-4">
                              <Receipt className="w-6 h-6 mr-2 text-[#509ee3]" />
                              <h4 className="text-lg font-bold text-gray-900">
                                Voucher Details - {voucher.voucherNo}
                              </h4>
                              <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {voucher.details?.length || 0} entries
                              </div>
                            </div>

                            {/* Details Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Account</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Debit</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Credit</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Cost</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ID Card</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Bank</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Bank Date</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {voucher.details?.map((detail: any, detailIndex: number) => {
                                    const isDebitRow = detail.amountDb > 0

                                    return (
                                      <tr
                                        key={detailIndex}
                                        className={`transition-colors duration-200 ${
                                          isDebitRow
                                            ? 'bg-red-50/30 hover:bg-red-50/50'
                                            : 'bg-green-50/30 hover:bg-green-50/50'
                                        }`}
                                      >
                                        <td className="px-3 py-3">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            isDebitRow
                                              ? 'bg-red-500 text-white'
                                              : 'bg-green-500 text-white'
                                          }`}>
                                            {detailIndex + 1}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            {detail.coa?.acName || `COA #${detail.coaId}`}
                                          </div>
                                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            isDebitRow
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-green-100 text-green-700'
                                          }`}>
                                            {isDebitRow ? 'Dr' : 'Cr'}
                                          </span>
                                        </td>

                                        <td className="px-3 py-3">
                                          <div className="text-sm text-gray-900">
                                            {detail.description || '-'}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3 text-right">
                                          <div className={`text-sm font-bold ${
                                            detail.amountDb > 0 ? 'text-red-600' : 'text-gray-400'
                                          }`}>
                                            {formatAmount(detail.amountDb)}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3 text-right">
                                          <div className={`text-sm font-bold ${
                                            detail.amountCr > 0 ? 'text-green-600' : 'text-gray-400'
                                          }`}>
                                            {formatAmount(detail.amountCr)}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                          <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${
                                            detail.isCost
                                              ? 'bg-blue-100 text-blue-800'
                                              : 'bg-gray-100 text-gray-500'
                                          }`}>
                                            {detail.isCost ? 'Yes' : 'No'}
                                          </span>
                                        </td>

                                        <td className="px-3 py-3">
                                          <div className="text-sm text-gray-700 flex items-center">
                                            {detail.idCard ? (
                                              <>
                                                <User className="w-3 h-3 mr-1" />
                                                {detail.idCard}
                                              </>
                                            ) : (
                                              <span className="text-gray-400">-</span>
                                            )}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3">
                                          <div className="text-sm text-gray-700 flex items-center">
                                            {detail.bank ? (
                                              <>
                                                <Building className="w-3 h-3 mr-1" />
                                                {detail.bank}
                                              </>
                                            ) : (
                                              <span className="text-gray-400">-</span>
                                            )}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3">
                                          <div className="text-sm text-gray-700 flex items-center">
                                            {detail.bankDate ? (
                                              <>
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDisplayDate(detail.bankDate)}
                                              </>
                                            ) : (
                                              <span className="text-gray-400">-</span>
                                            )}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                          <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${
                                            detail.status
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {detail.status ? 'Active' : 'Inactive'}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}

                                  {/* Totals Row */}
                                  <tr className="bg-gray-100 font-bold">
                                    <td colSpan={3} className="px-3 py-2 text-right text-gray-900">TOTALS:</td>
                                    <td className="px-3 py-2 text-right text-red-700">{formatAmount(totals.debit)}</td>
                                    <td className="px-3 py-2 text-right text-green-700">{formatAmount(totals.credit)}</td>
                                    <td colSpan={5} className="px-3 py-2 text-center">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        totals.debit === totals.credit
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {totals.debit === totals.credit ? 'BALANCED ✓' : 'NOT BALANCED'}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete' ? 'Delete LC Voucher' :
          confirmModal.type === 'post' ? 'Post LC Voucher' :
          'Unpost LC Voucher'
        }
        message={
          confirmModal.type === 'delete'
            ? 'Are you sure you want to delete this LC voucher? This action cannot be undone.'
            : confirmModal.type === 'post'
            ? 'Post this voucher? All details will become active.'
            : 'Unpost this voucher? It will become draft again.'
        }
        confirmText={confirmModal.type === 'delete' ? 'Delete' : confirmModal.type === 'post' ? 'Post' : 'Unpost'}
        cancelText="Cancel"
        type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        loading={isDeleting || isPostingUnposting}
      />
    </div>
  )
}

export default LcVoucherManager
