'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import {
  useGetUomsQuery,
  useDeleteUomMutation
} from '@/lib/redux/api/uomApi'
import { Uom } from '@/types/uom'
import { UomCard } from './UomCard'
import { UomForm } from './UomForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const UomList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUom, setEditingUom] = useState<Uom | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: uoms = [], error, isLoading, refetch } = useGetUomsQuery()
  const [deleteUom] = useDeleteUomMutation()

  // Filter UOMs based on search
  const filteredUoms = uoms.filter(uom =>
    uom.uom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (uom: Uom) => {
    setEditingUom(uom)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this UOM?')) return

    setDeletingId(id)
    try {
      await deleteUom(id).unwrap()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingUom(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingUom(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load UOMs</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Unit of Measures
          </h1>
          <p className="text-gray-600">
            Manage your units of measurement ({uoms.length} total)
          </p>
        </div>
        
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New UOM
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search UOMs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* UOM Grid */}
      <AnimatePresence mode="popLayout">
        {filteredUoms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No UOMs found matching your search' : 'No UOMs created yet'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)}>
                Create Your First UOM
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredUoms.map((uom) => (
              <UomCard
                key={uom.id}
                uom={uom}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === uom.id}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingUom ? 'Edit UOM' : 'Create New UOM'}
      >
        <UomForm
          editingUom={editingUom}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  )
}
