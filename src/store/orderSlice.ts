// store/orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface OrderDetail {
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
  uom1_qty: number;
  uom2_qty: number;
  uom3_qty: number;
  sale_unit: string;
  Discount_A: number;
  Discount_B: number;
  Discount_C: number;
  Goods: string;
  Remarks: string;
  grossTotal: number;
  netTotal: number;
}

interface OrderMaster {
  Stock_Type_ID: number | null;
  Date: string;
  COA_ID: number | null;
  Status: string;
  orderType: 'sales' | 'purchase';
  carriageAmount: number;
  carriageAccountId: number | null;
}

interface OrderState {
  // Order Data
  master: OrderMaster;
  details: OrderDetail[];
  
  // Items Data  
  items: any[];
  filteredItems: any[];
  classFilters: {
    itemClass1: number | null;
    itemClass2: number | null;
    itemClass3: number | null;
    itemClass4: number | null;
  };
  
  // Accounts Data
  accounts: any[];
  selectedAccount: any;
  showAllAccounts: boolean;
  carriageAccounts: any[];
  
  // Calculations
  totals: {
    grossTotal: number;
    netTotal: number;
    totalDiscount: number;
    grandTotal: number;
    itemCount: number;
  };
  
  // UI State
  loading: boolean;
  error: string | null;
  expandedRows: number[];
}

const initialDetail: OrderDetail = {
  Line_Id: 1,
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
  sale_unit: 'uom2', // Default UOM2
  Discount_A: 0,
  Discount_B: 0,
  Discount_C: 0,
  Goods: '',
  Remarks: '',
  grossTotal: 0,
  netTotal: 0,
};

const initialState: OrderState = {
  master: {
    Stock_Type_ID:null ,
    Date: new Date().toISOString().split('T')[0],
    COA_ID: null,
    Status: 'Draft',
    orderType: 'sales',
    carriageAmount: 0,
    carriageAccountId: null,
  },
  details: [initialDetail],
  items: [],
  filteredItems: [],
  classFilters: {
    itemClass1: null,
    itemClass2: null,
    itemClass3: null,
    itemClass4: null,
  },
  accounts: [],
  selectedAccount: null,
  showAllAccounts: false,
  carriageAccounts: [],
  totals: {
    grossTotal: 0,
    netTotal: 0,
    totalDiscount: 0,
    grandTotal: 0,
    itemCount: 0,
  },
  loading: false,
  error: null,
  expandedRows: [0],
};

// Async Thunks
export const fetchItems = createAsyncThunk(
  'order/fetchItems',
  async () => {
    const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items`);
    const result = await response.json();
    return result.success ? result.data : [];
  }
);

export const fetchAccounts = createAsyncThunk(
  'order/fetchAccounts',
  async (orderType: 'sales' | 'purchase') => {
    const endpoint = orderType === 'purchase' 
      ? 'by-coa-type-supplier'   // Your specific request
      : 'by-coa-type-customer';  // Your specific request
    
    const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/${endpoint}`);
    const result = await response.json();
    return result.success ? result.data : [];
  }
);

