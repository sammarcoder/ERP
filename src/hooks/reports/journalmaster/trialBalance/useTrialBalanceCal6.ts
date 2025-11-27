
// import { useMemo } from 'react'
// // import { RawJournalRecord, TrialBalanceRecord, TrialBalanceFilterState, TrialBalanceSummary } from '@/types/reports/trialbalance/TrialBalanceTypes'

// import { RawJournalRecord, TrialBalanceRecord, TrialBalanceFilterState, TrialBalanceSummary } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

// export const useTrialBalanceCal6 = (
//   rawData: RawJournalRecord[], 
//   filters: TrialBalanceFilterState
// ) => {
//   const trialBalanceData = useMemo(() => {
//     if (!rawData.length) {
//       return {
//         records: [] as TrialBalanceRecord[],
//         summary: {
//           totalOpeningDr: 0,
//           totalOpeningCr: 0,
//           totalMovementDr: 0,
//           totalMovementCr: 0,
//           totalBalance: 0,
//           recordCount: 0
//         } as TrialBalanceSummary
//       }
//     }

//     console.log('🧮 Starting CORRECTED Trial Balance Cal-6 calculation...')

//     // Helper function to process final records
//     const processRecords = (records: TrialBalanceRecord[]) => {
//       let finalRecords = records
//       if (!filters.showZeroBalance) {
//         finalRecords = records.filter(record => 
//           record.openingDr !== 0 || 
//           record.openingCr !== 0 || 
//           record.movementDr !== 0 || 
//           record.movementCr !== 0 || 
//           record.balance !== 0
//         )
//         console.log(`🚫 After hiding zero balance: ${finalRecords.length} records`)
//       }

//       const summary: TrialBalanceSummary = {
//         totalOpeningDr: finalRecords.reduce((sum, r) => sum + r.openingDr, 0),
//         totalOpeningCr: finalRecords.reduce((sum, r) => sum + r.openingCr, 0),
//         totalMovementDr: finalRecords.reduce((sum, r) => sum + r.movementDr, 0),
//         totalMovementCr: finalRecords.reduce((sum, r) => sum + r.movementCr, 0),
//         totalBalance: finalRecords.reduce((sum, r) => sum + r.balance, 0),
//         recordCount: finalRecords.length
//       }

//       return { records: finalRecords, summary }
//     }

//     // ===== STEP 1: Check Date Filter Requirements =====
//     const hasDateFilter = filters.dateFrom || filters.dateTo
//     const hasAccountFilter = filters.acName

//     if (hasDateFilter && !hasAccountFilter) {
//       console.log('⚠️ Date filter requires account filter - ignoring date filter')
//     }

//     // ===== STEP 2: Apply Normal Filters (Account, Description, Entry Type) =====
//     let filteredData = [...rawData]

//     if (filters.acName) {
//       filteredData = filteredData.filter(record => record.acName === filters.acName)
//       console.log(`🏦 Account filter (${filters.acName}): ${filteredData.length} records`)
//     }

//     if (filters.description) {
//       filteredData = filteredData.filter(record => 
//         record.description.toLowerCase().includes(filters.description.toLowerCase())
//       )
//       console.log(`📝 Description filter: ${filteredData.length} records`)
//     }

//     if (filters.entryType === 'credit_only') {
//       filteredData = filteredData.filter(record => record.amountCr > 0)
//       console.log(`💚 Credit-only filter: ${filteredData.length} records`)
//     } else if (filters.entryType === 'debit_only') {
//       filteredData = filteredData.filter(record => record.amountDb > 0)
//       console.log(`❤️ Debit-only filter: ${filteredData.length} records`)
//     }

//     // ===== STEP 3: Apply "To Date" as Normal Filter =====
//     if (hasAccountFilter && filters.dateTo) {
//       const toDate = new Date(filters.dateTo)
//       toDate.setHours(23, 59, 59, 999)
      
//       filteredData = filteredData.filter(record => {
//         const recordDate = new Date(record.date)
//         return recordDate <= toDate
//       })
      
//       console.log(`📅 "To Date" filter (${filters.dateTo}): ${filteredData.length} records`)
//     }

//     // ===== STEP 4: Apply Date Categorization Logic =====
//     const shouldApplyDateCategorization = hasAccountFilter && filters.dateFrom
    
//     if (shouldApplyDateCategorization) {
//       console.log('📅 Applying date categorization logic...')
      
//       const fromDate = new Date(filters.dateFrom)
//       fromDate.setHours(0, 0, 0, 0)

//       // Group by account and apply date categorization
//       const accountGroups = filteredData.reduce((acc, record) => {
//         const acName = record.acName || 'Unknown Account'
        
