
'use client'
import React, { useState, useMemo } from 'react'
import {
  useGetJournalVouchersByTypeQuery,
  useGetPettyCashVouchersByTypeQuery,
  useDeleteJournalVoucherMutation,
  usePostUnpostVoucherMutation,
} from '@/store/slice/journalVoucherSlice'
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
  FileText,
  DollarSign,
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
  Calendar
} from 'lucide-react'

interface Props {
  voucherType?: 'journal' | 'pettycash' | 'all'
}

export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
  const router = useRouter()
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set()) // ✅ Track expanded rows
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'draft'>('all')

  const { data: journalVouchers = [], isLoading: journalLoading, refetch: refetchJournal } = useGetJournalVouchersByTypeQuery(undefined, {
    skip: voucherType === 'pettycash'
  })

  const { data: pettyCashVouchers = [], isLoading: pettyCashLoading, refetch: refetchPetty } = useGetPettyCashVouchersByTypeQuery(undefined, {
    skip: voucherType === 'journal'
  })

  const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()
  const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostVoucherMutation()

  const allVouchers = useMemo(() => {
    let combined: any[] = []
    if (voucherType === 'all' || voucherType === 'journal') {
      combined = [...combined, ...journalVouchers]
    }
    if (voucherType === 'all' || voucherType === 'pettycash') {
      combined = [...combined, ...pettyCashVouchers]
    }
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [journalVouchers, pettyCashVouchers, voucherType])

  const filteredVouchers = useMemo(() => {
    let filtered = allVouchers

    if (statusFilter !== 'all') {
      filtered = filtered.filter(voucher => {
        if (statusFilter === 'posted') return voucher.status === true
        if (statusFilter === 'draft') return voucher.status === false
        return true
      })
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(voucher =>
        voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.id.toString().includes(searchTerm)
      )
    }

    return filtered
  }, [allVouchers, searchTerm, statusFilter])

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

  const getStatusCounts = () => {
    const total = allVouchers.length
    const posted = allVouchers.filter(v => v.status === true).length
    const draft = allVouchers.filter(v => v.status === false).length
    return { total, posted, draft }
  }

  const calculateVoucherTotals = (details: any[]) => {
    if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }
    const debit = details.reduce((sum, detail) => sum + (detail.amountDb || 0), 0)
    const credit = details.reduce((sum, detail) => sum + (detail.amountCr || 0), 0)
    return { debit, credit }
  }

  const handleCreate = (type: 'journal' | 'petty') => {
    router.push(`/vouchers/${type}/create`)
  }

  const handleEdit = (voucher: any) => {
    const path = voucher.voucherTypeId === 10 ? 'journal' : 'petty'
    router.push(`/vouchers/${path}/edit/${voucher.id}`)
  }

  const handleDeleteClick = (voucherId: number) => {
    setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
  }

  const handlePostUnpostClick = (voucherId: number, currentStatus: boolean) => {
    setConfirmModal({
      isOpen: true,
      voucherId,
      type: currentStatus ? 'unpost' : 'post'
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
  const isLoading = journalLoading || pettyCashLoading

  if (isLoading) {
    return <Loading size="lg" text="Loading Vouchers..." />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Receipt className="w-8 h-8 mr-3" />
              {voucherType === 'all' ? 'All Vouchers' :
                voucherType === 'journal' ? 'Journal Vouchers' :
                  'Petty Cash Vouchers'} Management
            </h1>
            <p className="text-blue-100 mt-2">
              Manage voucher entries and posting status • {filteredVouchers.length} total vouchers
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => Promise.all([refetchJournal(), refetchPetty()])}
              icon={<RefreshCw className="w-4 h-4" />}
              className="bg-white text-[#509ee3] hover:bg-gray-100"
            >
              Refresh
            </Button>
            {(voucherType === 'all' || voucherType === 'journal') && (
              <Button
                variant="secondary"
                onClick={() => handleCreate('journal')}
                icon={<Plus className="w-4 h-4" />}
                className="bg-white text-[#509ee3] hover:bg-gray-100"
              >
                Journal
              </Button>
            )}
            {(voucherType === 'all' || voucherType === 'pettycash') && (
              <Button
                variant="secondary"
                onClick={() => handleCreate('petty')}
                icon={<Plus className="w-4 h-4" />}
                className="bg-white text-[#509ee3] hover:bg-gray-100"
              >
                Petty Cash
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 max-w-[300px] ">
            <Input
              className='w-96 '
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

      {/* ✅ ENHANCED TABLE with Expandable Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Serial</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Voucher No</th>
              {/* <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Type</th> */}
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Date</th>
              {/* <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Amount</th> */}
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Status</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredVouchers.map((voucher: any, index: number) => {
              const totals = calculateVoucherTotals(voucher.details || [])
              const isJournal = voucher.voucherTypeId === 10
              const serialNumber = index + 1 // ✅ Serial number starting from 1
              const isExpanded = expandedRows.has(voucher.id)

              return (
                <React.Fragment key={voucher.id}>
                  {/* ✅ MAIN ROW */}
                  <tr className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ${isExpanded ? 'bg-blue-50' : ''
                    }`}>
                    {/* Serial Number */}
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                        {serialNumber}
                      </div>
                    </td>

                    {/* Voucher Info */}
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{voucher.voucherNo}</div>
                        {/* <div className="text-xs text-gray-500">ID: {voucher.id}</div> */}
                      </div>
                    </td>

                    {/* Type */}
                    {/* <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${isJournal
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-green-100 text-green-800 border-green-300'
                        }`}>
                        {isJournal ? (
                          <>
                            <FileText className="w-3 h-3 mr-1" />
                            Journal
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-3 h-3 mr-1" />
                            Petty Cash
                          </>
                        )}
                      </span>
                    </td> */}

                    {/* Date */}
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDisplayDate(voucher.date)}
                      </div>
                      {/* <div className="text-xs text-gray-500">
                        Created: {formatDisplayDate(voucher.createdAt)}
                      </div> */}
                    </td>

                    {/* Amount */}
                    {/* <td className="px-4 py-4">
                      <div className="flex space-x-4">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">Dr:</span> {formatAmount(totals.debit)}
                        </div>
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">Cr:</span> {formatAmount(totals.credit)}
                        </div>
                      </div>
                    </td> */}

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${voucher.status
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                        {voucher.status ? (
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
                    <td className="px-4 py-4  w-[250px]">
                      <div className="flex items-center justify-between space-x-2">
                        {/* ✅ VIEW BUTTON - Toggles expansion */}
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
                          variant={voucher.status ? "warning" : "success"}
                          size="sm"
                          onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
                          loading={isPostingUnposting}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {voucher.status ? 'Unpost' : 'Post'}
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

                        {/* <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(voucher.id)}
                          icon={<Trash2 className="w-3 h-3" />}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          Delete
                        </Button> */}
                      </div>
                    </td>
                  </tr>

                  {/* ✅ EXPANDABLE DETAILS ROW */}
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

                          {/* ✅ FIXED: DETAILS TABLE - Use amountDb/amountCr instead of ownDb/ownCr */}
                          <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Account</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Debit</th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Credit</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ID Card</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Bank</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Bank Date</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {voucher.details?.map((detail: any, detailIndex: number) => {
                                  const isAutoBalance = detail.description === "Auto Balancing Entry"

                                  return (
                                    <tr
                                      key={detailIndex}
                                      className={`transition-colors duration-200 ${isAutoBalance
                                          ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400'
                                          : 'hover:bg-gray-50'
                                        }`}
                                    >
                                      <td className="px-3 py-3">
                                        <div className="flex items-center">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAutoBalance
                                              ? 'bg-yellow-400 text-yellow-900'
                                              : 'bg-[#509ee3] text-white'
                                            }`}>
                                            {isAutoBalance ? '⚡' : detail.lineId}
                                          </div>
                                          {isAutoBalance && (
                                            <Star className="w-3 h-3 text-yellow-500 ml-1" />
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {detail.coa?.acName || 'N/A'}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className={`text-sm ${isAutoBalance ? 'font-bold text-yellow-800' : 'text-gray-900'
                                          }`}>
                                          {detail.description || '-'}
                                        </div>
                                      </td>

                                      {/* ✅ FIXED: Use amountDb instead of ownDb for DEBIT column */}
                                      <td className="px-3 py-3 text-right">
                                        <div className={`text-sm font-bold ${detail.amountDb > 0
                                            ? (isAutoBalance ? 'text-yellow-700' : 'text-green-600')
                                            : 'text-gray-400'
                                          }`}>
                                          {formatAmount(detail.amountDb)}
                                        </div>
                                      </td>

                                      {/* ✅ FIXED: Use amountCr instead of ownCr for CREDIT column */}
                                      <td className="px-3 py-3 text-right">
                                        <div className={`text-sm font-bold ${detail.amountCr > 0
                                            ? (isAutoBalance ? 'text-yellow-700' : 'text-blue-600')
                                            : 'text-gray-400'
                                          }`}>
                                          {formatAmount(detail.amountCr)}
                                        </div>
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
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${detail.status
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                          }`}>
                                          {detail.status ? 'Active' : 'Inactive'}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                })}

                                {/* ✅ FIXED: Totals Row - Make sure totals also use amountDb/amountCr */}
                                <tr className="bg-gray-100 font-bold">
                                  <td colSpan={3} className="px-3 py-2 text-right text-gray-900">TOTALS:</td>
                                  <td className="px-3 py-2 text-right text-green-700">{formatAmount(totals.debit)}</td>
                                  <td className="px-3 py-2 text-right text-blue-700">{formatAmount(totals.credit)}</td>
                                  <td colSpan={4} className="px-3 py-2 text-center">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                                      BALANCED ✓
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete' ? 'Delete Voucher' :
            confirmModal.type === 'post' ? 'Post Voucher' :
              'Unpost Voucher'
        }
        message={
          confirmModal.type === 'delete'
            ? 'Are you sure you want to delete this voucher? This action cannot be undone.'
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
