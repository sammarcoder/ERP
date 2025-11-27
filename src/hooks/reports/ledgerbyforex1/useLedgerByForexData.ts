// import { useState, useEffect, useCallback } from 'react'
// import { RawAdvancedRecord, AdvancedFilterOptions } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

// export const useLedgerByForexData = () => {
//   const [rawData, setRawData] = useState<RawAdvancedRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filterOptions, setFilterOptions] = useState<AdvancedFilterOptions>({ acNames: [] })

//   // ✅ Async data processing for better performance
//   const processRawDataAsync = async (data: any[]): Promise<RawAdvancedRecord[]> => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const processed = data.map((record: any) => ({
//           id: record.id || 0,
//           voucherNo: record.voucherNo || '',
//           date: record.date || '',
//           amountDb: parseFloat(record['Journaldetail__amountDb']) || 0,
//           amountCr: parseFloat(record['Journaldetail__amountCr']) || 0,
//           ownDb: parseFloat(record['Journaldetail__ownDb']) || 0,
//           ownCr: parseFloat(record['Journaldetail__ownCr']) || 0,
//           rate: parseFloat(record['Journaldetail__rate']) || 1,
//           isOpening: record.isOpening || false,
//           acName: record['Zcoas - CoaId__acName'] || '',
//           description: record['Journaldetail__description'] || '',
//           receiptNo: record['Journaldetail__recieptNo'] || '',
//           currency: record['Zcurrencies - CurrencyId__currencyName'] || 'PKR'
//         }))
//         resolve(processed)
//       }, 0)
//     })
//   }

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true)
//       console.log('📥 Fetching Ledger by Forex data...')
      
//       const response = await fetch('/api/journalmaster')
//       const result = await response.json()
      
//       if (result.success) {
//         console.log('🔄 Processing ledger data asynchronously...')
        
//         const processed = await processRawDataAsync(result.data)
//         const uniqueAccounts = [...new Set(processed.map(r => r.acName))].filter(Boolean).sort()
        
//         setRawData(processed)
//         setFilterOptions({ acNames: uniqueAccounts })
        
//         console.log('✅ Ledger by Forex data processed:', processed.length, 'records')
//         console.log('🏦 Unique accounts:', uniqueAccounts.length)
//       }
//     } catch (error) {
//       console.error('❌ Error fetching ledger by forex data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   return {
//     rawData,
//     loading,
//     filterOptions,
//     refetch: fetchData
//   }
// }











































import { useState, useEffect, useCallback } from 'react'
import { RawAdvancedRecord, AdvancedFilterOptions } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

export const useLedgerByForexData = () => {
  const [rawData, setRawData] = useState<RawAdvancedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<AdvancedFilterOptions>({ acNames: [] })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      console.log('📥 Fetching Ledger by Forex data...')
      
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (result.success) {
        console.log('🔄 Processing ledger data...')
        
        // ✅ FIXED: Ensure all numeric fields are properly parsed
        const processed = result.data.map((record: any) => ({
          id: record.id || 0,
          voucherNo: record.voucherNo || '',
          date: record.date || '',
          amountDb: parseFloat(record['Journaldetail__amountDb']) || 0,
          amountCr: parseFloat(record['Journaldetail__amountCr']) || 0,
          ownDb: parseFloat(record['Journaldetail__ownDb']) || 0,  // ✅ Ensure proper parsing
          ownCr: parseFloat(record['Journaldetail__ownCr']) || 0,  // ✅ Ensure proper parsing
          rate: parseFloat(record['Journaldetail__rate']) || 1,
          isOpening: record.isOpening || false,
          acName: record['Zcoas - CoaId__acName'] || '',
          description: record['Journaldetail__description'] || '',
          receiptNo: record['Journaldetail__recieptNo'] || '',
          currency: record['Zcurrencies - CurrencyId__currencyName'] || 'PKR'
        }))
        
        setRawData(processed)
        
        // Extract unique accounts
        const uniqueAccounts = [...new Set(processed.map(r => r.acName))].filter(Boolean).sort()
        setFilterOptions({ acNames: uniqueAccounts })
        
        console.log('✅ Ledger by Forex data processed:', {
          records: processed.length,
          accounts: uniqueAccounts.length,
          sampleOwnAmounts: processed.slice(0, 3).map(r => ({ ownDb: r.ownDb, ownCr: r.ownCr }))
        })
      }
    } catch (error) {
      console.error('❌ Error fetching ledger by forex data:', error)
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
