'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { ItemSearchableInput } from '@/components/common/items/ItemSearchableInput'
import { ItemMultiSelectInput } from '@/components/common/items/ItemMultiSelectInput'
import { 
  useGetMouldsQuery, 
  useCreateMouldMutation, 
  useUpdateMouldMutation, 
  useDeleteMouldMutation 
} from '@/store/slice/mouldApi'
import { Pencil, Trash2, Plus, Package, Clock, Grid3X3 } from 'lucide-react'

interface FormData {
  name: string;
  cycleTime: string;
  totalCavities: string;
  effectiveCavities: string;
  inputMaterialId: number | null;
  outputMaterialIds: number[];
}

const initialForm: FormData = {
  name: '',
  cycleTime: '',
  totalCavities: '',
  effectiveCavities: '',
  inputMaterialId: null,
  outputMaterialIds: []
}

export default function MouldsPage() {
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const { data, isLoading } = useGetMouldsQuery({ page, limit: 10 })
  const [createMould, { isLoading: creating }] = useCreateMouldMutation()
  const [updateMould, { isLoading: updating }] = useUpdateMouldMutation()
  const [deleteMould, { isLoading: deleting }] = useDeleteMouldMutation()

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {}
    
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.cycleTime) errors.cycleTime = 'Cycle time is required'
    if (!formData.totalCavities) errors.totalCavities = 'Total cavities is required'
    if (!formData.effectiveCavities) errors.effectiveCavities = 'Effective cavities is required'
    if (!formData.inputMaterialId) errors.inputMaterialId = 'Input material is required'
    
    if (parseInt(formData.effectiveCavities) > parseInt(formData.totalCavities)) {
      errors.effectiveCavities = 'Cannot exceed total cavities'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const payload = {
      name: formData.name,
      cycleTime: parseInt(formData.cycleTime),
      totalCavities: parseInt(formData.totalCavities),
      effectiveCavities: parseInt(formData.effectiveCavities),
      inputMaterialId: formData.inputMaterialId!,
      outputMaterialIds: formData.outputMaterialIds
    }

    try {
      if (editId) {
        await updateMould({ id: editId, data: payload }).unwrap()
      } else {
        await createMould(payload).unwrap()
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save mould:', err)
    }
  }

  const handleEdit = (mould: any) => {
    setFormData({
      name: mould.name,
      cycleTime: mould.cycleTime.toString(),
      totalCavities: mould.totalCavities.toString(),
      effectiveCavities: mould.effectiveCavities.toString(),
      inputMaterialId: mould.inputMaterialId,
      outputMaterialIds: mould.outputMaterials?.map((m: any) => m.id) || []
    })
    setEditId(mould.id)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    await deleteMould(deleteModal.id)
    setDeleteModal({ open: false, id: 0 })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditId(null)
    setFormData(initialForm)
    setFormErrors({})
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Moulds</h1>
          <p className="text-sm text-gray-500 mt-1">Manage production moulds and their materials</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Add Mould
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cycle Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cavities</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output Materials</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#509ee3]"></div>
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No moulds found. Create your first mould!
                </td>
              </tr>
            ) : data?.data?.map((mould: any) => (
              <tr key={mould.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{mould.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{mould.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    {mould.cycleTime}s
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Grid3X3 className="w-4 h-4 mr-1 text-gray-400" />
                    {mould.effectiveCavities}/{mould.totalCavities}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {mould.inputMaterial ? (
                    <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">
                      <Package className="w-3 h-3 mr-1" />
                      {mould.inputMaterial.itemName}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {mould.outputMaterials?.length > 0 ? (
                      mould.outputMaterials.slice(0, 2).map((item: any) => (
                        <span key={item.id} className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          {item.itemName}
                        </span>
                      ))
                    ) : '-'}
                    {mould.outputMaterials?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{mould.outputMaterials.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(mould)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteModal({ open: true, id: mould.id })}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Page {data?.page || 1} of {data?.totalPages || 1} ({data?.total || 0} total)
        </span>
        <div className="space-x-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => setPage(p => p + 1)} 
            disabled={page >= (data?.totalPages || 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Mould' : 'Add New Mould'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mould Name */}
             

              {/* Cycle Time & Cavities */}
              <div className="grid grid-cols-4 gap-4">
                 <Input 
                label="Mould Name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter mould name"
                required
                error={formErrors.name}
              />
                <Input 
                  label="Cycle Time (sec)" 
                  type="number"
                  min="1"
                  value={formData.cycleTime} 
                  onChange={(e) => setFormData({ ...formData, cycleTime: e.target.value })}
                  placeholder="e.g., 45"
                  required
                  error={formErrors.cycleTime}
                />
                <Input 
                  label="Total Cavities" 
                  type="number"
                  min="1"
                  value={formData.totalCavities} 
                  onChange={(e) => setFormData({ ...formData, totalCavities: e.target.value })}
                  placeholder="e.g., 8"
                  required
                  error={formErrors.totalCavities}
                />
                <Input 
                  label="Effective Cavities" 
                  type="number"
                  min="1"
                  value={formData.effectiveCavities} 
                  onChange={(e) => setFormData({ ...formData, effectiveCavities: e.target.value })}
                  placeholder="e.g., 6"
                  required
                  error={formErrors.effectiveCavities}
                />
              </div>

              {/* Input Material (Single Select) */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="text-sm font-medium text-amber-800 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Input Material (Raw Material)
                </h3>
                <ItemSearchableInput
                  value={formData.inputMaterialId}
                  onChange={(itemId) => setFormData({ ...formData, inputMaterialId: itemId })}
                  placeholder="Search and select input material..."
                  required
                  error={formErrors.inputMaterialId}
                  excludeIds={formData.outputMaterialIds}
                />
              </div>

              {/* Output Materials (Multi Select) */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Output Materials (Finished Products)
                </h3>
                <ItemMultiSelectInput
                  value={formData.outputMaterialIds}
                  onChange={(itemIds) => setFormData({ ...formData, outputMaterialIds: itemIds })}
                  placeholder="Search and select output materials..."
                  excludeIds={formData.inputMaterialId ? [formData.inputMaterialId] : []}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" loading={creating || updating}>
                  {editId ? 'Update Mould' : 'Create Mould'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: 0 })}
        onConfirm={handleDelete}
        title="Delete Mould"
        message="Are you sure you want to delete this mould? This will also remove all output material associations. This action cannot be undone."
        type="danger"
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  )
}
