// store/slice/grnApi.ts - GRN API SLICE
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
}

export const grnApi = createApi({
  reducerPath: 'grnApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getApiBaseUrl()}/grn`,
  }),
  tagTypes: ['GRN', 'Order'],
  endpoints: (builder) => ({
    // ✅ GET all GRNs
    getAllGRNs: builder.query<any, {
      status?: string
      dateFrom?: string
      dateTo?: string
      supplierId?: string
      page?: number
      limit?: number
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()
        
        if (params.status && params.status !== 'all') queryParams.append('status', params.status)
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
        if (params.dateTo) queryParams.append('dateTo', params.dateTo)
        if (params.supplierId) queryParams.append('supplierId', params.supplierId)
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        
        return `/?${queryParams}`
      },
      providesTags: ['GRN'],
    }),

    // ✅ GET single GRN by ID
    getGRNById: builder.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'GRN', id }],
    }),

    // ✅ CREATE new GRN
    createGRN: builder.mutation<any, { stockMain: any; stockDetails: any[] }>({
      query: (grnData) => ({
        url: '/',
        method: 'POST',
        body: grnData,
      }),
      invalidatesTags: ['GRN', 'Order'], // ✅ Invalidate both GRN and Order cache
    }),

    // ✅ UPDATE existing GRN
    updateGRN: builder.mutation<any, { id: string | number; stockMain: any; stockDetails: any[] }>({
      query: ({ id, ...grnData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: grnData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'GRN', id },
        { type: 'GRN', id: 'LIST' },
        'Order'
      ],
    }),

    // ✅ DELETE GRN
    deleteGRN: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GRN', 'Order'], // ✅ Invalidate both after deletion
    }),
  }),
})

export const {
  useGetAllGRNsQuery,
  useGetGRNByIdQuery,
  useCreateGRNMutation,
  useUpdateGRNMutation,
  useDeleteGRNMutation,
} = grnApi
