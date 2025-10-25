
'use client'
import React, { useState } from 'react'
import { 
  useGetUomsQuery, 
  useCreateUomMutation, 
  useUpdateUomMutation, 
  useDeleteUomMutation 
} from '@/store/slice/uomSlice'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { Modal } from '../ui/Modal'
import { ConfirmationModal } from '../common/ConfirmationModal' // Import your ConfirmationModal

export const UomManager: React.FC = () => {
  const [newUomName, setNewUomName] = useState('')
  const [editModal, setEditModal] = useState<{ isOpen: boolean; uom?: any }>({ isOpen: false })
  const [editName, setEditName] = useState('')
  
  // NEW: Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    uom?: any
  }>({ isOpen: false })

  // RTK Query hooks
  const { data: uoms = [], isLoading, error } = useGetUomsQuery()
  const [createUom, { isLoading: isCreating }] = useCreateUomMutation()
  const [updateUom, { isLoading: isUpdating }] = useUpdateUomMutation()
  const [deleteUom, { isLoading: isDeleting }] = useDeleteUomMutation()

  // Create UOM
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUomName.trim()) return

    try {
      await createUom({ uom: newUomName.trim() }).unwrap()
      setNewUomName('')
    } catch (err) {
      console.error('Create failed:', err)
    }
  }

  // Edit UOM
  const handleEditClick = (uom: any) => {
    setEditModal({ isOpen: true, uom })
    setEditName(uom.uom)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim() || !editModal.uom) return

    try {
      await updateUom({ 
        id: editModal.uom.id, 
        uom: editName.trim() 
      }).unwrap()
      setEditModal({ isOpen: false })
      setEditName('')
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  // NEW: Delete UOM with ConfirmationModal
  const handleDeleteClick = (uom: any) => {
    setConfirmModal({ isOpen: true, uom })
  }

  const handleConfirmDelete = async () => {
    if (!confirmModal.uom) return

    try {
      await deleteUom(confirmModal.uom.id).unwrap()
      setConfirmModal({ isOpen: false })
    } catch (err) {
      console.error('Delete failed:', err)
     
    }
  }

  const handleCancelDelete = () => {
    setConfirmModal({ isOpen: false })
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading UOMs..." />
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load UOMs. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          Unit of Measures
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your units of measurement ({uoms.length} total)
        </p>
      </div>

      {/* Create Form */}
      <div className="">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Add New UOM
        </h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <Input
            value={newUomName}
            onChange={(e) => setNewUomName(e.target.value)}
            placeholder="Enter UOM name "
            className=" w-96"
            disabled={isCreating}
          />
          <Button
            type="submit"
            loading={isCreating}
            disabled={!newUomName.trim()}
          >
            Add UOM
          </Button>
        </form>
      </div>

      {/* UOM List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Existing UOMs
          </h2>
        </div>

        {uoms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No UOMs created yet. Add your first one above.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {uoms.map((uom) => (
              <div key={uom.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {uom.id}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {uom.uom}
                    </h3>
                    {/* {uom.createdAt && (
                      <p className="text-sm text-gray-500">
                        Created: {new Date(uom.createdAt).toLocaleDateString()}
                      </p>
                    )} */}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditClick(uom)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(uom)} // Updated to use modal
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false })}
        title="Edit UOM"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="UOM Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter UOM name"
            autoFocus
          />
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              loading={isUpdating}
              disabled={!editName.trim()}
              className="flex-1"
            >
              Update UOM
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditModal({ isOpen: false })}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* NEW: Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete UOM"
        message={`Are you sure you want to delete "${confirmModal.uom?.uom}"? This action cannot be undone.`}
        confirmText="Delete UOM"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />
    </div>
  )
}
