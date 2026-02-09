
// // store/slice/lcMainSlice.ts

// import { createApi } from '@reduxjs/toolkit/query/react';
// import { lcMainBaseQuery } from '@/lib/baseQuery';

// // =============================================
// // TYPES
// // =============================================

// export interface LcDetail {
//   id?: number;
//   lcMainId?: number;
//   itemId: number;
//   cd: number;
//   acd: number;
//   rd: number;
//   salesTax: number;
//   addSalesTax: number;
//   itaxImport: number;
//   furtherTax: number;
//   incomeTaxWithheld: number;
//   assessedPrice: number;
//   priceFC: number;
//   assessedQty: number;
//   item?: {
//     id: number;
//     itemName: string;
//     uom1?: { uom: string };
//     uomTwo?: { uom: string };
//     uomThree?: { uom: string };
//   };
// }

// export interface LcMain {
//   id: number;
//   lcId: number;
//   gdnId: number | null;
//   shipperId: number | null;
//   consigneeId: number | null;
//   bankNameId: number | null;
//   contactTypeId: number | null;
//   bl: string | null;
//   container: string | null;
//   containerCount: number;
//   containerSize: string | null;
//   inv: string | null;
//   currencyId: number | null;
//   amount: number;
//   clearingAgentId: number | null;
//   gd: string | null;
//   gdDate: string | null;
//   exchangeRateDuty: number;
//   exchangeRateDocuments: number;
//   totalExp: number;
//   averageDollarRate: number;
//   paymentDate: string | null;
//   itemDescription: string | null;
//   landedCost: number;
//   status: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   lc?: { id: number; acName: string };
//   gdn?: { ID: number; Number: string };
//   shipper?: { id: number; actualName: string };
//   consignee?: { id: number; actualName: string };
//   bankName?: { id: number; actualName: string };
//   contactType?: { id: number; actualName: string };
//   clearingAgent?: { id: number; actualName: string };
//   currency?: { id: number; currencyName: string };
//   details?: LcDetail[];
// }

// export interface GdnItem {
//   ID: number;
//   Number: string;
//   Stock_Type_ID?: number;
// }

// export interface GdnDetailData {
//   ID: number;
//   batchno: string;
//   uom1_qty: string;
//   uom2_qty: string;
//   uom3_qty: string;
//   Item_ID: number;
//   item: {
//     id: number;
//     itemName: string;
//     incomeTaxWithheld: string | null;
//     cd: string;
//     acd: string;
//     rd: string;
//     salesTax: string;
//     addSalesTax: string;
//     itaxImport: string;
//     furtherTax: string;
//     assessedPrice: string;
//     purchasePriceFC: string;
//     uom1?: { uom: string };
//     uomTwo?: { uom: string };
//     uomThree?: { uom: string };
//   };
// }

// export interface GdnDetailItem {
//   ID: number;
//   Number: string;
//   details: GdnDetailData[];
// }

// export interface CreateLcMainRequest {
//   lcId: number;
//   gdnId?: number | null;
//   shipperId?: number | null;
//   consigneeId?: number | null;
//   bankNameId?: number | null;
//   contactTypeId?: number | null;
//   bl?: string | null;
//   container?: string | null;
//   containerCount?: number;
//   containerSize?: string | null;
//   inv?: string | null;
//   currencyId?: number | null;
//   amount?: number;
//   clearingAgentId?: number | null;
//   gd?: string | null;
//   gdDate?: string | null;
//   exchangeRateDuty?: number;
//   exchangeRateDocuments?: number;
//   totalExp?: number;
//   averageDollarRate?: number;
//   paymentDate?: string | null;
//   itemDescription?: string | null;
//   landedCost?: number;
//   status?: boolean;
//   details?: Partial<LcDetail>[];
// }

// export interface UpdateLcMainRequest extends Partial<CreateLcMainRequest> {
//   id: number;
// }

// export interface SyncDetailsRequest {
//   id: number;
//   details: Partial<LcDetail>[];
// }

// // =============================================
// // API SLICE
// // =============================================

// export const lcMainApi = createApi({
//   reducerPath: 'lcMainApi',
//   baseQuery: lcMainBaseQuery,
//   tagTypes: ['LcMain', 'UsedCoaIds', 'GdnList', 'GdnDetail'],
//   endpoints: (builder) => ({

//     getAllLcMain: builder.query<LcMain[], void>({
//       query: () => '/get',
//       providesTags: ['LcMain'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     getUsedCoaIds: builder.query<number[], number | void>({
//       query: (excludeId) => excludeId 
//         ? `/used-coa-ids?excludeId=${excludeId}` 
//         : '/used-coa-ids',
//       providesTags: ['UsedCoaIds'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     getAllGdn: builder.query<GdnItem[], number>({
//       query: (batchno) => `/get-all-gdn?batchno=${batchno}`,
//       providesTags: ['GdnList'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     getGdn: builder.query<GdnDetailItem[], number>({
//       query: (id) => `/get-gdn?id=${id}`,
//       providesTags: ['GdnDetail'],
//       transformResponse: (response: any) => response?.data || []
//     }),

