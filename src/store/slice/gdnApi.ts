































// // store/slice/gdnApi.ts - FIXED

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   }
//   return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
// }

// export const gdnApi = createApi({
//   reducerPath: 'gdnApi',
//   baseQuery: fetchBaseQuery({ baseUrl: getApiBaseUrl() }),  // ✅ NO /gdn suffix - base API only
//   tagTypes: ['GDN', 'Order', 'Batch'],
//   endpoints: (builder) => ({
    
//     // ═══════════════════════════════════════════════════════════════
//     // GDN CRUD - Uses /gdn prefix
//     // ═══════════════════════════════════════════════════════════════
//     getAllGDNs: builder.query<any, any>({
//       query: (params = {}) => {
//         const q = new URLSearchParams()
//         if (params.status && params.status !== 'all') q.append('status', params.status)
//         if (params.dateFrom) q.append('dateFrom', params.dateFrom)
//         if (params.dateTo) q.append('dateTo', params.dateTo)
//         if (params.customerId) q.append('customerId', params.customerId)
//         if (params.page) q.append('page', params.page.toString())
//         if (params.limit) q.append('limit', params.limit.toString())
//         return `/gdn?${q.toString()}`  // ✅ Full path
//       },
//       providesTags: ['GDN'],
//     }),

//     getGDNById: builder.query<any, string | number>({
//       query: (id) => `/gdn/${id}`,  // ✅ Full path
//       providesTags: (result, error, id) => [{ type: 'GDN', id }],
//     }),

//     createGDN: builder.mutation<any, { stockMain: any; stockDetails: any[] }>({
//       query: (data) => ({
//         url: '/gdn',  // ✅ Full path
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['GDN', 'Order', 'Batch'],
//     }),

//     updateGDN: builder.mutation<any, { id: string | number; stockMain: any; stockDetails: any[] }>({
//       query: ({ id, ...data }) => ({
//         url: `/gdn/${id}`,  // ✅ Full path
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['GDN', 'Order', 'Batch'],
//     }),

//     deleteGDN: builder.mutation<any, string | number>({
//       query: (id) => ({
//         url: `/gdn/${id}`,  // ✅ Full path
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['GDN', 'Order', 'Batch'],
//     }),

//     // ═══════════════════════════════════════════════════════════════
//     // ✅ BATCH APIs - Uses /dispatch prefix (YOUR EXISTING ROUTES)
//     // ═══════════════════════════════════════════════════════════════
    
//     // CREATE MODE: /api/dispatch/available-batches/:itemId
//     getAvailableBatches: builder.query<any, number>({
//       query: (itemId) => `/dispatch/available-batches/${itemId}`,  // ✅ CORRECT PATH
//       providesTags: ['Batch'],
//     }),

//     // EDIT MODE: /api/dispatch/available-batches-edit/:itemId/:dispatchId
//     getAvailableBatchesForEdit: builder.query<any, { itemId: number; dispatchId: number }>({
//       query: ({ itemId, dispatchId }) => `/dispatch/available-batches-edit/${itemId}/${dispatchId}`,  // ✅ CORRECT PATH
//       providesTags: ['Batch'],
//     }),
//   }),
// })

// export const {
//   useGetAllGDNsQuery,
//   useGetGDNByIdQuery,
//   useCreateGDNMutation,
//   useUpdateGDNMutation,
//   useDeleteGDNMutation,
//   // Batch APIs
//   useGetAvailableBatchesQuery,
//   useLazyGetAvailableBatchesQuery,
//   useGetAvailableBatchesForEditQuery,
//   useLazyGetAvailableBatchesForEditQuery,
// } = gdnApi










































// store/slice/gdnApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ✅ Dynamic port detection
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const port = window.location.port === '3001' ? 4001 : 4000;
    return `http://${window.location.hostname}:${port}/api`
  }
  const port = process.env.NODE_ENV === 'test' ? 4001 : 4000;
  return process.env.NEXT_PUBLIC_API_URL || `http://localhost:${port}/api`
}

export const gdnApi = createApi({
  reducerPath: 'gdnApi',
  baseQuery: fetchBaseQuery({ baseUrl: getApiBaseUrl() }),
  tagTypes: ['GDN', 'Order', 'Batch'],
  endpoints: (builder) => ({
    getAllGDNs: builder.query<any, any>({
      query: (params = {}) => {
        const q = new URLSearchParams()
        if (params.status && params.status !== 'all') q.append('status', params.status)
        if (params.dateFrom) q.append('dateFrom', params.dateFrom)
        if (params.dateTo) q.append('dateTo', params.dateTo)
        if (params.customerId) q.append('customerId', params.customerId)
        if (params.page) q.append('page', params.page.toString())
        if (params.limit) q.append('limit', params.limit.toString())
        return `/gdn?${q.toString()}`
      },
      providesTags: ['GDN'],
    }),

    getGDNById: builder.query<any, string | number>({
      query: (id) => `/gdn/${id}`,
      providesTags: (result, error, id) => [{ type: 'GDN', id }],
    }),

    createGDN: builder.mutation<any, { stockMain: any; stockDetails: any[] }>({
      query: (data) => ({
        url: '/gdn',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GDN', 'Order', 'Batch'],
    }),

    updateGDN: builder.mutation<any, { id: string | number; stockMain: any; stockDetails: any[] }>({
      query: ({ id, ...data }) => ({
        url: `/gdn/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GDN', 'Order', 'Batch'],
    }),

    deleteGDN: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/gdn/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GDN', 'Order', 'Batch'],
    }),

    getAvailableBatches: builder.query<any, number>({
      query: (itemId) => `/dispatch/available-batches/${itemId}`,
      providesTags: ['Batch'],
    }),

    getAvailableBatchesForEdit: builder.query<any, { itemId: number; dispatchId: number }>({
      query: ({ itemId, dispatchId }) => `/dispatch/available-batches-edit/${itemId}/${dispatchId}`,
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
  useGetAvailableBatchesQuery,
  useLazyGetAvailableBatchesQuery,
  useGetAvailableBatchesForEditQuery,
  useLazyGetAvailableBatchesForEditQuery,
} = gdnApi
