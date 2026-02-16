// // store/slice/mgrnSlice.ts

// import { createApi } from '@reduxjs/toolkit/query/react';
// import { mgrnBaseQuery } from '@/lib/baseQuery';

// // =============================================
// // TYPES
// // =============================================

// export interface MgrnDetail {
//   ID?: number;
//   STK_Main_ID?: number;
//   Line_Id?: number;
//   Item_ID: number;
//   gin_id: number;
//   batchno: number | null;
//   qty_received: number;
//   Stock_In_UOM_Qty?: number;
//   Stock_In_SKU_UOM_Qty?: number;
//   Stock_In_UOM3_Qty?: number;
//   item?: {
//     id: number;
//     itemName: string;
//   };
//   gin?: {
//     id: number;
//     gin_number: string;
//     item_id: number;
//     qty_planned: number;
//   };
// }

// export interface Mgrn {
//   ID: number;
//   Stock_Type_ID: number;
//   Number: string;
//   COA_ID: number | null;
//   Date: string;
//   Status: string;
//   Purchase_Type: string;
//   remarks: string | null;
//   createdAt?: string;
//   updatedAt?: string;
//   coa?: {
//     id: number;
//     acName: string;
//   };
//   details?: MgrnDetail[];
// }

// export interface GinForMgrn {
//   id: number;
//   gin_number: string;
//   item_id: number;
//   qty_planned: number;
//   qty_produced: number;
//   qty_remaining: number;
//   status: string;
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
// }

// export interface GinProductionSummary {
//   gin: any;
//   qty_planned: number;
//   qty_produced: number;
//   qty_remaining: number;
//   totals: {
//     uom1: number;
//     uom2: number;
//     uom3: number;
//   };
//   mgrn_entries: any[];
// }

// export interface CreateMgrnRequest {
//   coa_id: number;
//   mgrn_date: string;
//   batchno: number | null;
//   remarks?: string | null;
//   details: {
//     gin_id: number;
//     qty_received: number;
//   }[];
// }

// export interface UpdateMgrnRequest extends CreateMgrnRequest {
//   id: number;
// }

// // =============================================
// // API SLICE
// // =============================================

// export const mgrnApi = createApi({
//   reducerPath: 'mgrnApi',
//   baseQuery: mgrnBaseQuery,
//   tagTypes: ['Mgrn', 'MgrnNumber', 'GinsForMgrn'],
//   endpoints: (builder) => ({

//     // Get All MGRNs
//     getAllMgrns: builder.query<Mgrn[], void>({
//       query: () => '/get',
//       providesTags: ['Mgrn'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     // Get MGRN by ID
//     getMgrnById: builder.query<Mgrn, number>({
//       query: (id) => `/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Mgrn', id }],
//       transformResponse: (response: any) => response?.data
//     }),

//     // Get Next MGRN Number
//     getNextMgrnNumber: builder.query<string, void>({
//       query: () => '/next-number',
//       providesTags: ['MgrnNumber'],
//       transformResponse: (response: any) => response?.data || 'MGRN-1'
//     }),

//     // Get GINs available for MGRN
//     getGinsForMgrn: builder.query<GinForMgrn[], void>({
//       query: () => '/gins-for-mgrn',
//       providesTags: ['GinsForMgrn'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     // Get GIN Production Summary
//     getGinProductionSummary: builder.query<GinProductionSummary, number>({
//       query: (ginId) => `/gin-summary/${ginId}`,
//       transformResponse: (response: any) => response?.data
//     }),

//     // Create MGRN
//     createMgrn: builder.mutation<{ success: boolean; data: Mgrn }, CreateMgrnRequest>({
//       query: (data) => ({
//         url: '/create',
//         method: 'POST',
//         body: data
//       }),
//       invalidatesTags: ['Mgrn', 'MgrnNumber', 'GinsForMgrn']
//     }),

//     // Update MGRN
//     updateMgrn: builder.mutation<{ success: boolean; data: Mgrn }, UpdateMgrnRequest>({
//       query: ({ id, ...data }) => ({
//         url: `/put/${id}`,
//         method: 'PUT',
//         body: data
//       }),
//       invalidatesTags: ['Mgrn', 'GinsForMgrn']
//     }),