//     getLcMainById: builder.query<LcMain, number>({
//       query: (id) => `/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'LcMain', id }],
//       transformResponse: (response: any) => response?.data
//     }),

//     createLcMain: builder.mutation<{ success: boolean; data: LcMain }, CreateLcMainRequest>({
//       query: (data) => ({
//         url: '/create',
//         method: 'POST',
//         body: data
//       }),
//       invalidatesTags: ['LcMain', 'UsedCoaIds']
//     }),

//     updateLcMain: builder.mutation<{ success: boolean; data: LcMain }, UpdateLcMainRequest>({
//       query: ({ id, ...data }) => ({
//         url: `/put/${id}`,
//         method: 'PUT',
//         body: data
//       }),
//       invalidatesTags: ['LcMain', 'UsedCoaIds']
//     }),

//     syncDetails: builder.mutation<{ success: boolean; data: LcMain }, SyncDetailsRequest>({
//       query: ({ id, details }) => ({
//         url: `/sync-details/${id}`,
//         method: 'PATCH',
//         body: { details }
//       }),
//       invalidatesTags: ['LcMain']
//     }),

//     deleteLcMain: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/delete/${id}`,
//         method: 'DELETE'
//       }),
//       invalidatesTags: ['LcMain', 'UsedCoaIds']
//     }),

//     toggleLcMainStatus: builder.mutation<{ success: boolean; data: LcMain }, number>({
//       query: (id) => ({
//         url: `/toggle-status/${id}`,
//         method: 'PUT'
//       }),
//       invalidatesTags: ['LcMain']
//     })
//   })
// });

// export const {
//   useGetAllLcMainQuery,
//   useGetUsedCoaIdsQuery,
//   useGetAllGdnQuery,
//   useLazyGetAllGdnQuery,
//   useGetGdnQuery,
//   useLazyGetGdnQuery,
//   useGetLcMainByIdQuery,
//   useCreateLcMainMutation,
//   useUpdateLcMainMutation,
//   useSyncDetailsMutation,
//   useDeleteLcMainMutation,
//   useToggleLcMainStatusMutation
// } = lcMainApi;

























































// store/slice/lcMainSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { lcMainBaseQuery } from '@/lib/baseQuery';

// =============================================
// TYPES
// =============================================

export interface LcDetail {
  id?: number;
  lcMainId?: number;
  itemId: number;
  cd: number;
  acd: number;
  rd: number;
  salesTax: number;
  addSalesTax: number;
  itaxImport: number;
  furtherTax: number;
  incomeTaxWithheld: number;
  assessedPrice: number;
  priceFC: number;
  assessedQty: number;
  item?: {
    id: number;
    itemName: string;
    uom1?: { uom: string };
    uomTwo?: { uom: string };
    uomThree?: { uom: string };
  };
}

export interface LcMain {
  id: number;
  lcId: number;
  gdnId: number | null;
  shipperId: number | null;
  consigneeId: number | null;
  bankNameId: number | null;
  contactTypeId: number | null;
  bl: string | null;
  container: string | null;
  containerCount: number;
  containerSize: string | null;
  inv: string | null;
  currencyId: number | null;
  amount: number;
  clearingAgentId: number | null;
  gd: string | null;
  gdDate: string | null;
  exchangeRateDuty: number;
  exchangeRateDocuments: number;
  totalExp: number;
  averageDollarRate: number;
  paymentDate: string | null;
  itemDescription: string | null;
  landedCost: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  lc?: { id: number; acName: string };
  gdn?: { ID: number; Number: string };
  shipper?: { id: number; actualName: string };
  consignee?: { id: number; actualName: string };
  bankName?: { id: number; actualName: string };
  contactType?: { id: number; actualName: string };
  clearingAgent?: { id: number; actualName: string };
  currency?: { id: number; currencyName: string };
  details?: LcDetail[];
}

export interface GdnItem {
  ID: number;
  Number: string;
  Stock_Type_ID?: number;
}

export interface GdnDetailData {
  ID: number;
  batchno: string;
  uom1_qty: string;
  uom2_qty: string;
  uom3_qty: string;
  Item_ID: number;
  item: {
    id: number;
    itemName: string;
    incomeTaxWithheld: string | null;
    cd: string;
    acd: string;
    rd: string;
    salesTax: string;
    addSalesTax: string;
    itaxImport: string;
    furtherTax: string;
    assessedPrice: string;
    purchasePriceFC: string;
    uom1?: { uom: string };
    uomTwo?: { uom: string };
    uomThree?: { uom: string };
  };
}

export interface GdnDetailItem {
  ID: number;
  Number: string;
  details: GdnDetailData[];
}