export const fetchAllAccounts = createAsyncThunk(
  'order/fetchAllAccounts',
  async () => {
    const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`);
    const result = await response.json();
    return result.zCoaRecords || [];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Master Updates
    updateMaster: (state, action) => {
      state.master = { ...state.master, ...action.payload };
    },
    
    setOrderType: (state, action) => {
      state.master.orderType = action.payload;
    },
    
    // Detail Updates  
    addRow: (state) => {
      const newRow = {
        ...initialDetail,
        Line_Id: state.details.length + 1,
      };
      state.details.push(newRow);
      state.expandedRows.push(state.details.length - 1);
    },
    
    removeRow: (state, action) => {
      const index = action.payload;
      if (state.details.length > 1) {
        state.details.splice(index, 1);
        // Reindex Line_Id
        state.details.forEach((detail, idx) => {
          detail.Line_Id = idx + 1;
        });
        // Remove from expanded
        state.expandedRows = state.expandedRows.filter(i => i !== index);
      }
    },
    
    updateDetail: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.details[index]) {
        state.details[index][field] = value;
      }
    },
    
    // FIXED: Bulk Add Logic (replace empty row instead of adding)
    bulkAddItems: (state, action) => {
      const { items, selectedAccount } = action.payload;
      const firstRowEmpty = state.details.length === 1 && state.details[0].Item_ID === null;
      
      const newRows = items.map((item, index) => ({
        ...initialDetail,
        Line_Id: firstRowEmpty ? index + 1 : state.details.length + index + 1,
        Item_ID: item.id,
        Price: parseFloat(state.master.orderType === 'purchase' ? item.purchasePrice : item.sellingPrice) || 0,
        sale_unit: 'uom2', // Default UOM2
        Discount_A: selectedAccount?.discountA || 0,
        Discount_B: selectedAccount?.discountB || 0,
        Discount_C: selectedAccount?.discountC || 0,
      }));

      if (firstRowEmpty) {
        // REPLACE empty row instead of adding new
        state.details = newRows;
        state.expandedRows = newRows.map((_, index) => index);
      } else {
        // Add new rows (original behavior)
        state.details.push(...newRows);
        const newIndices = newRows.map((_, index) => state.details.length - newRows.length + index);
        state.expandedRows.push(...newIndices);
      }
    },
    
    // Account Management
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    
    setShowAllAccounts: (state, action) => {
      state.showAllAccounts = action.payload;
    },
    
    // Calculations  
    // calculateTotals: (state) => {
    //   let grossTotal = 0;
    //   let netTotal = 0;
    //   let totalDiscount = 0;
    //   let itemCount = 0;

    //   state.details.forEach(detail => {
    //     if (detail.Item_ID !== null) {
    //       // American Format Calculation
    //       const gross = detail.Price * detail.uom2_qty;
    //       let net = gross;
          
    //       // Cascading discounts: A → B → C
    //       if (detail.Discount_A > 0) {
    //         net = net * (1 - detail.Discount_A / 100);
    //       }
    //       if (detail.Discount_B > 0) {
    //         net = net * (1 - detail.Discount_B / 100);
    //       }
    //       if (detail.Discount_C > 0) {
    //         net = net * (1 - detail.Discount_C / 100);
    //       }
          
    //       detail.grossTotal = Math.ceil(gross * 100) / 100; // Round up (American standard)
    //       detail.netTotal = Math.ceil(net * 100) / 100;
          
    //       grossTotal += detail.grossTotal;
    //       netTotal += detail.netTotal;
    //       totalDiscount += (detail.grossTotal - detail.netTotal);
    //       itemCount++;
    //     }
    //   });

    //   state.totals = {
    //     grossTotal: Math.ceil(grossTotal * 100) / 100,
    //     netTotal: Math.ceil(netTotal * 100) / 100,
    //     totalDiscount: Math.ceil(totalDiscount * 100) / 100,
    //     grandTotal: Math.ceil((netTotal + state.master.carriageAmount) * 100) / 100,
    //     itemCount,
    //   };
    // },
    



// In store/orderSlice.ts - Update calculateTotals reducer
calculateTotals: (state) => {
  let grossTotal = 0;
  let netTotal = 0;
  let totalDiscount = 0;
  let itemCount = 0;

  state.details.forEach(detail => {
    // ✅ FIXED: Only calculate if item exists AND has UOM quantity > 0
    if (detail.Item_ID !== null && (detail.uom1_qty > 0 || detail.uom2_qty > 0 || detail.uom3_qty > 0)) {
      // Use UOM2 quantity for calculation (as per your requirement)
      const baseQty = detail.uom2_qty || detail.uom1_qty || detail.uom3_qty;
      const gross = detail.Price * baseQty;
      let net = gross;
      
      // Cascading discounts: A → B → C
      if (detail.Discount_A > 0) {
        net = net * (1 - detail.Discount_A / 100);
      }
      if (detail.Discount_B > 0) {
        net = net * (1 - detail.Discount_B / 100);
      }
      if (detail.Discount_C > 0) {
        net = net * (1 - detail.Discount_C / 100);
      }
      
      detail.grossTotal = Math.ceil(gross * 100) / 100;
      detail.netTotal = Math.ceil(net * 100) / 100;
      
      grossTotal += detail.grossTotal;
      netTotal += detail.netTotal;
      totalDiscount += (detail.grossTotal - detail.netTotal);
      itemCount++;
    } else {
      // ✅ FIXED: Reset totals to 0 when no UOM values
      detail.grossTotal = 0;
      detail.netTotal = 0;
    }
  });

  state.totals = {
    grossTotal: Math.ceil(grossTotal * 100) / 100,
    netTotal: Math.ceil(netTotal * 100) / 100,
    totalDiscount: Math.ceil(totalDiscount * 100) / 100,
    grandTotal: Math.ceil((netTotal + state.master.carriageAmount) * 100) / 100,
    itemCount,
  };
},









    // UI State
    toggleRowExpansion: (state, action) => {
      const index = action.payload;
      if (state.expandedRows.includes(index)) {
        state.expandedRows = state.expandedRows.filter(i => i !== index);
      } else {
        state.expandedRows.push(index);
      }
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.filteredItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.loading = false;
        state.showAllAccounts = false;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.loading = false;
        state.showAllAccounts = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'An error occurred';
        }
      );
  },
});

export const {
  updateMaster,
  setOrderType,
  addRow,
  removeRow,
  updateDetail,
  bulkAddItems,
  setSelectedAccount,
  setShowAllAccounts,
  calculateTotals,
  toggleRowExpansion,
  setError,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;
