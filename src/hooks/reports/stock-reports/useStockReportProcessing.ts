// import { useMemo } from 'react'
// import { StockReportRecord, ProcessedStockItem, StockReportFilters, StockReportResult } from '@/types/reports/stock/StockReportTypes'

// export const useStockReportProcessing = (
//   rawData: StockReportRecord[],
//   filters: StockReportFilters
// ): StockReportResult => {
  
//   const result = useMemo(() => {
//     if (!rawData.length) {
//       return {
//         items: [],
//         summary: { totalItems: 0, totalInQty: 0, totalOutQty: 0, totalBalance: 0 },
//         filters
//       }
//     }

//     // Check if at least one filter is applied
//     const hasFilters = filters.itemClass1 || filters.itemClass2 || 
//                       filters.itemClass3 || filters.itemClass4 || 
//                       filters.searchTerm.trim()

//     if (!hasFilters) {
//       console.log('⚠️ At least one filter is required to display data')
//       return {
//         items: [],
//         summary: { totalItems: 0, totalInQty: 0, totalOutQty: 0, totalBalance: 0 },
//         filters
//       }
//     }

//     console.log('🔄 Processing stock data with filters:', filters)

//     // Apply filters
//     let filteredData = [...rawData]

//     // Apply class filters
//     if (filters.itemClass1) {
//       filteredData = filteredData.filter(item => item.itemClass1 === filters.itemClass1)
//     }
//     if (filters.itemClass2) {
//       filteredData = filteredData.filter(item => item.itemClass2 === filters.itemClass2)
//     }
//     if (filters.itemClass3) {
//       filteredData = filteredData.filter(item => item.itemClass3 === filters.itemClass3)
//     }
//     if (filters.itemClass4) {
//       filteredData = filteredData.filter(item => item.itemClass4 === filters.itemClass4)
//     }

//     // Apply search filter
//     if (filters.searchTerm.trim()) {
//       const term = filters.searchTerm.toLowerCase()
//       filteredData = filteredData.filter(item =>
//         item.itemName.toLowerCase().includes(term) ||
//         item.number.toLowerCase().includes(term)
//       )
//     }

//     console.log(`✅ After filtering: ${filteredData.length} records`)

//     // Group by item and calculate totals
//     const itemGroups = new Map<number, StockReportRecord[]>()
    
//     filteredData.forEach(record => {
//       if (!itemGroups.has(record.itemId)) {
//         itemGroups.set(record.itemId, [])
//       }
//       itemGroups.get(record.itemId)!.push(record)
//     })

//     // Process each item group
//     const processedItems: ProcessedStockItem[] = []

//     for (const [itemId, records] of itemGroups.entries()) {
//       const firstRecord = records[0]
      
//       // Calculate quantities based on selected UOM
//       let totalInQty = 0
//       let totalOutQty = 0
//       let selectedUomName = ''

//       records.forEach(record => {
//         switch (filters.selectedUom) {
//           case 1: // SkuUOM
//             totalInQty += record.stockInSkuUomQty
//             totalOutQty += record.stockOutSkuUomQty
//             selectedUomName = record.skuUom
//             break
//           case 2: // UOM2
//             totalInQty += record.stockInUomQty
//             totalOutQty += record.stockOutUomQty
//             selectedUomName = record.uom2
//             break
//           case 3: // UOM3
//             totalInQty += record.stockInUom3Qty
//             totalOutQty += record.stockOutUom3Qty
//             selectedUomName = record.uom3
//             break
//         }
//       })

//       const balance = totalInQty - totalOutQty

//       processedItems.push({
//         itemId,
//         itemName: firstRecord.itemName,
//         itemClass1: firstRecord.itemClass1,
//         itemClass2: firstRecord.itemClass2,
//         itemClass3: firstRecord.itemClass3,
//         itemClass4: firstRecord.itemClass4,
//         selectedUom: selectedUomName,
//         totalInQty,
//         totalOutQty,
//         balance,
//         uom1: { name: firstRecord.skuUom, qty: 1 },
//         uom2: { name: firstRecord.uom2, qty: firstRecord.uom2Qty },
//         uom3: { name: firstRecord.uom3, qty: firstRecord.uom3Qty }
//       })
//     }

