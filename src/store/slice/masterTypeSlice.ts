// store/slice/masterTypeSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { masterTypeBaseQuery } from '@/lib/baseQuery';

// =============================================
// TYPES
// =============================================

export interface MasterType {
  id: number;
  type: number;
  typeName: string;
  actualName: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMasterTypeRequest {
  type: number;
  actualName: string;
  status?: boolean;
}

export interface UpdateMasterTypeRequest {
  id: number;
  actualName?: string;
  status?: boolean;
}

// =============================================
// TYPE CONSTANTS
// =============================================

export const MASTER_TYPES = {
  SHIPPER: 1,
  CARRIAGE: 2,
  BANK_NAME: 3,
  CONTACT_TYPE: 4,
  CLEARING_AGENT: 5
} as const;

export const TYPE_NAMES: Record<number, string> = {
  1: 'Shipper',
  2: 'Carriage',
  3: 'Bank Name',
  4: 'Contact Type',
  5: 'Clearing Agent'
};

// =============================================
// API SLICE
// =============================================

export const masterTypeApi = createApi({
  reducerPath: 'masterTypeApi',
  baseQuery: masterTypeBaseQuery,
  tagTypes: ['MasterType'],
  endpoints: (builder) => ({

    // GET /api/master-types/get
    getAllMasterTypes: builder.query<MasterType[], void>({
      query: () => '/get',
      providesTags: ['MasterType'],
      transformResponse: (response: any) => {
        return response?.data || [];
      }
    }),

    // GET /api/master-types/type/:type
    getMasterTypesByType: builder.query<MasterType[], number>({
      query: (type) => `/type/${type}`,
      providesTags: (result, error, type) => [{ type: 'MasterType', id: `type-${type}` }],
      transformResponse: (response: any) => {
        return response?.data || [];
      }
    }),

    // GET /api/master-types/get/:id
    getMasterTypeById: builder.query<MasterType, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'MasterType', id }],
      transformResponse: (response: any) => {
        return response?.data;
      }
    }),

    // POST /api/master-types/create
    createMasterType: builder.mutation<{ success: boolean; data: MasterType }, CreateMasterTypeRequest>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['MasterType']
    }),

    // PUT /api/master-types/put/:id
    updateMasterType: builder.mutation<{ success: boolean; data: MasterType }, UpdateMasterTypeRequest>({
      query: ({ id, ...data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['MasterType']
    }),

    // DELETE /api/master-types/delete/:id
    deleteMasterType: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['MasterType']
    }),

    // PUT /api/master-types/toggle-status/:id
    toggleMasterTypeStatus: builder.mutation<{ success: boolean; data: MasterType }, number>({
      query: (id) => ({
        url: `/toggle-status/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['MasterType']
    })
  })
});

export const {
  useGetAllMasterTypesQuery,
  useGetMasterTypesByTypeQuery,
  useGetMasterTypeByIdQuery,
  useCreateMasterTypeMutation,
  useUpdateMasterTypeMutation,
  useDeleteMasterTypeMutation,
  useToggleMasterTypeStatusMutation
} = masterTypeApi;
