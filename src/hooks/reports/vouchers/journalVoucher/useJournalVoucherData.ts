import { useState, useEffect, useCallback } from 'react'
import { RawJournalVoucherRecord, JournalVoucherFilterOptions } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'
import { VOUCHER_TYPES } from '@/constants/voucherTypes'

export const useJournalVoucherData = () => {
  const [rawData, setRawData] = useState<RawJournalVoucherRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<JournalVoucherFilterOptions>({ 
    voucherTypes: VOUCHER_TYPES,
    availableVoucherNos: [] 
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (result.success) {
        console.log('📥 Raw Journal Voucher Data fetched:', result.data.length, 'records')
        
        // Process raw data to journal voucher format
        const processed = result.data.map((record: any) => ({
          id: record.id || 0,
          voucherNo: record.voucherNo || '',
          voucherTypeId: record.voucherTypeId || 0,
          date: record.date || '',
          amountDb: parseFloat(record['Journaldetail__amountDb']) || 0,
          amountCr: parseFloat(record['Journaldetail__amountCr']) || 0,
          ownDb: parseFloat(record['Journaldetail__ownDb']) || 0,
          ownCr: parseFloat(record['Journaldetail__ownCr']) || 0,
          rate: parseFloat(record['Journaldetail__rate']) || 1,
          acName: record['Zcoas - CoaId__acName'] || '',
          description: record['Journaldetail__description'] || '',
          receiptNo: record['Journaldetail__recieptNo'] || '',
          currencyName: record['Zcurrencies - CurrencyId__currencyName'] || 'PKR'
        }))

        console.log('🔍 Sample descriptions before filtering:', processed.slice(0, 5).map(r => `"${r.description}"`))

        // ✅ ENHANCED Filter: Handle various cases of "Auto Balancing Entry"
        const filteredProcessed = processed.filter(record => {
          const description = record.description?.trim() || ''
          const isAutoBalancing = 
            description === "Auto Balancing Entry" ||
            description === "auto balancing entry" ||
            description.toLowerCase() === "auto balancing entry" ||
            description.includes("Auto Balancing Entry") ||
            description.includes("auto balancing entry")
          
          if (isAutoBalancing) {
            console.log(`🚫 Filtering out record with description: "${description}"`)
          }
          
          return !isAutoBalancing
        })

        console.log(`🚫 Filtered out Auto Balancing Entry: ${filteredProcessed.length} records (removed ${processed.length - filteredProcessed.length})`)

        setRawData(filteredProcessed)
        
        // Extract unique voucher numbers for autocomplete
        const uniqueVoucherNos = [...new Set(filteredProcessed.map(r => r.voucherNo))].filter(Boolean).sort()
        
        setFilterOptions({
          voucherTypes: VOUCHER_TYPES,
          availableVoucherNos: uniqueVoucherNos
        })
        
        console.log('✅ Processed journal voucher data:', filteredProcessed.length, 'records')
        console.log('🎫 Unique voucher numbers found:', uniqueVoucherNos.length)
      }
    } catch (error) {
      console.error('❌ Error fetching journal voucher data:', error)
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
