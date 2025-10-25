


'use client'
import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/Input'
import { Calendar } from 'lucide-react'

interface DateInputProps {
  label?: string
  name: string
  value: string // YYYY-MM-DD format
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  placeholder?: string
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder = "DD/MMM/YY"
}) => {
  const [displayValue, setDisplayValue] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef<HTMLInputElement>(null)

  // Convert YYYY-MM-DD to DD/MMM/YY for display
  const formatToDisplay = (dateStr: string): string => {
    if (!dateStr) return ''
    
    try {
      const [year, month, day] = dateStr.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthName = months[parseInt(month) - 1]
      const yearShort = year.slice(-2)
      
      return `${day}/${monthName}/${yearShort}`
    } catch (error) {
      return dateStr
    }
  }

  // Convert DD/MMM/YY back to YYYY-MM-DD
  const parseFromDisplay = (displayStr: string): string => {
    if (!displayStr) return ''
    
    try {
      // Handle different separators
      const parts = displayStr.replace(/[\/\-\.]/g, '/').split('/')
      if (parts.length !== 3) return ''
      
      const [day, monthStr, yearStr] = parts
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = months.findIndex(m => m.toLowerCase() === monthStr.toLowerCase())
      
      if (monthIndex === -1) return ''
      
      const fullYear = yearStr.length === 2 ? `20${yearStr}` : yearStr
      const monthNum = (monthIndex + 1).toString().padStart(2, '0')
      const dayNum = day.padStart(2, '0')
      
      return `${fullYear}-${monthNum}-${dayNum}`
    } catch (error) {
      return ''
    }
  }

  // Initialize display value
  React.useEffect(() => {
    setDisplayValue(formatToDisplay(value))
  }, [value])

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    // Try to parse and convert to YYYY-MM-DD
    const parsedDate = parseFromDisplay(inputValue)
    if (parsedDate) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, name, value: parsedDate }
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    setDisplayValue(formatToDisplay(selectedDate))
    setShowDatePicker(false)
    
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name, value: selectedDate }
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  return (
    <div className="relative">
      <div className="flex">
        <div className="flex-1">
          <Input
            label={label}
            name={name}
            value={displayValue}
            onChange={handleDisplayChange}
            error={error}
            placeholder={placeholder}
            required={required}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowDatePicker(true)}
          className="ml-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
          title="Open date picker"
        >
          <Calendar className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Hidden date picker */}
      {showDatePicker && (
        <div className="absolute top-full left-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
          <input
            ref={datePickerRef}
            type="date"
            value={value}
            onChange={handleDatePickerChange}
            className="border-0 focus:ring-0 focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowDatePicker(false)}
            className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
