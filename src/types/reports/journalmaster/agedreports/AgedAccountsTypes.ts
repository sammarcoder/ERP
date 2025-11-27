export interface Transaction {
  account_id: number
  account_name: string
  date: string // YYYY-MM-DD format
  type: 'debit' | 'credit'
  amount: number
  sequence?: number // Optional same-day ordering
}

export interface FilterParams {
  accountPrefix: string
  asOfDate: string // YYYY-MM-DD
  phaseDays: number // D parameter
}

// export interface PhaseData {
//   phase1: number // oldest
//   phase2: number // middle  
//   phase3: number // newest
// }

// export interface AccountSummary {
//   accountId: number
//   accountName: string
//   totalDebits: number
//   totalCredits: number
//   netBalance: number
//   outstanding: PhaseData
//   advance: number // if customer overpaid
// }

// export interface AgedAccountsResult {
//   accounts: AccountSummary[]
//   grandTotals: {
//     totalDebits: number
//     totalCredits: number
//     netBalance: number
//     outstanding: PhaseData
//     totalAdvance: number
//   }
//   filterParams: FilterParams
// }












export interface PhaseData {
  phase1: number
  phase2: number  
  phase3: number
}

export interface AccountSummary {
  accountId: number
  accountName: string
  totalDebits: number
  totalCredits: number
  netBalance: number
  phaseDebits: PhaseData      // ✅ NEW: Original debit amounts per phase
  outstanding: PhaseData      // Remaining outstanding per phase after payments
  advance: number
}

export interface AgedAccountsResult {
  accounts: AccountSummary[]
  grandTotals: {
    totalDebits: number
    totalCredits: number
    netBalance: number
    phaseDebits: PhaseData    // ✅ NEW: Grand total of original debits per phase
    outstanding: PhaseData    // Grand total of outstanding per phase
    totalAdvance: number
  }
  filterParams: FilterParams
}
