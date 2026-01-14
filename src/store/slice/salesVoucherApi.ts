// // services/slice/salesVoucherApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

// export const salesVoucherApi = createApi({
//   reducerPath: 'salesVoucherApi',
//   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
//   tagTypes: ['SalesVoucher', 'Journal'],
//   endpoints: (builder) => ({

//     // Get sales vouchers from journalmaster
//     getSalesVouchers: builder.query<any, void>({
//       query: () => '/journal-master/sales-vouchers',
//       providesTags: ['Journal'],
//     }),

//     // Update stk_main (approve, status, carriage)
//     updateStockMain: builder.mutation({
//       query: ({ id, data }: { id: number; data: any }) => ({
//         url: `/stock-order/stock-main/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['SalesVoucher'],
//     }),

//     // Update stk_detail (price, discounts)
//     updateStockDetail: builder.mutation({
//       query: ({ id, data }: { id: number; data: any }) => ({
//         url: `/stock-order/stock-detail/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['SalesVoucher'],
//     }),

//     // Check journal status
//     checkJournalStatus: builder.query<any, number>({
//       query: (stockMainId) => `/journal-master/check-status/${stockMainId}`,
//       providesTags: ['Journal'],
//     }),



//     // Post voucher to journal (create/edit)
//     postVoucherToJournal: builder.mutation({
//       query: ({ stockMainId, mode, calculatedTotals }: {
//         stockMainId: number;
//         mode: 'create' | 'edit';
//         calculatedTotals?: {
//           totalNet: number;
//           carriageAmount: number;
//           customerDebit: number;
//           batchTotals: Record<string, { batchName: string; amount: number }>;
//         };
//       }) => ({
//         url: `/journal-master/post-voucher/${stockMainId}`,
//         method: 'POST',
//         body: { mode, calculatedTotals },  // ✅ Added calculatedTotals
//       }),
//       invalidatesTags: ['SalesVoucher', 'Journal'],
//     }),

//     // postVoucherToJournal: builder.mutation({
//     //   query: ({ stockMainId, mode }: { stockMainId: number; mode: 'create' | 'edit' }) => ({
//     //     url: `/journal-master/post-voucher/${stockMainId}`,
//     //     method: 'POST',
//     //     body: { mode },
//     //   }),
//     //   invalidatesTags: ['SalesVoucher', 'Journal'],
//     // }),

//     // Post/UnPost journal
//     toggleJournalStatus: builder.mutation({
//       query: (journalId: number) => ({
//         url: `/journal-master/post-unpost/${journalId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['Journal'],
//     }),

//     toggleSalesVoucherStatus: builder.mutation({
//       query: (journalId: number) => ({
//         url: `/journal-master/sales-voucher-post-unpost/${journalId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['Journal'],
//     }),

//     // Delete voucher
//     deleteVoucher: builder.mutation({
//       query: (stockMainId: number) => ({
//         url: `/journal-master/delete-voucher/${stockMainId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['SalesVoucher', 'Journal'],
//     }),

//     // Get carriage accounts
//     getCarriageAccounts: builder.query<any, void>({
//       query: () => '/z-coa/by-coa-type-carriage',
//     }),
//   }),
// });

// export const {
//   useGetSalesVouchersQuery,
//   useUpdateStockMainMutation,
//   useUpdateStockDetailMutation,
//   useCheckJournalStatusQuery,
//   usePostVoucherToJournalMutation,
//   useToggleJournalStatusMutation,
//   useDeleteVoucherMutation,
//   useGetCarriageAccountsQuery,
//   useToggleSalesVoucherStatusMutation,
// } = salesVoucherApi;

























































// services/slice/salesVoucherApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

export const salesVoucherApi = createApi({
  reducerPath: 'salesVoucherApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['SalesVoucher', 'GDN'],
  endpoints: (builder) => ({

    // ═══════════════════════════════════════════════════════════════
    // GET APIs
    // ═══════════════════════════════════════════════════════════════

    // Get all sales vouchers
    getAllSalesVouchers: builder.query<any, void>({
      query: () => '/sales-voucher/get-all',
      providesTags: ['SalesVoucher'],
    }),

    // Get single sales voucher by ID
    getSalesVoucherById: builder.query<any, number>({
      query: (id) => `/sales-voucher/get/${id}`,
      providesTags: ['SalesVoucher'],
    }),

    // Get sales voucher by GDN ID
    getSalesVoucherByGdnId: builder.query<any, number>({
      query: (gdnId) => `/sales-voucher/get-by-gdn/${gdnId}`,
      providesTags: ['SalesVoucher'],
    }),

    // Get sales voucher stats
    getSalesVoucherStats: builder.query<any, void>({
      query: () => '/sales-voucher/stats',
      providesTags: ['SalesVoucher'],
    }),

    // ═══════════════════════════════════════════════════════════════
    // POST APIs
    // ═══════════════════════════════════════════════════════════════

    // Post voucher to journal (create/edit)
    postVoucherToJournal: builder.mutation<any, {
      stockMainId: number;
      mode: 'create' | 'edit';
      calculatedTotals?: {
        totalNet: number;
        carriageAmount: number;
        customerDebit: number;
        batchTotals: Record<string, { batchName: string; amount: number }>;
      };
    }>({
      query: ({ stockMainId, mode, calculatedTotals }) => ({
        url: `/sales-voucher/post-voucher/${stockMainId}`,
        method: 'POST',
        body: { mode, calculatedTotals },
      }),
      invalidatesTags: ['SalesVoucher', 'GDN'],
    }),

    // Post/UnPost sales voucher
    toggleSalesVoucherStatus: builder.mutation<any, number>({
      query: (journalId) => ({
        url: `/sales-voucher/post-unpost/${journalId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SalesVoucher'],
    }),

    // Delete voucher
    deleteVoucher: builder.mutation<any, number>({
      query: (stockMainId) => ({
        url: `/sales-voucher/delete/${stockMainId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SalesVoucher', 'GDN'],
    }),

    // ═══════════════════════════════════════════════════════════════
    // STOCK UPDATE APIs (for updating GDN data before posting)
    // ═══════════════════════════════════════════════════════════════

    // Update stk_main
    updateStockMain: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/stock-order/stock-main/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GDN'],
    }),

    // Update stk_detail
    updateStockDetail: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/stock-order/stock-detail/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GDN'],
    }),

    // Get carriage accounts
    getCarriageAccounts: builder.query<any, void>({
      query: () => '/z-coa/by-coa-type-carriage',
    }),
  }),
});

export const {
  // GET hooks
  useGetAllSalesVouchersQuery,
  useGetSalesVoucherByIdQuery,
  useGetSalesVoucherByGdnIdQuery,
  useGetSalesVoucherStatsQuery,
  // POST hooks
  usePostVoucherToJournalMutation,
  useToggleSalesVoucherStatusMutation,
  useDeleteVoucherMutation,
  // Stock update hooks
  useUpdateStockMainMutation,
  useUpdateStockDetailMutation,
  useGetCarriageAccountsQuery,
} = salesVoucherApi;
