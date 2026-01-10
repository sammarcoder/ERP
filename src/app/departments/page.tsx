'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { 
  useGetDepartmentsQuery, 
  useCreateDepartmentMutation, 
  useUpdateDepartmentMutation, 
  useDeleteDepartmentMutation 
} from '@/store/slice/departmentApi'
import { Pencil, Trash2, Plus } from 'lucide-react'

const initialForm = { departmentName: '', departmentCode: '', description: '', location: '', isActive: true }

export default function DepartmentsPage() {
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState(initialForm)

  const { data, isLoading } = useGetDepartmentsQuery({ page, limit: 10 })
  const [createDepartment, { isLoading: creating }] = useCreateDepartmentMutation()
  const [updateDepartment, { isLoading: updating }] = useUpdateDepartmentMutation()
  const [deleteDepartment, { isLoading: deleting }] = useDeleteDepartmentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      await updateDepartment({ id: editId, data: formData })
    } else {
      await createDepartment(formData)
    }
    setIsModalOpen(false)
    setFormData(initialForm)
    setEditId(null)
  }

  const handleEdit = (dept: any) => {
    setFormData({
      departmentName: dept.departmentName,
      departmentCode: dept.departmentCode,
      description: dept.description || '',
      location: dept.location || '',
      isActive: dept.isActive
    })
    setEditId(dept.id)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    await deleteDepartment(deleteModal.id)
    setDeleteModal({ open: false, id: 0 })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Departments</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>Add Department</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : data?.data?.map((dept: any) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{dept.id}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{dept.departmentCode}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{dept.departmentName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{dept.location || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${dept.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(dept)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteModal({ open: true, id: dept.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">Page {data?.page} of {data?.totalPages}</span>
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <Button size="sm" variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= (data?.totalPages || 1)}>Next</Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Department' : 'Add Department'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Department Code" value={formData.departmentCode} onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })} required />
                <Input label="Department Name" value={formData.departmentName} onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })} required />
              </div>
              <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setEditId(null); setFormData(initialForm) }}>Cancel</Button>
                <Button type="submit" loading={creating || updating}>{editId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: 0 })} onConfirm={handleDelete} title="Delete Department" message="Are you sure? Deleting a department may affect associated employees." type="danger" confirmText="Delete" loading={deleting} />
    </div>
  )
}
