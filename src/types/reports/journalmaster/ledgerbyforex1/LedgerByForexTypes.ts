export interface AdvancedProcessedRecord {
  id: number
  voucherNo: string
  date: string
  description: string
  amountDb: number
  amountCr: number
  ownDb: number
  ownCr: number
  rate: number
  receiptNo: string
  currency: string
  isOpening: boolean
  acName: string
  balance: number
  ownBalance: number // ✅ NEW: Own balance calculation
  rowIndex?: number
  calculationRowIndex?: number
  displayRowIndex?: number
}

export interface AdvancedFilterState {
  acName: string // ✅ MANDATORY
  dateFrom: string
  dateTo: string
  description: string
  minCredit: string
  maxCredit: string
  minDebit: string
  maxDebit: string
  receiptNo: string
  entryType: string
  showOpeningOnly: boolean
}

export interface AdvancedFilterOptions {
  acNames: string[]
}

export interface AdvancedFilterResult {
  calculationData: AdvancedProcessedRecord[]
  displayData: AdvancedProcessedRecord[]
  systemRowInfo: {
    totalOpeningRecords: number
    openingBalance: number
    openingOwnBalance: number // ✅ NEW: Own balance for system row
    systemRowGenerated: boolean
    displayBalance: number
    displayOwnBalance: number // ✅ NEW: Own display balance
    calculationBalance: number
    calculationOwnBalance: number // ✅ NEW: Own calculation balance
    lastHiddenRowIndex: number
    aboveRowBalance: number
    aboveRowOwnBalance: number // ✅ NEW: Above row own balance
  }
  filteringStats: {
    originalCount: number
    afterDataFilters: number
    afterDateFilter: number
    hiddenByDate: number
    firstDisplayRowIndex: number
  }
}

export interface RawAdvancedRecord {
  id: number
  voucherNo: string
  date: string
  amountDb: number
  amountCr: number
  ownDb: number
  ownCr: number
  rate: number
  isOpening: boolean
  acName: string
  description: string
  receiptNo: string
  currency: string
}
