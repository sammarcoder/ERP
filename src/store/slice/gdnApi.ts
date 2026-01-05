



// // store/slice/gdnApi.ts - FORCE ORDER STATUS UPDATE
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   } else {
//     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
//   }
// }

// export const gdnApi = createApi({
//   reducerPath: 'gdnApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${getApiBaseUrl()}/dispatch`,
//   }),
//   tagTypes: ['GDN', 'Order'],
//   endpoints: (builder) => ({
//     // ✅ CREATE new GDN with forced order update
//     createGDN: builder.mutation<any, {
//       stockMain: any;
//       stockDetails: any[];
//       updateOrderStatus?: boolean;
//       selectedOrderStatus?: string;
//     }>({
//       query: (gdnData) => {
//         // ✅ FORCE order status update to true
//         const payload = {
//           ...gdnData,
//           updateOrderStatus: true, // ✅ Always update order status
//           selectedOrderStatus: gdnData.selectedOrderStatus || 'Partial'
//         }

//         console.log('🚀 GDN API Payload with forced order update:', payload)

//         return {
//           url: '/',
//           method: 'POST',
//           body: payload,
//         }
//       },
//       invalidatesTags: ['GDN', 'Order'],
//     }),

//     // ✅ Force order refresh after GDN creation
//     forceOrderRefresh: builder.mutation<any, string | number>({
//       query: (orderId) => ({
//         url: `/force-order-update/${orderId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['Order'],
//     }),

//     // ... rest of endpoints remain the same
//     getAllGDNs: builder.query<any, {
//       status?: string
//       dateFrom?: string
//       dateTo?: string
//       customerId?: string
//       page?: number
//       limit?: number
//     }>({
//       query: (params = {}) => {
//         const queryParams = new URLSearchParams()

//         if (params.status && params.status !== 'all') queryParams.append('status', params.status)
//         if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
//         if (params.dateTo) queryParams.append('dateTo', params.dateTo)
//         if (params.customerId) queryParams.append('customerId', params.customerId)
//         if (params.page) queryParams.append('page', params.page.toString())
//         if (params.limit) queryParams.append('limit', params.limit.toString())

//         return `/?${queryParams}`
//       },
//       providesTags: ['GDN'],
//     }),

//     getGDNById: builder.query<any, string | number>({
//       query: (id) => `/${id}`,
//       providesTags: (result, error, id) => [{ type: 'GDN', id }],
//     }),

//     updateGDN: builder.mutation<any, {
//       id: string | number;
//       stockMain: any;
//       stockDetails: any[];
//       updateOrderStatus?: boolean;
//       selectedOrderStatus?: string;
//     }>({
//       query: ({ id, ...gdnData }) => ({
//         url: `/${id}`,
//         method: 'PUT',
//         body: gdnData,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: 'GDN', id },
//         { type: 'GDN', id: 'LIST' },
//         'Order'
//       ],
//     }),

//     // deleteGDN: builder.mutation<any, string | number>({
//     //   query: (id) => ({
//     //     url: `/${id}`,
//     //     method: 'DELETE',
//     //   }),
//     //   invalidatesTags: ['GDN', 'Order'],
//     // }),

//     deleteGDN: builder.mutation<any, string | number>({
//       query: (id) => ({
//         url: `/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: (result, error, id) => [
//         'GDN', // Invalidate all GDN cache
//         'Order', // Invalidate order cache (so deleted order appears back in Ready list)
//         { type: 'GDN', id }, // Invalidate specific GDN
//       ],
//       // ✅ Optimistic update for better UX
//       async onQueryStarted(id, { dispatch, queryFulfilled }) {
//         console.log(`🗑️ Starting delete for GDN ID: ${id}`);

//         try {
//           const result = await queryFulfilled;
//           console.log(`✅ Delete successful:`, result.data);

//           // Show success message
//           if (result.data?.data?.orderBackInGDNList) {
//             console.log(`🔄 Order is back in Ready for GDN list`);
//           }

//         } catch (error) {
//           console.error(`❌ Delete failed:`, error);
//         }
//       }
//     }),




//     getAvailableBatches: builder.query<any, string | number>({
//       query: (itemId) => `/available-batches/${itemId}`,
//       providesTags: (result, error, itemId) => [{ type: 'GDN', id: `batches-${itemId}` }],
//     }),

//     getAvailableBatchesEdit: builder.query<any, { itemId: string | number; dispatchId: string | number }>({
//       query: ({ itemId, dispatchId }) => `/available-batches-edit/${itemId}/${dispatchId}`,
//       providesTags: (result, error, { itemId, dispatchId }) => [
//         { type: 'GDN', id: `batches-edit-${itemId}-${dispatchId}` }
//       ],
//     }),
//   }),
// })

// export const {
//   useGetAllGDNsQuery,
//   useGetGDNByIdQuery,
//   useCreateGDNMutation,
//   useUpdateGDNMutation,
//   useDeleteGDNMutation,
//   useGetAvailableBatchesQuery,
//   useGetAvailableBatchesEditQuery,
// } = gdnApi


































// store/slice/gdnApi.ts - FIXED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
}

