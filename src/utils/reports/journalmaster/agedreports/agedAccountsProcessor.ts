// import { Transaction, FilterParams, AccountSummary, AgedAccountsResult, PhaseData } from '@/types/AgedAccountsTypes'

// export class AgedAccountsProcessor {
  
//   // Calculate phase boundaries based on as-of date and phase days
//   private calculatePhaseBoundaries(asOfDate: string, phaseDays: number) {
//     const asOf = new Date(asOfDate)
    
//     // Phase 3: [T - (D-1), T] - newest
//     const phase3Start = new Date(asOf)
//     phase3Start.setDate(phase3Start.getDate() - (phaseDays - 1))
    
//     // Phase 2: [T - (2D-1), T - D] - middle
//     const phase2End = new Date(phase3Start)
//     phase2End.setDate(phase2End.getDate() - 1)
    
//     const phase2Start = new Date(asOf)
//     phase2Start.setDate(phase2Start.getDate() - (2 * phaseDays - 1))
    
//     // Phase 1: (-∞, T - 2D] - oldest
//     const phase1End = new Date(phase2Start)
//     phase1End.setDate(phase1End.getDate() - 1)
    
//     return {
//       phase1End,
//       phase2Start,
//       phase2End,
//       phase3Start,
//       asOf
//     }
//   }

//   // Assign debit amount to appropriate phase based on transaction date
//   private assignDebitToPhase(transactionDate: string, amount: number, boundaries: any): PhaseData {
//     const txDate = new Date(transactionDate)
//     const phases: PhaseData = { phase1: 0, phase2: 0, phase3: 0 }
    
//     if (txDate <= boundaries.phase1End) {
//       phases.phase1 = amount
//     } else if (txDate >= boundaries.phase2Start && txDate <= boundaries.phase2End) {
//       phases.phase2 = amount
//     } else if (txDate >= boundaries.phase3Start && txDate <= boundaries.asOf) {
//       phases.phase3 = amount
//     }
    
//     return phases
//   }

//   // Apply FIFO payment allocation across phases
//   private applyFifoPayments(totalDebits: PhaseData, totalCredits: number): { outstanding: PhaseData, advance: number } {
//     let remainingCredits = totalCredits
//     const outstanding: PhaseData = { ...totalDebits }
    
//     // Apply to Phase 1 first (oldest)
//     if (remainingCredits > 0 && outstanding.phase1 > 0) {
//       const applied = Math.min(remainingCredits, outstanding.phase1)
//       outstanding.phase1 -= applied
//       remainingCredits -= applied
//     }
    
//     // Apply remainder to Phase 2
//     if (remainingCredits > 0 && outstanding.phase2 > 0) {
//       const applied = Math.min(remainingCredits, outstanding.phase2)
//       outstanding.phase2 -= applied
//       remainingCredits -= applied
//     }
    
//     // Apply remainder to Phase 3
//     if (remainingCredits > 0 && outstanding.phase3 > 0) {
//       const applied = Math.min(remainingCredits, outstanding.phase3)
//       outstanding.phase3 -= applied
//       remainingCredits -= applied
//     }
    
//     return {
//       outstanding,
//       advance: remainingCredits // Any leftover becomes customer advance
//     }
//   }

//   // Main processing function
//   public processAgedAccounts(transactions: Transaction[], filterParams: FilterParams): AgedAccountsResult {
//     const { accountPrefix, asOfDate, phaseDays } = filterParams
    
//     // Validation
//     if (phaseDays <= 0) {
//       throw new Error('Phase days must be a positive integer')
//     }
    
//     console.log('🔄 Processing Aged Accounts Report...', filterParams)
    
//     // STEP 1: Filter accounts by prefix and date
//     const filteredTransactions = transactions.filter(tx => 
//       tx.account_name.toLowerCase().startsWith(accountPrefix.toLowerCase()) &&
//       new Date(tx.date) <= new Date(asOfDate)
//     )
    
//     if (filteredTransactions.length === 0) {
//       return {
//         accounts: [],
//         grandTotals: {
//           totalDebits: 0,
//           totalCredits: 0,
//           netBalance: 0,
//           outstanding: { phase1: 0, phase2: 0, phase3: 0 },
//           totalAdvance: 0
//         },
//         filterParams
//       }
//     }
    
//     // STEP 2: Group by account and sort transactions
//     const accountGroups = new Map<number, Transaction[]>()
    
//     filteredTransactions.forEach(tx => {
//       if (!accountGroups.has(tx.account_id)) {
//         accountGroups.set(tx.account_id, [])
//       }
//       accountGroups.get(tx.account_id)!.push(tx)
//     })
    
//     // STEP 3: Calculate phase boundaries
//     const boundaries = this.calculatePhaseBoundaries(asOfDate, phaseDays)
    
//     console.log('📅 Phase Boundaries:', {
//       phase1: `Before ${boundaries.phase1End.toDateString()}`,
//       phase2: `${boundaries.phase2Start.toDateString()} to ${boundaries.phase2End.toDateString()}`,
//       phase3: `${boundaries.phase3Start.toDateString()} to ${boundaries.asOf.toDateString()}`
//     })
    
//     // STEP 4: Process each account
//     const accounts: AccountSummary[] = []
    
//     for (const [accountId, accountTransactions] of accountGroups.entries()) {
//       // Sort transactions: date ascending, debits before credits on same date
//       const sortedTransactions = accountTransactions.sort((a, b) => {
//         const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
//         if (dateCompare !== 0) return dateCompare
        
//         // Same date: debits before credits (unless sequence specified)
//         if (a.sequence !== undefined && b.sequence !== undefined) {
//           return a.sequence - b.sequence
//         }
        
