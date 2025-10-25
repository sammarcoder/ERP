import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types with ALL fields including your 3 new ones
export interface CoaFormData {
  id?: number;
  acName: string;
  ch1Id: number;
  ch2Id: number;
  coaTypeId: number;
  setupName: string;
  address: string;           
  city: string;
  personName: string;
  mobileNo: string;
  taxStatus: boolean;
  ntn: string;
  cnic: string;
  salesLimit: string;
  credit: string;
  creditDays: string;        
  salesMan: string;
  isJvBalance: boolean;
  isPettyCash?: boolean;
  discountA: number;
  discountB: number;
  discountC: number;
  batch_no: string;
  // EXPENSE FIELDS
  Transporter_ID: number | null;
  freight_crt: number;
  labour_crt: number;
  bility_expense: number;
  other_expense: number;
  // YOUR 3 NEW FIELDS
  foreign_currency: string | null;
  sub_customer: string | null;
  sub_city: string | null;
  str : number | null
}

export interface DropdownOption {
  id: number;
  label?: string;
  zHead1?: string;
  zHead2?: string;
  zType?: string;
  name?: string;
  [key: string]: any;
}

export interface CoaState {
  formData: CoaFormData;
  loading: {
    form: boolean;
    dropdowns: boolean;
    submit: boolean;
  };
  error: string | null;
  dropdownData: {
    controlHead1: DropdownOption[];
    controlHead2: DropdownOption[];
    filteredControlHead2: DropdownOption[];
    coaTypes: DropdownOption[];
    salesmen: DropdownOption[];
  };
  isEditMode: boolean;
}

// Initial state with ALL fields
const initialFormData: CoaFormData = {
  acName: '',
  ch1Id: 0,
  ch2Id: 0,
  coaTypeId: 0,
  setupName: '',
  address: '',
  city: '',
  personName: '',
  mobileNo: '',
  taxStatus: false,
  ntn: '',
  cnic: '',
  salesLimit: '',
  credit: '',
  creditDays: '',
  salesMan: '',
  isJvBalance: false,
  isPettyCash: false,
  discountA: 0,
  discountB: 0,
  discountC: 0,
  batch_no: '',
  // EXPENSE FIELDS
  Transporter_ID: null,
  freight_crt: 0.00,
  labour_crt: 0.00,
  bility_expense: 0.00,
  other_expense: 0.00,
  // NEW FIELDS
  foreign_currency: null,
  sub_customer: '',
  sub_city: null,
  str : null
};

const initialState: CoaState = {
  formData: initialFormData,
  loading: {
    form: false,
    dropdowns: false,
    submit: false,
  },
  error: null,
  dropdownData: {
    controlHead1: [],
    controlHead2: [],
    filteredControlHead2: [],
    coaTypes: [],
    salesmen: [],
  },
  isEditMode: false,
};

// Async Thunks
export const fetchCoaDropdowns = createAsyncThunk(
  'coa/fetchDropdowns',
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = `http://${window.location.hostname}:4000/api`;
      
      const [ch1Res, ch2Res, coaTypesRes, salesmenRes] = await Promise.all([
        fetch(`${baseUrl}/z-control-head1`),
        fetch(`${baseUrl}/z-control-head2/get`),
        fetch(`${baseUrl}/z-coa-type`),
        fetch(`${baseUrl}/z-control/salesman`),
      ]);

      const [ch1Data, ch2Data, coaTypesData, salesmenData] = await Promise.all([
        ch1Res.json(),
        ch2Res.json(),
        coaTypesRes.json(),
        salesmenRes.json(),
      ]);

      return {
        controlHead1: Array.isArray(ch1Data) ? ch1Data : [],
        controlHead2: Array.isArray(ch2Data) ? ch2Data : [],
        coaTypes: Array.isArray(coaTypesData) ? coaTypesData : coaTypesData.data || [],
        salesmen: Array.isArray(salesmenData) ? salesmenData : salesmenData.data || [],
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch dropdown data');
    }
  }
);

export const fetchCoaById = createAsyncThunk(
  'coa/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get/${id}`);
      if (!response.ok) throw new Error('Failed to fetch COA');
      
      const result = await response.json();
      return result.success ? result.data : result;
    } catch (error) {
      return rejectWithValue('Failed to fetch COA data');
    }
  }
);

export const saveCoa = createAsyncThunk(
  'coa/save',
  async ({ data, isEdit }: { data: CoaFormData; isEdit: boolean }, { rejectWithValue }) => {
    try {
      const url = isEdit 
        ? `http://${window.location.hostname}:4000/api/z-coa/update/${data.id}`
        : `http://${window.location.hostname}:4000/api/z-coa/create`;
        
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save COA');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save COA');
    }
  }
);

