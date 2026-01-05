export interface ProcessedRecord {
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
  rowIndex?: number
}

export interface FilterState {
  acName: string
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

export interface FilterOptions {
  acNames: string[]
}
