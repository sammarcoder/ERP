'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { 
  useGetShiftsQuery, 
  useCreateShiftMutation, 
  useUpdateShiftMutation, 
  useDeleteShiftMutation 
} from '@/store/slice/shiftApi'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function ShiftsPage() {
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', startTime: '', endTime: '' })

  const { data, isLoading } = useGetShiftsQuery({ page, limit: 10 })
  const [createShift, { isLoading: creating }] = useCreateShiftMutation()
  const [updateShift, { isLoading: updating }] = useUpdateShiftMutation()
  const [deleteShift, { isLoading: deleting }] = useDeleteShiftMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      await updateShift({ id: editId, data: formData })
    } else {
      await createShift(formData)
    }
    setIsModalOpen(false)
    setFormData({ name: '', startTime: '', endTime: '' })
    setEditId(null)
  }

  const handleEdit = (shift: any) => {
    setFormData({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime })
    setEditId(shift.id)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    await deleteShift(deleteModal.id)
    setDeleteModal({ open: false, id: 0 })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Shifts</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Add Shift
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : data?.data?.map((shift: any) => (
              <tr key={shift.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{shift.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{shift.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{shift.startTime}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{shift.endTime}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(shift)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteModal({ open: true, id: shift.id })}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">Page {data?.page} of {data?.totalPages}</span>
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= (data?.totalPages || 1)}>
            Next
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Shift' : 'Add Shift'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="Start Time" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
              <Input label="End Time" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setEditId(null); setFormData({ name: '', startTime: '', endTime: '' }) }}>Cancel</Button>
                <Button type="submit" loading={creating || updating}>{editId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: 0 })} onConfirm={handleDelete} title="Delete Shift" message="Are you sure you want to delete this shift?" type="danger" confirmText="Delete" loading={deleting} />
    </div>
  )
}
