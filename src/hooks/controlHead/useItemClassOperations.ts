// hooks/useItemClassOperations.ts
import { useCallback } from 'react'
import {
  useCreateItemClassMutation,
  useUpdateItemClassMutation,
  useDeleteItemClassMutation
} from '@/store/slice/itemsClassSlice'

interface FormData {
  zHead2: string
  zHead1Id: number | null
}

export const useItemClassOperations = () => {
  const [createItemClass] = useCreateItemClassMutation()
  const [updateItemClass] = useUpdateItemClassMutation()
  const [deleteItemClass, { isLoading: isDeleting }] = useDeleteItemClassMutation()

  const handleCreate = useCallback(async (
    formData: FormData,
    setLoading: (loading: boolean) => void,
    setMessage: (message: string) => void,
    resetForm: () => void,
    closeModal: () => void
  ) => {
    if (!formData.zHead1Id || !formData.zHead2) {
      setMessage('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      await createItemClass({
        zHead2: formData.zHead2.trim(),
        zHead1Id: formData.zHead1Id
      }).unwrap()

      setMessage('Data saved successfully!')
      resetForm()
      closeModal()

    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Failed to save data')
    } finally {
      setLoading(false)
    }
  }, [createItemClass])

  const handleUpdate = useCallback(async (
    id: number,
    formData: FormData,
    setLoading: (loading: boolean) => void,
    setMessage: (message: string) => void,
    resetForm: () => void,
    closeModal: () => void
  ) => {
    if (!formData.zHead1Id || !formData.zHead2) {
      setMessage('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      await updateItemClass({
        id,
        zHead2: formData.zHead2.trim(),
        zHead1Id: formData.zHead1Id
      }).unwrap()

      setMessage('Data updated successfully!')
      resetForm()
      closeModal()

    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Failed to update data')
    } finally {
      setLoading(false)
    }
  }, [updateItemClass])

  const handleDelete = useCallback(async (id: number, closeModal: () => void) => {
    try {
      await deleteItemClass(id).unwrap()
      closeModal()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }, [deleteItemClass])

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isDeleting
  }
}
