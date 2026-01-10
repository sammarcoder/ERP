// services/slice/salesVoucherApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

// export const salesVoucherApi = createApi({
//   reducerPath: 'salesVoucherApi',
//   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
//   tagTypes: ['SalesVoucher', 'Journal', 'GDN'],
//   endpoints: (builder) => ({

//     // ✅ NEW: Get all sales vouchers (voucherTypeId = 12, is_partially_deleted = 0)
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
//       invalidatesTags: ['SalesVoucher', 'GDN'],
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

//     // Check journal status by stk_Main_ID
//     checkJournalStatus: builder.query<any, number>({
//       query: (stockMainId) => `/journal-master/check-status/${stockMainId}`,
//       providesTags: ['Journal'],
//     }),

//     // Post voucher to journal (create/edit)
//     postVoucherToJournal: builder.mutation({
//       query: ({ stockMainId, mode }: { stockMainId: number; mode: 'create' | 'edit' }) => ({
//         url: `/journal-master/post-voucher/${stockMainId}`,
//         method: 'POST',
//         body: { mode },
//       }),
//       invalidatesTags: ['SalesVoucher', 'Journal', 'GDN'],
//     }),

//     // Post/UnPost journal
//     toggleJournalStatus: builder.mutation({
//       query: (journalId: number) => ({
//         url: `/journal-master/post-unpost/${journalId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['SalesVoucher', 'Journal'],
//     }),

//     // Delete voucher (partially)
//     deleteVoucher: builder.mutation({
//       query: (stockMainId: number) => ({
//         url: `/journal-master/delete-voucher/${stockMainId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['SalesVoucher', 'Journal', 'GDN'],
//     }),

//     // Get carriage accounts
//     getCarriageAccounts: builder.query<any, void>({
//       query: () => '/z-coa/by-coa-type-carriage',
//     }),
//   }),
// });

// export const {
//   useGetSalesVouchersQuery,  // ✅ NEW
//   useUpdateStockMainMutation,
//   useUpdateStockDetailMutation,
//   useCheckJournalStatusQuery,
//   usePostVoucherToJournalMutation,
//   useToggleJournalStatusMutation,
//   useDeleteVoucherMutation,
//   useGetCarriageAccountsQuery,
// } = salesVoucherApi;




















































// services/slice/salesVoucherApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

export const salesVoucherApi = createApi({
  reducerPath: 'salesVoucherApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['SalesVoucher', 'Journal'],
  endpoints: (builder) => ({

    // Get sales vouchers from journalmaster
    getSalesVouchers: builder.query<any, void>({
      query: () => '/journal-master/sales-vouchers',
      providesTags: ['Journal'],
    }),

    // Update stk_main (approve, status, carriage)
    updateStockMain: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/stock-order/stock-main/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SalesVoucher'],
    }),

    // Update stk_detail (price, discounts)
    updateStockDetail: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/stock-order/stock-detail/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SalesVoucher'],
    }),

    // Check journal status
    checkJournalStatus: builder.query<any, number>({
      query: (stockMainId) => `/journal-master/check-status/${stockMainId}`,
      providesTags: ['Journal'],
    }),

    // Post voucher to journal (create/edit)
    postVoucherToJournal: builder.mutation({
      query: ({ stockMainId, mode }: { stockMainId: number; mode: 'create' | 'edit' }) => ({
        url: `/journal-master/post-voucher/${stockMainId}`,
        method: 'POST',
        body: { mode },
      }),
      invalidatesTags: ['SalesVoucher', 'Journal'],
    }),

    // Post/UnPost journal
    toggleJournalStatus: builder.mutation({
      query: (journalId: number) => ({
        url: `/journal-master/post-unpost/${journalId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Journal'],
    }),

    toggleSalesVoucherStatus: builder.mutation({
      query: (journalId: number) => ({
        url: `/journal-master/sales-voucher-post-unpost/${journalId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Journal'],
    }),

    // Delete voucher
    deleteVoucher: builder.mutation({
      query: (stockMainId: number) => ({
        url: `/journal-master/delete-voucher/${stockMainId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SalesVoucher', 'Journal'],
    }),

    // Get carriage accounts
    getCarriageAccounts: builder.query<any, void>({
      query: () => '/z-coa/by-coa-type-carriage',
    }),
  }),
});

export const {
  useGetSalesVouchersQuery,
  useUpdateStockMainMutation,
  useUpdateStockDetailMutation,
  useCheckJournalStatusQuery,
  usePostVoucherToJournalMutation,
  useToggleJournalStatusMutation,
  useDeleteVoucherMutation,
  useGetCarriageAccountsQuery,
  useToggleSalesVoucherStatusMutation,
} = salesVoucherApi;
