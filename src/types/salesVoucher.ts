// lib/types/gdn.ts

export interface GDNHeader {
  ID: number;
  Number: string;
  Date: string;
  Status: 'Post' | 'UnPost';
  approved: boolean;
  is_Voucher_Generated: boolean;
  COA_ID: number;
  Order_Main_ID: number;
  Carriage_ID: number | null;
  Carriage_Amount: string;
  freight_crt: string;
  labour_crt: string;
  bility_expense: string;
  other_expense: string;
  booked_crt: string;
  remarks: string;
  account: {
    id: number;
    acName: string;
    city: string;
  };
  order: {
    Number: string;
    sub_city: string;
    sub_customer: string;
  };
  details: GDNDetail[];
}

export interface GDNDetail {
  ID: number;
  Line_Id: number;
  Item_ID: number;
  batchno: number;
  Stock_Price: string;
  uom1_qty: string;
  uom2_qty: string;
  uom3_qty: string;
  Sale_Unit: string;
  Discount_A: string;
  Discount_B: string;
  Discount_C: string;
  item: {
    id: number;
    itemName: string;
    uom1: { id: number; uom: string };
    uomTwo: { id: number; uom: string } | null;
    uomThree: { id: number; uom: string } | null;
  };
  batchDetails: {
    id: number;
    acName: string;
    city: string;
  };
}

export interface JournalStatus {
  success: boolean;
  isPosted: boolean;
  journalStatus: 'Post' | 'UnPost' | null;
  journalId: number | null;
  voucherNo: string | null;
}

export interface VoucherFormData {
  ID: number;
  Stock_Price: number;
  Discount_A: number;
  Discount_B: number;
  Discount_C: number;
}

export type FilterType = 'not_generated' | 'generated';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type VoucherMode = 'create' | 'edit' | 'view';
