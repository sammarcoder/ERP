// import { useMemo } from 'react'
// import { ProcessedRecord, FilterState } from '@/types/reports/journalmaster/JournalTypes'

// interface FilterResult {
//   calculationData: ProcessedRecord[]
//   displayData: ProcessedRecord[]
//   systemRowInfo: {
//     totalOpeningRecords: number
//     openingBalance: number
//     systemRowGenerated: boolean
//   }
//   filteringStats: {
//     originalCount: number
//     afterDataFilters: number
//     afterDateFilter: number
//     hiddenByDate: number
//   }
// }

// export const useComplexFiltering = (
//   processedData: ProcessedRecord[], 
//   filters: FilterState
// ): FilterResult => {
//   const result = useMemo(() => {
//     if (!processedData.length) {
//       return {
//         calculationData: [],
//         displayData: [],
//         systemRowInfo: { totalOpeningRecords: 0, openingBalance: 0, systemRowGenerated: false },
//         filteringStats: { originalCount: 0, afterDataFilters: 0, afterDateFilter: 0, hiddenByDate: 0 }
//       }
//     }

//     console.log('🔄 COMPLETE RE-PROCESSING: Starting from original data')
//     console.log('📊 Original data:', processedData.length, 'records')

//     // ===== STEP 1: Apply ALL Non-Date Filters (Complete Re-processing) =====
//     let filteredData = [...processedData]

//     // 1.1 Account Name Filter
//     if (filters.acName) {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => record.acName === filters.acName)
//       console.log(`🏦 Account filter (${filters.acName}): ${beforeCount} → ${filteredData.length}`)
//     }

//     // 1.2 Description Filter  
//     if (filters.description) {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => 
//         record.description.toLowerCase().includes(filters.description.toLowerCase())
//       )
//       console.log(`📝 Description filter: ${beforeCount} → ${filteredData.length}`)
//     }

//     // 1.3 Entry Type Filter
//     if (filters.entryType === 'credit_only') {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => record.amountCr > 0)
//       console.log(`💚 Credit-only filter: ${beforeCount} → ${filteredData.length}`)
//     } else if (filters.entryType === 'debit_only') {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => record.amountDb > 0)
//       console.log(`❤️ Debit-only filter: ${beforeCount} → ${filteredData.length}`)
//     }

//     const afterDataFiltersCount = filteredData.length

//     // ===== STEP 2: Process Opening Balances from FILTERED Data =====
//     const openingRecords = filteredData.filter(record => record.isOpening)
//     const regularRecords = filteredData.filter(record => !record.isOpening)

//     console.log(`🔶 Opening records in filtered data: ${openingRecords.length}`)
//     console.log(`📄 Regular records: ${regularRecords.length}`)

//     let calculationData: ProcessedRecord[] = []
//     let systemRowInfo = {
//       totalOpeningRecords: openingRecords.length,
//       openingBalance: 0,
//       systemRowGenerated: false
//     }

//     if (openingRecords.length > 0) {
//       // Calculate totals from FILTERED opening records
//       const totalOpeningDebit = openingRecords.reduce((sum, r) => sum + r.amountDb, 0)
//       const totalOpeningCredit = openingRecords.reduce((sum, r) => sum + r.amountCr, 0)
//       const totalOpeningOwnDebit = openingRecords.reduce((sum, r) => sum + r.ownDb, 0)
//       const totalOpeningOwnCredit = openingRecords.reduce((sum, r) => sum + r.ownCr, 0)
//       const openingBalance = totalOpeningCredit - totalOpeningDebit

//       // Create system-generated row from filtered opening data
//       const systemRow: ProcessedRecord = {
//         id: -1,
//         voucherNo: 'SYSTEM-GEN',
//         date: regularRecords[0]?.date || new Date().toISOString(),
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
//         balance: openingBalance
//       }

//       systemRowInfo = {
//         totalOpeningRecords: openingRecords.length,
//         openingBalance,
//         systemRowGenerated: true
//       }

//       calculationData = [systemRow, ...regularRecords]