//     // Delete MGRN
//     deleteMgrn: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/delete/${id}`,
//         method: 'DELETE'
//       }),
//       invalidatesTags: ['Mgrn', 'MgrnNumber', 'GinsForMgrn']
//     })
//   })
// });

// export const {
//   useGetAllMgrnsQuery,
//   useGetMgrnByIdQuery,
//   useGetNextMgrnNumberQuery,
//   useGetGinsForMgrnQuery,
//   useLazyGetGinsForMgrnQuery,
//   useGetGinProductionSummaryQuery,
//   useLazyGetGinProductionSummaryQuery,
//   useCreateMgrnMutation,
//   useUpdateMgrnMutation,
//   useDeleteMgrnMutation
// } = mgrnApi;


































// store/slice/mgrnSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { mgrnBaseQuery } from '@/lib/baseQuery';

export interface MgrnDetail {
  ID?: number;
  STK_Main_ID?: number;
  Line_Id?: number;
  Item_ID: number;
  gin_id: number;
  batchno: number | null;
  Stock_In_UOM_Qty?: number;
  Stock_In_SKU_UOM_Qty?: number;
  Stock_In_UOM3_Qty?: number;
  uom1_qty?: number;
  uom2_qty?: number;
  uom3_qty?: number;
  item?: {
    id: number;
    itemName: string;
  };
  gin?: {
    id: number;
    gin_number: string;
    item_id: number;
    qty_planned: number;
    status?: string;
    item?: { id: number; itemName: string };
  };
  batchDetails?: {
    id: number;
    acName: string;
  };
}

export interface Mgrn {
  ID: number;
  Stock_Type_ID: number;
  Number: string;
  COA_ID: number | null;
  Date: string;
  Status: string;
  Purchase_Type: string;
  remarks: string | null;
  createdAt?: string;
  updatedAt?: string;
  coa?: {
    id: number;
    acName: string;
  };
  details?: MgrnDetail[];
}

export interface GinForMgrn {
  id: number;
  gin_number: string;
  item_id: number;
  qty_planned: number;
  status: string;
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
}

export interface CreateMgrnRequest {
  coa_id: number;
  batchno: number | null;
  mgrn_date: string;
  remarks?: string | null;
  details: {
    gin_id: number;
    qty_received: number;
  }[];
}

export interface UpdateMgrnRequest extends CreateMgrnRequest {
  id: number;
}

export const mgrnApi = createApi({
  reducerPath: 'mgrnApi',
  baseQuery: mgrnBaseQuery,
  tagTypes: ['Mgrn', 'MgrnNumber', 'GinsForMgrn'],
  endpoints: (builder) => ({

    getAllMgrns: builder.query<Mgrn[], void>({
      query: () => '/get',
      providesTags: ['Mgrn'],
      transformResponse: (response: any) => response?.data || []
    }),

    getMgrnById: builder.query<Mgrn, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Mgrn', id }],
      transformResponse: (response: any) => response?.data
    }),

    getNextMgrnNumber: builder.query<string, void>({
      query: () => '/next-number',
      providesTags: ['MgrnNumber'],
      transformResponse: (response: any) => response?.data || 'MGRN-1'
    }),

    getGinsForMgrn: builder.query<GinForMgrn[], void>({
      query: () => '/gins-for-mgrn',
      providesTags: ['GinsForMgrn'],
      transformResponse: (response: any) => response?.data || []
    }),

    createMgrn: builder.mutation<{ success: boolean; data: Mgrn }, CreateMgrnRequest>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Mgrn', 'MgrnNumber', 'GinsForMgrn']
    }),

    updateMgrn: builder.mutation<{ success: boolean; data: Mgrn }, UpdateMgrnRequest>({
      query: ({ id, ...data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Mgrn', 'GinsForMgrn']
    }),

    deleteMgrn: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Mgrn', 'MgrnNumber', 'GinsForMgrn']
    })
  })
});

export const {
  useGetAllMgrnsQuery,
  useGetMgrnByIdQuery,
  useGetNextMgrnNumberQuery,
  useGetGinsForMgrnQuery,
  useLazyGetGinsForMgrnQuery,
  useCreateMgrnMutation,
  useUpdateMgrnMutation,
  useDeleteMgrnMutation
} = mgrnApi;
