// import { useMemo } from 'react'
// import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

// export const useBalanceCalculation = (data: ProcessedRecord[]) => {
//   const dataWithBalance = useMemo(() => {
//     if (!data.length) return []

//     // ✅ Sort by ID first, then by line ID or date for consistent order
//     const sortedData = [...data].sort((a, b) => {
//       if (a.id !== b.id) {
//         return a.id - b.id
//       }
//       // Secondary sort by date
//       return new Date(a.date).getTime() - new Date(b.date).getTime()
//     })

//     console.log('🧮 Calculating running balances...')

//     let previousBalance = 0
//     let currentId: number | null = null

//     return sortedData.map((record, index) => {
//       // ✅ Reset balance when ID changes (new voucher group)
//       if (currentId !== record.id) {
//         console.log(`🔄 New ID ${record.id}, resetting balance from ${previousBalance} to 0`)
//         previousBalance = 0
//         currentId = record.id
//       }

//       // ✅ Calculate current balance: Credit - Debit + Previous Balance
//       const currentBalance = record.amountCr - record.amountDb + previousBalance
      
//       console.log(`ID ${record.id}: ${record.amountCr} - ${record.amountDb} + ${previousBalance} = ${currentBalance}`)

//       // ✅ Update previous balance for next iteration
//       previousBalance = currentBalance

//       return {
//         ...record,
//         balance: currentBalance
//       }
//     })
//   }, [data])

//   return dataWithBalance
// }










// calculate fomr the start and go all the way down





import { useMemo } from 'react'
import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

export const useBalanceCalculation = (filteredData: ProcessedRecord[]) => {
  const dataWithBalance = useMemo(() => {
    if (!filteredData.length) return []

    console.log('🧮 Starting balance calculation on FILTERED data:', filteredData.length, 'records')
    console.log('🎯 Balance will start from 0 and calculate: Credit - Debit + Previous Balance')
    
    // Start with running balance = 0 for filtered data
    let runningBalance = 0
    
    const result = filteredData.map((record, index) => {
      // Balance formula: Credit - Debit + Previous Balance
      const credit = Number(record.amountCr) || 0
      const debit = Number(record.amountDb) || 0
      const currentBalance = credit - debit + runningBalance
      
      console.log(`Row ${index + 1}: ${credit} - ${debit} + ${runningBalance} = ${currentBalance}`)
      
      // Update running balance for next iteration
      runningBalance = currentBalance
      
      return {
        ...record,
        balance: currentBalance,
        rowIndex: index + 1
      }
    })

    console.log('✅ Balance calculation complete on filtered data')
    console.log('📊 Final balance:', runningBalance)
    
    return result
  }, [filteredData])

  return dataWithBalance
}
