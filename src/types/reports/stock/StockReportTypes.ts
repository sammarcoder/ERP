export interface RawStockRecord {
  // Stock Main
  "ID": number
  "Stock Type ID": number
  "Date": string
  "Number": string
  "Status": string
  "Purchase Type": string
  
  // Stock Detail
  "Stk Detail → ID": number
  "Stk Detail → Item ID": number
  "Stk Detail → Stock In Uom Qty": number | null
  "Stk Detail → Stock Out Uom Qty": number | null
  "Stk Detail → Stock In Sku Uom Qty": number | null
  "Stk Detail → Stock Out Sku Uom Qty": number | null
  "Stk Detail → Stock In Uom3 Qty": number | null
  "Stk Detail → Stock Out Uom3 Qty": number | null
  
  // Item Master
  "Zitems - Item → ID": number
  "Zitems - Item → ItemName": string
  "Zitems - Item → ItemClass1": number | null
  "Zitems - Item → ItemClass2": number | null
  "Zitems - Item → ItemClass3": number | null
  "Zitems - Item → ItemClass4": number | null
  
  // UOM Names
  "Uoms - SkuUOM → Uom": string
  "Uoms - Uom2 → Uom": string
  "Uoms - Uom3 → Uom": string
  
  // Class Names
  "Zclasstypes - ItemClass1 → ClassName": string | null
  "Zclasstypes - ItemClass2 → ClassName": string | null
  "Zclasstypes - ItemClass3 → ClassName": string | null
  "Zclasstypes - ItemClass4 → ClassName": string | null
}

export interface ProcessedStockItem {
  itemId: number
  itemName: string
  selectedUom: string
  totalInQty: number
  totalOutQty: number
  balance: number
  
  // For reference
  itemClass1: number | null
  itemClass2: number | null
  itemClass3: number | null
  itemClass4: number | null
}

export interface StockReportFilters {
  itemClass1: number | null
  itemClass2: number | null
  itemClass3: number | null
  itemClass4: number | null
  selectedUom: 1 | 2 | 3
  searchTerm: string
}

export interface ClassOption {
  id: number
  className: string
}

export interface StockReportResult {
  items: ProcessedStockItem[]
  summary: {
    totalItems: number
    totalInQty: number
    totalOutQty: number
    totalBalance: number
  }
  classOptions: {
    class1: ClassOption[]
    class2: ClassOption[]
    class3: ClassOption[]
    class4: ClassOption[]
  }
  filters: StockReportFilters
}
