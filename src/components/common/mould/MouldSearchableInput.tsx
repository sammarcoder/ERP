'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useGetMouldsQuery } from '@/store/slice/mouldApi'
import { Box, Search, X, ChevronDown } from 'lucide-react'

interface Mould {
  id: number;
  name: string;
  cycleTime: number;
  totalCavities: number;
  effectiveCavities: number;
  inputMaterial?: { id: number; itemName: string; uom1?: { uom: string } };
  outputMaterials?: Array<{ id: number; itemName: string; uom1?: { uom: string } }>;
}

interface MouldSearchableInputProps {
  label?: string;
  value: number | null;
  onChange: (mouldId: number | null, mould?: Mould) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const MouldSearchableInput: React.FC<MouldSearchableInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search moulds...',
  required = false,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: mouldsData, isLoading } = useGetMouldsQuery({ page: 1, limit: 1000 })
  
  const moulds: Mould[] = mouldsData?.data || []
  
  const filteredMoulds = moulds.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedMould = moulds.find(m => m.id === value)

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

  const handleSelect = (mould: Mould) => {
    onChange(mould.id, mould)
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
          ) : selectedMould ? (
            <div className="flex items-center flex-1">
              <Box className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-gray-900">{selectedMould.name}</span>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {selectedMould.effectiveCavities}/{selectedMould.totalCavities} cavities
              </span>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          
          <div className="flex items-center">
            {selectedMould && !disabled && (
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
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Loading moulds...</div>
            ) : filteredMoulds.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No moulds found</div>
            ) : (
              filteredMoulds.map((mould) => (
                <div
                  key={mould.id}
                  onClick={() => handleSelect(mould)}
                  className={`flex items-center px-4 py-2.5 cursor-pointer hover:bg-purple-50 transition-colors
                    ${value === mould.id ? 'bg-purple-50' : ''}`}
                >
                  <Box className="w-4 h-4 text-purple-600 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{mould.name}</div>
                    <div className="text-xs text-gray-500">
                      Cycle: {mould.cycleTime}s • Cavities: {mould.effectiveCavities}/{mould.totalCavities}
                    </div>
                  </div>
                  {value === mould.id && <div className="w-2 h-2 bg-purple-600 rounded-full"></div>}
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
