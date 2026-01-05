// store/slice/gdnApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
}

export const gdnApi2 = createApi({
  reducerPath: 'gdnApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${getApiBaseUrl()}/gdn` }),
  tagTypes: ['GDN', 'Order'],
  endpoints: (builder) => ({
    // Get all GDNs
    getAllGDNs: builder.query<any, {
      status?: string
      dateFrom?: string
      dateTo?: string
      customerId?: string
      page?: number
      limit?: number
    }>({
      query: (params = {}) => {
        const q = new URLSearchParams()
        if (params.status && params.status !== 'all') q.append('status', params.status)
        if (params.dateFrom) q.append('dateFrom', params.dateFrom)
        if (params.dateTo) q.append('dateTo', params.dateTo)
        if (params.customerId) q.append('customerId', params.customerId)
        if (params.page) q.append('page', params.page.toString())
        if (params.limit) q.append('limit', params.limit.toString())
        return `/?${q.toString()}`
      },
      providesTags: ['GDN'],
    }),

    // Get single GDN
    getGDNById: builder.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'GDN', id }],
    }),

    // Create GDN
    createGDN: builder.mutation<any, { stockMain: any; stockDetails: any[] }>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GDN', 'Order'],
    }),

    // Update GDN
    updateGDN: builder.mutation<any, { id: string | number; stockMain: any; stockDetails: any[] }>({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GDN', 'Order'],
    }),

    // Delete GDN
    deleteGDN: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GDN', 'Order'],
    }),
  }),
})

export const {
  useGetAllGDNsQuery,
  useGetGDNByIdQuery,
  useCreateGDNMutation,
  useUpdateGDNMutation,
  useDeleteGDNMutation,
} = gdnApi2
