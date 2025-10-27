// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { Uom, CreateUomRequest, UpdateUomRequest } from '@/types/uom'

// // Your API base URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:4000/api/z-uom`



// export const uomApi = createApi({
//   reducerPath: 'uomApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json')
//       return headers
//     },
//   }),
//   tagTypes: ['Uom'],
//   endpoints: (builder) => ({
//     // 📥 GET /api/z-uom/get - getAllUoms
//     getUoms: builder.query<Uom[], void>({
//       query: () => '/get',
//       providesTags: ['Uom'],
//       transformResponse: (response: any) => {
//         // Handle your API response format
//         return Array.isArray(response) ? response : response?.data || []
//       },
//     }),

//     // 📄 GET /api/z-uom/get/:id - getUomById
//     getUomById: builder.query<Uom, number>({
//       query: (id) => `/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Uom', id }],
//     }),

//     // ✅ POST /api/z-uom/create - createUom
//     createUom: builder.mutation<Uom, CreateUomRequest>({
//       query: (newUom) => ({
//         url: '/create',
//         method: 'POST',
//         body: newUom,
//       }),
//       invalidatesTags: ['Uom'],
//       transformResponse: (response: any) => {
//         return response?.data || response
//       },
//     }),

//     // ✏️ PUT /api/z-uom/put/:id - updateUom
//     updateUom: builder.mutation<Uom, UpdateUomRequest>({
//       query: ({ id, ...patch }) => ({
//         url: `/put/${id}`,
//         method: 'PUT',
//         body: patch,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: 'Uom', id }],
//     }),

//     // ❌ DELETE /api/z-uom/delete/:id - deleteUom
//     deleteUom: builder.mutation<{ message: string }, number>({
//       query: (id) => ({
//         url: `/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Uom'],
//     }),
//   }),
// })

// // Export hooks for components
// export const {
//   useGetUomsQuery,
//   useGetUomByIdQuery,
//   useCreateUomMutation,
//   useUpdateUomMutation,
//   useDeleteUomMutation,
// } = uomApi































































import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Uom, CreateUomRequest, UpdateUomRequest } from '@/types/uom'

// ✅ FIXED: Dynamic base URL (LAN + localhost compatible)
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api/z-uom`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/z-uom'
  }
}

export const uomApi = createApi({
  reducerPath: 'uomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Uom'],
  endpoints: (builder) => ({
    // 📥 GET /api/z-uom/get - getAllUoms
    getUoms: builder.query<Uom[], void>({
      query: () => '/get',
      providesTags: ['Uom'],
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.data || []
      },
    }),

    // 📄 GET /api/z-uom/get/:id - getUomById
    getUomById: builder.query<Uom, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Uom', id }],
    }),

    // ✅ POST /api/z-uom/create - createUom
    createUom: builder.mutation<Uom, CreateUomRequest>({
      query: (newUom) => ({
        url: '/create',
        method: 'POST',
        body: newUom,
      }),
      invalidatesTags: ['Uom'],
      transformResponse: (response: any) => response?.data || response,
    }),

    // ✏️ PUT /api/z-uom/put/:id - updateUom
    updateUom: builder.mutation<Uom, UpdateUomRequest>({
      query: ({ id, ...patch }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Uom', id }],
    }),

    // ❌ DELETE /api/z-uom/delete/:id - deleteUom
    deleteUom: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Uom'],
    }),
  }),
})

// ✅ Export hooks
export const {
  useGetUomsQuery,
  useGetUomByIdQuery,
  useCreateUomMutation,
  useUpdateUomMutation,
  useDeleteUomMutation,
} = uomApi
