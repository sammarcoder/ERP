// components/dispatch/GDNListActions.tsx - EXAMPLE USAGE
import React from 'react'
import { useDeleteGDNMutation } from '@/store/slice/gdnApi'
import { Trash2 } from 'lucide-react'

const GDNListActions = ({ gdnId, gdnNumber, onSuccess }) => {
  const [deleteGDN, { isLoading }] = useDeleteGDNMutation()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete GDN ${gdnNumber}?\n\nThis will:\n- Remove the dispatch record\n- Reset source order status\n- Make order available for dispatch again`)) {
      return
    }

    try {
      const result = await deleteGDN(gdnId).unwrap()
      
      alert(`GDN ${gdnNumber} deleted successfully!${result.data.orderBackInGDNList ? '\n\nSource order is now back in Ready for GDN list.' : ''}`)
      
      if (onSuccess) {
        onSuccess(result)
      }
      
    } catch (error) {
      console.error('Delete failed:', error)
      alert(`Failed to delete GDN: ${error?.data?.error || error.message}`)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export default GDNListActions
