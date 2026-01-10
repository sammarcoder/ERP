



'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  status?: 'default' | 'error' | 'success'
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '86'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  status = 'default',
  variant = 'default',
  size = 'md',
  maxWidth,
  className,
  type,
  value,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  // ✅ Status variants
  const statuses = {
    default: 'border-gray-300 focus:ring-[#509ee3] focus:border-[#509ee3]',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-300 focus:ring-green-500 focus:border-green-500'
  }

  // ✅ Input variants
  const variants = {
    default: 'bg-white border',
    filled: 'bg-gray-50 border-0 focus:bg-white focus:ring-2',
    outlined: 'bg-transparent border-2'
  }

  // ✅ Size variants
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  // ✅ Max width variants
  const maxWidths = {
    sm: 'max-w-xs',      // 20rem
    md: 'max-w-sm',      // 24rem
    lg: 'max-w-md',      // 28rem
    xl: 'max-w-lg',      // 32rem
    '86': 'max-w-86'     // Custom 86
  }

  const currentStatus = error ? 'error' : status

  // ✅ Simple date formatting
  const getDateDisplay = (dateValue: string) => {
    if (!dateValue) return ''
    try {
      const date = new Date(dateValue)
      const day = date.getDate()
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear().toString().slice(-2)
      return `${day}/${month}/${year}`
    } catch {
      return ''
    }
  }

  // ✅ Simple amount formatting
  const getAmountDisplay = (amountValue: string) => {
    if (!amountValue) return ''
    const num = parseFloat(amountValue as string)
    return isNaN(num) ? '' : num.toLocaleString('en-US')
  }

  // ✅ Get display value
  const getDisplayValue = () => {
    if (type === 'date') return getDateDisplay(value as string)
    if (type === 'amount') return getAmountDisplay(value as string)
    return ''
  }

  const displayValue = getDisplayValue()

  return (
    <div className={clsx('space-y-1', maxWidth && maxWidths[maxWidth])}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className={clsx(
              'transition-colors duration-200',
              isFocused ? 'text-[#509ee3]' : 'text-gray-400'
            )}>
              {icon}
            </div>
          </div>
        )}

        {/* ✅ Native input */}
        <motion.input
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.01 }}
          className={clsx(
            'block w-full rounded-lg shadow-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:ring-1',
            variants[variant],
            statuses[currentStatus],
            sizes[size],
            icon && 'pl-10',
            type === 'amount' && 'text-right',
            // ✅ Hide text when showing formatted overlay
            (type === 'date' || type === 'amount') && displayValue && 'text-transparent',
            className
          )}
          type={type}
          value={value}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
            props.onBlur?.(e)
          }}
          {...props}
        />

        {/* ✅ Format overlay - shows immediately when value exists */}
        {displayValue && (
          <div className={clsx(
            'absolute inset-y-0 left-0 flex items-center pointer-events-none',
            sizes[size],
            icon && 'pl-10',
            type === 'amount' && 'right-0 justify-end pr-4',
            type === 'date' && 'justify-start'
          )}>
            <span className="text-gray-900">{displayValue}</span>
          </div>
        )}

        {currentStatus !== 'default' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
            {currentStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
            {currentStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