//       console.log('✅ System row generated from filtered opening records:', {
//         fromRecords: openingRecords.length,
//         debit: totalOpeningDebit,
//         credit: totalOpeningCredit,
//         balance: openingBalance
//       })
//     } else {
//       calculationData = regularRecords
//     }

//     // ===== STEP 3: Calculate Running Balance on ALL Filtered Data =====
//     let runningBalance = 0
//     const dataWithBalance = calculationData.map((record, index) => {
//       if (index === 0 && record.isOpening) {
//         // System row: Use its pre-calculated balance
//         runningBalance = record.balance
//         console.log(`🔶 System row balance: ${runningBalance}`)
//       } else {
//         // Regular rows: Credit - Debit + Previous Balance
//         const currentBalance = record.amountCr - record.amountDb + runningBalance
//         runningBalance = currentBalance

//         if (index < 5) { // Log first few for debugging
//           console.log(`Row ${index + 1}: ${record.amountCr} - ${record.amountDb} + ${runningBalance - currentBalance} = ${currentBalance}`)
//         }
//       }

//       return {
//         ...record,
//         balance: runningBalance,
//         rowIndex: index + 1,
//         calculationRowIndex: index + 1
//       }
//     })

//     console.log('🧮 Balance calculation complete on filtered data. Final balance:', runningBalance)

//     // ===== STEP 4: Apply Date Filter for DISPLAY ONLY =====
//     let displayData = dataWithBalance

//     if (filters.dateFrom || filters.dateTo) {
//       const beforeDateFilter = displayData.length

//       if (filters.dateFrom) {
//         displayData = displayData.filter(record => 
//           new Date(record.date) >= new Date(filters.dateFrom)
//         )
//       }

//       if (filters.dateTo) {
//         displayData = displayData.filter(record => 
//           new Date(record.date) <= new Date(filters.dateTo)
//         )
//       }

//       const hiddenByDate = beforeDateFilter - displayData.length

//       console.log(`📅 Date filter applied: ${beforeDateFilter} → ${displayData.length} (${hiddenByDate} hidden)`)
//       console.log('⚠️ IMPORTANT: Balance calculation includes ALL filtered records, date filter only affects display')

//       // Update display row indices
//       displayData = displayData.map((record, displayIndex) => ({
//         ...record,
//         displayRowIndex: displayIndex + 1
//       }))
//     }

//     const filteringStats = {
//       originalCount: processedData.length,
//       afterDataFilters: afterDataFiltersCount,
//       afterDateFilter: displayData.length,
//       hiddenByDate: dataWithBalance.length - displayData.length
//     }

//     return {
//       calculationData: dataWithBalance,
//       displayData,
//       systemRowInfo,
//       filteringStats
//     }
//   }, [processedData, filters]) // Re-runs completely when ANY filter changes

//   return result
// }























































// import { useMemo } from 'react'
// import { ProcessedRecord, FilterState } from '@/types/reports/journalmaster/JournalTypes'

// interface FilterResult {
//   calculationData: ProcessedRecord[]
//   displayData: ProcessedRecord[]
//   systemRowInfo: {
//     totalOpeningRecords: number
//     openingBalance: number
//     systemRowGenerated: boolean
//     displayBalance: number      // NEW: For display (opening balance)
//     calculationBalance: number  // NEW: For calculation (last hidden row balance)
//     lastHiddenRowIndex: number  // NEW: Track which row was last hidden
//   }
//   filteringStats: {
//     originalCount: number
//     afterDataFilters: number
//     afterDateFilter: number
//     hiddenByDate: number
//     firstDisplayRowIndex: number
//   }
// }

// export const useComplexFiltering = (
//   processedData: ProcessedRecord[], 
//   filters: FilterState
// ): FilterResult => {
//   const result = useMemo(() => {
//     if (!processedData.length) {
//       return {
//         calculationData: [],
//         displayData: [],
//         systemRowInfo: { 
//           totalOpeningRecords: 0, 
//           openingBalance: 0, 
//           systemRowGenerated: false,
//           displayBalance: 0,
//           calculationBalance: 0,
//           lastHiddenRowIndex: 0
//         },
//         filteringStats: { 
//           originalCount: 0, 
//           afterDataFilters: 0, 
//           afterDateFilter: 0, 
//           hiddenByDate: 0,
//           firstDisplayRowIndex: 0
//         }
//       }
//     }

