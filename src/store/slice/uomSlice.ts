// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { Uom, CreateUomRequest, UpdateUomRequest } from '@/types/uom'

// // ✅ FIXED: Dynamic base URL (LAN + localhost compatible)
// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api/z-uom`
//   } else {
//     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/z-uom'
//   }
// }

// export const uomApi = createApi({
//   reducerPath: 'uomApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: getApiBaseUrl(),
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
//       transformResponse: (response: any) => response?.data || response,
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

// // ✅ Export hooks
// export const {
//   useGetUomsQuery,
//   useGetUomByIdQuery,
//   useCreateUomMutation,
//   useUpdateUomMutation,
//   useDeleteUomMutation,
// } = uomApi














































// store/slice/uomSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { uomBaseQuery } from '@/lib/baseQuery';

// Types
export interface Uom {
  id: number;
  uom: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUomRequest {
  uom: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateUomRequest {
  id: number;
  uom?: string;
  description?: string;
  isActive?: boolean;
}

export const uomApi = createApi({
  reducerPath: 'uomApi',
  baseQuery: uomBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['Uom'],
  endpoints: (builder) => ({
    // GET /api/z-uom/get
    getUoms: builder.query<Uom[], void>({
      query: () => '/get',
      providesTags: ['Uom'],
      transformResponse: (response: any) => {
        console.log('📊 UOM API Response:', response);
        return Array.isArray(response) ? response : response?.data || [];
      },
    }),

    // GET /api/z-uom/get/:id
    getUomById: builder.query<Uom, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Uom', id }],
    }),

    // POST /api/z-uom/create
    createUom: builder.mutation<{ success: boolean; data: Uom }, CreateUomRequest>({
      query: (newUom) => ({
        url: '/create',
        method: 'POST',
        body: newUom,
      }),
      invalidatesTags: ['Uom'],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log('✅ UOM created successfully:', result.data);
        } catch (error) {
          console.error('❌ UOM creation failed:', error);
        }
      },
    }),

    // PUT /api/z-uom/put/:id
    updateUom: builder.mutation<{ success: boolean; data: Uom }, UpdateUomRequest>({
      query: ({ id, ...patch }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Uom', id }, 'Uom'],
    }),

    // DELETE /api/z-uom/delete/:id
    deleteUom: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Uom'],
    }),
  }),
});

export const {
  useGetUomsQuery,
  useGetUomByIdQuery,
  useCreateUomMutation,
  useUpdateUomMutation,
  useDeleteUomMutation,
} = uomApi;
