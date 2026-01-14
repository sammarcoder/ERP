
// components/orders/OrderDetails.tsx - YOUR EXACT UI + FIXED UOM DATA STRUCTURE FOR EDIT
'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MultiSelectItemTable, ExtractedItemData } from '@/components/common/items/MultiSelectItemTable'
import UomConverter from '@/components/common/items/UomConverter'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { formatWithMathRound } from '@/components/common/NumberFormat'

interface OrderHeaderData {
  date: string
  COA_ID: string | number
  Transporter_ID: string | number
  Stock_Type_ID: number
  discountA: number
  discountB: number
  discountC: number
  freight_crt: number
  labour_crt: number
  bility_expense: number
  other_expense: number
  foreign_currency?: string
  sub_customer?: string
  sub_city?: string
  str?: number
}

interface OrderLineItem {
  lineNo: number
  Item_ID: number
  itemName: string
  unitPrice: number | string           

  // UOM Data
  uom1_qty: number | string            
  uom2_qty: number | string            
  uom3_qty: number | string            
  sale_unit: number
  Uom_Id: number

  // Discount Fields
  Discount_A: number | string          
  Discount_B: number | string          
  Discount_C: number | string          

  // Calculated fields (UI only)
  grossTotal: number
  totalDiscount: number
  netTotal: number

  // Reference data
  extractedUomData: ExtractedItemData['uomData']
  originalItem: ExtractedItemData
  isExpanded?: boolean
}

