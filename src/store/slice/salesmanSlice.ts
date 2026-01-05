import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Salesman,
  CreateSalesmanRequest,
  UpdateSalesmanRequest,
  SalesmanListResponse,
  FetchSalesmanParams,
} from '@/types/salesman'

// ✅ Dynamically resolve base URL for LAN / local / deployed environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // When running in browser (client-side)
    return `http://${window.location.hostname}:4000/api/salesman`
  } else {
    // When running on server (SSR or build)
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/salesman'
  }
}

export const salesmanApi = createApi({
  reducerPath: 'salesmanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Salesman'],

  endpoints: (builder) => ({
    // 📥 GET /api/salesman/get - Get all salesmen (with pagination)
    getSalesmen: builder.query<SalesmanListResponse, FetchSalesmanParams>({
      query: ({ page = 1, limit = 10 } = {}) => `/get?page=${page}&limit=${limit}`,
      providesTags: ['Salesman'],
    }),

    // 📄 GET /api/salesman/get/:id - Get salesman by ID
    getSalesmanById: builder.query<Salesman, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Salesman', id }],
    }),

    // ✅ POST /api/salesman/create - Create salesman
    createSalesman: builder.mutation<
      { success: boolean; data: Salesman },
      CreateSalesmanRequest
    >({
      query: (newSalesman) => ({
        url: '/create',
        method: 'POST',
        body: newSalesman,
      }),
      invalidatesTags: ['Salesman'],
    }),

    // ✏️ PUT /api/salesman/put/:id - Update salesman
    updateSalesman: builder.mutation<
      { success: boolean; data: Salesman },
      UpdateSalesmanRequest
    >({
      query: ({ id, ...patch }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Salesman', id }],
    }),

    // ❌ DELETE /api/salesman/delete/:id - Delete salesman
    deleteSalesman: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Salesman'],
    }),
  }),
})

export const {
  useGetSalesmenQuery,
  useGetSalesmanByIdQuery,
  useCreateSalesmanMutation,
  useUpdateSalesmanMutation,
  useDeleteSalesmanMutation,
} = salesmanApi
