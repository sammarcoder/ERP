// export interface JournalMaster {
//   id?: number
//   date: string
//   stk_Main_ID?: number
//   voucherTypeId: number
//   voucherNo: string
//   balacingId?: number
//   status: boolean
//   createdAt?: string
//   updatedAt?: string
// }

// export interface JournalDetail {
//   id?: number
//   jmId?: number
//   lineId: number
//   coaId: number
//   description?: string
//   chqNo?: string
//   recieptNo?: string
//   ownDb: number
//   ownCr: number
//   rate?: number
//   amountDb: number
//   amountCr: number
//   isCost: boolean
//   currencyId?: number
//   status: boolean
//   // New fields
//   idCard?: string
//   bank?: string
//   bankDate?: string
// }

// export interface CreateJournalVoucherRequest {
//   master: Omit<JournalMaster, 'id' | 'createdAt' | 'updatedAt'>
//   details: Omit<JournalDetail, 'id' | 'jmId' | 'createdAt' | 'updatedAt'>[]
// }

// export interface UpdateJournalVoucherRequest {
//   master: Omit<JournalMaster, 'createdAt' | 'updatedAt'>
//   details: Omit<JournalDetail, 'jmId' | 'createdAt' | 'updatedAt'>[]
// }

// export interface JournalVoucherResponse {
//   id: number
//   master: JournalMaster
//   details: JournalDetail[]
// }

// export interface CoaAccount {
//   id: number
//   acName: string
//   acCode: string
//   isJvBalance: boolean
//   isPettyCash: boolean
//   [key: string]: any
// }

// export interface Currency {
//   id: number
//   currencyName: string
//   createdAt?: string
//   updatedAt?: string
// }
































export interface JournalMaster {
  id?: number
  date: string
  stk_Main_ID?: number
  voucherTypeId: number
  voucherNo: string
  balacingId?: number
  status: boolean
  createdAt?: string
  updatedAt?: string
}

export interface JournalDetail {
  id?: number
  jmId?: number
  lineId: number
  coaId: number
  description?: string
  chqNo?: string
  recieptNo?: string
  ownDb: number
  ownCr: number
  rate?: number
  amountDb: number
  amountCr: number
  isCost: boolean
  currencyId?: number
  status: boolean
  // New fields
  idCard?: string
  bank?: string
  bankDate?: string
  isCurrencyLocked?: boolean
  coaTypeId?: number | string
}

export interface CoaAccount {
  id: number
  acName: string
  acCode: string
  isJvBalance: boolean
  isPettyCash: boolean
}

export interface Currency {
  id: number
  currencyName: string
}

export interface CreateJournalVoucherRequest {
  master: Omit<JournalMaster, 'id' | 'createdAt' | 'updatedAt'>
  details: Omit<JournalDetail, 'id' | 'jmId' | 'createdAt' | 'updatedAt'>[]
}
