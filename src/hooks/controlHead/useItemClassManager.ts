// hooks/useItemClassManager.ts - FIX: Add proper array defaults
import { useState, useRef, useCallback, useMemo } from 'react'
import {
  useGetItemClassesQuery,
  useCreateItemClassMutation,
  useUpdateItemClassMutation,
  useDeleteItemClassMutation
} from '@/store/slice/itemsClassSlice'

export const useItemClassManager = () => {
  // ✅ Use REFS for form inputs
  const zHead2Ref = useRef<HTMLInputElement>(null)
  const zHead1IdRef = useRef<HTMLSelectElement>(null)
  
  // State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editModal, setEditModal] = useState<{ isOpen: boolean; itemClass?: any }>({ isOpen: false })
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; itemClass?: any }>({ isOpen: false })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ FIX: Ensure data is always an array
  const { data: rawItemClasses, isLoading, error } = useGetItemClassesQuery()
  const itemClasses = rawItemClasses || [] // ✅ Always array, never undefined

  const [createItemClass] = useCreateItemClassMutation()
  const [updateItemClass] = useUpdateItemClassMutation()
  const [deleteItemClass, { isLoading: isDeleting }] = useDeleteItemClassMutation()

  // ✅ Filtered data with safe array handling
  const filteredItemClasses = useMemo(() => {
    if (!Array.isArray(itemClasses)) return [] // ✅ Safety check
    if (!searchTerm.trim()) return itemClasses

    return itemClasses.filter(itemClass =>
      itemClass?.zHead2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemClass?.["Control-Head-2"]?.zHead1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemClass?.zHead1Id?.toString().includes(searchTerm) ||
      itemClass?.id?.toString().includes(searchTerm)
    )
  }, [itemClasses, searchTerm])

  // Get form values from refs
  const getFormData = useCallback(() => {
    return {
      zHead2: zHead2Ref.current?.value || '',
      zHead1Id: zHead1IdRef.current?.value ? Number(zHead1IdRef.current.value) : null
    }
  }, [])

  // Clear form
  const clearForm = useCallback(() => {
    if (zHead2Ref.current) zHead2Ref.current.value = ''
    if (zHead1IdRef.current) zHead1IdRef.current.value = ''
    setMessage('')
  }, [])

  // Set form values
  const setFormValues = useCallback((data: any) => {
    if (zHead2Ref.current) zHead2Ref.current.value = data.zHead2 || ''
    if (zHead1IdRef.current) zHead1IdRef.current.value = data.zHead1Id || ''
    setMessage('')
  }, [])

  // Submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = getFormData()
    
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
      clearForm()
      setShowCreateModal(false)
    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Failed to save data')
    } finally {
      setLoading(false)
    }
  }, [createItemClass, getFormData, clearForm])

  // Edit handler
  const handleEditClick = useCallback((itemClass: any) => {
    setFormValues({
      zHead2: itemClass.zHead2,
      zHead1Id: itemClass.zHead1Id
    })
    setEditModal({ isOpen: true, itemClass })
  }, [setFormValues])

  // Update handler
  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = getFormData()
    
    if (!editModal.itemClass || !formData.zHead1Id || !formData.zHead2) {
      setMessage('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      
      await updateItemClass({
        id: editModal.itemClass.id,
        zHead2: formData.zHead2.trim(),
        zHead1Id: formData.zHead1Id
      }).unwrap()

      setMessage('Data updated successfully!')
      setEditModal({ isOpen: false })
      clearForm()
    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Failed to update data')
    } finally {
      setLoading(false)
    }
  }, [editModal.itemClass, updateItemClass, getFormData, clearForm])

  // Delete handlers
  const handleDeleteClick = useCallback((itemClass: any) => {
    setConfirmModal({ isOpen: true, itemClass })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmModal.itemClass) return
    try {
      await deleteItemClass(confirmModal.itemClass.id).unwrap()
      setConfirmModal({ isOpen: false })
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }, [confirmModal.itemClass, deleteItemClass])

  return {
    // Refs
    zHead2Ref,
    zHead1IdRef,
    
    // State
    showCreateModal,
    editModal,
    confirmModal,
    loading,
    message,
    searchTerm,
    
    // ✅ Data with safe defaults
    itemClasses: filteredItemClasses,
    originalItemClasses: itemClasses,
    isLoading,
    error,
    isDeleting,
    
    // Functions
    handleSubmit,
    handleUpdate,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    clearForm,
    setFormValues,
    setSearchTerm,
    setShowCreateModal,
    setEditModal,
    setConfirmModal,
    setMessage: () => setMessage('')
  }
}
