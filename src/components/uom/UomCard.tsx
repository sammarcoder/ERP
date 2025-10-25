'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import { Uom } from '@/types/uom'
import { Button } from '@/components/ui/Button'

interface UomCardProps {
  uom: Uom
  onEdit: (uom: Uom) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export const UomCard: React.FC<UomCardProps> = ({
  uom,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {uom.uom}
          </h3>
          <p className="text-sm text-gray-500">
            ID: {uom.id}
          </p>
          {uom.createdAt && (
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(uom.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(uom)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(uom.id)}
            loading={isDeleting}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
