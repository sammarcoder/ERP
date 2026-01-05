// // utils/orderDataFormatter.ts - Convert UI data to API format
// interface ApiOrderMaster {
//   date: string
//   COA_ID: string | number
//   Transporter_ID: string | number
//   Stock_Type_ID: number
//   freight_crt: number
//   labour_crt: number
//   bility_expense: number
//   other_expense: number
//   foreign_currency?: string
//   sub_customer?: string
//   sub_city?: string
//   str?: number
//   // NO discount fields in master - they go to details
// }

// interface ApiOrderDetail {
//   Item_ID: number
//   unitPrice: number
//   uom1_qty: number
//   uom2_qty: number
//   uom3_qty: number
//   sale_unit: number
//   Uom_Id: number
//   Discount_A: number
//   Discount_B: number
//   Discount_C: number
//   // NO calculated fields like grossTotal, netTotal, isExpanded, extractedUomData
// }

// interface ApiOrderSubmission {
//   master: ApiOrderMaster
//   details: ApiOrderDetail[]
// }

// export const formatOrderForApi = (headerData: any, orderDetails: any[]): ApiOrderSubmission => {
//   console.group('🔄 Converting Order Data for API')

//   // ✅ Clean Master Data - Remove discount fields, keep only DB fields
//   const master: ApiOrderMaster = {
//     date: headerData.date,
//     COA_ID: headerData.COA_ID,
//     Transporter_ID: headerData.Transporter_ID,
//     Stock_Type_ID: headerData.Stock_Type_ID,
//     freight_crt: headerData.freight_crt || 0,
//     labour_crt: headerData.labour_crt || 0,
//     bility_expense: headerData.bility_expense || 0,
//     other_expense: headerData.other_expense || 0,
//     foreign_currency: headerData.foreign_currency || null,
//     sub_customer: headerData.sub_customer || null,
//     sub_city: headerData.sub_city || null,
//     str: headerData.str || null
//     // ✅ REMOVED: discountA, discountB, discountC (these go to details)
//   }

//   // ✅ Clean Details Data - Remove UI fields, keep only DB fields
//   const details: ApiOrderDetail[] = orderDetails.map((item, index) => ({
//     Item_ID: item.Item_ID,
//     unitPrice: item.unitPrice,
//     uom1_qty: item.uom1_qty,
//     uom2_qty: item.uom2_qty,
//     uom3_qty: item.uom3_qty,
//     sale_unit: item.sale_unit,
//     Uom_Id: item.Uom_Id,
//     Discount_A: item.Discount_A,
//     Discount_B: item.Discount_B,
//     Discount_C: item.Discount_C
//     // ✅ REMOVED: grossTotal, netTotal, isExpanded, extractedUomData, itemName, lineNo, originalItem
//   }))

//   console.log('📤 API Master Data:', master)
//   console.log('📤 API Details Data:', details)
//   console.log('📊 Summary:', {
//     masterFields: Object.keys(master).length,
//     detailsCount: details.length,
//     detailFields: details.length > 0 ? Object.keys(details[0]).length : 0
//   })
//   console.groupEnd()

//   return { master, details }
// }











































// utils/orderDataFormatter.ts - FIX MISSING UNIT PRICE
export const formatOrderForApi = (headerData: any, orderDetails: any[]): ApiOrderSubmission => {
  console.group('🔄 Converting Order Data for API')
  
  const master: ApiOrderMaster = {
    Date: headerData.date,
    COA_ID: headerData.COA_ID,
    Transporter_ID: headerData.Transporter_ID || null,
    Stock_Type_ID: headerData.Stock_Type_ID,
    freight_crt: headerData.freight_crt || 0,
    labour_crt: headerData.labour_crt || 0,
    bility_expense: headerData.bility_expense || 0,
    other_expense: headerData.other_expense || 0,
    foreign_currency: headerData.foreign_currency || null,
    sub_customer: headerData.sub_customer || null,
    sub_city: headerData.sub_city || null,
    str: headerData.str || null,
    GRN_Status: 'Pending'
  }
  
  // ✅ FIX: Include unitPrice in details
  const details: ApiOrderDetail[] = orderDetails.map((item, index) => {
    console.log(`📋 Processing Detail ${index + 1}:`, {
      Item_ID: item.Item_ID,
      unitPrice: item.unitPrice, // ✅ LOG: Check if unitPrice exists
      uom_data: {
        uom1_qty: item.uom1_qty,
        uom2_qty: item.uom2_qty,
        uom3_qty: item.uom3_qty,
        sale_unit: item.sale_unit,
        Uom_Id: item.Uom_Id
      },
      discounts: {
        Discount_A: item.Discount_A,
        Discount_B: item.Discount_B,
        Discount_C: item.Discount_C
      }
    })

    return {
      Item_ID: item.Item_ID,
      unitPrice: item.unitPrice || 0, // ✅ FIX: Ensure unitPrice is included
      uom1_qty: item.uom1_qty || 0,
      uom2_qty: item.uom2_qty || 0,
      uom3_qty: item.uom3_qty || 0,
      sale_unit: item.sale_unit || 0,
      Uom_Id: item.Uom_Id || 0,
      Discount_A: item.Discount_A || 0,
      Discount_B: item.Discount_B || 0,
      Discount_C: item.Discount_C || 0
    }
  })
  
  console.log('📤 API Master Data:', master)
  console.log('📤 API Details Data:', details)
  
  // ✅ Enhanced validation
  if (!master.Date) throw new Error('Date is required')
  if (!master.COA_ID) throw new Error('Customer is required')
  if (details.length === 0) throw new Error('Order details are required')
  
  // ✅ Validate each detail has required fields
  details.forEach((detail, index) => {
    if (!detail.Item_ID) throw new Error(`Item ID is required for line ${index + 1}`)
    if (detail.unitPrice === undefined || detail.unitPrice === null) {
      console.warn(`⚠️ Unit price missing for line ${index + 1}, defaulting to 0`)
    }
  })
  
  console.groupEnd()
  return { master, details }
}

// ✅ Updated interface to include unitPrice
interface ApiOrderDetail {
  Item_ID: number
  unitPrice: number // ✅ FIX: Explicitly include unitPrice
  uom1_qty: number
  uom2_qty: number
  uom3_qty: number
  sale_unit: number
  Uom_Id: number
  Discount_A: number
  Discount_B: number
  Discount_C: number
}
