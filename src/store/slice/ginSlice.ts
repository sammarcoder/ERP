// // store/slice/ginSlice.ts

// import { createApi } from '@reduxjs/toolkit/query/react';
// import { ginBaseQuery } from '@/lib/baseQuery';

// // =============================================
// // TYPES
// // =============================================

// export interface GinDetail {
//   id?: number;
//   gin_main_id?: number;
//   item_id: number;
//   suggested_qty: number;
//   issue_qty: number;
//   issue_uom_id: number | null;
//   remained_unused: number;
//   wastage: number;
//   item?: {
//     id: number;
//     itemName: string;
//     skuUOM?: number;
//     uom2?: number;
//     uom2_qty?: string;
//     uom3?: number;
//     uom3_qty?: string;
//     uom1?: { id: number; uom: string };
//     uomTwo?: { id: number; uom: string };
//     uomThree?: { id: number; uom: string };
//   };
//   issueUom?: { id: number; uom: string };
// }

// export interface GinEmployee {
//   id?: number;
//   gin_id?: number;
//   employee_id: number;
//   employee?: {
//     id: number;
//     employeeName: string;
//   };
// }

// export interface Gin {
//   id: number;
//   gin_number: string;
//   item_id: number;
//   qty_planned: number;
//   Uom_Id: number | null;
//   status: 'open' | 'close' | 'pending' | 'rejected';
//   reason: string | null;
//   createdAt?: string;
//   updatedAt?: string;
//   item?: {
//     id: number;
//     itemName: string;
//     skuUOM?: number;
//     uom2?: number;
//     uom2_qty?: string;
//     uom3?: number;
//     uom3_qty?: string;
//     uom1?: { id: number; uom: string };
//     uomTwo?: { id: number; uom: string };
//     uomThree?: { id: number; uom: string };
//   };
//   uom?: { id: number; uom: string };
//   details?: GinDetail[];
//   employees?: GinEmployee[];
// }

// export interface RecipeForGin {
//   id: number;
//   Item_id: number;
//   qty: number;
//   Uom_Id: number | null;
//   item?: {
//     id: number;
//     itemName: string;
//     skuUOM?: number;
//     uom2?: number;
//     uom2_qty?: string;
//     uom3?: number;
//     uom3_qty?: string;
//     uom1?: { id: number; uom: string };
//     uomTwo?: { id: number; uom: string };
//     uomThree?: { id: number; uom: string };
//   };
//   uom?: { id: number; uom: string };
//   details?: {
//     id: number;
//     Item_id: number;
//     qty: number;
//     Uom_Id: number | null;
//     suggested_qty: number;
//     item?: {
//       id: number;
//       itemName: string;
//       skuUOM?: number;
//       uom2?: number;
//       uom2_qty?: string;
//       uom3?: number;
//       uom3_qty?: string;
//       uom1?: { id: number; uom: string };
//       uomTwo?: { id: number; uom: string };
//       uomThree?: { id: number; uom: string };
//     };
//     uom?: { id: number; uom: string };
//   }[];
// }

// export interface AvailableBatch {
//   batchno: number;
//   batchName: string;
//   item_id: number;
//   item_name: string;
//   uom2_qty: number;
//   total_received_uom1: number;
//   total_dispatched_uom1: number;
//   available_qty_uom1: number;
//   real_time_available: number;
//   available_after: number;
// }

// export interface CreateGinRequest {
//   item_id: number;
//   qty_planned: number;
//   Uom_Id?: number | null;
//   status?: 'open' | 'close' | 'pending' | 'rejected';
//   reason?: string | null;
//   details: {
//     item_id: number;
//     suggested_qty: number;
//     issue_qty: number;
//     issue_uom_id?: number | null;
//     remained_unused?: number;
//     wastage?: number;
//   }[];
//   employees: number[];
// }

// export interface UpdateGinRequest extends CreateGinRequest {
//   id: number;
// }

// // =============================================
// // API SLICE
// // =============================================

// export const ginApi = createApi({
//   reducerPath: 'ginApi',
//   baseQuery: ginBaseQuery,
//   tagTypes: ['Gin', 'GinNumber', 'AvailableBatches'],
//   endpoints: (builder) => ({

//     getAllGins: builder.query<Gin[], void>({
//       query: () => '/get',
//       providesTags: ['Gin'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     getGinById: builder.query<Gin, number>({
//       query: (id) => `/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Gin', id }],
//       transformResponse: (response: any) => response?.data
//     }),

