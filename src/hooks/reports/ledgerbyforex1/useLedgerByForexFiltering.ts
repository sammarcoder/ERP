// import { useMemo, useState } from 'react' // ✅ Fixed: Added useState import
// import { AdvancedProcessedRecord, AdvancedFilterState, AdvancedFilterResult, RawAdvancedRecord } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

// export const useLedgerByForexFiltering = (
//   rawData: RawAdvancedRecord[], 
//   filters: AdvancedFilterState
// ): AdvancedFilterResult => {
  
//   // ✅ Fixed: Properly handle async result with useState
//   const [asyncResult, setAsyncResult] = useState<AdvancedFilterResult>({
//     calculationData: [],
//     displayData: [],
//     systemRowInfo: { 
//       totalOpeningRecords: 0, 
//       openingBalance: 0,
//       openingOwnBalance: 0,
//       systemRowGenerated: false,
//       displayBalance: 0,
//       displayOwnBalance: 0,
//       calculationBalance: 0,
//       calculationOwnBalance: 0,
//       lastHiddenRowIndex: 0,
//       aboveRowBalance: 0,
//       aboveRowOwnBalance: 0
//     },
//     filteringStats: { 
//       originalCount: 0, 
//       afterDataFilters: 0, 
//       afterDateFilter: 0, 
//       hiddenByDate: 0,
//       firstDisplayRowIndex: 0
//     }
//   })

//   const result = useMemo(() => {
//     const processData = async () => {
//       if (!rawData.length || !filters.acName) { // ✅ Account filter mandatory
//         return {
//           calculationData: [],
//           displayData: [],
//           systemRowInfo: { 
//             totalOpeningRecords: 0, 
//             openingBalance: 0,
//             openingOwnBalance: 0,
//             systemRowGenerated: false,
//             displayBalance: 0,
//             displayOwnBalance: 0,
//             calculationBalance: 0,
//             calculationOwnBalance: 0,
//             lastHiddenRowIndex: 0,
//             aboveRowBalance: 0,
//             aboveRowOwnBalance: 0
//           },
//           filteringStats: { 
//             originalCount: 0, 
//             afterDataFilters: 0, 
//             afterDateFilter: 0, 
//             hiddenByDate: 0,
//             firstDisplayRowIndex: 0
//           }
//         }
//       }

//       console.log('🚀 Ledger by Forex processing with mandatory account filter:', filters.acName)

//       // ✅ Async filtering for better performance
//       const applyFiltersAsync = async (data: RawAdvancedRecord[]): Promise<RawAdvancedRecord[]> => {
//         return new Promise(resolve => {
//           setTimeout(() => {
//             let filteredData = [...data]

//             // Mandatory account filter
//             filteredData = filteredData.filter(record => record.acName === filters.acName)
//             console.log(`🏦 Account filter (${filters.acName}): ${filteredData.length} records`)

//             // Other filters
//             if (filters.description) {
//               filteredData = filteredData.filter(record => 
//                 record.description.toLowerCase().includes(filters.description.toLowerCase())
//               )
//             }

//             if (filters.entryType === 'credit_only') {
//               filteredData = filteredData.filter(record => record.amountCr > 0)
//             } else if (filters.entryType === 'debit_only') {
//               filteredData = filteredData.filter(record => record.amountDb > 0)
//             }

//             resolve(filteredData)
//           }, 0)
//         })
//       }

//       const filteredData = await applyFiltersAsync(rawData)
//       const afterDataFiltersCount = filteredData.length

//       // ✅ STEP 2: Generate System Row with Both Balances
//       const openingRecords = filteredData.filter(record => record.isOpening)
//       const regularRecords = filteredData.filter(record => !record.isOpening)

//       const totalOpeningDebit = openingRecords.reduce((sum, r) => sum + r.amountDb, 0)
//       const totalOpeningCredit = openingRecords.reduce((sum, r) => sum + r.amountCr, 0)
//       const totalOpeningOwnDebit = openingRecords.reduce((sum, r) => sum + r.ownDb, 0)
//       const totalOpeningOwnCredit = openingRecords.reduce((sum, r) => sum + r.ownCr, 0)

