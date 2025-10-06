// // lib/types.ts - Add voucher fields
// export interface VoucherItem {
//   ID: number
//   Line_Id: number
//   Batch_Number: string
//   Item_Name: string
//   Item_ID: number
//   uom1_qty: number
//   uom2_qty: number
//   uom3_qty: number
//   sale_unit: string
//   Stock_Price: number
//   item: ItemDetails
//   originalPrice: number
//   Discount_A: number
//   Discount_B: number
//   Discount_C: number
//   originalDiscountA: number
//   originalDiscountB: number
//   originalDiscountC: number
//   is_Voucher_Generated: boolean  // ADD THIS
// }

// export interface DispatchRecord {
//   id: number
//   label: string
//   number: string
//   date: string
//   customer: string
//   status: string
//   total_items: number
//   has_vouchers: boolean        // ADD THIS
//   all_vouchers_generated: boolean  // ADD THIS
// }

// export interface GrnRecord {
//   id: number
//   label: string
//   number: string
//   date: string
//   supplier: string
//   status: string
//   total_items: number
//   has_vouchers: boolean        // ADD THIS
//   all_vouchers_generated: boolean  // ADD THIS
// }

// export interface ItemDetails {
//   id: number
//   itemName: string
//   uom1: { id: number; uom: string }
//   uomTwo: { id: number; uom: string }
//   uomThree: { id: number; uom: string }
// }

// export interface VoucherData {
//   Number: string
//   Date: string
//   Customer?: string
//   Supplier?: string
//   Status: string
// }










































// UPDATED VoucherItem interface
export interface VoucherItem {
  ID: number
  Line_Id: number
  Batch_Number: string
  Item_Name: string
  Item_ID: number
  uom1_qty: number
  uom2_qty: number
  uom3_qty: number
  sale_unit: string
  Stock_Price: number
  item: ItemDetails
  originalPrice: number
  Discount_A: number
  Discount_B: number
  Discount_C: number
  originalDiscountA: number
  originalDiscountB: number
  originalDiscountC: number
  is_Voucher_Generated: boolean
  // ADD CARRIAGE FIELDS
  Carriage_ID?: number
  Carriage_Amount?: number
}

// UPDATED VoucherData interface
export interface VoucherData {
  Number: string
  Date: string
  Customer?: string
  Supplier?: string
  Status: string
  // ADD CARRIAGE FIELDS
  Carriage_Amount?: number
  Carriage_ID?: number
  Transporter?: string
}

// ADD CarriageAccount interface
export interface CarriageAccount {
  id: number
  acName: string
  ch1Id: number
  ch2Id: number
  coaTypeId: number
  setupName: string
  adress: string
  city: string
  personName: string
  mobileNo: string
  ZCOAType: {
    id: number
    zType: string
  }
}

export interface DispatchRecord {
  id: number
  label: string
  number: string
  date: string
  customer: string
  status: string
  total_items: number
  has_vouchers: boolean
  all_vouchers_generated: boolean
  // ADD CARRIAGE FIELDS
  Carriage_Amount?: number
  Carriage_ID?: number
  Transporter?: string
}

export interface GrnRecord {
  id: number
  label: string
  number: string
  date: string
  supplier: string
  status: string
  total_items: number
  has_vouchers: boolean
  all_vouchers_generated: boolean
  // ADD CARRIAGE FIELDS
  Carriage_Amount?: number
  Carriage_ID?: number
  Transporter?: string
}

export interface ItemDetails {
  id: number
  itemName: string
  uom1: { id: number; uom: string }
  uomTwo: { id: number; uom: string }
  uomThree: { id: number; uom: string }
}
