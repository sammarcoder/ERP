// import { useState, useEffect, useCallback } from 'react'
// import { JournalRecord, ProcessedRecord, FilterState, FilterOptions } from '@/types/reports/journalmaster/JournalTypes'

// export const useJournalData = () => {
//   const [rawData, setRawData] = useState<JournalRecord[]>([])
//   const [processedData, setProcessedData] = useState<ProcessedRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filterOptions, setFilterOptions] = useState<FilterOptions>({ acNames: [] })

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/journalmaster')
//       const result = await response.json()
      
//       if (result.success) {
//         setRawData(result.data)
        
//         // Extract unique account names for dropdown filter
//         const uniqueAcNames = [...new Set(
//           result.data.map((record: JournalRecord) => record['Zcoas - CoaId__acName'])
//         )].filter(Boolean).sort()
        
//         setFilterOptions({ acNames: uniqueAcNames })
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const processOpeningBalances = useCallback(() => {
//     const processedRecords: ProcessedRecord[] = []
    
//     // Group records by voucher number
//     const groupedByVoucher = rawData.reduce((acc, record) => {
//       const voucherNo = record.voucherNo
//       if (!acc[voucherNo]) {
//         acc[voucherNo] = []
//       }
//       acc[voucherNo].push(record)
//       return acc
//     }, {} as Record<string, JournalRecord[]>)

//     Object.keys(groupedByVoucher).forEach(voucherNo => {
//       const voucherRecords = groupedByVoucher[voucherNo]
//       const firstRecord = voucherRecords[0]

//       if (firstRecord.isOpening) {
//         // ✅ Opening Balance: Combine all debits and credits
//         const totalDebit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__amountDb'] || 0), 0)
//         const totalCredit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__amountCr'] || 0), 0)
//         const totalOwnDebit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__ownDb'] || 0), 0)
//         const totalOwnCredit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__ownCr'] || 0), 0)

//         processedRecords.push({
//           id: firstRecord.id,
//           voucherNo: firstRecord.voucherNo,
//           date: firstRecord.date,
//           description: 'Balance B/F',
//           amountDb: totalDebit,
//           amountCr: totalCredit,
//           ownDb: totalOwnDebit,
//           ownCr: totalOwnCredit,
//           rate: '',
//           receiptNo: '',
//           currency: voucherRecords.find(r => r['Zcurrencies - CurrencyId__currencyName'])?.['Zcurrencies - CurrencyId__currencyName'] || '',
//           isOpening: true,
//           acName: 'Opening Balance Entry',
//           balance: 0 // Will be calculated later
//         })
//       } else {
//         // ✅ Regular entries: Process individually
//         voucherRecords.forEach(record => {
//           processedRecords.push({
//             id: record.id,
//             voucherNo: record.voucherNo,
//             date: record.date,
//             description: record['Journaldetail__description'] || '',
//             amountDb: record['Journaldetail__amountDb'] || 0,
//             amountCr: record['Journaldetail__amountCr'] || 0,
//             ownDb: record['Journaldetail__ownDb'] || 0,
//             ownCr: record['Journaldetail__ownCr'] || 0,
//             rate: record['Journaldetail__rate'] || 0,
//             receiptNo: record['Journaldetail__recieptNo'] || '',
//             currency: record['Zcurrencies - CurrencyId__currencyName'] || '',
//             isOpening: false,
//             acName: record['Zcoas - CoaId__acName'] || '',
//             balance: 0 // Will be calculated later
//           })
//         })
//       }
//     })

//     setProcessedData(processedRecords)
//   }, [rawData])

//   useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   useEffect(() => {
//     processOpeningBalances()
//   }, [processOpeningBalances])

//   return {
//     rawData,
//     processedData,
//     loading,
//     filterOptions,
//     refetch: fetchData
//   }
// }























import { useState, useEffect, useCallback } from 'react'
import { ProcessedRecord, FilterOptions } from '@/types/reports/journalmaster/JournalTypes'

export const useJournalData = () => {
  const [rawData, setRawData] = useState<any[]>([])
  const [processedData, setProcessedData] = useState<ProcessedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ acNames: [] })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (result.success) {
        console.log('📥 Raw Data fetched:', result.data.length, 'records')
        setRawData(result.data)
        
        // Extract unique account names using correct field name
        const uniqueAcNames = [...new Set(
          result.data.map((record: any) => record['Zcoas - CoaId__acName'])
        )].filter(Boolean).sort()
        
        console.log('🏦 Unique accounts found:', uniqueAcNames.length)
        setFilterOptions({ acNames: uniqueAcNames })
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const processData = useCallback(() => {
    if (!rawData.length) return

    console.log('🔄 Processing', rawData.length, 'raw records with CORRECT field mapping')
    
    const processed = rawData.map((record, index) => ({
      id: record.id || index,
      voucherNo: record.voucherNo || '',
      date: record.date || '',
      // ✅ Using CORRECT field names with double underscores
      description: record['Journaldetail__description'] || '',
      amountDb: parseFloat(record['Journaldetail__amountDb']) || 0,
      amountCr: parseFloat(record['Journaldetail__amountCr']) || 0,
      ownDb: parseFloat(record['Journaldetail__ownDb']) || 0,
      ownCr: parseFloat(record['Journaldetail__ownCr']) || 0,
      rate: parseFloat(record['Journaldetail__rate']) || 0,
      receiptNo: record['Journaldetail__recieptNo'] || '',
      currency: record['Zcurrencies - CurrencyId__currencyName'] || 'PKR',
      isOpening: record.isOpening || false,
      acName: record['Zcoas - CoaId__acName'] || '',
      balance: 0 // Will be calculated after filtering
    }))

    // Sort by date for proper chronological order
    processed.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateA.getTime() - dateB.getTime()
      }
      return a.id - b.id
    })

    console.log('✅ Processed', processed.length, 'records')
    console.log('💰 Sample amounts:', processed.slice(0, 3).map(r => ({
      debit: r.amountDb,
      credit: r.amountCr,
      description: r.description
    })))
    
    setProcessedData(processed)
  }, [rawData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    processData()
  }, [processData])

  return {
    processedData,
    loading,
    filterOptions,
    refetch: fetchData
  }
}