interface OrderDetailsProps {
  mode?: 'create' | 'edit'             // ✅ ADD: Mode support
  headerData: OrderHeaderData
  isPurchase?: boolean
  onChange?: (orderDetails: OrderLineItem[]) => void
  initialLineItems?: any[]             // ✅ ADD: Initial data for edit
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  mode = 'create',                     // ✅ ADD: Default to create
  headerData,
  isPurchase = false,
  onChange,
  initialLineItems = []                // ✅ ADD: Initial data
}) => {
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([])
  const [showItemModal, setShowItemModal] = useState(false)
  const [nextLineNo, setNextLineNo] = useState(1)

  // Get already added item IDs for duplicate prevention
  const alreadyAddedItemIds = useMemo(() => lineItems.map(item => item.Item_ID), [lineItems])


  useEffect(() => {
    if (mode === 'edit' && initialLineItems && initialLineItems.length > 0) {
      console.group('📝 OrderDetails: Edit Mode - Pre-populating line items')

      const populatedItems = initialLineItems.map((detail: any, index: number) => {

        // ✅ FIXED: Use ITEM's conversion factors for UOM calculations
        const extractedUomData = {
          primary: {
            id: detail.item?.uom1?.id || 1,
            name: detail.item?.uom1?.uom || 'Pcs',
            qty: parseFloat(detail.item?.uom1_qyt || 1)      // ✅ Item's conversion factor
          },
          secondary: detail.item?.uomTwo ? {
            id: detail.item.uomTwo.id,
            name: detail.item.uomTwo.uom,
            qty: parseFloat(detail.item?.uom2_qty || 1)      // ✅ Item's conversion factor
          } : null,
          tertiary: detail.item?.uomThree ? {
            id: detail.item.uomThree.id,
            name: detail.item.uomThree.uom,
            qty: parseFloat(detail.item?.uom3_qty || 1)      // ✅ Item's conversion factor
          } : null
        }

        return {
          lineNo: detail.Line_Id || (index + 1),
          Item_ID: detail.Item_ID,
          itemName: detail.item?.itemName || '',
          unitPrice: detail.Price ? parseFloat(detail.Price) : '',

          // ✅ These are the ORDER LINE quantities (user-entered values)
          uom1_qty: detail.uom1_qty ? parseFloat(detail.uom1_qty) : '',
          uom2_qty: detail.uom2_qty ? parseFloat(detail.uom2_qty) : '',
          uom3_qty: detail.uom3_qty ? parseFloat(detail.uom3_qty) : '',
          sale_unit: parseInt(detail.sale_unit || 3),
          Uom_Id: detail.Uom_Id,

          Discount_A: detail.Discount_A ? parseFloat(detail.Discount_A) : '',
          Discount_B: detail.Discount_B ? parseFloat(detail.Discount_B) : '',
          Discount_C: detail.Discount_C ? parseFloat(detail.Discount_C) : '',

          // ✅ Pass ITEM's conversion factors to UomConverter
          extractedUomData: extractedUomData,
          originalItem: {
            id: detail.Item_ID,
            itemName: detail.item?.itemName || '',
            sellingPrice: parseFloat(detail.item?.sellingPrice || 0),
            purchasePricePKR: parseFloat(detail.item?.purchasePricePKR || 0),
            uomData: extractedUomData
          },
          grossTotal: 0,
          totalDiscount: 0,
          netTotal: 0,
          isExpanded: false
        }
      })

      const calculatedItems = populatedItems.map(item => calculateLineTotal(item))
      setLineItems(calculatedItems)
      setNextLineNo((populatedItems.length || 0) + 1)
      console.groupEnd()
    }
  }, [mode, initialLineItems])



  // ✅ Open modal handler
  const handleOpenModal = useCallback(() => {
    console.log('🔓 Opening item selection modal')
    setShowItemModal(true)
  }, [])

  // ✅ Close modal handler
  const handleCloseModal = useCallback(() => {
    console.log('❌ Closing item selection modal')
    setShowItemModal(false)
  }, [])

  // ✅ FIXED: Calculate line totals with CASCADING discounts
  // For SALES: Apply Discount_A first, then B on remaining, then C on remaining
  // For PURCHASE: Only apply Discount_A
  const calculateLineTotal = useCallback((lineItem: OrderLineItem): OrderLineItem => {
    // ✅ Get numeric values, treat empty strings as 0 for calculations only
    const getNumericValue = (val: number | string): number => {
      if (val === '' || val === null || val === undefined) return 0
      return typeof val === 'string' ? parseFloat(val) || 0 : val
    }

    const quantity = getNumericValue(lineItem.uom2_qty) || getNumericValue(lineItem.uom1_qty) || getNumericValue(lineItem.uom3_qty) || 0
    const unitPrice = getNumericValue(lineItem.unitPrice)
    const grossTotal = quantity * unitPrice

    // ✅ Get discount values
    const discountA = getNumericValue(lineItem.Discount_A)
    const discountB = getNumericValue(lineItem.Discount_B)
    const discountC = getNumericValue(lineItem.Discount_C)

    let totalDiscount = 0
    let netTotal = grossTotal

    if (isPurchase) {
      // ✅ PURCHASE: Only apply Discount_A
      const discountAmountA = (grossTotal * discountA) / 100
      totalDiscount = discountAmountA
      netTotal = grossTotal - totalDiscount
    } else {
      // ✅ SALES: Apply cascading discounts (A → B → C)
      // Step 1: Apply Discount_A to grossTotal
      const discountAmountA = (grossTotal * discountA) / 100
      const afterA = grossTotal - discountAmountA

      // Step 2: Apply Discount_B to remaining value (afterA)
      const discountAmountB = (afterA * discountB) / 100
      const afterB = afterA - discountAmountB

      // Step 3: Apply Discount_C to remaining value (afterB)
      const discountAmountC = (afterB * discountC) / 100
      netTotal = afterB - discountAmountC

      // Total discount is the sum of all discount amounts
      totalDiscount = discountAmountA + discountAmountB + discountAmountC
    }

    return {
      ...lineItem,
      grossTotal,
      totalDiscount,
      netTotal
    }
  }, [isPurchase])

  // ✅ FIXED: Handle bulk item selection with proper discount application in edit mode
  const handleBulkItemSelection = useCallback((selectedItems: ExtractedItemData[]) => {
    console.group('📦 Adding Bulk Items to Order')
    console.log('Selected Items:', selectedItems.length)
    console.log('Mode:', mode)
    console.log('Header Discounts:', {
      discountA: headerData.discountA,
      discountB: headerData.discountB,
      discountC: headerData.discountC
    })

    const newLineItems: OrderLineItem[] = selectedItems.map((item, index) => {
      const lineNo = nextLineNo + index

      const newLineItem: OrderLineItem = {
        lineNo,
        Item_ID: item.id,
        itemName: item.itemName,
        unitPrice: isPurchase ? item.purchasePricePKR : item.sellingPrice,

        // ✅ FIXED: Initialize UOM values as empty strings, not 0
        uom1_qty: '',
        uom2_qty: '',
        uom3_qty: '',
        sale_unit: 3, // Default to tertiary
        Uom_Id: item.uomData.tertiary?.id || item.uomData.primary.id,

       
        Discount_A: headerData.discountA || '',
        Discount_B: isPurchase ? '' : headerData.discountB || '',
        Discount_C: isPurchase ? '' : headerData.discountC || '',


        // Initial calculations
        grossTotal: 0,
        totalDiscount: 0,
        netTotal: 0,

        // Store UOM data for converter
        extractedUomData: item.uomData,
        originalItem: item,
        isExpanded: false
      }

      return calculateLineTotal(newLineItem)
    })

    console.log('New Line Items Created:', newLineItems.length)
    console.log('Discounts applied to new items:', {
      discountA: headerData.discountA || 'empty',
      discountB: headerData.discountB || 'empty',
      discountC: headerData.discountC || 'empty'
    })
    console.groupEnd()

    setLineItems(prev => [...prev, ...newLineItems])
    setNextLineNo(prev => prev + selectedItems.length)

    // ✅ Modal stays open - don't close here
    console.log('✅ Items added! Modal remains open for more selections.')
  }, [nextLineNo, headerData, isPurchase, calculateLineTotal, mode])

  // ✅ FIXED: Handle UOM converter changes with proper empty string support
  const handleUomChange = useCallback((lineIndex: number, uomData: any) => {
    console.log(`🔄 UOM changed for line ${lineIndex}:`, uomData)

    setLineItems(prev => prev.map((item, index) => {
      if (index === lineIndex) {
        const updatedItem = {
          ...item,
          // ✅ FIXED: Keep empty strings if no value
          uom1_qty: uomData.uom1_qty || '',
          uom2_qty: uomData.uom2_qty || '',
          uom3_qty: uomData.uom3_qty || '',
          sale_unit: uomData.sale_unit || 3,
          Uom_Id: uomData.Uom_Id || item.Uom_Id
        }
        return calculateLineTotal(updatedItem)
      }
      return item
    }))
  }, [calculateLineTotal])

  // ✅ FIXED: Handle unit price change with empty string support
  const handleUnitPriceChange = useCallback((lineIndex: number, value: string) => {
    setLineItems(prev => prev.map((item, index) => {
      if (index === lineIndex) {
        // ✅ FIXED: Keep as string if empty, otherwise convert to number
        const updatedItem = {
          ...item,
          unitPrice: value === '' ? '' : (parseFloat(value) || '')
        }
        return calculateLineTotal(updatedItem)
      }
      return item
    }))
  }, [calculateLineTotal])

  // ✅ FIXED: Handle discount changes with proper empty string support
  const handleDiscountChange = useCallback((lineIndex: number, discountType: 'A' | 'B' | 'C', value: string) => {
    setLineItems(prev => prev.map((item, index) => {
      if (index === lineIndex) {
        const updatedItem = {
          ...item,
          // ✅ FIXED: Keep empty string if empty, don't convert to 0
          [`Discount_${discountType}`]: value === '' ? '' : value
        }
        return calculateLineTotal(updatedItem)
      }
      return item
    }))
  }, [calculateLineTotal])

  // ✅ Delete line item
  const deleteLine = useCallback((lineIndex: number) => {
    setLineItems(prev => prev.filter((_, index) => index !== lineIndex))
  }, [])

  // ✅ Toggle line expansion
  const toggleLineExpansion = useCallback((lineIndex: number) => {
    setLineItems(prev => prev.map((item, index) =>
      index === lineIndex ? { ...item, isExpanded: !item.isExpanded } : item
    ))
  }, [])

  // ✅ Calculate order summary
  const orderSummary = useMemo(() => {
    const grossTotal = lineItems.reduce((sum, item) => sum + item.grossTotal, 0)
    const totalDiscount = lineItems.reduce((sum, item) => sum + item.totalDiscount, 0)
    const netTotal = grossTotal - totalDiscount

    return { grossTotal, totalDiscount, netTotal }
  }, [lineItems])

  // ✅ Notify parent of changes
  React.useEffect(() => {
    onChange?.(lineItems)
  }, [lineItems, onChange])

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md">
      {/* ✅ YOUR EXACT HEADER - NO CHANGES */}
      <div className=" flex justify-end p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="primary"
            onClick={handleOpenModal}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {mode === 'edit' ? 'Add More Items' : 'Add Bulk Items'}
          </Button>
        </div>
      </div>

      {/* ✅ YOUR EXACT TABLE LAYOUT - NO CHANGES */}
      <div className="bg-white overflow-hidden">
        {/* Table Header */}
        <div className="max-w-7xl bg-gray-100 border-b border-gray-300">
          <div className="flex justify-between px-2 py-3 text-sm font-medium text-gray-700">
            <div className=" text-center w-[5%]">LINE</div>
            <div className=" text-center w-[15%]">ITEM</div>
            <div className="text-center w-[7%] ">UNIT PRICE</div>
            <div className=" text-center w-[30%]">UOM SELECTION</div>
            <div className=" text-center w-[20%]">TIER DISCOUNTS (%)</div>
            <div className=" text-center w-[7%]">GROSS</div>
            <div className=" text-center w-[7%]">NET</div>
            <div className=" text-center  w-[5%]">ACTION</div>
          </div>
        </div>

        {/* ✅ YOUR EXACT EMPTY STATE OR TABLE BODY */}
        {lineItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">
              {mode === 'edit' ? 'No items in this order' : 'No items added yet'}
            </p>
            <p className="text-sm mt-2">
              {mode === 'edit'
                ? 'Add items to this order using "Add More Items"'
                : 'Click "Add Bulk Items" to select products'
              }
            </p>
          </div>
        ) : (
          <div>
            {lineItems.map((lineItem, index) => (
              <div
                key={`line-${lineItem.lineNo}`}
                className={`flex items-end justify-between px-2 py-2 ${index % 2 === 0 ? 'bg-gray-0' : 'bg-gray-200'
                  }`}
              >
                {/* Line Number */}
                <div className='w-[5%] '>
                  <div className=" bg-green-100 text-green-800   rounded-xl flex items-center justify-center w-8 h-8 mx-auto">
                    {lineItem.lineNo}
                  </div>
                </div>


                {/* Item Name */}
                
                <div className="w-[15%] mb-1.5">
                  <span className="text-gray-900 text-center font-normal text-sm  truncate block">
                    {lineItem.itemName}
                  </span>
                </div>

                {/* ✅ FIXED: Unit Price with proper empty string handling */}
                <div className="w-[7%]">
                  <Input
                    type="number"
                    value={lineItem.unitPrice}
                    onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                    placeholder="0"
                    step="0.01"
                    className="w-full h-8 text-sm font-normal p-0"
                  />
                </div>

                {/* ✅ CRITICAL FIX: UOM Selection with correctly structured UOM data */}
                <div className="w-[25%] mx-auto">
                  <div className=''>
                    <UomConverter
                      key={`uom-${lineItem.Item_ID}-${index}`}
                      uomData={lineItem.extractedUomData}
                      lineIndex={index}
                      onChange={(values) => handleUomChange(index, values)}
                      initialValues={{
                        // ✅ FIXED: Convert to string properly, show empty string if empty
                        uom1_qty: lineItem.uom1_qty === '' ? '' : lineItem.uom1_qty.toString(),
                        uom2_qty: lineItem.uom2_qty === '' ? '' : lineItem.uom2_qty.toString(),
                        uom3_qty: lineItem.uom3_qty === '' ? '' : lineItem.uom3_qty.toString(),
                        sale_unit: lineItem.sale_unit.toString()
                      }}
                      isPurchase={isPurchase}
                      tableMode={true}
                    />

                  </div>

                </div>





                <div className="w-[20%]">
                  <div className={`grid gap-2 ${isPurchase ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {/* Tier A */}
                    <div className="text-center">
                      {/* <div className="text-xs font-normal text-gray-500 mb-1">TIER A (%)</div> */}
                      <Input
                        type="number"
                        value={lineItem.Discount_A === '' ? '' : lineItem.Discount_A}
                        onChange={(e) => handleDiscountChange(index, 'A', e.target.value)}
                        placeholder="0"
                        step="0.1"
                        max="100"
                        className="w-full h-8 text-sm font-normal text-center pr-4 max-w-20"
                      />
                    </div>

                    {/* Only show B and C if not purchase */}
                    {!isPurchase && (
                      <>
                        <div className="text-center">
                          {/* <div className="text-xs font-normal text-gray-500 mb-1">TIER B (%)</div> */}
                          <Input
                            type="number"
                            value={lineItem.Discount_B === '' ? '' : lineItem.Discount_B}
                            onChange={(e) => handleDiscountChange(index, 'B', e.target.value)}
                            placeholder="0"
                            step="0.1"
                            max="100"
                            className="w-full h-8 text-sm font-normal text-center pr-4 max-w-20"
                          />
                        </div>
                        <div className="text-center">
                          {/* <div className="text-xs font-normal text-gray-500 mb-1">TIER C (%)</div> */}
                          <Input
                            type="number"
                            value={lineItem.Discount_C === '' ? '' : lineItem.Discount_C}
                            onChange={(e) => handleDiscountChange(index, 'C', e.target.value)}
                            placeholder="0"
                            step="0.1"
                            max="100"
                            className="w-full h-8 text-sm font-normal text-center pr-4 max-w-20"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Gross Total */}
                <div className='w-[16%] mb-1'>
                  <div className="text-center flex items-center justify-evenly px-1 space-x-7">
                    {/* <div className="text-xs font-normal text-gray-500">GROSS</div> */}
                    <div className="text-sm font-normal text-gray-900 mt-1">
                      {formatWithMathRound(lineItem.grossTotal)}
                    </div>
                    <div className="text-sm font-normal text-green-700 mt-1">
                      {formatWithMathRound(lineItem.netTotal)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-[3%]">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => deleteLine(index)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Delete line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ YOUR EXACT ORDER SUMMARY */}
      {lineItems.length > 0 && (
        <div className=" flex items-center justify-end p-2  bg-green-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-center w-30">
                {/* <div className="text-sm text-red-600">Total Discount:</div> */}
                <div className="font-semibold text-red-600">{formatWithMathRound(orderSummary.totalDiscount)}</div>
              </div>
              <div className="text-center w-30">
                {/* <div className="text-sm text-gray-600">Gross Total:</div> */}
                <div className="font-semibold">{formatWithMathRound(orderSummary.grossTotal)}</div>
              </div>

              <div className="text-center w-30">
                <div className=" font-semibold text-green-800  px-4 py-2 rounded-lg">
                  {formatWithMathRound(orderSummary.netTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ YOUR EXACT MODAL */}
      {showItemModal && (
        <MultiSelectItemTable
          onSelectionComplete={handleBulkItemSelection}
          onCancel={handleCloseModal}
          isPurchase={isPurchase}
          alreadyAddedItemIds={alreadyAddedItemIds}
        />
      )}
    </div>
  )
}

export default OrderDetails
