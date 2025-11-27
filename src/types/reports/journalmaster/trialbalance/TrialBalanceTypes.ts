export interface TrialBalanceRecord {
  acName: string
  openingDr: number
  openingCr: number
  movementDr: number
  movementCr: number
  balance: number
}

export interface TrialBalanceFilterState {
  acName: string
  dateFrom: string
  dateTo: string
  description: string
  entryType: string
  showZeroBalance: boolean
}

export interface TrialBalanceFilterOptions {
  acNames: string[]
}

export interface TrialBalanceSummary {
  totalOpeningDr: number
  totalOpeningCr: number
  totalMovementDr: number
  totalMovementCr: number
  totalBalance: number
  recordCount: number
}

export interface RawJournalRecord {
  id: number
  date: string
  voucherNo: string
  amountDb: number
  amountCr: number
  isOpening: boolean
  acName: string
  description: string
}