//     console.log('🔄 COMPLETE RE-PROCESSING: Starting from original data')
//     console.log('📊 Original data:', processedData.length, 'records')

//     // ===== STEP 1: Apply ALL Non-Date Filters =====
//     let filteredData = [...processedData]

//     if (filters.acName) {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => record.acName === filters.acName)
//       console.log(`🏦 Account filter (${filters.acName}): ${beforeCount} → ${filteredData.length}`)
//     }

//     if (filters.description) {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => 
//         record.description.toLowerCase().includes(filters.description.toLowerCase())
//       )
//       console.log(`📝 Description filter: ${beforeCount} → ${filteredData.length}`)
//     }

//     if (filters.entryType === 'credit_only') {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => record.amountCr > 0)
//       console.log(`💚 Credit-only filter: ${beforeCount} → ${filteredData.length}`)
//     } else if (filters.entryType === 'debit_only') {
//       const beforeCount = filteredData.length
//       filteredData = filteredData.filter(record => record.amountDb > 0)
//       console.log(`❤️ Debit-only filter: ${beforeCount} → ${filteredData.length}`)
//     }

//     const afterDataFiltersCount = filteredData.length

//     // ===== STEP 2: ALWAYS Generate System Row (Fixed Logic) =====
//     const openingRecords = filteredData.filter(record => record.isOpening)
//     const regularRecords = filteredData.filter(record => !record.isOpening)

//     console.log(`🔶 Opening records in filtered data: ${openingRecords.length}`)
//     console.log(`📄 Regular records: ${regularRecords.length}`)

//     // ✅ ALWAYS calculate opening balance (0 if no opening records)
//     const totalOpeningDebit = openingRecords.reduce((sum, r) => sum + r.amountDb, 0)
//     const totalOpeningCredit = openingRecords.reduce((sum, r) => sum + r.amountCr, 0)
//     const totalOpeningOwnDebit = openingRecords.reduce((sum, r) => sum + r.ownDb, 0)
//     const totalOpeningOwnCredit = openingRecords.reduce((sum, r) => sum + r.ownCr, 0)
//     const openingBalance = totalOpeningCredit - totalOpeningDebit

//     // ✅ ALWAYS create system row (even if opening balance is 0)
//     const systemRow: ProcessedRecord = {
//       id: -1,
//       voucherNo: 'SYSTEM-GEN',
//       date: regularRecords[0]?.date || new Date().toISOString(),
//       description: 'Balance B/F',
//       amountDb: totalOpeningDebit,
//       amountCr: totalOpeningCredit,
//       ownDb: totalOpeningOwnDebit,
//       ownCr: totalOpeningOwnCredit,
//       rate: 0,
//       receiptNo: '',
//       currency: 'PKR',
//       isOpening: true,
//       acName: 'System Generated',
//       balance: openingBalance
//     }

//     const calculationData = [systemRow, ...regularRecords]

//     let systemRowInfo = {
//       totalOpeningRecords: openingRecords.length,
//       openingBalance,
//       systemRowGenerated: true, // Always true now
//       displayBalance: openingBalance,      // For display
//       calculationBalance: openingBalance,  // Initially same as opening
//       lastHiddenRowIndex: 0
//     }

//     console.log('✅ System row ALWAYS generated:', {
//       openingRecords: openingRecords.length,
//       debit: totalOpeningDebit,
//       credit: totalOpeningCredit,
//       balance: openingBalance
//     })

//     // ===== STEP 3: Calculate Running Balance =====
//     let runningBalance = 0
//     const dataWithBalance = calculationData.map((record, index) => {
//       if (index === 0 && record.isOpening) {
//         runningBalance = record.balance
//         console.log(`🔶 System row balance: ${runningBalance}`)
//       } else {
//         const currentBalance = record.amountCr - record.amountDb + runningBalance
//         runningBalance = currentBalance

