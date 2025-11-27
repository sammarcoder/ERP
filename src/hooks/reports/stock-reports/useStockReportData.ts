import { useState, useEffect, useCallback } from 'react'
import { RawStockRecord } from '@/types/reports/stock/StockReportTypes'

export const useStockReportData = () => {
  const [rawData, setRawData] = useState<RawStockRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📥 Fetching stock reports data...')
      
      const response = await fetch('/api/stock-reports')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch stock data')
      }
      
      if (result.data && Array.isArray(result.data)) {
        // Map and clean the data
        const cleanedData: RawStockRecord[] = result.data.map((record: any) => ({
          // Stock Main
          "ID": record.ID || 0,
          "Stock Type ID": record["Stock Type ID"] || 0,
          "Date": record.Date || '',
          "Number": record.Number || '',
          "Status": record.Status || '',
          "Purchase Type": record["Purchase Type"] || '',
          
          // Stock Detail - handle null values properly
          "Stk Detail → ID": record["Stk Detail → ID"] || 0,
          "Stk Detail → Item ID": record["Stk Detail → Item ID"] || 0,
          "Stk Detail → Stock In Uom Qty": record["Stk Detail → Stock In Uom Qty"] || 0,
          "Stk Detail → Stock Out Uom Qty": record["Stk Detail → Stock Out Uom Qty"] || 0,
          "Stk Detail → Stock In Sku Uom Qty": record["Stk Detail → Stock In Sku Uom Qty"] || 0,
          "Stk Detail → Stock Out Sku Uom Qty": record["Stk Detail → Stock Out Sku Uom Qty"] || 0,
          "Stk Detail → Stock In Uom3 Qty": record["Stk Detail → Stock In Uom3 Qty"] || 0,
          "Stk Detail → Stock Out Uom3 Qty": record["Stk Detail → Stock Out Uom3 Qty"] || 0,
          
          // Item Master
          "Zitems - Item → ID": record["Zitems - Item → ID"] || 0,
          "Zitems - Item → ItemName": record["Zitems - Item → ItemName"] || '',
          "Zitems - Item → ItemClass1": record["Zitems - Item → ItemClass1"],
          "Zitems - Item → ItemClass2": record["Zitems - Item → ItemClass2"],
          "Zitems - Item → ItemClass3": record["Zitems - Item → ItemClass3"],
          "Zitems - Item → ItemClass4": record["Zitems - Item → ItemClass4"],
          
          // UOM Names
          "Uoms - SkuUOM → Uom": record["Uoms - SkuUOM → Uom"] || '',
          "Uoms - Uom2 → Uom": record["Uoms - Uom2 → Uom"] || '',
          "Uoms - Uom3 → Uom": record["Uoms - Uom3 → Uom"] || '',
          
          // Class Names
          "Zclasstypes - ItemClass1 → ClassName": record["Zclasstypes - ItemClass1 → ClassName"],
          "Zclasstypes - ItemClass2 → ClassName": record["Zclasstypes - ItemClass2 → ClassName"],
          "Zclasstypes - ItemClass3 → ClassName": record["Zclasstypes - ItemClass3 → ClassName"],
          "Zclasstypes - ItemClass4 → ClassName": record["Zclasstypes - ItemClass4 → ClassName"]
        }))
        
        setRawData(cleanedData)
        console.log('✅ Stock data processed:', cleanedData.length, 'records')
      } else {
        throw new Error('Invalid API response format')
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data'
      console.error('❌ Stock data fetch error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStockData()
  }, [fetchStockData])

  return {
    rawData,
    loading,
    error,
    refetch: fetchStockData
  }
}
