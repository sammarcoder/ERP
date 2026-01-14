'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useGetMachinesQuery } from '@/store/slice/machineApi'
import { Settings, Search, X, ChevronDown } from 'lucide-react'

interface Machine {
  id: number;
  name: string;
  function: string;
}

interface MachineSearchableInputProps {
  label?: string;
  value: number | null;
  onChange: (machineId: number | null, machine?: Machine) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const MachineSearchableInput: React.FC<MachineSearchableInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search machines...',
  required = false,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: machinesData, isLoading } = useGetMachinesQuery({ page: 1, limit: 1000 })
  
  const machines: Machine[] = machinesData?.data || []
  
  const filteredMachines = machines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.function.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedMachine = machines.find(m => m.id === value)

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

  const handleSelect = (machine: Machine) => {
    onChange(machine.id, machine)
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
          ) : selectedMachine ? (
            <div className="flex items-center flex-1">
              <Settings className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-900">{selectedMachine.name}</span>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {selectedMachine.function}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          
          <div className="flex items-center">
            {selectedMachine && !disabled && (
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
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Loading machines...</div>
            ) : filteredMachines.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No machines found</div>
            ) : (
              filteredMachines.map((machine) => (
                <div
                  key={machine.id}
                  onClick={() => handleSelect(machine)}
                  className={`flex items-center px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors
                    ${value === machine.id ? 'bg-blue-50' : ''}`}
                >
                  <Settings className="w-4 h-4 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{machine.name}</div>
                    <div className="text-xs text-gray-500">{machine.function}</div>
                  </div>
                  {value === machine.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
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
