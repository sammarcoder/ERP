
export const formatDisplayDate = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  
  try {
    let dateObj: Date
    
    if (typeof date === 'string') {
      // Handle YYYY-MM-DD format from inputs
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-')
        dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      } else {
        dateObj = new Date(date)
      }
    } else {
      dateObj = date
    }
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear().toString().slice(-2)
    
    return `${day}/${month}/${year}`
  } catch (error) {
    return ''
  }
}

/**
 * Format amount to American format (10,000,000.00)
 */
export const formatAmount = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '0.00'
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) return '0.00'
  
  const rounded = Math.round(numAmount * 100) / 100
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rounded)
}

/**
 * Parse amount from formatted string
 */
export const parseAmount = (value: string): number => {
  if (!value) return 0
  const cleaned = value.replace(/[,$]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatInputDate = (date: string | Date | null | undefined): string => {
  if (!date) return new Date().toISOString().split('T')[0]
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    return dateObj.toISOString().split('T')[0]
  } catch (error) {
    return new Date().toISOString().split('T')[0]
  }
}

/**
 * Convert DD/MMM/YY to YYYY-MM-DD
 */
export const parseDateInput = (dateStr: string): string => {
  if (!dateStr) return ''
  
  try {
    // Handle DD/MMM/YY format
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const [day, monthStr, yearStr] = parts
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = months.findIndex(m => m.toLowerCase() === monthStr.toLowerCase())
      
      if (monthIndex !== -1) {
        const fullYear = yearStr.length === 2 ? `20${yearStr}` : yearStr
        const monthNum = (monthIndex + 1).toString().padStart(2, '0')
        const dayNum = day.padStart(2, '0')
        
        return `${fullYear}-${monthNum}-${dayNum}`
      }
    }
    
    return dateStr
  } catch (error) {
    return dateStr
  }
}

















































