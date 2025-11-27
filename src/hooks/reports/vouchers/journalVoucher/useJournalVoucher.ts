// import { useMemo } from 'react'
// import { 
//   RawJournalVoucherRecord, 
//   JournalVoucherRecord, 
//   JournalVoucherFilterState,
//   JournalVoucherHeader,
//   BalanceRow
// } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'




// // import { RawJournalVoucherRecord, JournalVoucherFilterOptions } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'
// import { VOUCHER_TYPES } from '@/constants/voucherTypes'

// export const useJournalVoucher = (
//   rawData: RawJournalVoucherRecord[], 
//   filters: JournalVoucherFilterState
// ) => {
//   const journalVoucherData = useMemo(() => {
//     if (!rawData.length) {
//       return {
//         records: [] as JournalVoucherRecord[],
//         header: null as JournalVoucherHeader | null,
//         balanceRows: [] as BalanceRow[],
//         filteredVoucherNos: [] as string[]
//       }
//     }

//     console.log('🎫 Processing Journal Voucher data...')

//     // STEP 1: Filter by Voucher Type (Mandatory First Filter)
//     let filteredByType = rawData
//     if (filters.voucherTypeId) {
//       filteredByType = rawData.filter(record => record.voucherTypeId === filters.voucherTypeId)
//       console.log(`🏷️ After voucher type filter (${filters.voucherTypeId}): ${filteredByType.length} records`)
//     }

//     // Get available voucher numbers for second filter
//     const filteredVoucherNos = [...new Set(filteredByType.map(r => r.voucherNo))].filter(Boolean).sort()

//     // STEP 2: Filter by Voucher Number (Mandatory Second Filter)
//     let finalData: RawJournalVoucherRecord[] = []
//     let header: JournalVoucherHeader | null = null

//     if (filters.voucherNo && filters.voucherTypeId) {
//       finalData = filteredByType.filter(record => record.voucherNo === filters.voucherNo)
//       console.log(`🎫 After voucher number filter (${filters.voucherNo}): ${finalData.length} records`)

//       // Create header information
//       if (finalData.length > 0) {
//         const firstRecord = finalData[0]
//         const voucherTypeName = VOUCHER_TYPES.find(vt => vt.id === filters.voucherTypeId)?.name || 'Unknown'
        
//         header = {
//           voucherTypeName,
//           voucherNo: filters.voucherNo,
//           date: firstRecord.date,
//           totalDebit: finalData.reduce((sum, r) => sum + r.amountDb, 0),
//           totalCredit: finalData.reduce((sum, r) => sum + r.amountCr, 0),
//           totalOwnDebit: finalData.reduce((sum, r) => sum + r.ownDb, 0),
//           totalOwnCredit: finalData.reduce((sum, r) => sum + r.ownCr, 0)
//         }
//       }
//     }

//     // STEP 3: Convert to display format
//     const records: JournalVoucherRecord[] = finalData.map(record => ({
//       id: record.id,
//       voucherNo: record.voucherNo,
//       voucherTypeId: record.voucherTypeId,
//       voucherTypeName: VOUCHER_TYPES.find(vt => vt.id === record.voucherTypeId)?.name || 'Unknown',
//       date: record.date,
//       acName: record.acName,
//       description: record.description,
//       receiptNo: record.receiptNo,
//       ownDebit: record.ownDb,
//       ownCredit: record.ownCr,
//       rate: record.rate,
//       currencyName: record.currencyName,
//       debit: record.amountDb,
//       credit: record.amountCr
//     }))

//     // STEP 4: Calculate Opening and Closing Balance Rows
//     const balanceRows: BalanceRow[] = []
    
//     if (records.length > 0 && header) {
//       // Calculate cash opening balance (assuming first record or specific logic)
//       const openingBalance = records[0] // You may need to adjust this logic
//       const closingOwnDebit = header.totalOwnDebit
//       const closingOwnCredit = header.totalOwnCredit
//       const closingDebit = header.totalDebit
//       const closingCredit = header.totalCredit

//       balanceRows.push(
//         {
//           type: 'opening',
//           description: 'Cash Opening Balance',
//           ownDebit: 0, // You may need to calculate this from previous records
//           ownCredit: 0,
//           debit: 0,
//           credit: 0
//         },
//         {
//           type: 'closing',
//           description: 'Cash Closing Balance',
//           ownDebit: closingOwnDebit,
//           ownCredit: closingOwnCredit,
//           debit: closingDebit,
//           credit: closingCredit
//         }
//       )
//     }

//     console.log('✅ Journal Voucher processing complete')
//     console.log(`📊 Records: ${records.length}, Header: ${header ? 'Generated' : 'None'}`)

//     return {
//       records,
//       header,
//       balanceRows,
//       filteredVoucherNos
//     }
//   }, [rawData, filters])

//   return journalVoucherData
// }



































