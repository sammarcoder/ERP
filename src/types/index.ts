export interface ItemFormData {
  itemName: string;
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
  skuUOM: number | null;
  uom2: number | null;
  uom2_qty: number;
  uom3: number | null;
  uom3_qty: number;
  assessmentUOM: number | null;
  weight_per_pcs: number;
  barCode: string;
  sellingPrice: number;
  purchasePricePKR: number;
  purchasePriceFC: number;
  assessedPrice: number;
  hsCode: string;
  cd: number;
  ftaCd: number;
  acd: number;
  rd: number;
  salesTax: number;
  addSalesTax: number;
  itaxImport: number;
  furtherTax: number;
  supplier: number | null;
  purchaseAccount: number | null;
  salesAccount: number | null;
  salesTaxAccount: number | null;
  wastageItem: boolean;
  isNonInventory: boolean;
}

export interface ClassData {
  id: number;
  className: string;
  classId: number;
}

export interface UOMData {
  id: number;
  uom: string;
}

export interface COAData {
  id: number;
  acName: string;
  setupName: string;
}
