// components/UomConverterSimple.tsx

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
}

interface UomConverterSimpleProps {
  uomData: UomData;
  lineIndex: number;
  onChange?: (data: any) => void;
  initialValues?: InitialValues;
}

const UomConverterSimple = ({
  uomData,
  lineIndex,
  onChange,
  initialValues = {}
}: UomConverterSimpleProps) => {
  const [uom1Val, setUom1Val] = useState<string>(initialValues.uom1_qty || '');
  const [uom2Val, setUom2Val] = useState<string>(initialValues.uom2_qty || '');
  const [uom3Val, setUom3Val] = useState<string>(initialValues.uom3_qty || '');

  useEffect(() => {
    if (initialValues) {
      setUom1Val(initialValues.uom1_qty || '');
      setUom2Val(initialValues.uom2_qty || '');
      setUom3Val(initialValues.uom3_qty || '');
    }
  }, [initialValues]);

  // Always notify with sale_unit = 2
  const notifyParent = (uom1: string, uom2: string, uom3: string) => {
    if (onChange) {
      const data = {
        uom1_qty: parseFloat(uom1) || 0,
        uom2_qty: parseFloat(uom2) || 0,
        uom3_qty: parseFloat(uom3) || 0,
        sale_unit: 2,  // ✅ Always 2
        Uom_Id: uomData.secondary?.id || 0  // ✅ Always secondary UOM
      };

      console.log(`🔄 UOM Simple Data for line ${lineIndex}:`, data);
      onChange(data);
    }
  };

  // Only secondary is editable - this handles the change
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
      notifyParent(uom1, value, uom3);
    } else {
      setUom1Val('');
      setUom3Val('');
      notifyParent('0', value || '0', '0');
    }
  };

  return (
    <div className="flex items-start">
      {/* Tertiary UOM - ReadOnly */}
      {uomData.tertiary && (
        <div className="gap-2 border-gray-400 px-1.5">
          <label className="text-xs flex text-gray-600 mb-0.5 font-medium">
            <div>{uomData.tertiary.name}</div>
          </label>
          <input
            type="text"
            value={uom3Val}
            placeholder="0"
            readOnly
            className="border rounded-md px-1 py-0.5 w-14 h-8 text-sm bg-gray-100 text-gray-600 border-gray-300 cursor-not-allowed"
          />
        </div>
      )}

      {/* Secondary UOM - Editable */}
      {uomData.secondary && (
        <div className="gap-2 border-gray-400 px-1.5">
          <label className="text-xs flex text-gray-600 mb-0.5 font-medium">
            <div>{uomData.secondary.name}</div>
          </label>
          <input
            type="text"
            value={uom2Val}
            onChange={handleUom2Change}
            placeholder="0"
            className="border rounded-md px-1 py-0.5 w-16 h-8 text-sm border-green-400 bg-green-50 focus:ring-1 focus:ring-green-500 transition-all"
          />
        </div>
      )}

      {/* Primary UOM - ReadOnly */}
      <div className="gap-2 border-gray-400 px-1.5">
        <label className="text-xs flex text-gray-600 mb-0.5 font-medium items-center">
          <div>{uomData.primary.name}</div>
        </label>
        <input
          type="text"
          value={uom1Val}
          placeholder="0"
          readOnly
          className="border rounded-md px-1 py-0.5 w-[80px] h-8 text-sm bg-gray-100 text-gray-600 border-gray-300 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default UomConverterSimple;