//     getNextGinNumber: builder.query<string, void>({
//       query: () => '/next-number',
//       providesTags: ['GinNumber'],
//       transformResponse: (response: any) => response?.data || 'GIN-1'
//     }),

//     getRecipeForGin: builder.query<RecipeForGin, { recipeId: number; qtyPlanned: number }>({
//       query: ({ recipeId, qtyPlanned }) => `/recipe-for-gin?recipeId=${recipeId}&qtyPlanned=${qtyPlanned}`,
//       transformResponse: (response: any) => response?.data
//     }),

//     getAvailableBatches: builder.query<AvailableBatch[], { itemId: number; suggestedQty?: number }>({
//       query: ({ itemId, suggestedQty }) => 
//         `/available-batches/${itemId}${suggestedQty ? `?suggestedQty=${suggestedQty}` : ''}`,
//       providesTags: ['AvailableBatches'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     createGin: builder.mutation<{ success: boolean; data: Gin }, CreateGinRequest>({
//       query: (data) => ({
//         url: '/create',
//         method: 'POST',
//         body: data
//       }),
//       invalidatesTags: ['Gin', 'GinNumber', 'AvailableBatches']
//     }),

//     updateGin: builder.mutation<{ success: boolean; data: Gin }, UpdateGinRequest>({
//       query: ({ id, ...data }) => ({
//         url: `/put/${id}`,
//         method: 'PUT',
//         body: data
//       }),
//       invalidatesTags: ['Gin', 'AvailableBatches']
//     }),

//     deleteGin: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/delete/${id}`,
//         method: 'DELETE'
//       }),
//       invalidatesTags: ['Gin', 'GinNumber']
//     }),

//     updateGinStatus: builder.mutation<{ success: boolean; data: Gin }, { id: number; status: string; reason?: string }>({
//       query: ({ id, status, reason }) => ({
//         url: `/status/${id}`,
//         method: 'PUT',
//         body: { status, reason }
//       }),
//       invalidatesTags: ['Gin']
//     })
//   })
// });

// export const {
//   useGetAllGinsQuery,
//   useGetGinByIdQuery,
//   useGetNextGinNumberQuery,
//   useGetRecipeForGinQuery,
//   useLazyGetRecipeForGinQuery,
//   useGetAvailableBatchesQuery,
//   useLazyGetAvailableBatchesQuery,
//   useCreateGinMutation,
//   useUpdateGinMutation,
//   useDeleteGinMutation,
//   useUpdateGinStatusMutation
// } = ginApi;















































// store/slice/ginSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { ginBaseQuery } from '@/lib/baseQuery';

// =============================================
// TYPES
// =============================================

export interface GinDetail {
  id?: number;
  gin_main_id?: number;
  item_id: number;
  suggested_qty: number;
  batchno: number | null;
  issue_qty: number;
  issue_uom1_qty: number;
  issue_uom2_qty: number;
  issue_uom3_qty: number;
  issue_uom_id: number | null;
  remained_unused: number;
  wastage: number;
  actual_used: number;
  actual_used_uom1: number;
  actual_used_uom2: number;
  actual_used_uom3: number;
  item?: {
    id: number;
    itemName: string;
    skuUOM?: number;
    uom2?: number;
    uom2_qty?: string;
    uom3?: number;
    uom3_qty?: string;
    uom1?: { id: number; uom: string };
    uomTwo?: { id: number; uom: string };
    uomThree?: { id: number; uom: string };
  };
  issueUom?: { id: number; uom: string };
}

export interface GinEmployee {
  id?: number;
  gin_id?: number;
  employee_id: number;
  employee?: {
    id: number;
    employeeName: string;
  };
}

export interface Gin {
  id: number;
  gin_number: string;
  item_id: number;
  qty_planned: number;
  Uom_Id: number | null;
  coa_id: number | null;
  gin_date: string;
  status: 'open' | 'close' | 'pending' | 'rejected';
  reason: string | null;
  createdAt?: string;
  updatedAt?: string;
  item?: {
    id: number;
    itemName: string;
    skuUOM?: number;
    uom2?: number;
    uom2_qty?: string;
    uom3?: number;
    uom3_qty?: string;
    uom1?: { id: number; uom: string };
    uomTwo?: { id: number; uom: string };
    uomThree?: { id: number; uom: string };
  };
  uom?: { id: number; uom: string };
  coa?: { id: number; acName: string };
  details?: GinDetail[];
  employees?: GinEmployee[];
  recipe?: {
    id: number;
    qty: number;
    details: { Item_id: number; qty: number; Uom_Id: number }[];
  };
}

