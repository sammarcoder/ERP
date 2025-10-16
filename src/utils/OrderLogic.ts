// utils/OrderLogic.ts - FIXED to match your backend expectations
export interface Detail {
  Line_Id: number;
  Item_ID: number | null;
  Price: number;
  Stock_In_UOM: number | null;
  Stock_In_UOM_Qty: number;
  Stock_SKU_Price: number;
  Stock_In_SKU_UOM: number | null;
  Stock_In_SKU_UOM_Qty: number;
  Stock_In_UOM3_Qty: number;
  Stock_out_UOM: number | null;
  Stock_out_UOM_Qty: number;
  Stock_out_SKU_UOM: number | null;
  Stock_out_SKU_UOM_Qty: number;
  Stock_out_UOM3_Qty: number;
  uom1_qty?: number;
  uom2_qty?: number;
  uom3_qty?: number;
  sale_unit?: string;
  Discount_A: number;
  Discount_B: number;
  Discount_C: number;
  Goods: string;
  Remarks: string;
  grossTotal: number;
  netTotal: number;
}

export class OrderLogic {
  // ✅ FIXED: Calculate totals - ALWAYS use uom2_qty * price
  static calculateItemTotals = (detail: Detail): Detail => {
    const price = parseFloat(detail.Price.toString()) || 0;
    const qty = parseFloat(detail.uom2_qty?.toString()) || 0; // ALWAYS uom2_qty

    if (detail.Item_ID && qty > 0) {
      const discountA = parseFloat(detail.Discount_A.toString()) || 0;
      const discountB = parseFloat(detail.Discount_B.toString()) || 0;
      const discountC = parseFloat(detail.Discount_C.toString()) || 0;

      const grossTotal = price * qty; // ✅ ALWAYS uom2_qty * price

      let netTotal = grossTotal;
      if (discountA > 0) netTotal = netTotal * (1 - discountA / 100);
      if (discountB > 0) netTotal = netTotal * (1 - discountB / 100);
      if (discountC > 0) netTotal = netTotal * (1 - discountC / 100);

      return {
        ...detail,
        grossTotal: Math.ceil(grossTotal * 100) / 100,
        netTotal: Math.ceil(netTotal * 100) / 100
      };
    } else {
      return { ...detail, grossTotal: 0, netTotal: 0 };
    }
  };

  // ✅ Create new row
  static createNewRow = (lineId: number, selectedAccount: any): Detail => {
    return {
      Line_Id: lineId,
      Item_ID: null,
      Price: 0,
      Stock_In_UOM: null,
      Stock_In_UOM_Qty: 0,
      Stock_SKU_Price: 0,
      Stock_In_SKU_UOM: null,
      Stock_In_SKU_UOM_Qty: 0,
      Stock_In_UOM3_Qty: 0,
      Stock_out_UOM: null,
      Stock_out_UOM_Qty: 0,
      Stock_out_SKU_UOM: null,
      Stock_out_SKU_UOM_Qty: 0,
      Stock_out_UOM3_Qty: 0,
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: '',
      Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
      Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
      Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
      Goods: '',
      Remarks: '',
      grossTotal: 0,
      netTotal: 0
    };
  };

  // ✅ FIXED: Setup item defaults with GUARANTEED UOM2 selection
  static setupItemDefaults = (detail: Detail, selectedItem: any, selectedAccount: any, isPurchase: boolean): Detail => {
    const price = parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0;
    
    console.log('🎯 Setting up item defaults with FORCE UOM2:', {
      itemName: selectedItem.itemName,
      itemId: selectedItem.id,
      price
    });

    const updatedDetail: Detail = {
      ...detail,
      Item_ID: selectedItem.id,
      Price: price,
      sale_unit: 'uomTwo', // ✅ FORCE UOM2 ALWAYS
      uom2_qty: 1,         // ✅ Default quantity ALWAYS
      uom1_qty: 0,
      uom3_qty: 0,
      Discount_A: selectedAccount?.discountA || 0,
      Discount_B: selectedAccount?.discountB || 0,
      Discount_C: selectedAccount?.discountC || 0,
    };

    // Calculate totals immediately
    return this.calculateItemTotals(updatedDetail);
  };