//         if (a.type === 'debit' && b.type === 'credit') return -1
//         if (a.type === 'credit' && b.type === 'debit') return 1
//         return 0
//       })
      
//       const accountName = sortedTransactions[0].account_name
      
//       // Calculate totals
//       let totalDebits = 0
//       let totalCredits = 0
//       const debitsByPhase: PhaseData = { phase1: 0, phase2: 0, phase3: 0 }
      
//       sortedTransactions.forEach(tx => {
//         if (tx.type === 'debit') {
//           totalDebits += tx.amount
          
//           // Assign debit to phase based on transaction date
//           const phaseAssignment = this.assignDebitToPhase(tx.date, tx.amount, boundaries)
//           debitsByPhase.phase1 += phaseAssignment.phase1
//           debitsByPhase.phase2 += phaseAssignment.phase2
//           debitsByPhase.phase3 += phaseAssignment.phase3
//         } else {
//           totalCredits += tx.amount
//         }
//       })
      
//       const netBalance = totalDebits - totalCredits
      
//       // Only process accounts with positive balance (customers who owe money)
//       if (netBalance > 0) {
//         // Apply FIFO payment allocation
//         const { outstanding, advance } = this.applyFifoPayments(debitsByPhase, totalCredits)
        
//         accounts.push({
//           accountId,
//           accountName,
//           totalDebits,
//           totalCredits,
//           netBalance,
//           outstanding,
//           advance
//         })
        
//         console.log(`💰 ${accountName}: Outstanding Phase 1: ${outstanding.phase1}, Phase 2: ${outstanding.phase2}, Phase 3: ${outstanding.phase3}`)
//       } else {
//         // Customer has credit balance (overpaid)
//         accounts.push({
//           accountId,
//           accountName,
//           totalDebits,
//           totalCredits,
//           netBalance,
//           outstanding: { phase1: 0, phase2: 0, phase3: 0 },
//           advance: Math.abs(netBalance)
//         })
//       }
//     }
    
//     // STEP 5: Calculate grand totals
//     const grandTotals = accounts.reduce((totals, account) => ({
//       totalDebits: totals.totalDebits + account.totalDebits,
//       totalCredits: totals.totalCredits + account.totalCredits,
//       netBalance: totals.netBalance + account.netBalance,
//       outstanding: {
//         phase1: totals.outstanding.phase1 + account.outstanding.phase1,
//         phase2: totals.outstanding.phase2 + account.outstanding.phase2,
//         phase3: totals.outstanding.phase3 + account.outstanding.phase3
//       },
//       totalAdvance: totals.totalAdvance + account.advance
//     }), {
//       totalDebits: 0,
//       totalCredits: 0,
//       netBalance: 0,
//       outstanding: { phase1: 0, phase2: 0, phase3: 0 },
//       totalAdvance: 0
//     })
    
//     console.log('✅ Aged Accounts Processing Complete', {
//       accountsProcessed: accounts.length,
//       grandTotals
//     })
    
//     return {
//       accounts: accounts.sort((a, b) => a.accountName.localeCompare(b.accountName)),
//       grandTotals,
//       filterParams
//     }
//   }
// }












































// import { Transaction, FilterParams, AccountSummary, AgedAccountsResult, PhaseData } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

// export class AgedAccountsProcessor {
  
//   /**
//    * Calculate phase boundaries based on as-of date and phase days
//    * Phase 3 (Newest): Last D days
//    * Phase 2 (Middle): D+1 to 2D days ago  
//    * Phase 1 (Oldest): Everything older than 2D days
//    */
//   private calculatePhaseBoundaries(asOfDate: string, phaseDays: number) {
//     const asOf = new Date(asOfDate)
    
//     // Phase 3: [T - (D-1), T] - newest transactions
//     const phase3Start = new Date(asOf)
//     phase3Start.setDate(phase3Start.getDate() - (phaseDays - 1))
    
//     // Phase 2: [T - (2D-1), T - D] - middle transactions
//     const phase2End = new Date(phase3Start)
//     phase2End.setDate(phase2End.getDate() - 1)
    
//     const phase2Start = new Date(asOf)
//     phase2Start.setDate(phase2Start.getDate() - (2 * phaseDays - 1))
    
//     // Phase 1: (-∞, T - 2D] - oldest transactions
//     const phase1End = new Date(phase2Start)
//     phase1End.setDate(phase1End.getDate() - 1)
    
//     console.log('📅 Calculated Phase Boundaries:', {
//       phase1: `Before or on ${phase1End.toDateString()}`,
//       phase2: `${phase2Start.toDateString()} to ${phase2End.toDateString()}`,
//       phase3: `${phase3Start.toDateString()} to ${asOf.toDateString()}`,
//       phaseDays
//     })
    
//     return {
//       phase1End,
//       phase2Start,
//       phase2End,
//       phase3Start,
//       asOf
//     }
//   }

//   /**
//    * Assign debit amount to appropriate phase based on transaction date
//    * Returns phase data with amount assigned to correct phase
//    */
//   private assignDebitToPhase(transactionDate: string, amount: number, boundaries: any): PhaseData {
//     const txDate = new Date(transactionDate)
//     const phases: PhaseData = { phase1: 0, phase2: 0, phase3: 0 }
    
