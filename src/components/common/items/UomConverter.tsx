// components/UomConverter.tsx - FIXED RADIO BUTTONS & DEFAULT VALUES
'use client'
import React, { useEffect, useState } from 'react';

interface UomData {
  primary: { id: number; name: string; qty: number };
  secondary?: { id: number; name: string; qty: number };
  tertiary?: { id: number; name: string; qty: number };
}

interface InitialValues {
  uom1_qty?: string;
  uom2_qty?: string;
  uom3_qty?: string;
  sale_unit?: string;
}

interface UomConverterProps {
  uomData: UomData;
  lineIndex: number; // ✅ ADD: Unique identifier for radio button groups
  onChange?: (data: any) => void;
  initialValues?: InitialValues;
  isPurchase?: boolean;
}

const UomConverter = ({ 
  uomData, 
  lineIndex, // ✅ NEW: Make radio buttons unique per line
  onChange, 
  initialValues = {}, 
  isPurchase = false 
}: UomConverterProps) => {
  // ✅ FIX: Default to tertiary selection but empty value
  const [saleUnit, setSaleUnit] = useState<string>(initialValues.sale_unit || '3');
  const [uom1Val, setUom1Val] = useState<string>(initialValues.uom1_qty || '');
  const [uom2Val, setUom2Val] = useState<string>(initialValues.uom2_qty || '');
  const [uom3Val, setUom3Val] = useState<string>(initialValues.uom3_qty || ''); // ✅ FIX: Empty by default

  useEffect(() => {
    if (initialValues) {
      setUom1Val(initialValues.uom1_qty || '');
      setUom2Val(initialValues.uom2_qty || '');
      setUom3Val(initialValues.uom3_qty || ''); // ✅ FIX: No default "1"
      setSaleUnit(initialValues.sale_unit || '3');
    }
  }, [initialValues]);

  // ✅ FIX: Always notify parent with complete data including uom_ID and sale_unit
  const notifyParent = (uom1: string, uom2: string, uom3: string, selectedSaleUnit: string) => {
    if (onChange) {
      // ✅ FIX: Calculate correct Uom_Id based on sale_unit selection
      let uomId = 0;
      if (selectedSaleUnit === '1') uomId = uomData.primary.id;
      else if (selectedSaleUnit === '2') uomId = uomData.secondary?.id || 0;
      else if (selectedSaleUnit === '3') uomId = uomData.tertiary?.id || 0;

      const data = {
        uom1_qty: parseFloat(uom1) || 0,
        uom2_qty: parseFloat(uom2) || 0,
        uom3_qty: parseFloat(uom3) || 0,
        sale_unit: parseInt(selectedSaleUnit), // ✅ FIX: Send as number, not string
        Uom_Id: uomId // ✅ FIX: Include Uom_Id in response
      };
      
      console.log(`🔄 UOM Data for line ${lineIndex}:`, data);
      onChange(data);
    }
  };

  const handleUom1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUom1Val(value);
    
    if (value && !isNaN(Number(value))) {
      const numValue = parseFloat(value);
      let uom2 = '';
      let uom3 = '';
      
      if (uomData.secondary) {
        uom2 = (numValue / uomData.secondary.qty).toFixed(6);
        setUom2Val(uom2);
      }
      if (uomData.tertiary) {
        uom3 = (numValue / uomData.tertiary.qty).toFixed(6);
        setUom3Val(uom3);
      }
      
      notifyParent(value, uom2, uom3, saleUnit);
    } else {
      setUom2Val('');
      setUom3Val('');
      notifyParent(value || '0', '0', '0', saleUnit);
    }
  };

  const handleUom2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUom2Val(value);
    
    if (value && !isNaN(Number(value)) && uomData.secondary) {
      const numValue = parseFloat(value);
      const uom1 = (numValue * uomData.secondary.qty).toFixed(2);
      let uom3 = '';
      
      if (uomData.tertiary) {
        uom3 = (numValue * uomData.secondary.qty / uomData.tertiary.qty).toFixed(6);
        setUom3Val(uom3);
      }
      
      setUom1Val(uom1);
      notifyParent(uom1, value, uom3, saleUnit);
    } else {
      setUom1Val('');
      setUom3Val('');
      notifyParent('0', value || '0', '0', saleUnit);
    }
  };

  const handleUom3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUom3Val(value);
    
    if (value && !isNaN(Number(value)) && uomData.tertiary) {
      const numValue = parseFloat(value);
      const uom1 = (numValue * uomData.tertiary.qty).toFixed(2);
      let uom2 = '';
      
      if (uomData.secondary) {
        uom2 = (numValue * uomData.tertiary.qty / uomData.secondary.qty).toFixed(2);
        setUom2Val(uom2);
      }
      
      setUom1Val(uom1);
      notifyParent(uom1, uom2, value, saleUnit);
    } else {
      setUom1Val('');
      setUom2Val('');
      notifyParent('0', '0', value || '0', saleUnit);
    }
  };

  // ✅ FIX: Handle sale unit selection and notify immediately
  const handleSaleUnitChange = (unit: string) => {
    console.log(`🎯 Line ${lineIndex} - Sale Unit changed to: ${unit}`);
    setSaleUnit(unit);
    notifyParent(uom1Val, uom2Val, uom3Val, unit);
  };

  // ✅ FIX: Unique radio button name per line
  const radioGroupName = `sale_unit_line_${lineIndex}`;

  return (
    <div className="flex items-start">
      {/* ✅ Tertiary UOM */}
      {uomData.tertiary && (
        <div className="flex gap-2 w-24 border-gray-400 px-1.5">
          <input
            type="text"
            value={uom3Val}
            onChange={handleUom3Change}
            placeholder="0" // ✅ FIX: No default value
            className={`border rounded-md px-1 py-0.5 w-14 h-8 text-sm focus:ring-1 transition-all ${
              saleUnit === '3' && !isPurchase
                ? 'border-green-400 bg-green-50 focus:ring-green-500'
                : 'border-gray-300 focus:ring-purple-500'
            }`}
          />
           <label className="text-xs text-gray-600 mb-0.5 font-medium" title=''>
            {/* {!isPurchase && ( */}
              <input
                type="radio"
                name={radioGroupName} // ✅ FIX: Unique name per line
                value="3"
                checked={saleUnit === '3'}
                onChange={() => handleSaleUnitChange('3')}
                className="mr-1 w-3 h-3"
              />
            {/* )} */}
            <div>
                {uomData.tertiary.name}
            </div>
           
          </label>
        </div>
      )}

      {/* ✅ Secondary UOM */}
      {uomData.secondary && (
        <div className="flex gap-2 w-26 border-gray-400  px-1.5">
          
          <input
            type="text"
            value={uom2Val}
            onChange={handleUom2Change}
            placeholder="0"
            className={`border rounded-md px-1 py-0.5 w-16 h-8 text-sm focus:ring-1 transition-all ${
              saleUnit === '2' && !isPurchase
                ? 'border-green-400 bg-green-50 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <label className="text-xs text-gray-600 mb-0.5 font-medium">
            {/* {!isPurchase && ( */}
              <input
                type="radio"
                name={radioGroupName} // ✅ FIX: Unique name per line
                value="2"
                checked={saleUnit === '2'}
                onChange={() => handleSaleUnitChange('2')}
                className="mr-1 w-3 h-3"
              />
            {/* )} */}
            <div>
                 {uomData.secondary.name}
            </div>
            
          </label>
        </div>
      )}

      {/* ✅ Primary UOM */}
      <div className="flex gap-2 w-30  border-gray-400 px-1.5">
        
        <input
          type="text"
          value={uom1Val}
          onChange={handleUom1Change}
          placeholder="0"
          className={`border rounded-md px-1 py-0.5 w-16 h-8 text-sm focus:ring-1 transition-all w-[80px] ${
            saleUnit === '1' && !isPurchase
              ? 'border-green-400 bg-green-50 focus:ring-green-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <label className="text-xs  text-gray-600 mb-0.5 font-medium  items-center">
          {/* {!isPurchase && ( */}
            <input
              type="radio"
              name={radioGroupName} // ✅ FIX: Unique name per line
              value="1"
              checked={saleUnit === '1'}
              onChange={() => handleSaleUnitChange('1')}
              className="mr-1 w-3 h-3"
            />
          {/* )} */}
          <div>
              {uomData.primary.name}
          </div>
          
        </label>
      </div>
    </div>
  );
};

export default UomConverter;




