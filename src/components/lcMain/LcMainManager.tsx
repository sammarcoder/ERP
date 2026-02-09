// components/lc-main/LcMainManager.tsx

'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetAllLcMainQuery,
  useDeleteLcMainMutation,
  useToggleLcMainStatusMutation,
  LcMain
} from '@/store/slice/lcMainSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { formatDisplayDate } from '@/utils/formatters'
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Landmark,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Ship,
  Building2,
  DollarSign
} from 'lucide-react'

const LcMainManager: React.FC = () => {
  const router = useRouter()

  // =============================================
  // STATE
  // =============================================

  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id?: number; type?: 'delete' | 'toggle' }>({ isOpen: false })

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: lcMainList = [], isLoading, refetch } = useGetAllLcMainQuery()
  const [deleteLcMain, { isLoading: isDeleting }] = useDeleteLcMainMutation()
  const [toggleStatus, { isLoading: isToggling }] = useToggleLcMainStatusMutation()

  // =============================================
  // FILTERED DATA
  // =============================================

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return lcMainList

    const search = searchTerm.toLowerCase()
    return lcMainList.filter(item =>
      item.lc?.acName?.toLowerCase().includes(search) ||
      item.bl?.toLowerCase().includes(search) ||
      item.container?.toLowerCase().includes(search) ||
      item.gd?.toLowerCase().includes(search) ||
      item.shipper?.actualName?.toLowerCase().includes(search)
    )
  }, [lcMainList, searchTerm])

  // =============================================
  // HANDLERS
  // =============================================

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleCreate = () => router.push('/lc-main/create')
  const handleEdit = (id: number) => router.push(`/lc-main/edit/${id}`)

  const handleDeleteClick = (id: number) => {
    setConfirmModal({ isOpen: true, id, type: 'delete' })
  }

  const handleToggleClick = (id: number) => {
    setConfirmModal({ isOpen: true, id, type: 'toggle' })
  }

  const handleConfirmAction = async () => {
    if (!confirmModal.id) return

    try {
      if (confirmModal.type === 'delete') {
        await deleteLcMain(confirmModal.id).unwrap()
      } else if (confirmModal.type === 'toggle') {
        await toggleStatus(confirmModal.id).unwrap()
      }
      setConfirmModal({ isOpen: false })
    } catch (error) {
      console.error('Action failed:', error)
      setConfirmModal({ isOpen: false })
    }
  }

  // =============================================
  // LOADING
  // =============================================

  if (isLoading) {
    return <Loading size="lg" text="Loading LC Main records..." />
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Landmark className="w-8 h-8 mr-3" />
              LC Main Management
            </h1>
            <p className="text-blue-100 mt-1">
              Manage Letter of Credit records • {filteredData.length} total records
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
              Create LC Main
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by LC, B/L, Container, GD, Shipper..."
          icon={<Search className="w-4 h-4" />}
          className="max-w-md"
        />
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Landmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No LC Main Records Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No records match your search' : 'Get started by creating your first LC Main'}
          </p>
          {!searchTerm && (
            <Button variant="primary" onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
              Create LC Main
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {filteredData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">LC</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shipper</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">B/L</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Container</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">GD Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const isExpanded = expandedRows.has(item.id)

                return (
                  <React.Fragment key={item.id}>
                    {/* Main Row */}
                    <tr className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.lc?.acName || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{item.shipper?.actualName || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{item.bl || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{item.container || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{item.gdDate ? formatDisplayDate(item.gdDate) : '-'}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleClick(item.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            item.status
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.status ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleRowExpansion(item.id)}
                            icon={isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          >
                            {isExpanded ? 'Hide' : 'View'}
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(item.id)}
                            icon={<Edit className="w-3 h-3" />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(item.id)}
                            icon={<Trash2 className="w-3 h-3" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <tr className="bg-blue-50/50">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-gray-200">
                            <div>
                              <span className="text-xs text-gray-500">Consignee</span>
                              <p className="text-sm font-medium">{item.consignee?.actualName || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Invoice</span>
                              <p className="text-sm font-medium">{item.inv || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">GD</span>
                              <p className="text-sm font-medium">{item.gd || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Bank Name</span>
                              <p className="text-sm font-medium">{item.bankName?.actualName || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Contact Type</span>
                              <p className="text-sm font-medium">{item.contactType?.actualName || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Payment Date</span>
                              <p className="text-sm font-medium">{item.paymentDate ? formatDisplayDate(item.paymentDate) : '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Currency</span>
                              <p className="text-sm font-medium">{item.currency?.currencyName || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Clearing Agent</span>
                              <p className="text-sm font-medium">{item.clearingAgent?.actualName || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Exchange Rate Duty</span>
                              <p className="text-sm font-medium">{item.exchangeRateDuty || '0.0000'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Exchange Rate Documents</span>
                              <p className="text-sm font-medium">{item.exchangeRateDocuments || '0.0000'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Total Expenses</span>
                              <p className="text-sm font-medium">{item.totalExp || '0'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Avg Dollar Rate</span>
                              <p className="text-sm font-medium">{item.averageDollarRate || '0.00'}</p>
                            </div>
                            <div className="col-span-2 md:col-span-4">
                              <span className="text-xs text-gray-500">Item Description</span>
                              <p className="text-sm font-medium">{item.itemDescription || '-'}</p>
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
        title={confirmModal.type === 'delete' ? 'Delete LC Main' : 'Toggle Status'}
        message={
          confirmModal.type === 'delete'
            ? 'Are you sure you want to delete this LC Main record? This action cannot be undone.'
            : 'Are you sure you want to toggle the status?'
        }
        confirmText={confirmModal.type === 'delete' ? 'Delete' : 'Toggle'}
        type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        loading={isDeleting || isToggling}
      />
    </div>
  )
}

export default LcMainManager
