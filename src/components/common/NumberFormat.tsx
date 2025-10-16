// components/common/NumberFormat.tsx
import React from 'react';

interface NumberFormatProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  showZero?: boolean;
}

const NumberFormat: React.FC<NumberFormatProps> = ({ 
  value, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 2,
  showZero = true
}) => {
  const formatNumber = (num: number): string => {
    if (num === 0 && !showZero) return '';
    
    // Round up as requested (American standard)
    const roundedValue = Math.ceil(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    
    // Format with commas and specified decimal places
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(roundedValue);
  };

  const formattedValue = formatNumber(value);

  if (value === 0 && !showZero) {
    return <span className={className}>-</span>;
  }

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

// Currency component specifically for money values
export const CurrencyFormat: React.FC<{
  value: number;
  className?: string;
  showCurrency?: boolean;
  color?: 'default' | 'success' | 'danger' | 'warning';
}> = ({ value, className = '', showCurrency = true, color = 'default' }) => {
  const colorClasses = {
    default: 'text-gray-900',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
  };

  return (
    <NumberFormat 
      value={value}
      prefix={showCurrency ? '₨' : ''}
      className={`${colorClasses[color]} ${className}`}
      decimals={2}
    />
  );
};

// Percentage component
export const PercentageFormat: React.FC<{
  value: number;
  className?: string;
  decimals?: number;
}> = ({ value, className = '', decimals = 1 }) => {
  return (
    <NumberFormat 
      value={value}
      suffix="%"
      className={className}
      decimals={decimals}
      showZero={true}
    />
  );
};

// Utility functions for use in calculations
export const formatCurrency = (value: number): string => {
  const roundedValue = Math.ceil(value * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedValue);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  const roundedValue = Math.ceil(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(roundedValue);
};

// Input component for number entry with formatting
export const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
}> = ({ 
  value, 
  onChange, 
  className = '', 
  placeholder, 
  prefix = '', 
  suffix = '',
  min,
  max,
  step = 0.01,
  decimals = 2
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value) || 0;
    const roundedValue = Math.ceil(inputValue * Math.pow(10, decimals)) / Math.pow(10, decimals);
    onChange(roundedValue);
  };

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-mono">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={`${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${className}`}
        placeholder={placeholder}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-mono">
          {suffix}
        </span>
      )}
    </div>
  );
};

export default NumberFormat;
