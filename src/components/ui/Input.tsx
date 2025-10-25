// 'use client'
// import React from 'react'
// import { motion } from 'framer-motion'
// import { clsx } from 'clsx'
// // import a from './test.jsx'

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string
//   error?: string
//   helperText?: string
// }

// export const Input: React.FC<InputProps> = ({
//   label,
//   error,
//   helperText,
//   className,
//   ...props
// }) => {

//     // console.log(a)
//   return (
//     <div className="space-y-1">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label }
//         </label>
//       )}
      
//       <motion.input
//         initial={{ scale: 1 }}
//         focusWithin={{ scale: 1.01 }}
//         className={clsx(
//           'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm',
//           'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
//           'transition-colors duration-200',
//           error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
//           className
//         )}
//         {...props}
//       />
      
//       {error && (
//         <motion.p
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-sm text-red-600"
//         >
//           {error}
//         </motion.p>
//       )}
      
//       {helperText && !error && (
//         <p className="text-sm text-gray-500">{helperText}</p>
//       )}
//     </div>
//   )
// }












































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
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  status = 'default',
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const currentStatus = error ? 'error' : status

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={clsx(
              'transition-colors duration-200',
              isFocused ? 'text-[#509ee3]' : 'text-gray-400'
            )}>
              {icon}
            </div>
          </div>
        )}

        <motion.input
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.01 }}
          className={clsx(
            'block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200',
            'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#509ee3] focus:border-[#509ee3]',
            currentStatus === 'error' && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            currentStatus === 'success' && 'border-green-300 focus:ring-green-500 focus:border-green-500',
            currentStatus === 'default' && 'border-gray-300',
            icon && 'pl-10',
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />

        {currentStatus !== 'default' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
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
