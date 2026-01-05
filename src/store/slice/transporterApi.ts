// store/api/transporterApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
}

export const transporterApi = createApi({
  reducerPath: 'transporterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getApiBaseUrl()}/transporter`,
  }),
  tagTypes: ['Transporter'],
  endpoints: (builder) => ({
    // ✅ Get all transporters (with optional pagination & search)
    getAllTransporters: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 50, search = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        })
        return `/?${params}`
      },
      providesTags: ['Transporter'],
    }),
    
    // ✅ Get single transporter by ID
    getTransporterById: builder.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: ['Transporter'],
    }),
    
    // ✅ Create new transporter
    createTransporter: builder.mutation<any, any>({
      query: (transporterData) => ({
        url: '/',
        method: 'POST',
        body: transporterData,
      }),
      invalidatesTags: ['Transporter'],
    }),
    
    // ✅ Update transporter
    updateTransporter: builder.mutation<any, { id: string | number; data: any }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Transporter'],
    }),
    
    // ✅ Delete/Deactivate transporter
    deleteTransporter: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transporter'],
    }),
    
    // ✅ Restore transporter
    restoreTransporter: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Transporter'],
    }),
  }),
})

export const {
  useGetAllTransportersQuery,
  useGetTransporterByIdQuery,
  useCreateTransporterMutation,
  useUpdateTransporterMutation,
  useDeleteTransporterMutation,
  useRestoreTransporterMutation,
} = transporterApi
