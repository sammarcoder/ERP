'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useGetEmployeesQuery } from '@/store/slice/employeeApi'
import { User, Search, X, ChevronDown } from 'lucide-react'

interface Employee {
  id: number;
  employeeName: string;
  phone: string;
  department?: { id: number; departmentName: string };
}

interface EmployeeSearchableInputProps {
  label?: string;
  value: number | null;
  onChange: (employeeId: number | null, employee?: Employee) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const EmployeeSearchableInput: React.FC<EmployeeSearchableInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search employees...',
  required = false,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: employeesData, isLoading } = useGetEmployeesQuery({ page: 1, limit: 1000 })
  
  const employees: Employee[] = employeesData?.data || []
  
  const filteredEmployees = employees.filter(e =>
    e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedEmployee = employees.find(e => e.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (employee: Employee) => {
    onChange(employee.id, employee)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setSearchTerm('')
  }

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div
          onClick={handleInputClick}
          className={`
            flex items-center justify-between w-full rounded-xl border px-4 py-2.5 text-sm cursor-pointer
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm hover:border-gray-400'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isOpen ? 'ring-2 ring-blue-500/50 border-blue-500' : ''}
          `}
        >
          {isOpen ? (
            <div className="flex items-center flex-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="flex-1 outline-none bg-transparent"
                disabled={disabled}
              />
            </div>
          ) : selectedEmployee ? (
            <div className="flex items-center flex-1">
              <User className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-gray-900">{selectedEmployee.employeeName}</span>
              {selectedEmployee.department && (
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {selectedEmployee.department.departmentName}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          
          <div className="flex items-center">
            {selectedEmployee && !disabled && (
              <button type="button" onClick={handleClear} className="p-1 hover:bg-gray-100 rounded mr-1">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Loading employees...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No employees found</div>
            ) : (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
                  className={`flex items-center px-4 py-2.5 cursor-pointer hover:bg-green-50 transition-colors
                    ${value === employee.id ? 'bg-green-50' : ''}`}
                >
                  <User className="w-4 h-4 text-green-600 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                    <div className="text-xs text-gray-500">{employee.phone || 'No phone'}</div>
                  </div>
                  {value === employee.id && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