//     // Assign to appropriate phase based on transaction date
//     if (txDate <= boundaries.phase1End) {
//       phases.phase1 = amount
//       console.log(`📊 Assigned $${amount} to Phase 1 (${transactionDate})`)
//     } else if (txDate >= boundaries.phase2Start && txDate <= boundaries.phase2End) {
//       phases.phase2 = amount
//       console.log(`📊 Assigned $${amount} to Phase 2 (${transactionDate})`)
//     } else if (txDate >= boundaries.phase3Start && txDate <= boundaries.asOf) {
//       phases.phase3 = amount
//       console.log(`📊 Assigned $${amount} to Phase 3 (${transactionDate})`)
//     } else {
//       // Transaction is outside our phase range (future dated or too old)
//       console.warn(`⚠️ Transaction ${transactionDate} with amount $${amount} falls outside phase boundaries`)
//     }
    
//     return phases
//   }

//   /**
//    * Apply FIFO payment allocation across phases
//    * Payments are applied to oldest phase first (Phase 1 → Phase 2 → Phase 3)
//    * Returns remaining outstanding amounts per phase and any customer advance
//    */
//   private applyFifoPayments(totalDebits: PhaseData, totalCredits: number): { outstanding: PhaseData, advance: number } {
//     let remainingCredits = totalCredits
//     const outstanding: PhaseData = { 
//       phase1: totalDebits.phase1,
//       phase2: totalDebits.phase2,
//       phase3: totalDebits.phase3
//     }
    
//     console.log('💳 Starting FIFO Payment Application:', {
//       totalCredits,
//       originalDebits: totalDebits
//     })
    
//     // STEP 1: Apply to Phase 1 first (oldest debts)
//     if (remainingCredits > 0 && outstanding.phase1 > 0) {
//       const applied = Math.min(remainingCredits, outstanding.phase1)
//       outstanding.phase1 -= applied
//       remainingCredits -= applied
//       console.log(`💰 Applied $${applied} to Phase 1. Remaining Phase 1: $${outstanding.phase1}, Credits left: $${remainingCredits}`)
//     }
    
//     // STEP 2: Apply remainder to Phase 2 (middle debts)
//     if (remainingCredits > 0 && outstanding.phase2 > 0) {
//       const applied = Math.min(remainingCredits, outstanding.phase2)
//       outstanding.phase2 -= applied
//       remainingCredits -= applied
//       console.log(`💰 Applied $${applied} to Phase 2. Remaining Phase 2: $${outstanding.phase2}, Credits left: $${remainingCredits}`)
//     }
    
//     // STEP 3: Apply remainder to Phase 3 (newest debts)
//     if (remainingCredits > 0 && outstanding.phase3 > 0) {
//       const applied = Math.min(remainingCredits, outstanding.phase3)
//       outstanding.phase3 -= applied
//       remainingCredits -= applied
//       console.log(`💰 Applied $${applied} to Phase 3. Remaining Phase 3: $${outstanding.phase3}, Credits left: $${remainingCredits}`)
//     }
    
//     // Any remaining credits become customer advance (prepaid balance)
//     const advance = remainingCredits
//     if (advance > 0) {
//       console.log(`💎 Customer advance (overpayment): $${advance}`)
//     }
    
//     console.log('✅ FIFO Payment Application Complete:', {
//       finalOutstanding: outstanding,
//       customerAdvance: advance
//     })
    
//     return { outstanding, advance }
//   }

//   /**
//    * Validate filter parameters
//    * Ensures all required fields are present and valid
//    */
//   private validateFilters(filterParams: FilterParams): void {
//     const { accountPrefix, asOfDate, phaseDays } = filterParams
    
//     if (!accountPrefix || accountPrefix.trim() === '') {
//       throw new Error('Account prefix is required and cannot be empty')
//     }
    
//     if (!asOfDate) {
//       throw new Error('As-of date is required')
//     }
    
//     const asOf = new Date(asOfDate)
//     if (isNaN(asOf.getTime())) {
//       throw new Error('Invalid as-of date format. Use YYYY-MM-DD format.')
//     }
    
//     if (!phaseDays || phaseDays <= 0) {
//       throw new Error('Phase days must be a positive integer greater than 0')
//     }
    
//     if (phaseDays > 365) {
//       console.warn('⚠️ Phase days is very large (>365). This may result in unexpected phase assignments.')
//     }
//   }

//   /**
//    * Sort transactions by date and type
//    * Same date: debits before credits (unless sequence specified)
//    */
//   private sortTransactions(transactions: Transaction[]): Transaction[] {
//     return transactions.sort((a, b) => {
//       // First sort by date (ascending - oldest first)
//       const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
//       if (dateCompare !== 0) return dateCompare
      
//       // Same date: check if sequence is provided
//       if (a.sequence !== undefined && b.sequence !== undefined) {
//         return a.sequence - b.sequence
//       }
      
//       // Default same-day ordering: debits before credits
//       if (a.type === 'debit' && b.type === 'credit') return -1
//       if (a.type === 'credit' && b.type === 'debit') return 1
      
//       // Same type, same date: maintain original order
//       return 0
//     })
//   }

//   /**
//    * Process a single account's transactions
//    * Calculate totals, phase assignments, and FIFO payment allocation
//    */
//   private processAccount(
//     accountId: number, 
//     accountTransactions: Transaction[], 
//     boundaries: any
//   ): AccountSummary {
//     const sortedTransactions = this.sortTransactions(accountTransactions)
//     const accountName = sortedTransactions[0].account_name
    
//     console.log(`🏢 Processing Account: ${accountName} (${sortedTransactions.length} transactions)`)
    
//     // Initialize totals and phase tracking
//     let totalDebits = 0
//     let totalCredits = 0
//     const debitsByPhase: PhaseData = { phase1: 0, phase2: 0, phase3: 0 }
    
//     // Process each transaction
//     sortedTransactions.forEach((tx, index) => {
//       console.log(`📝 Transaction ${index + 1}: ${tx.date} - ${tx.type.toUpperCase()} $${tx.amount}`)
      