//     // Sort by item name
//     processedItems.sort((a, b) => a.itemName.localeCompare(b.itemName))

//     // Calculate summary
//     const summary = {
//       totalItems: processedItems.length,
//       totalInQty: processedItems.reduce((sum, item) => sum + item.totalInQty, 0),
//       totalOutQty: processedItems.reduce((sum, item) => sum + item.totalOutQty, 0),
//       totalBalance: processedItems.reduce((sum, item) => sum + item.balance, 0)
//     }

//     console.log('✅ Stock processing complete:', {
//       itemsProcessed: processedItems.length,
//       summary
//     })

//     return {
//       items: processedItems,
//       summary,
//       filters
//     }

//   }, [rawData, filters])

//   return result
// }




















































import { useMemo } from 'react'
import { 
  RawStockRecord, 
  ProcessedStockItem, 
  StockReportFilters, 
  StockReportResult,
  ClassOption 
} from '@/types/reports/stock/StockReportTypes'

export const useStockReportProcessing = (
  rawData: RawStockRecord[],
  filters: StockReportFilters
): StockReportResult => {
  
  const result = useMemo(() => {
    if (!rawData.length) {
      return {
        items: [],
        summary: { totalItems: 0, totalInQty: 0, totalOutQty: 0, totalBalance: 0 },
        classOptions: { class1: [], class2: [], class3: [], class4: [] },
        filters
      }
    }

    console.log('🔄 Processing stock data with filters:', filters)

    // ✅ STEP 1: Extract class options from data (no separate API calls)
    const classOptionsMap = {
      class1: new Map<number, string>(),
      class2: new Map<number, string>(),
      class3: new Map<number, string>(),
      class4: new Map<number, string>()
    }

    rawData.forEach(record => {
      if (record["Zitems - Item → ItemClass1"] && record["Zclasstypes - ItemClass1 → ClassName"]) {
        classOptionsMap.class1.set(
          record["Zitems - Item → ItemClass1"], 
          record["Zclasstypes - ItemClass1 → ClassName"]
        )
      }
      if (record["Zitems - Item → ItemClass2"] && record["Zclasstypes - ItemClass2 → ClassName"]) {
        classOptionsMap.class2.set(
          record["Zitems - Item → ItemClass2"], 
          record["Zclasstypes - ItemClass2 → ClassName"]
        )
      }
      if (record["Zitems - Item → ItemClass3"] && record["Zclasstypes - ItemClass3 → ClassName"]) {
        classOptionsMap.class3.set(
          record["Zitems - Item → ItemClass3"], 
          record["Zclasstypes - ItemClass3 → ClassName"]
        )
      }
      if (record["Zitems - Item → ItemClass4"] && record["Zclasstypes - ItemClass4 → ClassName"]) {
        classOptionsMap.class4.set(
          record["Zitems - Item → ItemClass4"], 
          record["Zclasstypes - ItemClass4 → ClassName"]
        )
      }
    })

    const classOptions = {
      class1: Array.from(classOptionsMap.class1.entries()).map(([id, className]) => ({ id, className })),
      class2: Array.from(classOptionsMap.class2.entries()).map(([id, className]) => ({ id, className })),
      class3: Array.from(classOptionsMap.class3.entries()).map(([id, className]) => ({ id, className })),
      class4: Array.from(classOptionsMap.class4.entries()).map(([id, className]) => ({ id, className }))
    }

    // ✅ STEP 2: Check if at least one filter is applied
    const hasFilters = filters.itemClass1 || filters.itemClass2 || 
                      filters.itemClass3 || filters.itemClass4 || 
                      filters.searchTerm.trim()

    if (!hasFilters) {
      console.log('⚠️ At least one filter is required to display data')
      return {
        items: [],
        summary: { totalItems: 0, totalInQty: 0, totalOutQty: 0, totalBalance: 0 },
        classOptions,
        filters
      }
    }

    // ✅ STEP 3: Apply filters
    let filteredData = [...rawData]

    // Apply class filters (same logic as EnhancedSelectableTable)
    if (filters.itemClass1) {
      filteredData = filteredData.filter(item => item["Zitems - Item → ItemClass1"] === filters.itemClass1)
    }
    if (filters.itemClass2) {
      filteredData = filteredData.filter(item => item["Zitems - Item → ItemClass2"] === filters.itemClass2)
    }
    if (filters.itemClass3) {
      filteredData = filteredData.filter(item => item["Zitems - Item → ItemClass3"] === filters.itemClass3)
    }
    if (filters.itemClass4) {
      filteredData = filteredData.filter(item => item["Zitems - Item → ItemClass4"] === filters.itemClass4)
    }

    // Apply search filter
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase()
      filteredData = filteredData.filter(item =>
        item["Zitems - Item → ItemName"].toLowerCase().includes(term) ||
        item.Number.toLowerCase().includes(term)
      )
    }

    console.log(`✅ After filtering: ${filteredData.length} records`)

    // ✅ STEP 4: Group by item and calculate totals
    const itemGroups = new Map<number, RawStockRecord[]>()
    
    filteredData.forEach(record => {
      const itemId = record["Zitems - Item → ID"]
      if (!itemGroups.has(itemId)) {
        itemGroups.set(itemId, [])
      }
      itemGroups.get(itemId)!.push(record)
    })

    // ✅ STEP 5: Process each item group
    const processedItems: ProcessedStockItem[] = []

    for (const [itemId, records] of itemGroups.entries()) {
      const firstRecord = records[0]
      
      // Calculate quantities based on selected UOM
      let totalInQty = 0
      let totalOutQty = 0
      let selectedUomName = ''

      records.forEach(record => {
        switch (filters.selectedUom) {
          case 1: // SkuUOM (Base)
            totalInQty += record["Stk Detail → Stock In Sku Uom Qty"] || 0
            totalOutQty += record["Stk Detail → Stock Out Sku Uom Qty"] || 0
            selectedUomName = record["Uoms - SkuUOM → Uom"]
            break
          case 2: // UOM2
            totalInQty += record["Stk Detail → Stock In Uom Qty"] || 0
            totalOutQty += record["Stk Detail → Stock Out Uom Qty"] || 0
            selectedUomName = record["Uoms - Uom2 → Uom"]
            break
          case 3: // UOM3
            totalInQty += record["Stk Detail → Stock In Uom3 Qty"] || 0
            totalOutQty += record["Stk Detail → Stock Out Uom3 Qty"] || 0
            selectedUomName = record["Uoms - Uom3 → Uom"]
            break
        }
      })

      const balance = totalInQty - totalOutQty

      processedItems.push({
        itemId,
        itemName: firstRecord["Zitems - Item → ItemName"],
        selectedUom: selectedUomName,
        totalInQty,
        totalOutQty,
        balance,
        itemClass1: firstRecord["Zitems - Item → ItemClass1"],
        itemClass2: firstRecord["Zitems - Item → ItemClass2"],
        itemClass3: firstRecord["Zitems - Item → ItemClass3"],
        itemClass4: firstRecord["Zitems - Item → ItemClass4"]
      })
    }

    // Sort by item name
    processedItems.sort((a, b) => a.itemName.localeCompare(b.itemName))

    // Calculate summary
    const summary = {
      totalItems: processedItems.length,
      totalInQty: processedItems.reduce((sum, item) => sum + item.totalInQty, 0),
      totalOutQty: processedItems.reduce((sum, item) => sum + item.totalOutQty, 0),
      totalBalance: processedItems.reduce((sum, item) => sum + item.balance, 0)
    }

    console.log('✅ Stock processing complete:', {
      itemsProcessed: processedItems.length,
      summary
    })

    return {
      items: processedItems,
      summary,
      classOptions,
      filters
    }

  }, [rawData, filters])

  return result
}
