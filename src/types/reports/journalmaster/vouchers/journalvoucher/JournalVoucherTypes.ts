export interface JournalVoucherRecord {
  id: number
  voucherNo: string
  voucherTypeId: number
  voucherTypeName: string
  date: string
  acName: string
  description: string
  receiptNo: string
  ownDebit: number
  ownCredit: number
  rate: number
  currencyName: string
  debit: number
  credit: number
}

export interface JournalVoucherFilterState {
  voucherTypeId: number | null
  voucherNo: string
}

export interface VoucherType {
  id: number
  name: string
}

export interface JournalVoucherFilterOptions {
  voucherTypes: VoucherType[]
  availableVoucherNos: string[]
}

export interface JournalVoucherHeader {
  voucherTypeName: string
  voucherNo: string
  date: string
  totalDebit: number
  totalCredit: number
  totalOwnDebit: number
  totalOwnCredit: number
}

export interface BalanceRow {
  type: 'opening' | 'closing'
  description: string
  ownDebit: number
  ownCredit: number
  debit: number
  credit: number
}

export interface RawJournalVoucherRecord {
  id: number
  voucherNo: string
  voucherTypeId: number
  date: string
  amountDb: number
  amountCr: number
  ownDb: number
  ownCr: number
  rate: number
  acName: string
  description: string
  receiptNo: string
  currencyName: string
}
