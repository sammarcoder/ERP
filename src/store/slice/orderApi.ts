
// // store/api/orderApi.ts - ONLY FIX THE FRONTEND
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   } else {
//     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
//   }
// }

// export const orderApi = createApi({
//   reducerPath: 'orderApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${getApiBaseUrl()}/order`,
//   }),
//   tagTypes: ['Order'],
//   endpoints: (builder) => ({
//     createOrder: builder.mutation<any, { master: any; details: any[] }>({
//       query: (orderData) => ({
//         url: '/',
//         method: 'POST',
//         body: orderData,
//       }),
//       invalidatesTags: ['Order'],
//     }),

//     // ✅ FIXED: Use stockTypeId to match your backend
//     getAllOrders: builder.query<any, {
//       stockTypeId?: 11 | 12 | string  
//       status?: string
//       dateFrom?: string
//       dateTo?: string
//       page?: number
//       limit?: number
//     }>({
//       query: (params = {}) => {
//         const queryParams = new URLSearchParams()
        
//         // ✅ Use stockTypeId - matches your backend exactly
//         if (params.stockTypeId) queryParams.append('stockTypeId', params.stockTypeId.toString())
//         if (params.status && params.status !== 'all') queryParams.append('status', params.status)
//         if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
//         if (params.dateTo) queryParams.append('dateTo', params.dateTo)
//         if (params.page) queryParams.append('page', params.page.toString())
//         if (params.limit) queryParams.append('limit', params.limit.toString())
        
//         return `/?${queryParams}`
//       },
//       providesTags: ['Order'],
//     }),

//     getOrderById: builder.query<any, string | number>({
//       query: (id) => `/${id}`,
//       providesTags: ['Order'],
//     }),

//     updateOrder: builder.mutation<any, { id: string | number; master: any; details: any[] }>({
//       query: ({ id, master, details }) => ({
//         url: `/${id}`,
//         method: 'PUT',
//         body: { master, details },
//       }),
//       invalidatesTags: ['Order'],
//     }),

//     deleteOrder: builder.mutation<any, string | number>({
//       query: (id) => ({
//         url: `/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Order'],
//     }),
//   }),
// })

// export const {
//   useCreateOrderMutation,
//   useGetAllOrdersQuery,
//   useGetOrderByIdQuery,
//   useUpdateOrderMutation,
//   useDeleteOrderMutation,
// } = orderApi
















































// store/slice/orderApi.ts - UPDATED WITH APPROVAL STATUS ENDPOINT
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getApiBaseUrl()}/order`,
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, { master: any; details: any[] }>({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    // ✅ Get all orders with stockTypeId filter
    getAllOrders: builder.query<any, {
      stockTypeId?: 11 | 12 | string  
      status?: string
      dateFrom?: string
      dateTo?: string
      page?: number
      limit?: number
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()
        
        if (params.stockTypeId) queryParams.append('stockTypeId', params.stockTypeId.toString())
        if (params.status && params.status !== 'all') queryParams.append('status', params.status)
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
        if (params.dateTo) queryParams.append('dateTo', params.dateTo)
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        
        return `/?${queryParams}`
      },
      providesTags: ['Order'],
    }),

    getOrderById: builder.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    updateOrder: builder.mutation<any, { id: string | number; master: any; details: any[] }>({
      query: ({ id, master, details }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: { master, details },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),

    // ✅ NEW: Update order approval status
    updateOrderStatus: builder.mutation<any, { 
      id: string | number; 
      status?: string;
      approved?: number;
      is_Note_generated?: number;
    }>({
      query: ({ id, ...updateData }) => ({
        url: `/update-status/${id}`, // ✅ YOUR SPECIFIC PATH
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),

    // ✅ NEW: Specific mutation for approval updates (cleaner for UI)
    updateOrderApproval: builder.mutation<any, { 
      id: string | number; 
      approved: number; 
    }>({
      query: ({ id, approved }) => ({
        url: `/update-status/${id}`, // ✅ YOUR SPECIFIC PATH
        method: 'PUT',
        body: { approved },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),

    // ✅ NEW: System update for note generation status
    updateOrderNoteStatus: builder.mutation<any, { 
      id: string | number; 
      is_Note_generated: number; 
    }>({
      query: ({ id, is_Note_generated }) => ({
        url: `/update-status/${id}`, // ✅ YOUR SPECIFIC PATH
        method: 'PUT',
        body: { is_Note_generated },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),

    deleteOrder: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,     // ✅ General status updates
  useUpdateOrderApprovalMutation,   // ✅ Specific for approval dropdown
  useUpdateOrderNoteStatusMutation, // ✅ System updates for GRN/GDN generation
  useDeleteOrderMutation,
} = orderApi