//       const openingBalance = totalOpeningCredit - totalOpeningDebit
//       const openingOwnBalance = totalOpeningOwnCredit - totalOpeningOwnDebit // ✅ NEW

//       const systemRow: AdvancedProcessedRecord = {
//         id: -1,
//         voucherNo: 'System',
//         date: '',
//         description: 'Balance B/F',
//         amountDb: totalOpeningDebit,
//         amountCr: totalOpeningCredit,
//         ownDb: totalOpeningOwnDebit,
//         ownCr: totalOpeningOwnCredit,
//         rate: 0,
//         receiptNo: '',
//         currency: 'PKR',
//         isOpening: true,
//         acName: 'System Generated',
//         balance: openingBalance,
//         ownBalance: openingOwnBalance // ✅ NEW
//       }

//       const calculationData = [systemRow, ...regularRecords]

//       // ✅ STEP 3: Calculate Running Balance (Both Regular and Own)
//       const calculateBalancesAsync = async (data: AdvancedProcessedRecord[]): Promise<AdvancedProcessedRecord[]> => {
//         return new Promise(resolve => {
//           setTimeout(() => {
//             let runningBalance = 0
//             let runningOwnBalance = 0

//             const dataWithBalance = data.map((record, index) => {
//               if (index === 0 && record.isOpening) {
//                 runningBalance = record.balance
//                 runningOwnBalance = record.ownBalance
//               } else {
//                 const currentBalance = record.amountCr - record.amountDb + runningBalance
//                 const currentOwnBalance = record.ownCr - record.ownDb + runningOwnBalance // ✅ NEW
//                 runningBalance = currentBalance
//                 runningOwnBalance = currentOwnBalance
//               }

//               return {
//                 ...record,
//                 balance: runningBalance,
//                 ownBalance: runningOwnBalance, // ✅ NEW
//                 rowIndex: index + 1,
//                 calculationRowIndex: index + 1
//               }
//             })

//             resolve(dataWithBalance)
//           }, 0)
//         })
//       }

//       const dataWithBalance = await calculateBalancesAsync(calculationData)
//       console.log('🧮 Both balances calculated. Final balance:', dataWithBalance[dataWithBalance.length - 1]?.balance)
//       console.log('💰 Final own balance:', dataWithBalance[dataWithBalance.length - 1]?.ownBalance)

//       // ✅ STEP 4: Apply Date Filter (Complex Logic)
//       let displayData = dataWithBalance
//       let systemRowInfo = {
//         totalOpeningRecords: openingRecords.length,
//         openingBalance,
//         openingOwnBalance, // ✅ NEW
//         systemRowGenerated: true,
//         displayBalance: openingBalance,
//         displayOwnBalance: openingOwnBalance, // ✅ NEW
//         calculationBalance: openingBalance,
//         calculationOwnBalance: openingOwnBalance, // ✅ NEW
//         lastHiddenRowIndex: 0,
//         aboveRowBalance: openingBalance,
//         aboveRowOwnBalance: openingOwnBalance // ✅ NEW
//       }

//       if (filters.dateFrom || filters.dateTo) {
//         const systemRowData = dataWithBalance.filter(record => record.isOpening)
//         const regularRowData = dataWithBalance.filter(record => !record.isOpening)

//         console.log('📅 Applying date filter with dual balance logic...')

//         let filteredRegularData = regularRowData

//         // Date filtering logic
//         if (filters.dateFrom) {
//           const fromDate = new Date(filters.dateFrom)
//           fromDate.setHours(0, 0, 0, 0)
          
//           filteredRegularData = filteredRegularData.filter(record => {
//             const recordDate = new Date(record.date)
//             recordDate.setHours(0, 0, 0, 0)
//             return recordDate >= fromDate
//           })
//         }

