import { useState, useCallback } from 'react'
import { Transaction, FilterParams, AgedAccountsResult } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'
import { AgedAccountsProcessor } from '@/utils/reports/journalmaster/agedreports/agedAccountsProcessor'

export const useAgedAccounts = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AgedAccountsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const processor = new AgedAccountsProcessor()
  
  const processReport = useCallback(async (transactions: Transaction[], filterParams: FilterParams) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = processor.processAgedAccounts(transactions, filterParams)
      setResult(result)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [processor])
  
  return {
    loading,
    result,
    error,
    processReport
  }
}
