// components/master-types/MasterTypeManager.tsx

'use client'
import React, { useState, useMemo } from 'react'
import {
    useGetAllMasterTypesQuery,
    useCreateMasterTypeMutation,
    useUpdateMasterTypeMutation,
    useDeleteMasterTypeMutation,
    useToggleMasterTypeStatusMutation,
    MASTER_TYPES,
    TYPE_NAMES,
    MasterType
} from '@/store/slice/masterTypeSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import {
    Plus,
    Edit,
    Trash2,
    RefreshCw,
    Search,
    Ship,
    Truck,
    Building2,
    Contact,
    UserCheck,
    CheckCircle,
    XCircle,
    X,
    Save,
    AlertCircle
} from 'lucide-react'

// =============================================
// TAB CONFIG
// =============================================

const TABS = [
    { type: MASTER_TYPES.SHIPPER, name: 'Shipper', icon: Ship },
    { type: MASTER_TYPES.CARRIAGE, name: ' consignee', icon: UserCheck },
    { type: MASTER_TYPES.BANK_NAME, name: 'Bank Name', icon: Building2 },
    { type: MASTER_TYPES.CONTACT_TYPE, name: 'Contact Type', icon: Contact },
    { type: MASTER_TYPES.CLEARING_AGENT, name: 'Clearing Agent', icon: UserCheck }
]

// =============================================
// COMPONENT
// =============================================

const MasterTypeManager: React.FC = () => {
    // =============================================
    // STATE
    // =============================================

    const [activeTab, setActiveTab] = useState(MASTER_TYPES.SHIPPER)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MasterType | null>(null)
    const [formValue, setFormValue] = useState('')
    const [formError, setFormError] = useState('')
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id?: number; type?: 'delete' | 'toggle' }>({ isOpen: false })

    // =============================================
    // RTK QUERY
    // =============================================

    const { data: allData = [], isLoading, refetch } = useGetAllMasterTypesQuery()
    const [createMasterType, { isLoading: isCreating }] = useCreateMasterTypeMutation()
    const [updateMasterType, { isLoading: isUpdating }] = useUpdateMasterTypeMutation()
    const [deleteMasterType, { isLoading: isDeleting }] = useDeleteMasterTypeMutation()
    const [toggleStatus, { isLoading: isToggling }] = useToggleMasterTypeStatusMutation()

    // =============================================
    // FILTERED DATA
    // =============================================

    const filteredData = useMemo(() => {
        let data = allData.filter(item => item.type === activeTab)

        if (searchTerm.trim()) {
            data = data.filter(item =>
                item.actualName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        return data.sort((a, b) => a.actualName.localeCompare(b.actualName))
    }, [allData, activeTab, searchTerm])

    // =============================================
    // GET TAB COUNTS
    // =============================================

    const getTabCount = (type: number) => {
        return allData.filter(item => item.type === type).length
    }

    // =============================================
    // HANDLERS
    // =============================================

    const handleOpenModal = (item?: MasterType) => {
        if (item) {
            setEditingItem(item)
            setFormValue(item.actualName)
        } else {
            setEditingItem(null)
            setFormValue('')
        }
        setFormError('')
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingItem(null)
        setFormValue('')
        setFormError('')
    }

    const handleSave = async () => {
        if (!formValue.trim()) {
            setFormError('Name is required')
            return
        }

        try {
            if (editingItem) {
                await updateMasterType({
                    id: editingItem.id,
                    actualName: formValue.trim()
                }).unwrap()
            } else {
                await createMasterType({
                    type: activeTab,
                    actualName: formValue.trim()
                }).unwrap()
            }
            handleCloseModal()
        } catch (error: any) {
            setFormError(error?.data?.message || 'Failed to save')
        }
    }

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
                await deleteMasterType(confirmModal.id).unwrap()
            } else if (confirmModal.type === 'toggle') {
                await toggleStatus(confirmModal.id).unwrap()
            }
            setConfirmModal({ isOpen: false })
        } catch (error) {
            console.error('Action failed:', error)
            setConfirmModal({ isOpen: false })
        }
    }

    const activeTabConfig = TABS.find(t => t.type === activeTab)

    // =============================================
    // LOADING
    // =============================================

    if (isLoading) {
        return <Loading size="lg" text="Loading Master Types..." />
    }

    // =============================================
    // RENDER
    // =============================================

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Master Types Management</h1>
                        {/* <p className="text-blue-100 mt-1">Manage Shippers, Carriage, Banks, Contact Types & Clearing Agents</p> */}
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => refetch()}
                        icon={<RefreshCw className="w-4 h-4" />}
                        className="bg-white text-[#509ee3] hover:bg-gray-100"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.type
                        const count = getTabCount(tab.type)

                        return (
                            <button
                                key={tab.type}
                                onClick={() => {
                                    setActiveTab(tab.type)
                                    setSearchTerm('')
                                }}
                                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${isActive
                                        ? 'border-[#509ee3] text-[#509ee3] bg-blue-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-[#509ee3]' : 'text-gray-400'}`} />
                                {tab.name}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-[#509ee3] text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex-1 max-w-md">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Search ${activeTabConfig?.name}...`}
                                icon={<Search className="w-4 h-4" />}
                            />
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => handleOpenModal()}
                            icon={<Plus className="w-4 h-4" />}
                        >
                            Add {activeTabConfig?.name}
                        </Button>
                    </div>

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            {activeTabConfig && <activeTabConfig.icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />}
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No {activeTabConfig?.name} Found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm
                                    ? 'No records match your search'
                                    : `Add your first ${activeTabConfig?.name?.toLowerCase()}`}
                            </p>
                            {!searchTerm && (
                                <Button
                                    variant="primary"
                                    onClick={() => handleOpenModal()}
                                    icon={<Plus className="w-4 h-4" />}
                                >
                                    Add {activeTabConfig?.name}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Table */}
                    {filteredData.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                        {/* <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th> */}
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredData.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{item.actualName}</div>
                                            </td>
                                            {/* <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleToggleClick(item.id)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${item.status
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
                                            </td> */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(item)}
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingItem ? `Edit ${activeTabConfig?.name}` : `Add New ${activeTabConfig?.name}`}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4">
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-700">{formError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {activeTabConfig?.name} Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formValue}
                                    onChange={(e) => {
                                        setFormValue(e.target.value)
                                        setFormError('')
                                    }}
                                    placeholder={`Enter ${activeTabConfig?.name?.toLowerCase()} name`}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <Button
                                variant="outline"
                                onClick={handleCloseModal}
                                icon={<X className="w-4 h-4" />}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                loading={isCreating || isUpdating}
                                icon={<Save className="w-4 h-4" />}
                            >
                                {editingItem ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={handleConfirmAction}
                title={confirmModal.type === 'delete' ? 'Delete Record' : 'Toggle Status'}
                message={
                    confirmModal.type === 'delete'
                        ? 'Are you sure you want to delete this record? This action cannot be undone.'
                        : 'Are you sure you want to toggle the status of this record?'
                }
                confirmText={confirmModal.type === 'delete' ? 'Delete' : 'Toggle'}
                confirmVariant={confirmModal.type === 'delete' ? 'danger' : 'warning'}
                isLoading={isDeleting || isToggling}
            />
        </div>
    )
}

export default MasterTypeManager
