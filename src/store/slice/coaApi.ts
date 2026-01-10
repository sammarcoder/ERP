// // store/api/coaApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   } else {
//     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
//   }
// }

// export const coaApi = createApi({
//   reducerPath: 'coaApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${getApiBaseUrl()}/z-coa`,
//   }),
//   tagTypes: ['COA'],
//   endpoints: (builder) => ({
//     // ✅ Get all COA (default)
//     getAllCoa: builder.query<any[], void>({
//       query: () => '/get',
//       providesTags: ['COA'],
//     }),
    
//     // ✅ Get customers only (for Sales Orders)
//     getCustomerCoa: builder.query<any[], void>({
//       query: () => '/by-coa-type-customer',
//       providesTags: ['COA'],
//     }),
    
//     // ✅ Get suppliers only (for Purchase Orders)  
//     getSupplierCoa: builder.query<any[], void>({
//       query: () => '/by-coa-type-supplier',
//       providesTags: ['COA'],
//     }),
    
//     // ✅ Get single COA by ID
//     getCoaById: builder.query<any, string | number>({
//       query: (id) => `/get/${id}`,
//       providesTags: ['COA'],
//     }),
    
//     // ✅ Create new COA
//     createCoa: builder.mutation<any, any>({
//       query: (coaData) => ({
//         url: '/create',
//         method: 'POST',
//         body: coaData,
//       }),
//       invalidatesTags: ['COA'],
//     }),
    
//     // ✅ Update COA
//     updateCoa: builder.mutation<any, { id: string | number; data: any }>({
//       query: ({ id, data }) => ({
//         url: `/update/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['COA'],
//     }),
    
//     // ✅ Delete COA
//     deleteCoa: builder.mutation<any, string | number>({
//       query: (id) => ({
//         url: `/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['COA'],
//     }),
//   }),
// })

// export const {
//   useGetAllCoaQuery,
//   useGetCustomerCoaQuery,
//   useGetSupplierCoaQuery,
//   useGetCoaByIdQuery,
//   useCreateCoaMutation,
//   useUpdateCoaMutation,
//   useDeleteCoaMutation,
// } = coaApi














































// store/api/coaApi.ts - FIXED for your API response structure
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
}

export const coaApi = createApi({
  reducerPath: 'coaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getApiBaseUrl()}/z-coa`,
  }),
  tagTypes: ['COA'],
  endpoints: (builder) => ({
    // ✅ Get all COA - handles zCoaRecords field
    getAllCoa: builder.query<any[], void>({
      query: () => '/get',
      transformResponse: (response: any) => {
        console.log('🔍 Raw All COA API Response:', response)
        
        // ✅ Handle your specific API structure
        if (response.success) {
          // Your API returns 'zCoaRecords' not 'data'
          const data = response.zCoaRecords || response.data || []
          console.log('✅ All COA Data Array:', data)
          return Array.isArray(data) ? data : []
        }
        
        // Fallback for direct array response
        if (Array.isArray(response)) {
          return response
        }
        
        console.warn('⚠️ Unexpected All COA response structure:', response)
        return []
      },
      providesTags: ['COA'],
    }),
    
    // ✅ Get customers only - handles data field  
    getCustomerCoa: builder.query<any[], void>({
      query: () => '/by-coa-type-customer',
      transformResponse: (response: any) => {
        console.log('🔍 Raw Customer COA API Response:', response)
        
        if (response.success) {
          // This API returns 'data' field
          const data = response.data || response.zCoaRecords || []
          console.log('✅ Customer COA Data Array:', data)
          console.log('📊 Customer COA Count:', response.count)
          return Array.isArray(data) ? data : []
        }
        
        // Handle 404 case
        if (response.success === false && response.message) {
          console.log('ℹ️ No customers found:', response.message)
          return []
        }
        
        if (Array.isArray(response)) {
          return response
        }
        
        console.warn('⚠️ Unexpected Customer COA response structure:', response)
        return []
      },
      providesTags: ['COA'],
    }),
    
    // ✅ Get suppliers only - handles data field
    getSupplierCoa: builder.query<any[], void>({
      query: () => '/by-coa-type-supplier',
      transformResponse: (response: any) => {
        console.log('🔍 Raw Supplier COA API Response:', response)
        
        if (response.success) {
          // This API returns 'data' field  
          const data = response.data || response.zCoaRecords || []
          console.log('✅ Supplier COA Data Array:', data)
          console.log('📊 Supplier COA Count:', response.count)
          return Array.isArray(data) ? data : []
        }
        
        // Handle 404 case
        if (response.success === false && response.message) {
          console.log('ℹ️ No suppliers found:', response.message)
          return []
        }
        
        if (Array.isArray(response)) {
          return response
        }
        
        console.warn('⚠️ Unexpected Supplier COA response structure:', response)
        return []
      },
      providesTags: ['COA'],
    }),
    
    // ✅ Get single COA by ID
    getCoaById: builder.query<any, string | number>({
      query: (id) => `/get/${id}`,
      transformResponse: (response: any) => {
        console.log('🔍 COA By ID Response:', response)
        if (response.success) {
          return response.data || response.zCoaRecord || response
        }
        return response
      },
      providesTags: ['COA'],
    }),

    getCoaByCarriage: builder.query<any, string | number>({
      query: () => `/by-coa-type-carriage`,
      transformResponse: (response: any) => {   
        console.log('🔍 COA By Carriage ID Response:', response)
        if (response.success) {
          return response.data || response.zCoaRecord || response
        }
        return response

      },
      providesTags: ['COA'],
    }),
    
    // ✅ Create new COA
    createCoa: builder.mutation<any, any>({
      query: (coaData) => ({
        url: '/create',
        method: 'POST',
        body: coaData,
      }),
      invalidatesTags: ['COA'],
    }),
    
    // ✅ Update COA
    updateCoa: builder.mutation<any, { id: string | number; data: any }>({
      query: ({ id, data }) => ({
        url: `/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['COA'],
    }),
    
    // ✅ Delete COA
    deleteCoa: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['COA'],
    }),
  }),
})

export const {
  useGetAllCoaQuery,
  useGetCustomerCoaQuery,
  useGetSupplierCoaQuery,
  useGetCoaByIdQuery,
  useGetCoaByCarriageQuery,
  useCreateCoaMutation,
  useUpdateCoaMutation,
  useDeleteCoaMutation,
} = coaApi