//         if (index < 5) {
//           console.log(`Row ${index + 1}: ${record.amountCr} - ${record.amountDb} + ${runningBalance - currentBalance} = ${currentBalance}`)
//         }
//       }

//       return {
//         ...record,
//         balance: runningBalance,
//         rowIndex: index + 1,
//         calculationRowIndex: index + 1
//       }
//     })

//     console.log('🧮 Balance calculation complete. Final balance:', runningBalance)

//     // ===== STEP 4: Apply Date Filter with Dual Balance Logic =====
//     let displayData = dataWithBalance
//     let firstDisplayRowIndex = 0

//     if (filters.dateFrom || filters.dateTo) {
//       const beforeDateFilter = displayData.length

//       // Find which records will be hidden by date filter
//       let hiddenData = []
//       let visibleData = [...displayData]

//       if (filters.dateFrom) {
//         const fromDate = new Date(filters.dateFrom)
//         hiddenData = visibleData.filter(record => {
//           const recordDate = new Date(record.date)
//           return recordDate < fromDate
//         })
//         visibleData = visibleData.filter(record => {
//           const recordDate = new Date(record.date)
//           return recordDate >= fromDate
//         })
//       }

//       if (filters.dateTo) {
//         const toDate = new Date(filters.dateTo)
//         toDate.setHours(23, 59, 59, 999)
//         visibleData = visibleData.filter(record => {
//           const recordDate = new Date(record.date)
//           return recordDate <= toDate
//         })
//       }

//       displayData = visibleData
//       const hiddenByDate = beforeDateFilter - displayData.length

//       // ✅ DUAL BALANCE LOGIC: Find last hidden row balance
//       if (hiddenData.length > 0) {
//         const lastHiddenRow = hiddenData[hiddenData.length - 1]
//         systemRowInfo.calculationBalance = lastHiddenRow.balance
//         systemRowInfo.lastHiddenRowIndex = lastHiddenRow.rowIndex

//         console.log(`📅 Date filter applied - Dual balance logic:`)
//         console.log(`   Display Balance: ${systemRowInfo.displayBalance} (opening balance)`)
//         console.log(`   Calculation Balance: ${systemRowInfo.calculationBalance} (from hidden row ${systemRowInfo.lastHiddenRowIndex})`)

//         // Update system row in display data to use dual balance
//         if (displayData.length > 0 && displayData[0].isOpening) {
//           displayData[0] = {
//             ...displayData[0],
//             // Display shows opening balance, but internal calculation will use calculationBalance
//             balance: systemRowInfo.displayBalance,
//             calculationBalance: systemRowInfo.calculationBalance // Add this for calculation reference
//           } as any
//         }
//       }

//       console.log(`📅 Date filter applied: ${beforeDateFilter} → ${displayData.length} (${hiddenByDate} hidden)`)

//       // Find first display row index
//       if (displayData.length > 0) {
//         const firstDisplayRowOriginalIndex = dataWithBalance.findIndex(
//           row => row.id === displayData[0].id && row.rowIndex === displayData[0].rowIndex
//         )
//         firstDisplayRowIndex = firstDisplayRowOriginalIndex + 1
//       }

//       // Update display row indices
//       displayData = displayData.map((record, displayIndex) => ({
//         ...record,
//         displayRowIndex: displayIndex + 1
//       }))
//     }

//     const filteringStats = {
//       originalCount: processedData.length,
//       afterDataFilters: afterDataFiltersCount,
//       afterDateFilter: displayData.length,
//       hiddenByDate: dataWithBalance.length - displayData.length,
//       firstDisplayRowIndex
//     }

//     return {
//       calculationData: dataWithBalance,
//       displayData,
//       systemRowInfo,
//       filteringStats
//     }
//   }, [processedData, filters])

//   return result
// }

























































import { useMemo } from 'react'
import { ProcessedRecord, FilterState } from '@/types/reports/journalmaster/JournalTypes'

