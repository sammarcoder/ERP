// store/slice/zlcvSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { zlcvBaseQuery } from '@/lib/baseQuery';

// =============================================
// TYPES
// =============================================

interface Coa {
  id: number;
  acCode: string;
  acName: string;
}

interface Zlcv {
  id: number;
  coaId: number | null;
  description: string;
  order: number;
  status: boolean;
  isCost: boolean;
  isDb: boolean;
  coa?: Coa;
  createdAt?: string;
  updatedAt?: string;
}

interface ZlcvListResponse {
  success: boolean;
  data: Zlcv[];
}

interface ZlcvResponse {
  success: boolean;
  data: Zlcv;
  message?: string;
}

interface ZlcvQueryParams {
  search?: string;
  isDb?: boolean | string;
  status?: boolean | string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface CreateZlcvInput {
  coaId?: number | null;
  description: string;
  order: number;
  status: boolean;
  isCost: boolean;
  isDb: boolean;
}

interface UpdateZlcvInput extends CreateZlcvInput {
  id: number;
}

// =============================================
// API SLICE
// =============================================

export const zlcvApi = createApi({
  reducerPath: 'zlcvApi',
  baseQuery: zlcvBaseQuery,  // ✅ Use dynamic base query
  tagTypes: ['Zlcv'],
  endpoints: (builder) => ({
    // GET all ZLCV
    getZlcvList: builder.query<ZlcvListResponse, ZlcvQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.isDb !== undefined && params.isDb !== '') {
          queryParams.append('isDb', String(params.isDb));
        }
        if (params.status !== undefined && params.status !== '') {
          queryParams.append('status', String(params.status));
        }
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        
        const queryString = queryParams.toString();
        return queryString ? `?${queryString}` : '';
      },
      providesTags: ['Zlcv']
    }),

    // GET by ID
    getZlcvById: builder.query<ZlcvResponse, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Zlcv', id }]
    }),

    // CREATE
    createZlcv: builder.mutation<ZlcvResponse, CreateZlcvInput>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Zlcv']
    }),

    // UPDATE
    updateZlcv: builder.mutation<ZlcvResponse, UpdateZlcvInput>({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Zlcv']
    }),

    // DELETE
    deleteZlcv: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Zlcv']
    }),

    // BULK DELETE
    bulkDeleteZlcv: builder.mutation<{ success: boolean; message: string }, number[]>({
      query: (ids) => ({
        url: '/bulk-delete',
        method: 'POST',
        body: { ids }
      }),
      invalidatesTags: ['Zlcv']
    })
  })
});

export const {
  useGetZlcvListQuery,
  useGetZlcvByIdQuery,
  useCreateZlcvMutation,
  useUpdateZlcvMutation,
  useDeleteZlcvMutation,
  useBulkDeleteZlcvMutation
} = zlcvApi;
