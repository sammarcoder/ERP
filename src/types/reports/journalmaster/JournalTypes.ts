// export interface JournalRecord {
//   id: number
//   voucherNo: string
//   date: string
//   status: boolean
//   isOpening: boolean
//   'Zcoas - CoaId__acName': string
//   'Zvouchertype - VoucherTypeId__vType': string
//   'Journaldetail__id': number
//   'Journaldetail__description': string
//   'Journaldetail__amountDb': number
//   'Journaldetail__amountCr': number
//   'Journaldetail__ownDb': number
//   'Journaldetail__ownCr': number
//   'Journaldetail__rate': number
//   'Journaldetail__recieptNo': string
//   'Zcurrencies - CurrencyId__currencyName': string
// }

// export interface ProcessedRecord {
//   id: number
//   voucherNo: string
//   date: string
//   description: string
//   amountDb: number
//   amountCr: number
//   ownDb: number
//   ownCr: number
//   rate: number | string
//   receiptNo: string
//   currency: string
//   isOpening: boolean
//   acName: string
//   balance: number // ✅ New balance field
// }

// export interface FilterState {
//   acName: string
//   dateFrom: string
//   dateTo: string
//   description: string
//   minCredit: string
//   maxCredit: string
//   minDebit: string
//   maxDebit: string
//   receiptNo: string
//   entryType: string
//   showOpeningOnly: boolean
// }

// export interface FilterOptions {
//   acNames: string[]
// }


































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