//         if (filters.dateTo) {
//           const toDate = new Date(filters.dateTo)
//           toDate.setHours(23, 59, 59, 999)
          
//           filteredRegularData = filteredRegularData.filter(record => {
//             const recordDate = new Date(record.date)
//             return recordDate <= toDate
//           })
//         }

//         // ✅ Dual balance logic for both regular and own balances
//         if (filteredRegularData.length > 0) {
//           const firstVisibleRow = filteredRegularData[0]
//           const firstVisibleIndex = regularRowData.findIndex(r => 
//             r.id === firstVisibleRow.id && r.rowIndex === firstVisibleRow.rowIndex
//           )
          
//           if (firstVisibleIndex > 0) {
//             const aboveRow = regularRowData[firstVisibleIndex - 1]
//             systemRowInfo.aboveRowBalance = aboveRow.balance
//             systemRowInfo.aboveRowOwnBalance = aboveRow.ownBalance // ✅ NEW
//             systemRowInfo.calculationBalance = aboveRow.balance
//             systemRowInfo.calculationOwnBalance = aboveRow.ownBalance // ✅ NEW
//             systemRowInfo.lastHiddenRowIndex = aboveRow.rowIndex || 0
            
//             console.log(`📅 Above row balances - Regular: ${systemRowInfo.aboveRowBalance}, Own: ${systemRowInfo.aboveRowOwnBalance}`)
//           }
//         }

//         displayData = [...systemRowData, ...filteredRegularData]
//         displayData = displayData.map((record, displayIndex) => ({
//           ...record,
//           displayRowIndex: displayIndex + 1
//         }))
//       }

//       const filteringStats = {
//         originalCount: rawData.length,
//         afterDataFilters: afterDataFiltersCount,
//         afterDateFilter: displayData.length,
//         hiddenByDate: dataWithBalance.length - displayData.length,
//         firstDisplayRowIndex: displayData.length > 1 ? 2 : 1
//       }

//       return {
//         calculationData: dataWithBalance,
//         displayData,
//         systemRowInfo,
//         filteringStats
//       }
//     }

//     processData().then(setAsyncResult)
//   }, [rawData, filters])

//   return asyncResult
// }










































import { useMemo, useState, useEffect } from 'react'
import { AdvancedProcessedRecord, AdvancedFilterState, AdvancedFilterResult, RawAdvancedRecord } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

