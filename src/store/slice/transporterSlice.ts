import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Transporter {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransporterState {
  transporters: Transporter[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchTerm: string;
  filterActive: 'all' | 'active' | 'inactive';
}

export interface FetchTransportersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateTransporterData {
  name: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateTransporterData extends CreateTransporterData {
  id: number;
}

// Async Thunks
export const fetchTransporters = createAsyncThunk(
  'transporter/fetchTransporters',
  async (params: FetchTransportersParams = {}) => {
    const { page = 1, limit = 10, search = '', isActive } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    
    if (isActive !== undefined) {
      queryParams.append('isActive', isActive.toString());
    }
    
    const response = await fetch(`http://${window.location.hostname}:4000/api/transporter?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch transporters');
    }
    
    return await response.json();
  }
);

export const createTransporter = createAsyncThunk(
  'transporter/createTransporter',
  async (data: CreateTransporterData) => {
    const response = await fetch(`http://${window.location.hostname}:4000/api/transporter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create transporter');
    }
    
    return await response.json();
  }
);

export const updateTransporter = createAsyncThunk(
  'transporter/updateTransporter',
  async ({ id, ...data }: UpdateTransporterData) => {
    const response = await fetch(`http://${window.location.hostname}:4000/api/transporter/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update transporter');
    }
    
    return await response.json();
  }
);

export const deleteTransporter = createAsyncThunk(
  'transporter/deleteTransporter',
  async ({ id, permanent = false }: { id: number; permanent?: boolean }) => {
    const response = await fetch(`http://${window.location.hostname}:4000/api/transporter/${id}${permanent ? '?permanent=true' : ''}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete transporter');
    }
    
    return { id, permanent };
  }
);

export const restoreTransporter = createAsyncThunk(
  'transporter/restoreTransporter',
  async (id: number) => {
    const response = await fetch(`http://${window.location.hostname}:4000/api/transporter/${id}/restore`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to restore transporter');
    }
    
    return await response.json();
  }
);

// Initial State
const initialState: TransporterState = {
  transporters: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  searchTerm: '',
  filterActive: 'all',
};

// Slice
const transporterSlice = createSlice({
  name: 'transporter',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterActive: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.filterActive = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transporters
      .addCase(fetchTransporters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransporters.fulfilled, (state, action) => {
        state.loading = false;
        state.transporters = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransporters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transporters';
      })
      
      // Create Transporter
      .addCase(createTransporter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransporter.fulfilled, (state, action) => {
        state.loading = false;
        state.transporters.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createTransporter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create transporter';
      })
      
      // Update Transporter
      .addCase(updateTransporter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransporter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transporters.findIndex(t => t.id === action.payload.data.id);
        if (index !== -1) {
          state.transporters[index] = action.payload.data;
        }
      })
      .addCase(updateTransporter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update transporter';
      })
      
      // Delete Transporter
      .addCase(deleteTransporter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransporter.fulfilled, (state, action) => {
        state.loading = false;
        const { id, permanent } = action.payload;
        
        if (permanent) {
          state.transporters = state.transporters.filter(t => t.id !== id);
          state.pagination.total -= 1;
        } else {
          const index = state.transporters.findIndex(t => t.id === id);
          if (index !== -1) {
            state.transporters[index].isActive = false;
          }
        }
      })
      .addCase(deleteTransporter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete transporter';
      })
      
      // Restore Transporter
      .addCase(restoreTransporter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreTransporter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transporters.findIndex(t => t.id === action.payload.data.id);
        if (index !== -1) {
          state.transporters[index] = action.payload.data;
        }
      })
      .addCase(restoreTransporter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to restore transporter';
      });
  },
});

export const { setSearchTerm, setFilterActive, clearError } = transporterSlice.actions;
export default transporterSlice.reducer;
