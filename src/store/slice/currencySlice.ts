// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { Currency, CreateCurrencyRequest, UpdateCurrencyRequest } from '@/types/currency'

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:4000/api/z-currency`

// export const currencyApi = createApi({
//   reducerPath: 'currencyApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json')
//       return headers
//     },
//   }),
//   tagTypes: ['Currency'],
//   endpoints: (builder) => ({
//     // 📥 GET /api/z-currency/get - Get all currencies
//     getCurrencies: builder.query<Currency[], void>({
//       query: () => '/get',
//       providesTags: ['Currency'],
//       transformResponse: (response: any) => {
//         return Array.isArray(response) ? response : response?.data || []
//       },
//     }),

//     // 📄 GET /api/z-currency/get/:id - Get currency by ID
//     getCurrencyById: builder.query<Currency, number>({
//       query: (id) => `/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Currency', id }],
//     }),

//     // ✅ POST /api/z-currency/create - Create currency
//     createCurrency: builder.mutation<{ success: boolean; data: Currency }, CreateCurrencyRequest>({
//       query: (newCurrency) => ({
//         url: '/create',
//         method: 'POST',
//         body: newCurrency,
//       }),
//       invalidatesTags: ['Currency'],
//     }),

//     // ✏️ PUT /api/z-currency/put/:id - Update currency
//     updateCurrency: builder.mutation<{ success: boolean; data: Currency }, UpdateCurrencyRequest>({
//       query: ({ id, ...patch }) => ({
//         url: `/put/${id}`,
//         method: 'PUT',
//         body: patch,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: 'Currency', id }],
//     }),

//     // ❌ DELETE /api/z-currency/delete/:id - Delete currency
//     deleteCurrency: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Currency'],
//     }),
//   }),
// })

// export const {
//   useGetCurrenciesQuery,
//   useGetCurrencyByIdQuery,
//   useCreateCurrencyMutation,
//   useUpdateCurrencyMutation,
//   useDeleteCurrencyMutation,
// } = currencyApi
























































import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Currency, CreateCurrencyRequest, UpdateCurrencyRequest } from '@/types/currency'

// ✅ Dynamic base URL (LAN + localhost safe, like journalVoucherApi)
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api/z-currency`
  } else {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/z-currency'
  }
}

export const currencyApi = createApi({
  reducerPath: 'currencyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Currency'],
  endpoints: (builder) => ({
    // 📥 GET /api/z-currency/get - Get all currencies
    getCurrencies: builder.query<Currency[], void>({
      query: () => '/get',
      providesTags: ['Currency'],
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.data || []
      },
    }),

    // 📄 GET /api/z-currency/get/:id - Get currency by ID
    getCurrencyById: builder.query<Currency, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Currency', id }],
    }),

    // ✅ POST /api/z-currency/create - Create currency
    createCurrency: builder.mutation<{ success: boolean; data: Currency }, CreateCurrencyRequest>({
      query: (newCurrency) => ({
        url: '/create',
        method: 'POST',
        body: newCurrency,
      }),
      invalidatesTags: ['Currency'],
    }),

    // ✏️ PUT /api/z-currency/put/:id - Update currency
    updateCurrency: builder.mutation<{ success: boolean; data: Currency }, UpdateCurrencyRequest>({
      query: ({ id, ...patch }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Currency', id }],
    }),

    // ❌ DELETE /api/z-currency/delete/:id - Delete currency
    deleteCurrency: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Currency'],
    }),
  }),
})

// ✅ Export hooks for usage in components
export const {
  useGetCurrenciesQuery,
  useGetCurrencyByIdQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = currencyApi