export const deleteCoa = createAsyncThunk(
  'coa/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete COA');
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to delete COA');
    }
  }
);

// Slice
const coaSlice = createSlice({
  name: 'coa',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof CoaFormData; value: any }>) => {
      const { field, value } = action.payload;
      (state.formData as any)[field] = value;
    },
    
    updateFilteredCh2: (state) => {
      if (state.formData.ch1Id) {
        state.dropdownData.filteredControlHead2 = state.dropdownData.controlHead2.filter(
          ch2 => ch2.zHead1Id === state.formData.ch1Id
        );
        
        const validCh2 = state.dropdownData.filteredControlHead2.find(
          ch2 => ch2.id === state.formData.ch2Id
        );
        if (!validCh2) {
          state.formData.ch2Id = 0;
        }
      } else {
        state.dropdownData.filteredControlHead2 = [];
        state.formData.ch2Id = 0;
      }
    },
    
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
    
    resetForm: (state) => {
      state.formData = { ...initialFormData };
      state.isEditMode = false;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dropdowns
      .addCase(fetchCoaDropdowns.pending, (state) => {
        state.loading.dropdowns = true;
      })
      .addCase(fetchCoaDropdowns.fulfilled, (state, action) => {
        state.loading.dropdowns = false;
        state.dropdownData = {
          ...state.dropdownData,
          ...action.payload,
        };
      })
      .addCase(fetchCoaDropdowns.rejected, (state, action) => {
        state.loading.dropdowns = false;
        state.error = action.payload as string;
      })
      
      // Fetch COA by ID - PROPERLY INSIDE BUILDER
      .addCase(fetchCoaById.pending, (state) => {
        state.loading.form = true;
      })
      .addCase(fetchCoaById.fulfilled, (state, action) => {
        state.loading.form = false;
        const data = action.payload;
        
        state.formData = {
          id: data.id,
          acName: data.acName || '',
          ch1Id: data.ch1Id || 0,
          ch2Id: data.ch2Id || 0,
          coaTypeId: data.coaTypeId || 0,
          setupName: data.setupName || '',
          address: data.address || data.adress || '',    
          city: data.city || '',
          personName: data.personName || '',
          mobileNo: data.mobileNo || '',
          taxStatus: Boolean(data.taxStatus),
          ntn: data.ntn || '',
          cnic: data.cnic || '',
          salesLimit: data.salesLimit || '',
          credit: data.credit || '',
          creditDays: data.creditDays || data.creditDoys || '', 
          salesMan: data.salesMan || '',
          isJvBalance: Boolean(data.isJvBalance),
          isPettyCash: Boolean(data.isPettyCash),
          discountA: parseFloat(data.discountA) || 0,
          discountB: parseFloat(data.discountB) || 0,
          discountC: parseFloat(data.discountC) || 0,
          batch_no: data.batch_no || '',
          // EXPENSE FIELDS
          Transporter_ID: data.Transporter_ID || null,
          freight_crt: parseFloat(data.freight_crt) || 0.00,
          labour_crt: parseFloat(data.labour_crt) || 0.00,
          bility_expense: parseFloat(data.bility_expense) || 0.00,
          other_expense: parseFloat(data.other_expense) || 0.00,
          // NEW FIELDS
          foreign_currency: data.foreign_currency || null,
          sub_customer: data.sub_customer,
          sub_city: data.sub_city || null,
          str : data.str || null
        };
        
        state.isEditMode = true;
      })
      .addCase(fetchCoaById.rejected, (state, action) => {
        state.loading.form = false;
        state.error = action.payload as string;
      })
      
      // Save COA
      .addCase(saveCoa.pending, (state) => {
        state.loading.submit = true;
        state.error = null;
      })
      .addCase(saveCoa.fulfilled, (state) => {
        state.loading.submit = false;
        if (!state.isEditMode) {
          state.formData = { ...initialFormData };
        }
      })
      .addCase(saveCoa.rejected, (state, action) => {
        state.loading.submit = false;
        state.error = action.payload as string;
      })
      
      // Delete COA
      .addCase(deleteCoa.pending, (state) => {
        state.loading.submit = true;
      })
      .addCase(deleteCoa.fulfilled, (state) => {
        state.loading.submit = false;
        state.formData = { ...initialFormData };
        state.isEditMode = false;
      })
      .addCase(deleteCoa.rejected, (state, action) => {
        state.loading.submit = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateField,
  updateFilteredCh2,
  setEditMode,
  resetForm,
  clearError,
} = coaSlice.actions;

export default coaSlice.reducer;
