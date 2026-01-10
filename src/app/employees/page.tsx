'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { 
  useGetEmployeesQuery, 
  useCreateEmployeeMutation, 
  useUpdateEmployeeMutation, 
  useDeleteEmployeeMutation 
} from '@/store/slice/employeeApi'
import { useGetAllDepartmentsQuery } from '@/store/slice/departmentApi'
import { Pencil, Trash2, Plus } from 'lucide-react'

const initialForm = { employeeName: '', phone: '', address: '', departmentId: '' }

export default function EmployeesPage() {
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState(initialForm)

  const { data, isLoading } = useGetEmployeesQuery({ page, limit: 10 })
  const { data: departments } = useGetAllDepartmentsQuery()
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation()
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation()
  const [deleteEmployee, { isLoading: deleting }] = useDeleteEmployeeMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...formData, departmentId: parseInt(formData.departmentId) }
    if (editId) {
      await updateEmployee({ id: editId, data: payload })
    } else {
      await createEmployee(payload)
    }
    setIsModalOpen(false)
    setFormData(initialForm)
    setEditId(null)
  }

  const handleEdit = (emp: any) => {
    setFormData({
      employeeName: emp.employeeName,
      phone: emp.phone,
      address: emp.address || '',
      departmentId: emp.departmentId.toString()
    })
    setEditId(emp.id)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    await deleteEmployee(deleteModal.id)
    setDeleteModal({ open: false, id: 0 })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Employees</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>Add Employee</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : data?.data?.map((emp: any) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{emp.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{emp.employeeName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{emp.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {emp.department?.departmentName || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{emp.address || '-'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(emp)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteModal({ open: true, id: emp.id })}><Trash2 className="w-4 h-4 text-red-500" /></Button>
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
            <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Employee Name" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} required />
              <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                <select 
                  value={formData.departmentId} 
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
                  required
                >
                  <option value="">Select Department</option>
                  {departments?.data?.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setEditId(null); setFormData(initialForm) }}>Cancel</Button>
                <Button type="submit" loading={creating || updating}>{editId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: 0 })} onConfirm={handleDelete} title="Delete Employee" message="Are you sure you want to delete this employee?" type="danger" confirmText="Delete" loading={deleting} />
    </div>
  )
}
