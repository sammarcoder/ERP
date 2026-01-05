// hooks/useItemClassModals.ts
import { useState, useCallback } from 'react'
import { ItemClass } from '@/types/itemsClass'

export const useItemClassModals = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editModal, setEditModal] = useState<{ isOpen: boolean; itemClass?: ItemClass }>({ isOpen: false })
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; itemClass?: ItemClass }>({ isOpen: false })

  const openCreateModal = useCallback(() => {
    setShowCreateModal(true)
  }, [])

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  const openEditModal = useCallback((itemClass: ItemClass) => {
    setEditModal({ isOpen: true, itemClass })
  }, [])

  const closeEditModal = useCallback(() => {
    setEditModal({ isOpen: false })
  }, [])

  const openConfirmModal = useCallback((itemClass: ItemClass) => {
    setConfirmModal({ isOpen: true, itemClass })
  }, [])

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false })
  }, [])

  return {
    showCreateModal,
    editModal,
    confirmModal,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openConfirmModal,
    closeConfirmModal
  }
}