import { useMemo } from 'react'
import { 
  RawJournalVoucherRecord, 
  JournalVoucherRecord, 
  JournalVoucherFilterState,
  JournalVoucherHeader,
  BalanceRow
} from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'
import { VOUCHER_TYPES } from '@/constants/voucherTypes'

export const useJournalVoucher = (
  rawData: RawJournalVoucherRecord[], 
  filters: JournalVoucherFilterState
) => {
  const journalVoucherData = useMemo(() => {
    if (!rawData.length) {
      return {
        records: [] as JournalVoucherRecord[],
        header: null as JournalVoucherHeader | null,
        balanceRows: [] as BalanceRow[],
        filteredVoucherNos: [] as string[]
      }
    }

    console.log('🎫 Processing Journal Voucher data...')

    // ✅ DOUBLE PROTECTION: Filter out "Auto Balancing Entry" again at processing level
    const cleanedData = rawData.filter(record => {
      const description = record.description?.trim() || ''
      const isAutoBalancing = 
        description === "Auto Balancing Entry" ||
        description === "auto balancing entry" ||
        description.toLowerCase() === "auto balancing entry" ||
        description.includes("Auto Balancing Entry") ||
        description.includes("auto balancing entry")
      
      return !isAutoBalancing
    })

    console.log(`🚫 Double-check filter: ${cleanedData.length} records (removed ${rawData.length - cleanedData.length} more)`)

    // STEP 1: Filter by Voucher Type (Mandatory First Filter)
    let filteredByType = cleanedData
    if (filters.voucherTypeId) {
      filteredByType = cleanedData.filter(record => record.voucherTypeId === filters.voucherTypeId)
      console.log(`🏷️ After voucher type filter (${filters.voucherTypeId}): ${filteredByType.length} records`)
    }

    // Get available voucher numbers for second filter
    const filteredVoucherNos = [...new Set(filteredByType.map(r => r.voucherNo))].filter(Boolean).sort()

    // STEP 2: Filter by Voucher Number (Mandatory Second Filter)
    let finalData: RawJournalVoucherRecord[] = []
    let header: JournalVoucherHeader | null = null

    if (filters.voucherNo && filters.voucherTypeId) {
      finalData = filteredByType.filter(record => record.voucherNo === filters.voucherNo)
      console.log(`🎫 After voucher number filter (${filters.voucherNo}): ${finalData.length} records`)

      // ✅ FINAL CHECK: Log what descriptions we have
      console.log('📋 Final data descriptions:', finalData.map(r => `"${r.description}"`))

      // Create header information
      if (finalData.length > 0) {
        const firstRecord = finalData[0]
        const voucherTypeName = VOUCHER_TYPES.find(vt => vt.id === filters.voucherTypeId)?.name || 'Unknown'
        
        header = {
          voucherTypeName,
          voucherNo: filters.voucherNo,
          date: firstRecord.date,
          totalDebit: finalData.reduce((sum, r) => sum + r.amountDb, 0),
          totalCredit: finalData.reduce((sum, r) => sum + r.amountCr, 0),
          totalOwnDebit: finalData.reduce((sum, r) => sum + r.ownDb, 0),
          totalOwnCredit: finalData.reduce((sum, r) => sum + r.ownCr, 0)
        }
      }
    }

    // STEP 3: Convert to display format
    const records: JournalVoucherRecord[] = finalData.map(record => ({
      id: record.id,
      voucherNo: record.voucherNo,
      voucherTypeId: record.voucherTypeId,
      voucherTypeName: VOUCHER_TYPES.find(vt => vt.id === record.voucherTypeId)?.name || 'Unknown',
      date: record.date,
      acName: record.acName,
      description: record.description,
      receiptNo: record.receiptNo,
      ownDebit: record.ownDb,
      ownCredit: record.ownCr,
      rate: record.rate,
      currencyName: record.currencyName,
      debit: record.amountDb,
      credit: record.amountCr
    }))

    // STEP 4: Calculate Opening and Closing Balance Rows
    const balanceRows: BalanceRow[] = []
    
    if (records.length > 0 && header) {
      balanceRows.push(
        {
          type: 'opening',
          description: 'Cash Opening Balance',
          ownDebit: 0,
          ownCredit: 0,
          debit: 0,
          credit: 0
        },
        {
          type: 'closing',
          description: 'Cash Closing Balance',
          ownDebit: header.totalOwnDebit,
          ownCredit: header.totalOwnCredit,
          debit: header.totalDebit,
          credit: header.totalCredit
        }
      )
    }

    console.log('✅ Journal Voucher processing complete')
    console.log(`📊 Records: ${records.length}, Header: ${header ? 'Generated' : 'None'}`)

    return {
      records,
      header,
      balanceRows,
      filteredVoucherNos
    }
  }, [rawData, filters])

  return journalVoucherData
}
