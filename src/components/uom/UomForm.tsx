'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCreateUomMutation, useUpdateUomMutation } from '@/lib/redux/api/uomApi'
import { Uom } from '@/types/uom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface UomFormProps {
  editingUom?: Uom | null
  onSuccess: () => void
  onCancel: () => void
}

export const UomForm: React.FC<UomFormProps> = ({
  editingUom,
  onSuccess,
  onCancel
}) => {
  const [uomName, setUomName] = useState('')
  const [error, setError] = useState('')

  const [createUom, { isLoading: isCreating }] = useCreateUomMutation()
  const [updateUom, { isLoading: isUpdating }] = useUpdateUomMutation()

  const isEditing = !!editingUom
  const isLoading = isCreating || isUpdating

  // Populate form when editing
  useEffect(() => {
    if (editingUom) {
      setUomName(editingUom.uom)
    } else {
      setUomName('')
    }
    setError('')
  }, [editingUom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uomName.trim()) {
      setError('UOM name is required')
      return
    }

    try {
      if (isEditing) {
        await updateUom({
          id: editingUom.id,
          uom: uomName.trim()
        }).unwrap()
      } else {
        await createUom({
          uom: uomName.trim()
        }).unwrap()
      }
      
      setUomName('')
      setError('')
      onSuccess()
    } catch (err: any) {
      setError(err?.data?.error || 'Something went wrong')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="UOM Name"
        placeholder="Enter unit of measure (e.g., Pieces, Kg, Liter)"
        value={uomName}
        onChange={(e) => setUomName(e.target.value)}
        error={error}
        helperText="Enter a descriptive name for the unit of measure"
        autoFocus
      />

      <div className="flex space-x-3">
        <Button
          type="submit"
          loading={isLoading}
          className="flex-1"
        >
          {isEditing ? 'Update UOM' : 'Create UOM'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}
