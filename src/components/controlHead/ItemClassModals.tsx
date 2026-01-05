// components/ItemClass/ItemClassModals.tsx - UNCONTROLLED inputs
import React from 'react'
import { Modal } from '../ui/Modal'
import { ConfirmationModal } from '../common/ConfirmationModal'

interface ItemClassModalsProps {
  // Refs instead of controlled state
  zHead2Ref: React.RefObject<HTMLInputElement>
  zHead1IdRef: React.RefObject<HTMLSelectElement>
  
  // Modal state
  showCreateModal: boolean
  editModal: { isOpen: boolean; itemClass?: any }
  confirmModal: { isOpen: boolean; itemClass?: any }
  
  // Other state
  loading: boolean
  message: string
  isDeleting: boolean
  
  // Handlers
  onSubmit: (e: React.FormEvent) => void
  onUpdate: (e: React.FormEvent) => void
  onCloseCreateModal: () => void
  onCloseEditModal: () => void
  onCloseConfirmModal: () => void
  onConfirmDelete: () => void
  onClearMessage: () => void
}

export const ItemClassModals: React.FC<ItemClassModalsProps> = ({
  zHead2Ref,
  zHead1IdRef,
  showCreateModal,
  editModal,
  confirmModal,
  loading,
  message,
  isDeleting,
  onSubmit,
  onUpdate,
  onCloseCreateModal,
  onCloseEditModal,
  onCloseConfirmModal,
  onConfirmDelete,
  onClearMessage
}) => {
  const accountTypes = [
    { id: 1, name: 'Assets' },
    { id: 2, name: 'Liability' },
    { id: 3, name: 'Revenue' },
    { id: 4, name: 'Expense' }
  ]

  const FormFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Control Head 1 Type <span className="text-red-500">*</span>
        </label>
        <select
          ref={zHead1IdRef}
          onFocus={onClearMessage}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Control Head 1 Type</option>
          {accountTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.id} - {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Control Head 2 Name <span className="text-red-500">*</span>
        </label>
        <input
          ref={zHead2Ref}
          type="text"
          placeholder="Enter Control Head 2 name"
          onFocus={onClearMessage}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  )

  return (
    <>
      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={onCloseCreateModal} title="Add New Control Head 2">
        <form onSubmit={onSubmit} className="space-y-6">
          <FormFields />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Data'}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal.isOpen} onClose={onCloseEditModal} title="Edit Control Head 2">
        <form onSubmit={onUpdate} className="space-y-6">
          <FormFields />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Data'}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={onCloseConfirmModal}
        onConfirm={onConfirmDelete}
        title="Delete Control Head 2"
        message={`Are you sure you want to delete "${confirmModal.itemClass?.zHead2}"? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />
    </>
  )
}