export const gdnApi = createApi({
  reducerPath: 'gdnApi',
  baseQuery: fetchBaseQuery({ baseUrl: getApiBaseUrl() }),  // ✅ NO /gdn suffix - base API only
  tagTypes: ['GDN', 'Order', 'Batch'],
  endpoints: (builder) => ({
    
    // ═══════════════════════════════════════════════════════════════
    // GDN CRUD - Uses /gdn prefix
    // ═══════════════════════════════════════════════════════════════
    getAllGDNs: builder.query<any, any>({
      query: (params = {}) => {
        const q = new URLSearchParams()
        if (params.status && params.status !== 'all') q.append('status', params.status)
        if (params.dateFrom) q.append('dateFrom', params.dateFrom)
        if (params.dateTo) q.append('dateTo', params.dateTo)
        if (params.customerId) q.append('customerId', params.customerId)
        if (params.page) q.append('page', params.page.toString())
        if (params.limit) q.append('limit', params.limit.toString())
        return `/gdn?${q.toString()}`  // ✅ Full path
      },
      providesTags: ['GDN'],
    }),

    getGDNById: builder.query<any, string | number>({
      query: (id) => `/gdn/${id}`,  // ✅ Full path
      providesTags: (result, error, id) => [{ type: 'GDN', id }],
    }),

    createGDN: builder.mutation<any, { stockMain: any; stockDetails: any[] }>({
      query: (data) => ({
        url: '/gdn',  // ✅ Full path
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GDN', 'Order', 'Batch'],
    }),

    updateGDN: builder.mutation<any, { id: string | number; stockMain: any; stockDetails: any[] }>({
      query: ({ id, ...data }) => ({
        url: `/gdn/${id}`,  // ✅ Full path
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GDN', 'Order', 'Batch'],
    }),

    deleteGDN: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/gdn/${id}`,  // ✅ Full path
        method: 'DELETE',
      }),
      invalidatesTags: ['GDN', 'Order', 'Batch'],
    }),

    // ═══════════════════════════════════════════════════════════════
    // ✅ BATCH APIs - Uses /dispatch prefix (YOUR EXISTING ROUTES)
    // ═══════════════════════════════════════════════════════════════
    
    // CREATE MODE: /api/dispatch/available-batches/:itemId
    getAvailableBatches: builder.query<any, number>({
      query: (itemId) => `/dispatch/available-batches/${itemId}`,  // ✅ CORRECT PATH
      providesTags: ['Batch'],
    }),

    // EDIT MODE: /api/dispatch/available-batches-edit/:itemId/:dispatchId
    getAvailableBatchesForEdit: builder.query<any, { itemId: number; dispatchId: number }>({
      query: ({ itemId, dispatchId }) => `/dispatch/available-batches-edit/${itemId}/${dispatchId}`,  // ✅ CORRECT PATH
      providesTags: ['Batch'],
    }),
  }),
})

export const {
  useGetAllGDNsQuery,
  useGetGDNByIdQuery,
  useCreateGDNMutation,
  useUpdateGDNMutation,
  useDeleteGDNMutation,
  // Batch APIs
  useGetAvailableBatchesQuery,
  useLazyGetAvailableBatchesQuery,
  useGetAvailableBatchesForEditQuery,
  useLazyGetAvailableBatchesForEditQuery,
} = gdnApi