// ✅ NEW - Journal Detail Types
export interface JournalDetailItem {
  id: number;
  jmId: number;
  lineId: number;
  coaId: number;
  description: string | null;
  rate: number;
  ownDb: number;
  amountDb: number;
  isCost: boolean;
  currencyId: number | null;
  coa?: { id: number; acName: string };
  currency?: { id: number; currencyName: string };
}

export interface JournalDetailUpdate {
  id: number;
  description?: string;
  rate?: number;
  ownDb?: number;
  isCost?: boolean;
}

export interface CreateLcMainRequest {
  lcId: number;
  gdnId?: number | null;
  shipperId?: number | null;
  consigneeId?: number | null;
  bankNameId?: number | null;
  contactTypeId?: number | null;
  bl?: string | null;
  container?: string | null;
  containerCount?: number;
  containerSize?: string | null;
  inv?: string | null;
  currencyId?: number | null;
  amount?: number;
  clearingAgentId?: number | null;
  gd?: string | null;
  gdDate?: string | null;
  exchangeRateDuty?: number;
  exchangeRateDocuments?: number;
  totalExp?: number;
  averageDollarRate?: number;
  paymentDate?: string | null;
  itemDescription?: string | null;
  landedCost?: number;
  status?: boolean;
  details?: Partial<LcDetail>[];
}

export interface UpdateLcMainRequest extends Partial<CreateLcMainRequest> {
  id: number;
}

export interface SyncDetailsRequest {
  id: number;
  details: Partial<LcDetail>[];
}

// =============================================
// API SLICE
// =============================================

export const lcMainApi = createApi({
  reducerPath: 'lcMainApi',
  baseQuery: lcMainBaseQuery,
  tagTypes: ['LcMain', 'UsedCoaIds', 'GdnList', 'GdnDetail', 'JournalDetails'],
  endpoints: (builder) => ({

    getAllLcMain: builder.query<LcMain[], void>({
      query: () => '/get',
      providesTags: ['LcMain'],
      transformResponse: (response: any) => response?.data || []
    }),

    getUsedCoaIds: builder.query<number[], number | void>({
      query: (excludeId) => excludeId 
        ? `/used-coa-ids?excludeId=${excludeId}` 
        : '/used-coa-ids',
      providesTags: ['UsedCoaIds'],
      transformResponse: (response: any) => response?.data || []
    }),

    getAllGdn: builder.query<GdnItem[], number>({
      query: (batchno) => `/get-all-gdn?batchno=${batchno}`,
      providesTags: ['GdnList'],
      transformResponse: (response: any) => response?.data || []
    }),

    getGdn: builder.query<GdnDetailItem[], number>({
      query: (id) => `/get-gdn?id=${id}`,
      providesTags: ['GdnDetail'],
      transformResponse: (response: any) => response?.data || []
    }),

    // ✅ NEW - Get Journal Details by COA ID
    getJournalDetailsByCoa: builder.query<JournalDetailItem[], number>({
      query: (coaId) => `/journal-details?coaId=${coaId}`,
      providesTags: ['JournalDetails'],
      transformResponse: (response: any) => response?.data || []
    }),

    getLcMainById: builder.query<LcMain, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'LcMain', id }],
      transformResponse: (response: any) => response?.data
    }),

    createLcMain: builder.mutation<{ success: boolean; data: LcMain }, CreateLcMainRequest>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LcMain', 'UsedCoaIds']
    }),

    updateLcMain: builder.mutation<{ success: boolean; data: LcMain }, UpdateLcMainRequest>({
      query: ({ id, ...data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['LcMain', 'UsedCoaIds']
    }),

    syncDetails: builder.mutation<{ success: boolean; data: LcMain }, SyncDetailsRequest>({
      query: ({ id, details }) => ({
        url: `/sync-details/${id}`,
        method: 'PATCH',
        body: { details }
      }),
      invalidatesTags: ['LcMain']
    }),

    // ✅ NEW - Update Journal Details
    updateJournalDetails: builder.mutation<{ success: boolean; updatedCount: number }, { updates: JournalDetailUpdate[] }>({
      query: (data) => ({
        url: '/update-journal-details',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['JournalDetails']
    }),

    deleteLcMain: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['LcMain', 'UsedCoaIds']
    }),

    toggleLcMainStatus: builder.mutation<{ success: boolean; data: LcMain }, number>({
      query: (id) => ({
        url: `/toggle-status/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['LcMain']
    })
  })
});

export const {
  useGetAllLcMainQuery,
  useGetUsedCoaIdsQuery,
  useGetAllGdnQuery,
  useLazyGetAllGdnQuery,
  useGetGdnQuery,
  useLazyGetGdnQuery,
  useGetJournalDetailsByCoaQuery,        // ✅ NEW
  useLazyGetJournalDetailsByCoaQuery,    // ✅ NEW
  useGetLcMainByIdQuery,
  useCreateLcMainMutation,
  useUpdateLcMainMutation,
  useSyncDetailsMutation,
  useUpdateJournalDetailsMutation,       // ✅ NEW
  useDeleteLcMainMutation,
  useToggleLcMainStatusMutation
} = lcMainApi;