//       if (tx.type === 'debit') {
//         totalDebits += tx.amount
        
//         // Assign debit to appropriate phase based on transaction date
//         const phaseAssignment = this.assignDebitToPhase(tx.date, tx.amount, boundaries)
//         debitsByPhase.phase1 += phaseAssignment.phase1
//         debitsByPhase.phase2 += phaseAssignment.phase2
//         debitsByPhase.phase3 += phaseAssignment.phase3
//       } else if (tx.type === 'credit') {
//         totalCredits += tx.amount
//       } else {
//         console.warn(`⚠️ Unknown transaction type: ${tx.type}`)
//       }
//     })
    
//     const netBalance = totalDebits - totalCredits
    
//     console.log(`📊 ${accountName} Summary:`, {
//       totalDebits,
//       totalCredits,
//       netBalance,
//       phaseDebits: debitsByPhase
//     })
    
//     // Apply FIFO payment allocation
//     const { outstanding, advance } = this.applyFifoPayments(debitsByPhase, totalCredits)
    
//     return {
//       accountId,
//       accountName,
//       totalDebits,
//       totalCredits,
//       netBalance: Math.max(0, netBalance), // Only show positive balances (amounts owed)
//       phaseDebits: debitsByPhase,
//       outstanding,
//       advance: netBalance < 0 ? Math.abs(netBalance) : advance
//     }
//   }

//   /**
//    * Main processing function for aged accounts report
//    * Orchestrates the entire aging analysis process
//    */
//   public processAgedAccounts(transactions: Transaction[], filterParams: FilterParams): AgedAccountsResult {
//     console.log('🚀 Starting Aged Accounts Processing...', filterParams)
    
//     try {
//       // STEP 1: Validate input parameters
//       this.validateFilters(filterParams)
      
//       const { accountPrefix, asOfDate, phaseDays } = filterParams
      
//       // STEP 2: Filter transactions by account prefix and date
//       console.log(`🔍 Filtering ${transactions.length} transactions...`)
      
//       const filteredTransactions = transactions.filter(tx => {
//         const matchesPrefix = tx.account_name.toLowerCase().startsWith(accountPrefix.toLowerCase())
//         const matchesDate = new Date(tx.date) <= new Date(asOfDate)
//         return matchesPrefix && matchesDate
//       })
      
//       console.log(`✅ Filtered to ${filteredTransactions.length} transactions matching criteria`)
      
//       // Handle empty results
//       if (filteredTransactions.length === 0) {
//         console.log('📭 No transactions found matching filter criteria')
//         return {
//           accounts: [],
//           grandTotals: {
//             totalDebits: 0,
//             totalCredits: 0,
//             netBalance: 0,
//             phaseDebits: { phase1: 0, phase2: 0, phase3: 0 },
//             outstanding: { phase1: 0, phase2: 0, phase3: 0 },
//             totalAdvance: 0
//           },
//           filterParams
//         }
//       }
      
//       // STEP 3: Group transactions by account
//       const accountGroups = new Map<number, Transaction[]>()
      
//       filteredTransactions.forEach(tx => {
//         if (!accountGroups.has(tx.account_id)) {
//           accountGroups.set(tx.account_id, [])
//         }
//         accountGroups.get(tx.account_id)!.push(tx)
//       })
      
//       console.log(`👥 Found ${accountGroups.size} unique accounts to process`)
      
//       // STEP 4: Calculate phase boundaries
//       const boundaries = this.calculatePhaseBoundaries(asOfDate, phaseDays)
      
//       // STEP 5: Process each account
//       const accounts: AccountSummary[] = []
      
//       for (const [accountId, accountTransactions] of accountGroups.entries()) {
//         const accountSummary = this.processAccount(accountId, accountTransactions, boundaries)
//         accounts.push(accountSummary)
//       }
      
//       // STEP 6: Sort accounts by name for consistent display
//       accounts.sort((a, b) => a.accountName.localeCompare(b.accountName))
      
//       // STEP 7: Calculate grand totals across all accounts
//       const grandTotals = accounts.reduce((totals, account) => ({
//         totalDebits: totals.totalDebits + account.totalDebits,
//         totalCredits: totals.totalCredits + account.totalCredits,
//         netBalance: totals.netBalance + account.netBalance,
//         phaseDebits: {
//           phase1: totals.phaseDebits.phase1 + account.phaseDebits.phase1,
//           phase2: totals.phaseDebits.phase2 + account.phaseDebits.phase2,
//           phase3: totals.phaseDebits.phase3 + account.phaseDebits.phase3
//         },
//         outstanding: {
//           phase1: totals.outstanding.phase1 + account.outstanding.phase1,
//           phase2: totals.outstanding.phase2 + account.outstanding.phase2,
//           phase3: totals.outstanding.phase3 + account.outstanding.phase3
//         },
//         totalAdvance: totals.totalAdvance + account.advance
//       }), {
//         totalDebits: 0,
//         totalCredits: 0,
//         netBalance: 0,
//         phaseDebits: { phase1: 0, phase2: 0, phase3: 0 },
//         outstanding: { phase1: 0, phase2: 0, phase3: 0 },
//         totalAdvance: 0
//       })
      
//       console.log('🎯 Final Report Summary:', {
//         accountsProcessed: accounts.length,
//         grandTotals
//       })
      
//       // STEP 8: Return complete results
//       return {
//         accounts,
//         grandTotals,
//         filterParams
//       }
      
//     } catch (error) {
//       console.error('❌ Error in aged accounts processing:', error)
//       throw error
//     }
//   }