export const useLedgerByForexFiltering = (
  rawData: RawAdvancedRecord[], 
  filters: AdvancedFilterState
): AdvancedFilterResult => {
  
  const [asyncResult, setAsyncResult] = useState<AdvancedFilterResult>({
    calculationData: [],
    displayData: [],
    systemRowInfo: { 
      totalOpeningRecords: 0, 
      openingBalance: 0,
      openingOwnBalance: 0,
      systemRowGenerated: false,
      displayBalance: 0,
      displayOwnBalance: 0,
      calculationBalance: 0,
      calculationOwnBalance: 0,
      lastHiddenRowIndex: 0,
      aboveRowBalance: 0,
      aboveRowOwnBalance: 0
    },
    filteringStats: { 
      originalCount: 0, 
      afterDataFilters: 0, 
      afterDateFilter: 0, 
      hiddenByDate: 0,
      firstDisplayRowIndex: 0
    }
  })

  const processData = useMemo(() => {
    const process = async () => {
      if (!rawData.length || !filters.acName) {
        console.log('⚠️ No data or account filter missing')
        return {
          calculationData: [],
          displayData: [],
          systemRowInfo: { 
            totalOpeningRecords: 0, 
            openingBalance: 0,
            openingOwnBalance: 0,
            systemRowGenerated: false,
            displayBalance: 0,
            displayOwnBalance: 0,
            calculationBalance: 0,
            calculationOwnBalance: 0,
            lastHiddenRowIndex: 0,
            aboveRowBalance: 0,
            aboveRowOwnBalance: 0
          },
          filteringStats: { 
            originalCount: rawData.length || 0, 
            afterDataFilters: 0, 
            afterDateFilter: 0, 
            hiddenByDate: 0,
            firstDisplayRowIndex: 0
          }
        }
      }

      console.log('🚀 Processing Ledger by Forex with account:', filters.acName)

      // ✅ STEP 1: Apply Filters
      let filteredData = [...rawData]

      // Mandatory account filter
      filteredData = filteredData.filter(record => record.acName === filters.acName)
      console.log(`🏦 Account filter: ${filteredData.length} records`)

      // Other filters
      if (filters.description) {
        filteredData = filteredData.filter(record => 
          record.description.toLowerCase().includes(filters.description.toLowerCase())
        )
        console.log(`📝 Description filter: ${filteredData.length} records`)
      }

      if (filters.entryType === 'credit_only') {
        filteredData = filteredData.filter(record => record.amountCr > 0)
      } else if (filters.entryType === 'debit_only') {
        filteredData = filteredData.filter(record => record.amountDb > 0)
      }

      const afterDataFiltersCount = filteredData.length

      // ✅ STEP 2: Generate System Row with DUAL Balance
      const openingRecords = filteredData.filter(record => record.isOpening)
      const regularRecords = filteredData.filter(record => !record.isOpening)

      // Calculate opening totals
      const totalOpeningDebit = openingRecords.reduce((sum, r) => sum + r.amountDb, 0)
      const totalOpeningCredit = openingRecords.reduce((sum, r) => sum + r.amountCr, 0)
      const totalOpeningOwnDebit = openingRecords.reduce((sum, r) => sum + r.ownDb, 0)
      const totalOpeningOwnCredit = openingRecords.reduce((sum, r) => sum + r.ownCr, 0)

      // ✅ FIXED: Calculate both balances correctly
      const openingBalance = totalOpeningCredit - totalOpeningDebit
      const openingOwnBalance = totalOpeningOwnCredit - totalOpeningOwnDebit

      console.log('💰 Opening balances calculated:', {
        regular: openingBalance,
        own: openingOwnBalance,
        openingRecords: openingRecords.length
      })

      // Create system row
      const systemRow: AdvancedProcessedRecord = {
        id: -1,
        voucherNo: 'System',
        date: '',
        description: 'Balance B/F',
        amountDb: totalOpeningDebit,
        amountCr: totalOpeningCredit,
        ownDb: totalOpeningOwnDebit,
        ownCr: totalOpeningOwnCredit,
        rate: 0,
        receiptNo: '',
        currency: 'PKR',
        isOpening: true,
        acName: 'System Generated',
        balance: openingBalance,
        ownBalance: openingOwnBalance
      }

      const calculationData = [systemRow, ...regularRecords]

      // ✅ STEP 3: Calculate Running DUAL Balance
      let runningBalance = 0
      let runningOwnBalance = 0

      const dataWithBalance = calculationData.map((record, index) => {
        if (index === 0 && record.isOpening) {
          // First row (system row) - use its balance values
          runningBalance = record.balance
          runningOwnBalance = record.ownBalance
        } else {
          // Calculate running balances for regular records
          const currentBalance = record.amountCr - record.amountDb + runningBalance
          const currentOwnBalance = record.ownCr - record.ownDb + runningOwnBalance
          runningBalance = currentBalance
          runningOwnBalance = currentOwnBalance
        }

        return {
          ...record,
          balance: runningBalance,
          ownBalance: runningOwnBalance,
          rowIndex: index + 1,
          calculationRowIndex: index + 1
        }
      })

      console.log('🧮 Running balances calculated. Final:', {
        balance: runningBalance,
        ownBalance: runningOwnBalance
      })

      // ✅ STEP 4: Apply Date Filter with DUAL Balance Logic
      let displayData = dataWithBalance
      let systemRowInfo = {
        totalOpeningRecords: openingRecords.length,
        openingBalance,
        openingOwnBalance,
        systemRowGenerated: true,
        displayBalance: openingBalance,
        displayOwnBalance: openingOwnBalance,
        calculationBalance: openingBalance,
        calculationOwnBalance: openingOwnBalance,
        lastHiddenRowIndex: 0,
        aboveRowBalance: openingBalance,
        aboveRowOwnBalance: openingOwnBalance
      }

      if (filters.dateFrom || filters.dateTo) {
        console.log('📅 Applying date filter with dual balance logic...')
        
        const systemRowData = dataWithBalance.filter(record => record.isOpening)
        const regularRowData = dataWithBalance.filter(record => !record.isOpening)

        let filteredRegularData = regularRowData

        // Apply date filters
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom)
          fromDate.setHours(0, 0, 0, 0)
          
          filteredRegularData = filteredRegularData.filter(record => {
            const recordDate = new Date(record.date)
            recordDate.setHours(0, 0, 0, 0)
            return recordDate >= fromDate
          })
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo)
          toDate.setHours(23, 59, 59, 999)
          
          filteredRegularData = filteredRegularData.filter(record => {
            const recordDate = new Date(record.date)
            return recordDate <= toDate
          })
        }

        // ✅ FIXED: Find "above row" for BOTH balances
        if (filteredRegularData.length > 0) {
          const firstVisibleRow = filteredRegularData[0]
          const firstVisibleIndex = regularRowData.findIndex(r => 
            r.id === firstVisibleRow.id && r.rowIndex === firstVisibleRow.rowIndex
          )
          
          if (firstVisibleIndex > 0) {
            const aboveRow = regularRowData[firstVisibleIndex - 1]
            systemRowInfo.aboveRowBalance = aboveRow.balance
            systemRowInfo.aboveRowOwnBalance = aboveRow.ownBalance
            systemRowInfo.calculationBalance = aboveRow.balance
            systemRowInfo.calculationOwnBalance = aboveRow.ownBalance
            systemRowInfo.lastHiddenRowIndex = aboveRow.rowIndex || 0
            
            console.log(`📅 Above row found with dual balances:`, {
              balance: systemRowInfo.aboveRowBalance,
              ownBalance: systemRowInfo.aboveRowOwnBalance,
              rowIndex: systemRowInfo.lastHiddenRowIndex
            })
          }
        }

        displayData = [...systemRowData, ...filteredRegularData]
        displayData = displayData.map((record, displayIndex) => ({
          ...record,
          displayRowIndex: displayIndex + 1
        }))
      }

      const filteringStats = {
        originalCount: rawData.length,
        afterDataFilters: afterDataFiltersCount,
        afterDateFilter: displayData.length,
        hiddenByDate: dataWithBalance.length - displayData.length,
        firstDisplayRowIndex: displayData.length > 1 ? 2 : 1
      }

      console.log('✅ Ledger by Forex processing complete:', {
        displayRecords: displayData.length,
        finalBalance: displayData[displayData.length - 1]?.balance || 0,
        finalOwnBalance: displayData[displayData.length - 1]?.ownBalance || 0
      })

      return {
        calculationData: dataWithBalance,
        displayData,
        systemRowInfo,
        filteringStats
      }
    }

    return process()
  }, [rawData, filters])

  useEffect(() => {
    processData.then(result => {
      setAsyncResult(result)
    }).catch(error => {
      console.error('❌ Error in ledger processing:', error)
      setAsyncResult({
        calculationData: [],
        displayData: [],
        systemRowInfo: { 
          totalOpeningRecords: 0, 
          openingBalance: 0,
          openingOwnBalance: 0,
          systemRowGenerated: false,
          displayBalance: 0,
          displayOwnBalance: 0,
          calculationBalance: 0,
          calculationOwnBalance: 0,
          lastHiddenRowIndex: 0,
          aboveRowBalance: 0,
          aboveRowOwnBalance: 0
        },
        filteringStats: { 
          originalCount: 0, 
          afterDataFilters: 0, 
          afterDateFilter: 0, 
          hiddenByDate: 0,
          firstDisplayRowIndex: 0
        }
      })
    })
  }, [processData])

  return asyncResult
}
