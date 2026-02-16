// // store/slice/batchReportSlice.ts

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// // =============================================
// // TYPES
// // =============================================

// export interface Transaction {
//   id: number;
//   document: string;
//   date: string;
//   type: 'IN' | 'OUT';
//   stockTypeId: number;
//   qty: number;
// }

// export interface ItemEntry {
//   item_id: number;
//   itemName: string;
//   uomName: string;
//   totalIn: number;
//   totalOut: number;
//   balance: number;
//   transactions: Transaction[];
// }

// export interface BatchStockLedgerData {
//   batch: { id: number; name: string };
//   uomType: string;
//   items: ItemEntry[];
//   summary: {
//     totalItems: number;
//     grandTotalIn: number;
//     grandTotalOut: number;
//     grandBalance: number;
//   };
// }

// export interface StockDetail {
//   id: number;
//   document: string;
//   documentId: number;
//   date: string;
//   stockTypeId: number;
//   stockTypeName: string;
//   item_id: number;
//   itemName: string;
//   qty: number;
//   uomName: string;
// }

// export interface BatchInOutSummaryData {
//   batch: { id: number; name: string };
//   uomType: string;
//   stockIn: {
//     total: number;
//     count: number;
//     details: StockDetail[];
//   };
//   stockOut: {
//     total: number;
//     count: number;
//     details: StockDetail[];
//   };
//   summary: {
//     totalIn: number;
//     totalOut: number;
//     remaining: number;
//   };
// }

// export interface BatchInfo {
//   id: number;
//   acName: string;
// }

// export interface ReportParams {
//   batchno: number;
//   uom?: '1' | '2' | '3';
// }

// // =============================================
// // API SLICE
// // =============================================

// export const batchReportApi = createApi({
//   reducerPath: 'batchReportApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_BASE}/api/batch-report`,
//   }),
//   tagTypes: ['BatchStockLedger', 'BatchInOutSummary', 'Batches'],
//   endpoints: (builder) => ({

//     // Get Batch Stock Ledger (Report 1)
//     getBatchStockLedger: builder.query<BatchStockLedgerData, ReportParams>({
//       query: ({ batchno, uom = '2' }) => `/stock-ledger?batchno=${batchno}&uom=${uom}`,
//       providesTags: ['BatchStockLedger'],
//       transformResponse: (response: { success: boolean; data: BatchStockLedgerData }) => response.data
//     }),

//     // Get Batch In/Out Summary (Report 2)
//     getBatchInOutSummary: builder.query<BatchInOutSummaryData, ReportParams>({
//       query: ({ batchno, uom = '2' }) => `/in-out-summary?batchno=${batchno}&uom=${uom}`,
//       providesTags: ['BatchInOutSummary'],
//       transformResponse: (response: { success: boolean; data: BatchInOutSummaryData }) => response.data
//     }),

//     // Get all batches with stock
//     getBatchesWithStock: builder.query<BatchInfo[], void>({
//       query: () => '/batches',
//       providesTags: ['Batches'],
//       transformResponse: (response: { success: boolean; data: BatchInfo[] }) => response.data || []
//     }),

//   })
// });

// export const {
//   useGetBatchStockLedgerQuery,
//   useLazyGetBatchStockLedgerQuery,
//   useGetBatchInOutSummaryQuery,
//   useLazyGetBatchInOutSummaryQuery,
//   useGetBatchesWithStockQuery,
// } = batchReportApi;










































// store/slice/batchReportSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// =============================================
// TYPES
// =============================================

export interface Transaction {
  id: number;
  document: string;
  date: string;
  type: 'IN' | 'OUT';
  stockTypeId: number;
  qty: number;
}

export interface ItemEntry {
  item_id: number;
  itemName: string;
  uomName: string;
  totalIn: number;
  totalOut: number;
  balance: number;
  transactions: Transaction[];
}

export interface BatchStockLedgerData {
  batch: { id: number; name: string };
  uomType: string;
  items: ItemEntry[];
  summary: {
    totalItems: number;
    grandTotalIn: number;
    grandTotalOut: number;
    grandBalance: number;
  };
}

// ✅ Fixed: Using acName (matching API)
export interface StockDetail {
  id: number;
  document: string;
  documentId: number;
  date: string;
  stockTypeId: number;
  stockTypeName: string;
  accountId: number | null;
  acName: string;  // ✅ Changed from accountName to acName
  item_id: number;
  itemName: string;
  qty: number;
  uomName: string;
}

// ✅ Fixed: Stock IN grouped by document
export interface StockInGrouped {
  document: string;
  documentId: number;
  date: string;
  stockTypeId: number;
  stockTypeName: string;
  accountId: number | null;
  acName: string;  // ✅ Changed from accountName to acName
  totalQty: number;
  items: {
    id: number;
    item_id: number;
    itemName: string;
    qty: number;
    uomName: string;
  }[];
}

export interface BatchInOutSummaryData {
  batch: { id: number; name: string };
  uomType: string;
  stockIn: {
    total: number;
    count: number;
    documentCount?: number;
    grouped?: StockInGrouped[];
    details: StockDetail[];
  };
  stockOut: {
    total: number;
    count: number;
    details: StockDetail[];
  };
  summary: {
    totalIn: number;
    totalOut: number;
    remaining: number;
  };
}

export interface BatchInfo {
  id: number;
  acName: string;
}

export interface ReportParams {
  batchno: number;
  uom?: '1' | '2' | '3';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// =============================================
// API SLICE
// =============================================

export const batchReportApi = createApi({
  reducerPath: 'batchReportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/batch-report`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['BatchStockLedger', 'BatchInOutSummary', 'Batches'],
  endpoints: (builder) => ({

    // Get Batch Stock Ledger (Report 1)
    getBatchStockLedger: builder.query<BatchStockLedgerData, ReportParams>({
      query: ({ batchno, uom = '2' }) => `/stock-ledger?batchno=${batchno}&uom=${uom}`,
      providesTags: ['BatchStockLedger'],
      transformResponse: (response: ApiResponse<BatchStockLedgerData>) => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch report');
        }
        return response.data;
      }
    }),

    // Get Batch In/Out Summary (Report 2)
    getBatchInOutSummary: builder.query<BatchInOutSummaryData, ReportParams>({
      query: ({ batchno, uom = '2' }) => `/in-out-summary?batchno=${batchno}&uom=${uom}`,
      providesTags: ['BatchInOutSummary'],
      transformResponse: (response: ApiResponse<BatchInOutSummaryData>) => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch report');
        }
        return response.data;
      }
    }),

    // Get all batches with stock
    getBatchesWithStock: builder.query<BatchInfo[], void>({
      query: () => '/batches',
      providesTags: ['Batches'],
      transformResponse: (response: ApiResponse<BatchInfo[]>) => response.data || []
    }),

  })
});

export const {
  useGetBatchStockLedgerQuery,
  useLazyGetBatchStockLedgerQuery,
  useGetBatchInOutSummaryQuery,
  useLazyGetBatchInOutSummaryQuery,
  useGetBatchesWithStockQuery,
} = batchReportApi;