//         if (!acc[acName]) {
//           acc[acName] = {
//             originalOpeningRecords: [],
//             beforeFromDateRecords: [],
//             fromDateOnwardsRecords: []
//           }
//         }
        
//         // Check if record is before "From Date"
//         const recordDate = new Date(record.date)
//         recordDate.setHours(0, 0, 0, 0)
//         const isBeforeFromDate = recordDate < fromDate

//         // Categorize records
//         if (record.isOpening) {
//           // Original opening records always go to opening
//           acc[acName].originalOpeningRecords.push(record)
//         } else {
//           if (isBeforeFromDate) {
//             // Regular records BEFORE "From Date" become opening
//             acc[acName].beforeFromDateRecords.push(record)
//           } else {
//             // Regular records FROM "From Date" onwards become movement
//             acc[acName].fromDateOnwardsRecords.push(record)
//           }
//         }
        
//         return acc
//       }, {} as Record<string, {
//         originalOpeningRecords: RawJournalRecord[]
//         beforeFromDateRecords: RawJournalRecord[]
//         fromDateOnwardsRecords: RawJournalRecord[]
//       }>)

//       // Create trial balance records with date categorization
//       const records: TrialBalanceRecord[] = Object.entries(accountGroups).map(([acName, data]) => {
//         console.log(`💰 Processing ${acName} with date categorization:`)
//         console.log(`   Original opening: ${data.originalOpeningRecords.length}`)
//         console.log(`   Before from-date: ${data.beforeFromDateRecords.length}`)
//         console.log(`   From-date onwards: ${data.fromDateOnwardsRecords.length}`)

//         // Calculate opening totals (original opening + before from-date)
//         const originalOpeningDr = data.originalOpeningRecords.reduce((sum, r) => sum + r.amountDb, 0)
//         const originalOpeningCr = data.originalOpeningRecords.reduce((sum, r) => sum + r.amountCr, 0)
//         const beforeFromDateDr = data.beforeFromDateRecords.reduce((sum, r) => sum + r.amountDb, 0)
//         const beforeFromDateCr = data.beforeFromDateRecords.reduce((sum, r) => sum + r.amountCr, 0)

//         // Total opening = original + before from-date
//         const totalOpeningDr = originalOpeningDr + beforeFromDateDr
//         const totalOpeningCr = originalOpeningCr + beforeFromDateCr

//         // Calculate net opening balance
//         const netOpeningBalance = totalOpeningCr - totalOpeningDr

//         // ✅ KEY LOGIC: Consolidate opening balance based on sign
//         let finalOpeningDr = 0
//         let finalOpeningCr = 0
        
//         if (netOpeningBalance < 0) {
//           finalOpeningDr = Math.abs(netOpeningBalance)
//           finalOpeningCr = 0
//         } else if (netOpeningBalance > 0) {
//           finalOpeningDr = 0
//           finalOpeningCr = netOpeningBalance
//         }

//         // Movement totals (from from-date onwards)
//         const movementDr = data.fromDateOnwardsRecords.reduce((sum, r) => sum + r.amountDb, 0)
//         const movementCr = data.fromDateOnwardsRecords.reduce((sum, r) => sum + r.amountCr, 0)

//         // Final balance calculation
//         const totalCredits = finalOpeningCr + movementCr
//         const totalDebits = finalOpeningDr + movementDr
//         const balance = totalCredits - totalDebits

//         console.log(`   Result: Opening(${finalOpeningDr}/${finalOpeningCr}) + Movement(${movementDr}/${movementCr}) = Balance(${balance})`)

//         return {
//           acName,
//           openingDr: finalOpeningDr,
//           openingCr: finalOpeningCr,
//           movementDr: movementDr,
//           movementCr: movementCr,
//           balance
//         }
//       }).sort((a, b) => a.acName.localeCompare(b.acName))

//       return processRecords(records)
//     }

//     // ===== STEP 5: Standard Processing (No Date Categorization) =====
//     console.log('📊 Standard processing - no date categorization applied')
    
//     const accountGroups = filteredData.reduce((acc, record) => {
//       const acName = record.acName || 'Unknown Account'
      
//       if (!acc[acName]) {
//         acc[acName] = {
//           openingDr: 0,
//           openingCr: 0,
//           movementDr: 0,
//           movementCr: 0
//         }
//       }
      
//       if (record.isOpening) {
//         acc[acName].openingDr += record.amountDb
//         acc[acName].openingCr += record.amountCr
//       } else {
//         acc[acName].movementDr += record.amountDb
//         acc[acName].movementCr += record.amountCr
//       }
      