//   /**
//    * Utility method to get phase description
//    * Useful for UI display purposes
//    */
//   public getPhaseDescription(phase: number, phaseDays: number): string {
//     switch (phase) {
//       case 1:
//         return `Phase 1 (Oldest - ${phaseDays * 2 + 1}+ days ago)`
//       case 2:
//         return `Phase 2 (Middle - ${phaseDays + 1} to ${phaseDays * 2} days ago)`
//       case 3:
//         return `Phase 3 (Newest - 1 to ${phaseDays} days ago)`
//       default:
//         return 'Unknown Phase'
//     }
//   }

//   /**
//    * Utility method to validate transaction data
//    * Ensures transaction data meets minimum requirements
//    */
//   public validateTransactionData(transactions: Transaction[]): { valid: boolean, errors: string[] } {
//     const errors: string[] = []
    
//     if (!Array.isArray(transactions)) {
//       errors.push('Transactions must be an array')
//       return { valid: false, errors }
//     }
    
//     if (transactions.length === 0) {
//       errors.push('At least one transaction is required')
//       return { valid: false, errors }
//     }
    
//     transactions.forEach((tx, index) => {
//       if (!tx.account_id) {
//         errors.push(`Transaction ${index + 1}: account_id is required`)
//       }
      
//       if (!tx.account_name || tx.account_name.trim() === '') {
//         errors.push(`Transaction ${index + 1}: account_name is required`)
//       }
      
//       if (!tx.date) {
//         errors.push(`Transaction ${index + 1}: date is required`)
//       } else if (isNaN(new Date(tx.date).getTime())) {
//         errors.push(`Transaction ${index + 1}: invalid date format`)
//       }
      
//       if (!tx.type || !['debit', 'credit'].includes(tx.type)) {
//         errors.push(`Transaction ${index + 1}: type must be 'debit' or 'credit'`)
//       }
      
//       if (typeof tx.amount !== 'number' || tx.amount < 0) {
//         errors.push(`Transaction ${index + 1}: amount must be a positive number`)
//       }
//     })
    
//     return {
//       valid: errors.length === 0,
//       errors
//     }
//   }

//   /**
//    * Utility method to generate summary statistics
//    * Provides additional insights for business analysis
//    */
//   public generateSummaryStats(result: AgedAccountsResult) {
//     const { accounts, grandTotals } = result
    
//     if (accounts.length === 0) {
//       return {
//         avgBalance: 0,
//         avgDaysOutstanding: 0,
//         collectionEfficiency: 0,
//         riskScore: 0
//       }
//     }
    
//     const avgBalance = grandTotals.netBalance / accounts.length
    
//     // Calculate weighted average days outstanding
//     const totalOutstanding = grandTotals.outstanding.phase1 + grandTotals.outstanding.phase2 + grandTotals.outstanding.phase3
//     const weightedDays = totalOutstanding > 0 ? 
//       ((grandTotals.outstanding.phase1 * 45) + (grandTotals.outstanding.phase2 * 25) + (grandTotals.outstanding.phase3 * 10)) / totalOutstanding : 0
    
//     // Collection efficiency (% of debits collected)
//     const collectionEfficiency = grandTotals.totalDebits > 0 ? 
//       (grandTotals.totalCredits / grandTotals.totalDebits) * 100 : 0
    
//     // Risk score (higher phase 1 = higher risk)
//     const riskScore = totalOutstanding > 0 ? 
//       (grandTotals.outstanding.phase1 / totalOutstanding) * 100 : 0
    
//     return {
//       avgBalance: Math.round(avgBalance * 100) / 100,
//       avgDaysOutstanding: Math.round(weightedDays),
//       collectionEfficiency: Math.round(collectionEfficiency * 100) / 100,
//       riskScore: Math.round(riskScore * 100) / 100
//     }
//   }
// }































































import { Transaction, FilterParams, AccountSummary, AgedAccountsResult, PhaseData } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

export class AgedAccountsProcessor {
  
