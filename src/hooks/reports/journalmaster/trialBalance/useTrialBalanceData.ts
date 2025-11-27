import { useState, useEffect, useCallback } from 'react'
import { RawJournalRecord, TrialBalanceFilterOptions } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

export const useTrialBalanceData = () => {
  const [rawData, setRawData] = useState<RawJournalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<TrialBalanceFilterOptions>({ acNames: [] })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (result.success) {
        console.log('📥 Raw Data fetched for Trial Balance:', result.data.length, 'records')
        
        // Process raw data to our format
        const processed = result.data.map((record: any) => ({
          id: record.id || 0,
          date: record.date || '',
          voucherNo: record.voucherNo || '',
          amountDb: parseFloat(record['Journaldetail__amountDb']) || 0,
          amountCr: parseFloat(record['Journaldetail__amountCr']) || 0,
          isOpening: record.isOpening || false,
          acName: record['Zcoas - CoaId__acName'] || '',
          description: record['Journaldetail__description'] || ''
        }))

        setRawData(processed)
        
        // Extract unique account names for filters
        const uniqueAccounts = [...new Set(processed.map(r => r.acName))].filter(Boolean).sort()
        setFilterOptions({ acNames: uniqueAccounts })
        
        console.log('✅ Processed trial balance data:', processed.length, 'records')
        console.log('🏦 Unique accounts found:', uniqueAccounts.length)
      }
    } catch (error) {
      console.error('❌ Error fetching trial balance data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    rawData,
    loading,
    filterOptions,
    refetch: fetchData
  }
}