interface FilterResult {
  calculationData: ProcessedRecord[]
  displayData: ProcessedRecord[]
  systemRowInfo: {
    totalOpeningRecords: number
    openingBalance: number
    systemRowGenerated: boolean
    displayBalance: number
    calculationBalance: number
    lastHiddenRowIndex: number
    aboveRowBalance: number     // NEW: Balance from row above date filter
  }
  filteringStats: {
    originalCount: number
    afterDataFilters: number
    afterDateFilter: number
    hiddenByDate: number
    firstDisplayRowIndex: number
  }
}

export const useComplexFiltering = (
  processedData: ProcessedRecord[],
  filters: FilterState
): FilterResult => {
  const result = useMemo(() => {
    if (!processedData.length) {
      return {
        calculationData: [],
        displayData: [],
        systemRowInfo: {
          totalOpeningRecords: 0,
          openingBalance: 0,
          systemRowGenerated: false,
          displayBalance: 0,
          calculationBalance: 0,
          lastHiddenRowIndex: 0,
          aboveRowBalance: 0
        },
        filteringStats: {
          originalCount: 0,
          afterDataFilters: 0,
          afterDateFilter: 0,
          hiddenByDate: 0,
          firstDisplayRowIndex: 0
        }
      }
    }

    console.log('🔄 COMPLETE RE-PROCESSING: Starting from original data')

    // ===== STEP 1: Apply ALL Non-Date Filters =====
    let filteredData = [...processedData]

    if (filters.acName) {
      filteredData = filteredData.filter(record => record.acName === filters.acName)
      console.log(`🏦 Account filter: ${filteredData.length} records`)
    }

    if (filters.description) {
      filteredData = filteredData.filter(record =>
        record.description.toLowerCase().includes(filters.description.toLowerCase())
      )
      console.log(`📝 Description filter: ${filteredData.length} records`)
    }

    if (filters.entryType === 'credit_only') {
      filteredData = filteredData.filter(record => record.amountCr > 0)
      console.log(`💚 Credit-only filter: ${filteredData.length} records`)
    } else if (filters.entryType === 'debit_only') {
      filteredData = filteredData.filter(record => record.amountDb > 0)
      console.log(`❤️ Debit-only filter: ${filteredData.length} records`)
    }

    const afterDataFiltersCount = filteredData.length

    // ===== STEP 2: ALWAYS Generate System Row (FIXED - NO DATE) =====
    const openingRecords = filteredData.filter(record => record.isOpening)
    const regularRecords = filteredData.filter(record => !record.isOpening)

    const totalOpeningDebit = openingRecords.reduce((sum, r) => sum + r.amountDb, 0)
    const totalOpeningCredit = openingRecords.reduce((sum, r) => sum + r.amountCr, 0)
    const totalOpeningOwnDebit = openingRecords.reduce((sum, r) => sum + r.ownDb, 0)
    const totalOpeningOwnCredit = openingRecords.reduce((sum, r) => sum + r.ownCr, 0)
    const openingBalance = totalOpeningCredit - totalOpeningDebit

    // ✅ FIXED: System row with NO DATE
    const systemRow: ProcessedRecord = {
      id: -1,
      voucherNo: 'System',
      date: '', // ✅ NO DATE for system row
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
      balance: openingBalance
    }

    const calculationData = [systemRow, ...regularRecords]

    console.log('✅ System row generated (NO DATE):', {
      openingRecords: openingRecords.length,
      balance: openingBalance,
      date: 'EMPTY' // Confirm no date
    })

    // ===== STEP 3: Calculate Running Balance =====
    let runningBalance = 0
    const dataWithBalance = calculationData.map((record, index) => {
      if (index === 0 && record.isOpening) {
        runningBalance = record.balance
      } else {
        const currentBalance = record.amountCr - record.amountDb + runningBalance
        runningBalance = currentBalance
      }

      return {
        ...record,
        balance: runningBalance,
        rowIndex: index + 1,
        calculationRowIndex: index + 1
      }
    })

    console.log('🧮 Balance calculation complete. Final balance:', runningBalance)

    // ===== STEP 4: Apply Date Filter (FIXED - EXCLUDE SYSTEM ROW) =====
    let displayData = dataWithBalance
    let systemRowInfo = {
      totalOpeningRecords: openingRecords.length,
      openingBalance,
      systemRowGenerated: true,
      displayBalance: openingBalance,
      calculationBalance: openingBalance,
      lastHiddenRowIndex: 0,
      aboveRowBalance: openingBalance
    }

    if (filters.dateFrom || filters.dateTo) {
      // ✅ CRITICAL: Separate system row from regular data
      const systemRowData = dataWithBalance.filter(record => record.isOpening)
      const regularRowData = dataWithBalance.filter(record => !record.isOpening)

      console.log('📅 Applying date filter to regular rows only (system row always included)')

      let filteredRegularData = regularRowData

      // // Apply date filter to regular rows only
      // if (filters.dateFrom) {
      //   const fromDate = new Date(filters.dateFrom)
      //   filteredRegularData = filteredRegularData.filter(record => {
      //     const recordDate = new Date(record.date)
      //     return recordDate >= fromDate
      //   })
      // }

      // if (filters.dateTo) {
      //   const toDate = new Date(filters.dateTo)
      //   toDate.setHours(23, 59, 59, 999)
      //   filteredRegularData = filteredRegularData.filter(record => {
      //     const recordDate = new Date(record.date)
      //     return recordDate <= toDate
      //   })
      // }



      // ✅ FIXED: Apply date filter with proper date normalization
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        fromDate.setHours(0, 0, 0, 0) // ✅ Set to start of day

        filteredRegularData = filteredRegularData.filter(record => {
          const recordDate = new Date(record.date)
          recordDate.setHours(0, 0, 0, 0) // ✅ Set to start of day
          return recordDate >= fromDate // ✅ Now truly inclusive
        })

        console.log(`📅 Date from filter (${filters.dateFrom}): ${filteredRegularData.length} records`)
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // ✅ Set to end of day

        filteredRegularData = filteredRegularData.filter(record => {
          const recordDate = new Date(record.date)
          return recordDate <= toDate // ✅ Includes entire selected day
        })

        console.log(`📅 Date to filter (${filters.dateTo}): ${filteredRegularData.length} records`)
      }

      // ✅ DUAL BALANCE LOGIC: Find the "above row" balance
      if (filteredRegularData.length > 0) {
        const firstVisibleRow = filteredRegularData[0]
        const firstVisibleIndex = regularRowData.findIndex(r =>
          r.id === firstVisibleRow.id && r.rowIndex === firstVisibleRow.rowIndex
        )

        if (firstVisibleIndex > 0) {
          // There are hidden rows before the first visible row
          const aboveRow = regularRowData[firstVisibleIndex - 1]
          systemRowInfo.aboveRowBalance = aboveRow.balance
          systemRowInfo.calculationBalance = aboveRow.balance
          systemRowInfo.lastHiddenRowIndex = aboveRow.rowIndex

          console.log(`📅 Above row balance found: ${systemRowInfo.aboveRowBalance} (from row ${systemRowInfo.lastHiddenRowIndex})`)

          // Update system row to show dual balance
          systemRowData[0] = {
            ...systemRowData[0],
            balance: systemRowInfo.displayBalance, // Show opening balance
            calculationBalance: systemRowInfo.calculationBalance // Store calculation balance
          } as any
        }
      }

      // ✅ ALWAYS include system row + filtered regular rows
      displayData = [...systemRowData, ...filteredRegularData]

      console.log(`📅 Date filter result: System row + ${filteredRegularData.length} regular rows`)
      console.log(`📊 Display Balance: ${systemRowInfo.displayBalance}, Calculation Balance: ${systemRowInfo.calculationBalance}`)

      // Update display indices
      displayData = displayData.map((record, displayIndex) => ({
        ...record,
        displayRowIndex: displayIndex + 1
      }))
    }

    const filteringStats = {
      originalCount: processedData.length,
      afterDataFilters: afterDataFiltersCount,
      afterDateFilter: displayData.length,
      hiddenByDate: dataWithBalance.length - displayData.length,
      firstDisplayRowIndex: displayData.length > 1 ? 2 : 1 // System row is always #1
    }

    return {
      calculationData: dataWithBalance,
      displayData,
      systemRowInfo,
      filteringStats
    }
  }, [processedData, filters])

  return result
}