  /**
   * ✅ FIXED: Calculate phase boundaries based on as-of date and phase days
   * Phase 3 (Newest): Last D days
   * Phase 2 (Middle): D+1 to 2D days ago  
   * Phase 1 (Oldest): Everything older than 2D days
   */
  private calculatePhaseBoundaries(asOfDate: string, phaseDays: number) {
    const asOf = new Date(asOfDate)
    asOf.setHours(23, 59, 59, 999) // End of as-of date
    
    // ✅ FIXED: Phase 3 (Newest): Last phaseDays days [T-(D-1), T]
    const phase3Start = new Date(asOf)
    phase3Start.setDate(phase3Start.getDate() - (phaseDays - 1))
    phase3Start.setHours(0, 0, 0, 0) // Start of day
    
    // ✅ FIXED: Phase 2 (Middle): Previous phaseDays days [T-(2D-1), T-D]
    const phase2End = new Date(phase3Start)
    phase2End.setDate(phase2End.getDate() - 1)
    phase2End.setHours(23, 59, 59, 999) // End of day
    
    const phase2Start = new Date(asOf)
    phase2Start.setDate(phase2Start.getDate() - (2 * phaseDays - 1))
    phase2Start.setHours(0, 0, 0, 0) // Start of day
    
    // ✅ FIXED: Phase 1 (Oldest): Everything before Phase 2
    const phase1End = new Date(phase2Start)
    phase1End.setDate(phase1End.getDate() - 1)
    phase1End.setHours(23, 59, 59, 999) // End of day
    
    // Validation: Calculate actual days in each phase
    const phase3Days = Math.ceil((asOf.getTime() - phase3Start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const phase2Days = phase2End >= phase2Start ? 
      Math.ceil((phase2End.getTime() - phase2Start.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0
    
    console.log('📅 FIXED Phase Boundaries:', {
      asOfDate,
      phaseDays,
      phase1: `Before or on ${phase1End.toDateString()} (unlimited days)`,
      phase2: `${phase2Start.toDateString()} to ${phase2End.toDateString()} (${phase2Days} days)`,
      phase3: `${phase3Start.toDateString()} to ${asOf.toDateString()} (${phase3Days} days)`,
      validation: {
        phase3ActualDays: phase3Days,
        phase2ActualDays: phase2Days,
        expectedDaysPerPhase: phaseDays
      }
    })
    
    return {
      phase1End,
      phase2Start,
      phase2End,
      phase3Start,
      asOf
    }
  }

  /**
   * ✅ FIXED: Assign debit amount to appropriate phase based on transaction date
   * Returns phase data with amount assigned to correct phase
   */
  private assignDebitToPhase(transactionDate: string, amount: number, boundaries: any): PhaseData {
    const txDate = new Date(transactionDate)
    const phases: PhaseData = { phase1: 0, phase2: 0, phase3: 0 }
    
    console.log(`🔍 Processing transaction: ${transactionDate} → ${txDate.toDateString()} - Amount: $${amount}`)
    
    // ✅ FIXED: Check Phase 3 first (newest - most common case)
    if (txDate >= boundaries.phase3Start && txDate <= boundaries.asOf) {
      phases.phase3 = amount
      console.log(`📊 ✅ Assigned $${amount} to Phase 3 (newest)`)
    }
    // ✅ FIXED: Check Phase 2 (middle)
    else if (txDate >= boundaries.phase2Start && txDate <= boundaries.phase2End) {
      phases.phase2 = amount
      console.log(`📊 ✅ Assigned $${amount} to Phase 2 (middle)`)
    }
    // ✅ FIXED: Phase 1 (oldest - everything else in the past)
    else if (txDate <= boundaries.phase1End) {
      phases.phase1 = amount
      console.log(`📊 ✅ Assigned $${amount} to Phase 1 (oldest)`)
    }
    // Handle edge cases
    else {
      console.warn(`⚠️ Transaction ${transactionDate} with amount $${amount} has unusual timing`)
      console.warn(`   Transaction: ${txDate.toISOString()}`)
      console.warn(`   As-of date: ${boundaries.asOf.toISOString()}`)
      
      // If transaction is not too far in the future, assign to Phase 3
      if (txDate <= boundaries.asOf) {
        phases.phase3 = amount
        console.log(`📊 🔧 Assigned $${amount} to Phase 3 (edge case handling)`)
      } else {
        console.warn(`❌ Transaction is future-dated beyond as-of date - skipping assignment`)
      }
    }
    
    return phases
  }

  /**
   * Apply FIFO payment allocation across phases
   * Payments are applied to oldest phase first (Phase 1 → Phase 2 → Phase 3)
   * Returns remaining outstanding amounts per phase and any customer advance
   */
  private applyFifoPayments(totalDebits: PhaseData, totalCredits: number): { outstanding: PhaseData, advance: number } {
    let remainingCredits = totalCredits
    const outstanding: PhaseData = { 
      phase1: totalDebits.phase1,
      phase2: totalDebits.phase2,
      phase3: totalDebits.phase3
    }
    
    console.log('💳 Starting FIFO Payment Application:', {
      totalCredits,
      originalDebits: totalDebits,
      totalDebitAmount: totalDebits.phase1 + totalDebits.phase2 + totalDebits.phase3
    })
    
    // STEP 1: Apply to Phase 1 first (oldest debts)
    if (remainingCredits > 0 && outstanding.phase1 > 0) {
      const applied = Math.min(remainingCredits, outstanding.phase1)
      outstanding.phase1 -= applied
      remainingCredits -= applied
      console.log(`💰 Applied $${applied} to Phase 1. Remaining Phase 1: $${outstanding.phase1}, Credits left: $${remainingCredits}`)
    }
    
    // STEP 2: Apply remainder to Phase 2 (middle debts)
    if (remainingCredits > 0 && outstanding.phase2 > 0) {
      const applied = Math.min(remainingCredits, outstanding.phase2)
      outstanding.phase2 -= applied
      remainingCredits -= applied
      console.log(`💰 Applied $${applied} to Phase 2. Remaining Phase 2: $${outstanding.phase2}, Credits left: $${remainingCredits}`)
    }
    
    // STEP 3: Apply remainder to Phase 3 (newest debts)
    if (remainingCredits > 0 && outstanding.phase3 > 0) {
      const applied = Math.min(remainingCredits, outstanding.phase3)
      outstanding.phase3 -= applied
      remainingCredits -= applied
      console.log(`💰 Applied $${applied} to Phase 3. Remaining Phase 3: $${outstanding.phase3}, Credits left: $${remainingCredits}`)
    }
    
    // Any remaining credits become customer advance (prepaid balance)
    const advance = remainingCredits
    if (advance > 0) {
      console.log(`💎 Customer advance (overpayment): $${advance}`)
    }
    
    console.log('✅ FIFO Payment Application Complete:', {
      finalOutstanding: outstanding,
      totalOutstanding: outstanding.phase1 + outstanding.phase2 + outstanding.phase3,
      customerAdvance: advance
    })
    
    return { outstanding, advance }
  }

  /**
   * Validate filter parameters
   * Ensures all required fields are present and valid
   */
  private validateFilters(filterParams: FilterParams): void {
    const { accountPrefix, asOfDate, phaseDays } = filterParams
    
    if (!accountPrefix || accountPrefix.trim() === '') {
      throw new Error('Account prefix is required and cannot be empty')
    }
    
    if (!asOfDate) {
      throw new Error('As-of date is required')
    }
    
    const asOf = new Date(asOfDate)
    if (isNaN(asOf.getTime())) {
      throw new Error('Invalid as-of date format. Use YYYY-MM-DD format.')
    }
    
    if (!phaseDays || phaseDays <= 0) {
      throw new Error('Phase days must be a positive integer greater than 0')
    }
    
    if (phaseDays > 365) {
      console.warn('⚠️ Phase days is very large (>365). This may result in unexpected phase assignments.')
    }
    
    // Additional validation
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (asOf > today) {
      console.warn('⚠️ As-of date is in the future. This may result in unexpected behavior.')
    }
  }

  /**
   * Sort transactions by date and type
   * Same date: debits before credits (unless sequence specified)
   */
  private sortTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      // First sort by date (ascending - oldest first)
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      const dateCompare = dateA - dateB
      if (dateCompare !== 0) return dateCompare
      
      // Same date: check if sequence is provided
      if (a.sequence !== undefined && b.sequence !== undefined) {
        return a.sequence - b.sequence
      }
      
      // Default same-day ordering: debits before credits
      if (a.type === 'debit' && b.type === 'credit') return -1
      if (a.type === 'credit' && b.type === 'debit') return 1
      
      // Same type, same date: maintain original order
      return 0
    })
  }

  /**
   * Process a single account's transactions
   * Calculate totals, phase assignments, and FIFO payment allocation
   */
  private processAccount(
    accountId: number, 
    accountTransactions: Transaction[], 
    boundaries: any
  ): AccountSummary {
    const sortedTransactions = this.sortTransactions(accountTransactions)
    const accountName = sortedTransactions[0].account_name
    
    console.log(`🏢 Processing Account: ${accountName} (${sortedTransactions.length} transactions)`)
    
    // Initialize totals and phase tracking
    let totalDebits = 0
    let totalCredits = 0
    const debitsByPhase: PhaseData = { phase1: 0, phase2: 0, phase3: 0 }
    
    // Process each transaction
    sortedTransactions.forEach((tx, index) => {
      console.log(`📝 Transaction ${index + 1}: ${tx.date} - ${tx.type.toUpperCase()} $${tx.amount}`)
      
      if (tx.type === 'debit') {
        totalDebits += tx.amount
        
        // Assign debit to appropriate phase based on transaction date
        const phaseAssignment = this.assignDebitToPhase(tx.date, tx.amount, boundaries)
        debitsByPhase.phase1 += phaseAssignment.phase1
        debitsByPhase.phase2 += phaseAssignment.phase2
        debitsByPhase.phase3 += phaseAssignment.phase3
      } else if (tx.type === 'credit') {
        totalCredits += tx.amount
      } else {
        console.warn(`⚠️ Unknown transaction type: ${tx.type}`)
      }
    })
    
    const netBalance = totalDebits - totalCredits
    
    console.log(`📊 ${accountName} Summary:`, {
      totalDebits,
      totalCredits,
      netBalance,
      phaseDebits: debitsByPhase,
      phaseDebitTotal: debitsByPhase.phase1 + debitsByPhase.phase2 + debitsByPhase.phase3
    })
    
    // Apply FIFO payment allocation
    const { outstanding, advance } = this.applyFifoPayments(debitsByPhase, totalCredits)
    
    return {
      accountId,
      accountName,
      totalDebits,
      totalCredits,
      netBalance: Math.max(0, netBalance), // Only show positive balances (amounts owed)
      phaseDebits: debitsByPhase,
      outstanding,
      advance: netBalance < 0 ? Math.abs(netBalance) : advance
    }
  }

  /**
   * Main processing function for aged accounts report
   * Orchestrates the entire aging analysis process
   */
  public processAgedAccounts(transactions: Transaction[], filterParams: FilterParams): AgedAccountsResult {
    console.log('🚀 Starting Aged Accounts Processing...', filterParams)
    
    try {
      // STEP 1: Validate input parameters
      this.validateFilters(filterParams)
      
      const { accountPrefix, asOfDate, phaseDays } = filterParams
      
      // STEP 2: Filter transactions by account prefix and date
      console.log(`🔍 Filtering ${transactions.length} transactions...`)
      
      const filteredTransactions = transactions.filter(tx => {
        const matchesPrefix = tx.account_name.toLowerCase().startsWith(accountPrefix.toLowerCase())
        const matchesDate = new Date(tx.date) <= new Date(asOfDate)
        return matchesPrefix && matchesDate
      })
      
      console.log(`✅ Filtered to ${filteredTransactions.length} transactions matching criteria`)
      
      // Handle empty results
      if (filteredTransactions.length === 0) {
        console.log('📭 No transactions found matching filter criteria')
        return {
          accounts: [],
          grandTotals: {
            totalDebits: 0,
            totalCredits: 0,
            netBalance: 0,
            phaseDebits: { phase1: 0, phase2: 0, phase3: 0 },
            outstanding: { phase1: 0, phase2: 0, phase3: 0 },
            totalAdvance: 0
          },
          filterParams
        }
      }
      
      // STEP 3: Group transactions by account
      const accountGroups = new Map<number, Transaction[]>()
      
      filteredTransactions.forEach(tx => {
        if (!accountGroups.has(tx.account_id)) {
          accountGroups.set(tx.account_id, [])
        }
        accountGroups.get(tx.account_id)!.push(tx)
      })
      
      console.log(`👥 Found ${accountGroups.size} unique accounts to process`)
      
      // STEP 4: Calculate phase boundaries
      const boundaries = this.calculatePhaseBoundaries(asOfDate, phaseDays)
      
      // STEP 5: Process each account
      const accounts: AccountSummary[] = []
      
      for (const [accountId, accountTransactions] of accountGroups.entries()) {
        const accountSummary = this.processAccount(accountId, accountTransactions, boundaries)
        accounts.push(accountSummary)
      }
      
      // STEP 6: Sort accounts by name for consistent display
      accounts.sort((a, b) => a.accountName.localeCompare(b.accountName))
      
      // STEP 7: Calculate grand totals across all accounts
      const grandTotals = accounts.reduce((totals, account) => ({
        totalDebits: totals.totalDebits + account.totalDebits,
        totalCredits: totals.totalCredits + account.totalCredits,
        netBalance: totals.netBalance + account.netBalance,
        phaseDebits: {
          phase1: totals.phaseDebits.phase1 + account.phaseDebits.phase1,
          phase2: totals.phaseDebits.phase2 + account.phaseDebits.phase2,
          phase3: totals.phaseDebits.phase3 + account.phaseDebits.phase3
        },
        outstanding: {
          phase1: totals.outstanding.phase1 + account.outstanding.phase1,
          phase2: totals.outstanding.phase2 + account.outstanding.phase2,
          phase3: totals.outstanding.phase3 + account.outstanding.phase3
        },
        totalAdvance: totals.totalAdvance + account.advance
      }), {
        totalDebits: 0,
        totalCredits: 0,
        netBalance: 0,
        phaseDebits: { phase1: 0, phase2: 0, phase3: 0 },
        outstanding: { phase1: 0, phase2: 0, phase3: 0 },
        totalAdvance: 0
      })
      
      console.log('🎯 Final Report Summary:', {
        accountsProcessed: accounts.length,
        grandTotals: {
          ...grandTotals,
          totalPhaseDebits: grandTotals.phaseDebits.phase1 + grandTotals.phaseDebits.phase2 + grandTotals.phaseDebits.phase3,
          totalOutstanding: grandTotals.outstanding.phase1 + grandTotals.outstanding.phase2 + grandTotals.outstanding.phase3
        }
      })
      
      // STEP 8: Return complete results
      return {
        accounts,
        grandTotals,
        filterParams
      }
      
    } catch (error) {
      console.error('❌ Error in aged accounts processing:', error)
      throw error
    }
  }

  /**
   * Utility method to get phase description
   * Useful for UI display purposes
   */
  public getPhaseDescription(phase: number, phaseDays: number): string {
    switch (phase) {
      case 1:
        return `Phase 1 (Oldest - ${phaseDays * 2 + 1}+ days ago)`
      case 2:
        return `Phase 2 (Middle - ${phaseDays + 1} to ${phaseDays * 2} days ago)`
      case 3:
        return `Phase 3 (Newest - 1 to ${phaseDays} days ago)`
      default:
        return 'Unknown Phase'
    }
  }

  /**
   * Utility method to validate transaction data
   * Ensures transaction data meets minimum requirements
   */
  public validateTransactionData(transactions: Transaction[]): { valid: boolean, errors: string[] } {
    const errors: string[] = []
    
    if (!Array.isArray(transactions)) {
      errors.push('Transactions must be an array')
      return { valid: false, errors }
    }
    
    if (transactions.length === 0) {
      errors.push('At least one transaction is required')
      return { valid: false, errors }
    }
    
    transactions.forEach((tx, index) => {
      if (!tx.account_id) {
        errors.push(`Transaction ${index + 1}: account_id is required`)
      }
      
      if (!tx.account_name || tx.account_name.trim() === '') {
        errors.push(`Transaction ${index + 1}: account_name is required`)
      }
      
      if (!tx.date) {
        errors.push(`Transaction ${index + 1}: date is required`)
      } else if (isNaN(new Date(tx.date).getTime())) {
        errors.push(`Transaction ${index + 1}: invalid date format`)
      }
      
      if (!tx.type || !['debit', 'credit'].includes(tx.type)) {
        errors.push(`Transaction ${index + 1}: type must be 'debit' or 'credit'`)
      }
      
      if (typeof tx.amount !== 'number' || tx.amount < 0) {
        errors.push(`Transaction ${index + 1}: amount must be a positive number`)
      }
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Utility method to generate summary statistics
   * Provides additional insights for business analysis
   */
  public generateSummaryStats(result: AgedAccountsResult) {
    const { accounts, grandTotals } = result
    
    if (accounts.length === 0) {
      return {
        avgBalance: 0,
        avgDaysOutstanding: 0,
        collectionEfficiency: 0,
        riskScore: 0
      }
    }
    
    const avgBalance = grandTotals.netBalance / accounts.length
    
    // Calculate weighted average days outstanding
    const totalOutstanding = grandTotals.outstanding.phase1 + grandTotals.outstanding.phase2 + grandTotals.outstanding.phase3
    const weightedDays = totalOutstanding > 0 ? 
      ((grandTotals.outstanding.phase1 * 45) + (grandTotals.outstanding.phase2 * 25) + (grandTotals.outstanding.phase3 * 10)) / totalOutstanding : 0
    
    // Collection efficiency (% of debits collected)
    const collectionEfficiency = grandTotals.totalDebits > 0 ? 
      (grandTotals.totalCredits / grandTotals.totalDebits) * 100 : 0
    
    // Risk score (higher phase 1 = higher risk)
    const riskScore = totalOutstanding > 0 ? 
      (grandTotals.outstanding.phase1 / totalOutstanding) * 100 : 0
    
    return {
      avgBalance: Math.round(avgBalance * 100) / 100,
      avgDaysOutstanding: Math.round(weightedDays),
      collectionEfficiency: Math.round(collectionEfficiency * 100) / 100,
      riskScore: Math.round(riskScore * 100) / 100
    }
  }
}
