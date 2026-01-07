'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'

interface UomData {
  primary: { id: number; name: string; qty: number }
  secondary?: { id: number; name: string; qty: number }
  tertiary?: { id: number; name: string; qty: number }
}

interface InitialValues {
  uom1_qty?: string
  uom2_qty?: string
  uom3_qty?: string
  sale_unit?: string
}

interface Props {
  uomData: UomData
  lineIndex: number
  itemId?: number
  onChange?: (data: any) => void
  initialValues?: InitialValues
  isPurchase?: boolean
  defaultSaleUnit?: string
}

const UomConverter: React.FC<Props> = ({
  uomData,
  lineIndex,
  itemId,
  onChange,
  initialValues,
  isPurchase = false,
  defaultSaleUnit = '1'
}) => {
  // ✅ Determine which UOM to default to based on available UOMs
  const getDefaultSaleUnit = () => {
    if (initialValues?.sale_unit) return initialValues.sale_unit
    if (uomData.tertiary) return '3'
    if (uomData.secondary) return '2'
    return '1'
  }

  const [uom1Val, setUom1Val] = useState('')
  const [uom2Val, setUom2Val] = useState('')
  const [uom3Val, setUom3Val] = useState('')
  const [saleUnit, setSaleUnit] = useState(getDefaultSaleUnit())

  const isFirstRender = useRef(true)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // ✅ Initialize ONLY on first render
  useEffect(() => {
    if (!isFirstRender.current) return
    isFirstRender.current = false

    if (initialValues) {
      const u1 = initialValues.uom1_qty || ''
      const u2 = initialValues.uom2_qty || ''
      const u3 = initialValues.uom3_qty || ''
      const su = initialValues.sale_unit || getDefaultSaleUnit()

      setUom1Val(u1)
      setUom2Val(u2)
      setUom3Val(u3)
      setSaleUnit(su)

      notifyParent(u1, u2, u3, su)
    }
  }, [])

  // ✅ Helper: Ensure non-negative number
  const sanitizeValue = (val: string): string => {
    const num = parseFloat(val)
    if (isNaN(num) || num < 0) return ''
    return val
  }

  // ✅ Helper: Parse to non-negative number
  const parsePositive = (val: string): number => {
    const num = parseFloat(val)
    return isNaN(num) || num < 0 ? 0 : num
  }

  const notifyParent = useCallback((u1: string, u2: string, u3: string, su: string) => {
    if (!onChangeRef.current) return

    let uomId = 0
    if (su === '1') uomId = uomData.primary.id
    else if (su === '2') uomId = uomData.secondary?.id || 0
    else if (su === '3') uomId = uomData.tertiary?.id || 0

    const data = {
      uom1_qty: parsePositive(u1),
      uom2_qty: parsePositive(u2),
      uom3_qty: parsePositive(u3),
      sale_unit: parseInt(su),
      Uom_Id: uomId
    }

    console.log(`📊 UOM Notify (Item ${itemId}):`, data)
    onChangeRef.current(data)
  }, [uomData, itemId])

  // ✅ Handle PRIMARY (UOM1) input change
  const handleUom1Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    
    // ✅ Prevent negative input
    if (rawValue.includes('-')) return
    
    const value = sanitizeValue(rawValue)
    setUom1Val(rawValue) // Allow typing

    const numValue = parsePositive(rawValue)
    let newUom2 = ''
    let newUom3 = ''

    if (numValue > 0) {
      // Convert: Primary → Secondary
      if (uomData.secondary && uomData.secondary.qty > 1) {
        newUom2 = (numValue / uomData.secondary.qty).toFixed(2)
      }
      // Convert: Primary → Tertiary
      if (uomData.tertiary && uomData.tertiary.qty > 1) {
        newUom3 = (numValue / uomData.tertiary.qty).toFixed(2)
      }
    }

    setUom2Val(newUom2)
    setUom3Val(newUom3)
    notifyParent(rawValue, newUom2, newUom3, saleUnit)
  }, [uomData, saleUnit, notifyParent])

  // ✅ Handle SECONDARY (UOM2) input change
  const handleUom2Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    
    if (rawValue.includes('-')) return
    
    setUom2Val(rawValue)

    const numValue = parsePositive(rawValue)
    let newUom1 = ''
    let newUom3 = ''

    if (numValue > 0 && uomData.secondary && uomData.secondary.qty > 0) {
      // Convert: Secondary → Primary (multiply)
      newUom1 = (numValue * uomData.secondary.qty).toFixed(2)

      // Convert: Secondary → Tertiary
      if (uomData.tertiary && uomData.tertiary.qty > 1) {
        const primaryQty = numValue * uomData.secondary.qty
        newUom3 = (primaryQty / uomData.tertiary.qty).toFixed(2)
      }
    }

    setUom1Val(newUom1)
    setUom3Val(newUom3)
    notifyParent(newUom1, rawValue, newUom3, saleUnit)
  }, [uomData, saleUnit, notifyParent])

  // ✅ Handle TERTIARY (UOM3) input change
  const handleUom3Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    
    if (rawValue.includes('-')) return
    
    setUom3Val(rawValue)

    const numValue = parsePositive(rawValue)
    let newUom1 = ''
    let newUom2 = ''

    if (numValue > 0 && uomData.tertiary && uomData.tertiary.qty > 0) {
      // Convert: Tertiary → Primary (multiply)
      newUom1 = (numValue * uomData.tertiary.qty).toFixed(2)

      // Convert: Tertiary → Secondary
      if (uomData.secondary && uomData.secondary.qty > 0) {
        const primaryQty = numValue * uomData.tertiary.qty
        newUom2 = (primaryQty / uomData.secondary.qty).toFixed(2)
      }
    }

    setUom1Val(newUom1)
    setUom2Val(newUom2)
    notifyParent(newUom1, newUom2, rawValue, saleUnit)
  }, [uomData, saleUnit, notifyParent])

  // ✅ Handle sale unit radio change
  const handleSaleUnitChange = useCallback((unit: string) => {
    setSaleUnit(unit)
    notifyParent(uom1Val, uom2Val, uom3Val, unit)
  }, [uom1Val, uom2Val, uom3Val, notifyParent])

  const radioName = `saleunit_${lineIndex}_${itemId || 'x'}`

  const getInputClass = (unit: string) => {
    const isActive = saleUnit === unit && !isPurchase
    return `border rounded px-2 py-1 w-20 h-8 text-sm transition-all ${
      isActive
        ? 'border-green-500 bg-green-50 ring-1 ring-green-400'
        : 'border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
    }`
  }

  // ✅ Check if UOM is available
  const hasSecondary = uomData.secondary && uomData.secondary.qty > 0
  const hasTertiary = uomData.tertiary && uomData.tertiary.qty > 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* ✅ TERTIARY UOM - Only show if available */}
      {hasTertiary && (
        <div className=" items-center gap-1">
          <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
            <input
              type="radio"
              name={radioName}
              checked={saleUnit === '3'}
              onChange={() => handleSaleUnitChange('3')}
              className="w-3 h-3 cursor-pointer"
            />
            <span>{uomData.tertiary!.name}</span>
            <span className="text-gray-400 text-[10px]">({uomData.tertiary!.qty})</span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={uom3Val}
            onChange={handleUom3Change}
            onKeyDown={(e) => e.key === '-' && e.preventDefault()}
            placeholder="0"
            className={getInputClass('3')}
          />
          
        </div>
      )}

      {/* ✅ SECONDARY UOM - Only show if available */}
      {hasSecondary && (
        <div className="items-center gap-1">
           <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
            <input
              type="radio"
              name={radioName}
              checked={saleUnit === '2'}
              onChange={() => handleSaleUnitChange('2')}
              className="w-3 h-3 cursor-pointer"
            />
            <span>{uomData.secondary!.name}</span>
            <span className="text-gray-400 text-[10px]">({uomData.secondary!.qty})</span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={uom2Val}
            onChange={handleUom2Change}
            onKeyDown={(e) => e.key === '-' && e.preventDefault()}
            placeholder="0"
            className={getInputClass('2')}
          />
         
        </div>
      )}

      {/* ✅ PRIMARY UOM - Always show */}
      <div className="items-center gap-1">
         <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
          <input
            type="radio"
            name={radioName}
            checked={saleUnit === '1'}
            onChange={() => handleSaleUnitChange('1')}
            className="w-3 h-3 cursor-pointer"
          />
          <span>{uomData.primary.name}</span>
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={uom1Val}
          onChange={handleUom1Change}
          onKeyDown={(e) => e.key === '-' && e.preventDefault()}
          placeholder="0"
          className={`${getInputClass('1')}`}
        />
       
      </div>

      {/* ✅ Warning if no conversion available */}
      {!hasSecondary && !hasTertiary && (
        <span className="text-xs text-orange-500 ml-2">
          (Primary only)
        </span>
      )}
    </div>
  )
}

export default UomConverter