export interface AvailableBatch {
  batchno: number;
  batchName: string;
  item_id: number;
  item_name: string;
  // UOM1
  total_received_uom1: number;
  total_dispatched_uom1: number;
  available_qty_uom1: number;
  // UOM2
  total_received_uom2: number;
  total_dispatched_uom2: number;
  available_qty_uom2: number;
  // UOM3
  total_received_uom3: number;
  total_dispatched_uom3: number;
  available_qty_uom3: number;
  // Edit mode fields
  total_other_dispatched_uom1?: number;
  current_dispatch_uom1?: number;
  total_other_dispatched_uom2?: number;
  current_dispatch_uom2?: number;
  total_other_dispatched_uom3?: number;
  current_dispatch_uom3?: number;
  edit_mode: boolean;
}

export interface CreateGinRequest {
  item_id: number;
  qty_planned: number;
  Uom_Id?: number | null;
  coa_id: number | null;
  gin_date: string;
  status?: 'open' | 'close' | 'pending' | 'rejected';
  reason?: string | null;
  details: {
    item_id: number;
    suggested_qty: number;
    batchno: number | null;
    issue_qty: number;
    issue_uom1_qty: number;
    issue_uom2_qty: number;
    issue_uom3_qty: number;
    issue_uom_id?: number | null;
    remained_unused: number;
    wastage: number;
    actual_used: number;
    actual_used_uom1: number;
    actual_used_uom2: number;
    actual_used_uom3: number;
  }[];
  employees: number[];
}

export interface UpdateGinRequest extends CreateGinRequest {
  id: number;
}

// =============================================
// API SLICE
// =============================================

export const ginApi = createApi({
  reducerPath: 'ginApi',
  baseQuery: ginBaseQuery,
  tagTypes: ['Gin', 'GinNumber', 'AvailableBatches'],
  endpoints: (builder) => ({

    // Get All GINs
    getAllGins: builder.query<Gin[], void>({
      query: () => '/get',
      providesTags: ['Gin'],
      transformResponse: (response: any) => response?.data || []
    }),

    // Get GIN by ID (includes recipe)
    getGinById: builder.query<Gin, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gin', id }],
      transformResponse: (response: any) => response?.data
    }),

    // Get Next GIN Number
    getNextGinNumber: builder.query<string, void>({
      query: () => '/next-number',
      providesTags: ['GinNumber'],
      transformResponse: (response: any) => response?.data || 'GIN-1'
    }),

    // Get Available Batches (Create Mode)
    getAvailableBatches: builder.query<AvailableBatch[], number>({
      query: (itemId) => `/available-batches/${itemId}`,
      providesTags: ['AvailableBatches'],
      transformResponse: (response: any) => response?.data || []
    }),

    // Get Available Batches (Edit Mode)
    getAvailableBatchesForEdit: builder.query<AvailableBatch[], { itemId: number; ginId: number }>({
      query: ({ itemId, ginId }) => `/available-batches-edit/${itemId}/${ginId}`,
      providesTags: ['AvailableBatches'],
      transformResponse: (response: any) => response?.data || []
    }),

    // Create GIN
    createGin: builder.mutation<{ success: boolean; data: Gin; mgdn_number?: string }, CreateGinRequest>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Gin', 'GinNumber', 'AvailableBatches']
    }),

    // Update GIN
    updateGin: builder.mutation<{ success: boolean; data: Gin; mgdn_number?: string }, UpdateGinRequest>({
      query: ({ id, ...data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Gin', 'AvailableBatches']
    }),

    // Delete GIN
    deleteGin: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Gin', 'GinNumber']
    }),

    // Update GIN Status
    updateGinStatus: builder.mutation<{ success: boolean; data: Gin }, { id: number; status: string; reason?: string }>({
      query: ({ id, status, reason }) => ({
        url: `/status/${id}`,
        method: 'PUT',
        body: { status, reason }
      }),
      invalidatesTags: ['Gin']
    })
  })
});

export const {
  useGetAllGinsQuery,
  useGetGinByIdQuery,
  useGetNextGinNumberQuery,
  useGetAvailableBatchesQuery,
  useLazyGetAvailableBatchesQuery,
  useGetAvailableBatchesForEditQuery,
  useLazyGetAvailableBatchesForEditQuery,
  useCreateGinMutation,
  useUpdateGinMutation,
  useDeleteGinMutation,
  useUpdateGinStatusMutation
} = ginApi;
