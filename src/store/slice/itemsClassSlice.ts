


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { ItemClass, CreateItemClassRequest, UpdateItemClassRequest } from '@/types/itemClass'

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:4000/api`



// export const itemClassApi = createApi({
//   reducerPath: 'itemClassApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json')
//       return headers
//     },
//   }),
//   tagTypes: ['ItemClass'],
//   endpoints: (builder) => ({
//     // 📥 GET /api/z-control-head2/get - Get all control head 2s
//     getItemClasses: builder.query<ItemClass[], void>({
//       query: () => '/z-control-head2/get',
//       providesTags: ['ItemClass'],
//       transformResponse: (response: any) => {
//         return Array.isArray(response) ? response : response?.data || []
//       },
//     }),

//     // 📄 GET /api/z-control-head2/get/:id - Get control head 2 by ID
//     getItemClassById: builder.query<ItemClass, number>({
//       query: (id) => `/z-control-head2/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'ItemClass', id }],
//     }),

//     // ✅ POST /api/z-control-head2/ - Create control head 2
//     createItemClass: builder.mutation<{ message: string; data: ItemClass }, CreateItemClassRequest>({
//       query: (newItemClass) => ({
//         url: '/z-control-head2',
//         method: 'POST',
//         body: newItemClass,
//       }),
//       invalidatesTags: ['ItemClass'],
//     }),

//     // ✏️ PUT /api/z-control-head2/update/:id - Update control head 2
//     updateItemClass: builder.mutation<{ message: string; data: ItemClass }, UpdateItemClassRequest>({
//       query: ({ id, ...patch }) => ({
//         url: `/z-control-head2/update/${id}`,
//         method: 'PUT',
//         body: patch,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: 'ItemClass', id }],
//     }),

//     // ❌ DELETE /api/z-control-head2/delete/:id - Delete control head 2
//     deleteItemClass: builder.mutation<{ message: string }, number>({
//       query: (id) => ({
//         url: `/z-control-head2/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['ItemClass'],
//     }),
//   }),
// })

// export const {
//   useGetItemClassesQuery,
//   useGetItemClassByIdQuery,
//   useCreateItemClassMutation,
//   useUpdateItemClassMutation,
//   useDeleteItemClassMutation,
// } = itemClassApi














































import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ItemClass, CreateItemClassRequest, UpdateItemClassRequest } from '@/types/itemClass'

// ✅ Dynamic LAN + fallback for deployment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
}

export const itemClassApi = createApi({
  reducerPath: 'itemClassApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['ItemClass'],
  endpoints: (builder) => ({
    // 📥 GET /api/z-control-head2/get - Get all control head 2s
    getItemClasses: builder.query<ItemClass[], void>({
      query: () => '/z-control-head2/get',
      providesTags: ['ItemClass'],
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.data || []
      },
    }),

    // 📄 GET /api/z-control-head2/get/:id - Get control head 2 by ID
    getItemClassById: builder.query<ItemClass, number>({
      query: (id) => `/z-control-head2/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'ItemClass', id }],
    }),

    // ✅ POST /api/z-control-head2 - Create control head 2
    createItemClass: builder.mutation<{ message: string; data: ItemClass }, CreateItemClassRequest>({
      query: (newItemClass) => ({
        url: '/z-control-head2',
        method: 'POST',
        body: newItemClass,
      }),
      invalidatesTags: ['ItemClass'],
    }),

    // ✏️ PUT /api/z-control-head2/update/:id - Update control head 2
    updateItemClass: builder.mutation<{ message: string; data: ItemClass }, UpdateItemClassRequest>({
      query: ({ id, ...patch }) => ({
        url: `/z-control-head2/update/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ItemClass', id }],
    }),

    // ❌ DELETE /api/z-control-head2/delete/:id - Delete control head 2
    deleteItemClass: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/z-control-head2/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ItemClass'],
    }),
  }),
})

export const {
  useGetItemClassesQuery,
  useGetItemClassByIdQuery,
  useCreateItemClassMutation,
  useUpdateItemClassMutation,
  useDeleteItemClassMutation,
} = itemClassApi
