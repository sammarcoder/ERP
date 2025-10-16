// // components/common/DateFormat.tsx
// import React from 'react';

// interface DateFormatProps {
//   date: string | Date;
//   className?: string;
//   format?: 'full' | 'short' | 'input';
// }

// const DateFormat: React.FC<DateFormatProps> = ({ 
//   date, 
//   className = '',
//   format = 'short'
// }) => {
//   const formatDate = (inputDate: string | Date, formatType: string): string => {
//     const dateObj = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    
//     if (isNaN(dateObj.getTime())) {
//       return 'Invalid Date';
//     }

//     const day = String(dateObj.getDate()).padStart(2, '0');
//     const months = [
//       'jan', 'feb', 'mar', 'apr', 'may', 'jun',
//       'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
//     ];
//     const month = months[dateObj.getMonth()];
//     const year = String(dateObj.getFullYear()).slice(-2); // Last 2 digits
    
//     switch (formatType) {
//       case 'full':
//         return `${day}/${month}/${dateObj.getFullYear()}`; // 01/oct/2025
//       case 'input':
//         // For input fields - return ISO format
//         return dateObj.toISOString().split('T')[0];
//       case 'short':
//       default:
//         return `${day}/${month}/${year}`; // 01/oct/25
//     }
//   };

//   const formattedDate = formatDate(date, format);

//   return (
//     <span className={`font-mono ${className}`} title={new Date(date).toLocaleDateString()}>
//       {formattedDate}
//     </span>
//   );
// };

// // Utility function for components that need date formatting
// export const formatDateString = (date: string | Date, format: 'full' | 'short' | 'input' = 'short'): string => {
//   const dateObj = typeof date === 'string' ? new Date(date) : date;
  
//   if (isNaN(dateObj.getTime())) {
//     return 'Invalid Date';
//   }

//   const day = String(dateObj.getDate()).padStart(2, '0');
//   const months = [
//     'jan', 'feb', 'mar', 'apr', 'may', 'jun',
//     'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
//   ];
//   const month = months[dateObj.getMonth()];
//   const year = String(dateObj.getFullYear()).slice(-2);
  
//   switch (format) {
//     case 'full':
//       return `${day}/${month}/${dateObj.getFullYear()}`;
//     case 'input':
//       return dateObj.toISOString().split('T')[0];
//     case 'short':
//     default:
//       return `${day}/${month}/${year}`;
//   }
// };

// // Date input component with custom format display
// export const DateInput: React.FC<{
//   value: string;
//   onChange: (value: string) => void;
//   className?: string;
//   placeholder?: string;
//   label?: string;
// }> = ({ value, onChange, className = '', placeholder, label }) => {
//   return (
//     <div className="flex flex-col">
//       {label && (
//         <label className="text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//       )}
//       <div className="relative">
//         <input
//           type="date"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
//           placeholder={placeholder}
//         />
//         {value && (
//           <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-white px-2 pointer-events-none">
//             <DateFormat date={value} format="short" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DateFormat;



























// components/common/DateFormat.tsx - FIXED
import React from 'react';

interface DateFormatProps {
  date: string | Date;
  className?: string;
  format?: 'full' | 'short' | 'input';
}

const DateFormat: React.FC<DateFormatProps> = ({ 
  date, 
  className = '',
  format = 'short'
}) => {
  const formatDate = (inputDate: string | Date, formatType: string): string => {
    const dateObj = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const months = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    const month = months[dateObj.getMonth()];
    const year = String(dateObj.getFullYear()).slice(-2); // Last 2 digits
    
    switch (formatType) {
      case 'full':
        return `${day}/${month}/${dateObj.getFullYear()}`; // 11/oct/2025
      case 'input':
        return dateObj.toISOString().split('T')[0];
      case 'short':
      default:
        return `${day}/${month}/${year}`; // ✅ FIXED: 11/oct/25 (not 10/11/25)
    }
  };

  const formattedDate = formatDate(date, format);

  return (
    <span className={`font-mono ${className}`} title={new Date(date).toLocaleDateString()}>
      {formattedDate}
    </span>
  );
};

export default DateFormat;
