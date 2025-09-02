'use client'

import React from 'react'

interface DropdownProps {
  label: string;
  name: string;
  value: number | null;
  onChange: (name: string, value: number | null | string) => void;
  options: Array<{ id: number; label: string }>;
  placeholder?: string;
  required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(name, e.target.value ? Number(e.target.value) : null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