//       return acc
//     }, {} as Record<string, {
//       openingDr: number
//       openingCr: number
//       movementDr: number
//       movementCr: number
//     }>)

//     const records: TrialBalanceRecord[] = Object.entries(accountGroups).map(([acName, data]) => {
//       const totalCredits = data.openingCr + data.movementCr
//       const totalDebits = data.openingDr + data.movementDr
//       const balance = totalCredits - totalDebits

//       return {
//         acName,
//         openingDr: data.openingDr,
//         openingCr: data.openingCr,
//         movementDr: data.movementDr,
//         movementCr: data.movementCr,
//         balance
//       }
//     }).sort((a, b) => a.acName.localeCompare(b.acName))

//     return processRecords(records)
//   }, [rawData, filters])

//   return trialBalanceData
// }





































import { useMemo } from 'react'
import { RawJournalRecord, TrialBalanceRecord, TrialBalanceFilterState, TrialBalanceSummary } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

export const useTrialBalanceCal6 = (
  rawData: RawJournalRecord[], 
  filters: TrialBalanceFilterState
) => {
  const trialBalanceData = useMemo(() => {
    if (!rawData.length) {
      return {
        records: [] as TrialBalanceRecord[],
        summary: {
          totalOpeningDr: 0,
          totalOpeningCr: 0,
          totalMovementDr: 0,
          totalMovementCr: 0,
          totalBalance: 0,
          recordCount: 0
        } as TrialBalanceSummary
      }
    }

    console.log('🧮 Starting CORRECTED Trial Balance Cal-6 calculation...')

    // Helper function to process final records
    const processRecords = (records: TrialBalanceRecord[]) => {
      let finalRecords = records
      if (!filters.showZeroBalance) {
        finalRecords = records.filter(record => 
          record.openingDr !== 0 || 
          record.openingCr !== 0 || 
          record.movementDr !== 0 || 
          record.movementCr !== 0 || 
          record.balance !== 0
        )
        console.log(`🚫 After hiding zero balance: ${finalRecords.length} records`)
      }

      const summary: TrialBalanceSummary = {
        totalOpeningDr: finalRecords.reduce((sum, r) => sum + r.openingDr, 0),
        totalOpeningCr: finalRecords.reduce((sum, r) => sum + r.openingCr, 0),
        totalMovementDr: finalRecords.reduce((sum, r) => sum + r.movementDr, 0),
        totalMovementCr: finalRecords.reduce((sum, r) => sum + r.movementCr, 0),
        totalBalance: finalRecords.reduce((sum, r) => sum + r.balance, 0),
        recordCount: finalRecords.length
      }

      return { records: finalRecords, summary }
    }

    // ===== STEP 1: Apply Normal Filters (Account, Description, Entry Type) =====
    let filteredData = [...rawData]

    if (filters.acName) {
      filteredData = filteredData.filter(record => record.acName === filters.acName)
      console.log(`🏦 Account filter (${filters.acName}): ${filteredData.length} records`)
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

    // ===== STEP 2: Apply ONLY "To Date" as Normal Filter =====
    // ✅ CRITICAL: Only "To Date" filters the data, "From Date" is for categorization only
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      
      filteredData = filteredData.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate <= toDate
      })
      
      console.log(`📅 "To Date" filter (${filters.dateTo}): ${filteredData.length} records`)
      console.log(`📅 Data now includes records from beginning to ${filters.dateTo}`)
    }

    // ===== STEP 3: Apply Date Categorization Logic =====
    const shouldApplyDateCategorization = filters.dateFrom
    
    if (shouldApplyDateCategorization) {
      console.log('📅 Applying date categorization logic...')
      console.log(`📅 "From Date" (${filters.dateFrom}) used as categorization boundary only`)
      
      const fromDate = new Date(filters.dateFrom)
      fromDate.setHours(0, 0, 0, 0)

      // Group by account and apply date categorization
      const accountGroups = filteredData.reduce((acc, record) => {
        const acName = record.acName || 'Unknown Account'
        
        if (!acc[acName]) {
          acc[acName] = {
            originalOpeningRecords: [],
            beforeFromDateRecords: [],
            fromDateOnwardsRecords: []
          }
        }
        
        // Check if record is before "From Date"
        const recordDate = new Date(record.date)
        recordDate.setHours(0, 0, 0, 0)
        const isBeforeFromDate = recordDate < fromDate

        // ✅ CORRECT CATEGORIZATION
        if (record.isOpening) {
          // Original opening records always go to opening
          acc[acName].originalOpeningRecords.push(record)
        } else {
          if (isBeforeFromDate) {
            // Regular records BEFORE "From Date" become opening
            acc[acName].beforeFromDateRecords.push(record)
          } else {
            // Regular records FROM "From Date" onwards become movement
            acc[acName].fromDateOnwardsRecords.push(record)
          }
        }
        
        return acc
      }, {} as Record<string, {
        originalOpeningRecords: RawJournalRecord[]
        beforeFromDateRecords: RawJournalRecord[]
        fromDateOnwardsRecords: RawJournalRecord[]
      }>)

      // Create trial balance records with date categorization
      const records: TrialBalanceRecord[] = Object.entries(accountGroups).map(([acName, data]) => {
        console.log(`💰 Processing ${acName} with CORRECTED categorization:`)
        console.log(`   Original opening: ${data.originalOpeningRecords.length}`)
        console.log(`   Before from-date (${filters.dateFrom}): ${data.beforeFromDateRecords.length}`)
        console.log(`   From-date onwards: ${data.fromDateOnwardsRecords.length}`)

        // Calculate opening totals (original opening + before from-date)
        const originalOpeningDr = data.originalOpeningRecords.reduce((sum, r) => sum + r.amountDb, 0)
        const originalOpeningCr = data.originalOpeningRecords.reduce((sum, r) => sum + r.amountCr, 0)
        const beforeFromDateDr = data.beforeFromDateRecords.reduce((sum, r) => sum + r.amountDb, 0)
        const beforeFromDateCr = data.beforeFromDateRecords.reduce((sum, r) => sum + r.amountCr, 0)

        // Total opening = original + before from-date
        const totalOpeningDr = originalOpeningDr + beforeFromDateDr
        const totalOpeningCr = originalOpeningCr + beforeFromDateCr

        // Calculate net opening balance
        const netOpeningBalance = totalOpeningCr - totalOpeningDr

        // ✅ KEY LOGIC: Consolidate opening balance based on sign
        let finalOpeningDr = 0
        let finalOpeningCr = 0
        
        if (netOpeningBalance < 0) {
          finalOpeningDr = Math.abs(netOpeningBalance)
          finalOpeningCr = 0
        } else if (netOpeningBalance > 0) {
          finalOpeningDr = 0
          finalOpeningCr = netOpeningBalance
        }

        // Movement totals (from from-date onwards)
        const movementDr = data.fromDateOnwardsRecords.reduce((sum, r) => sum + r.amountDb, 0)
        const movementCr = data.fromDateOnwardsRecords.reduce((sum, r) => sum + r.amountCr, 0)

        // Final balance calculation
        const totalCredits = finalOpeningCr + movementCr
        const totalDebits = finalOpeningDr + movementDr
        const balance = totalCredits - totalDebits

        console.log(`   CORRECTED Result: Opening(${finalOpeningDr}/${finalOpeningCr}) + Movement(${movementDr}/${movementCr}) = Balance(${balance})`)

        return {
          acName,
          openingDr: finalOpeningDr,
          openingCr: finalOpeningCr,
          movementDr: movementDr,
          movementCr: movementCr,
          balance
        }
      }).sort((a, b) => a.acName.localeCompare(b.acName))

      return processRecords(records)
    }

    // ===== STEP 4: Standard Processing (No Date Categorization) =====
    console.log('📊 Standard processing - no date categorization applied')
    
    const accountGroups = filteredData.reduce((acc, record) => {
      const acName = record.acName || 'Unknown Account'
      
      if (!acc[acName]) {
        acc[acName] = {
          openingDr: 0,
          openingCr: 0,
          movementDr: 0,
          movementCr: 0
        }
      }
      
      if (record.isOpening) {
        acc[acName].openingDr += record.amountDb
        acc[acName].openingCr += record.amountCr
      } else {
        acc[acName].movementDr += record.amountDb
        acc[acName].movementCr += record.amountCr
      }
      
      return acc
    }, {} as Record<string, {
      openingDr: number
      openingCr: number
      movementDr: number
      movementCr: number
    }>)

    const records: TrialBalanceRecord[] = Object.entries(accountGroups).map(([acName, data]) => {
      const totalCredits = data.openingCr + data.movementCr
      const totalDebits = data.openingDr + data.movementDr
      const balance = totalCredits - totalDebits

      return {
        acName,
        openingDr: data.openingDr,
        openingCr: data.openingCr,
        movementDr: data.movementDr,
        movementCr: data.movementCr,
        balance
      }
    }).sort((a, b) => a.acName.localeCompare(b.acName))

    return processRecords(records)
  }, [rawData, filters])

  return trialBalanceData
}
