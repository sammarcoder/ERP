// hooks/controlHead/useItemClassForm.ts
import { useState, useCallback } from 'react'

interface FormData {
  zHead2: string
  zHead1Id: number | null
}

export const useItemClassForm = (initialData?: FormData) => {
  const [formData, setFormData] = useState<FormData>({
    zHead2: initialData?.zHead2 || '',
    zHead1Id: initialData?.zHead1Id || null
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // ✅ FIXED: Properly memoize handleChange to prevent recreation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === 'zHead1Id' ? (value ? Number(value) : null) : value
    }))

    // ✅ FIXED: Don't clear message on every keystroke - causes re-render
    // if (message) setMessage('')  // ← REMOVE THIS LINE!
  }, []) // ← Empty dependency array = function never changes

  // ✅ NEW: Separate function for clearing messages
  const clearMessage = useCallback(() => {
    setMessage('')
  }, [])

  const resetForm = useCallback(() => {
    setFormData({ zHead2: '', zHead1Id: null })
    setMessage('')
  }, [])

  const setFormValues = useCallback((data: FormData) => {
    setFormData(data)
    setMessage('')
  }, [])

  return {
    formData,
    loading,
    message,
    setLoading,
    setMessage,
    handleChange,     // ✅ Now stable - never recreated
    clearMessage,     // ✅ NEW: For clearing messages separately  
    resetForm,
    setFormValues
  }
}