  // ✅ FIXED: Bulk add with UOM2 default for ALL rows including FIRST
  static createBulkItems = (selectedItems: any[], existingDetails: Detail[], selectedAccount: any, isPurchase: boolean): Detail[] => {
    const firstRowEmpty = existingDetails.length === 1 && existingDetails[0].Item_ID === null;
    
    console.log('🔄 Creating bulk items:', {
      itemCount: selectedItems.length,
      firstRowEmpty,
      existingCount: existingDetails.length
    });

    const newRows = selectedItems.map((item, index) => {
      const currentLineId = firstRowEmpty ? index + 1 : existingDetails.length + index + 1;
      const price = parseFloat(isPurchase ? item.purchasePrice : item.sellingPrice) || 0;
      
      console.log(`📦 Creating row ${index + 1} for item:`, item.itemName || item.label);
      
      const newRow: Detail = {
        Line_Id: currentLineId,
        Item_ID: item.id,
        Price: price,
        Stock_In_UOM: null,
        Stock_In_UOM_Qty: 0,
        Stock_SKU_Price: 0,
        Stock_In_SKU_UOM: null,
        Stock_In_SKU_UOM_Qty: 0,
        Stock_In_UOM3_Qty: 0,
        Stock_out_UOM: null,
        Stock_out_UOM_Qty: 0,
        Stock_out_SKU_UOM: null,
        Stock_out_SKU_UOM_Qty: 0,
        Stock_out_UOM3_Qty: 0,
        uom1_qty: 0,
        uom2_qty: 1, // ✅ FORCE UOM2 for ALL including first
        uom3_qty: 0,
        sale_unit: 'uomTwo', // ✅ FORCE UOM2 for ALL including first
        Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
        Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
        Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
        Goods: '',
        Remarks: '',
        grossTotal: 0,
        netTotal: 0
      };

      // Calculate totals for each item
      const calculatedRow = this.calculateItemTotals(newRow);
      
      console.log(`✅ Row ${index + 1} created:`, {
        itemId: calculatedRow.Item_ID,
        sale_unit: calculatedRow.sale_unit,
        uom2_qty: calculatedRow.uom2_qty,
        grossTotal: calculatedRow.grossTotal,
        isFirstRow: index === 0
      });

      return calculatedRow;
    });

    console.log('✅ All bulk rows created with UOM2:', {
      totalRows: newRows.length,
      allHaveUOM2: newRows.every(r => r.sale_unit === 'uomTwo'),
      firstRowUOM2: newRows[0]?.sale_unit === 'uomTwo'
    });

    return firstRowEmpty ? newRows : [...existingDetails, ...newRows];
  };

  // ✅ Date formatting (11/oct/25 style)
  static formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // ✅ Validation
  static validateForm = (master: any, details: Detail[]): { isValid: boolean; message: string } => {
    if (!master.COA_ID) {
      return {
        isValid: false,
        message: 'Please select a customer/supplier'
      };
    }

    const itemsWithoutSelection = details.filter(d => !d.Item_ID);
    if (itemsWithoutSelection.length > 0) {
      return {
        isValid: false,
        message: `Please select items for ${itemsWithoutSelection.length} row(s)`
      };
    }

    const itemsWithoutQuantity = details.filter(d => d.Item_ID && (!d.uom2_qty || d.uom2_qty <= 0));
    if (itemsWithoutQuantity.length > 0) {
      return {
        isValid: false,
        message: `Please enter UOM2 quantity for ${itemsWithoutQuantity.length} item(s)`
      };
    }

    return { isValid: true, message: '' };
  };

  // ✅ ADDED: Fetch order using OrderAPI
  static fetchOrder = async (orderId: string) => {
    return await OrderAPI.fetchOrder(orderId);
  };
}
