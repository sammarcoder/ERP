
// import { createApi } from '@reduxjs/toolkit/query/react'
// import { currencyBaseQuery } from '@/lib/baseQuery'  //  Import centralized base query
// import { Currency, CreateCurrencyRequest, UpdateCurrencyRequest } from '@/types/currency'

// //  Clean slice - no token logic needed here!
// export const currencyApi = createApi({
//   reducerPath: 'currencyApi',
//   baseQuery: currencyBaseQuery,  //  Use centralized base query
//   tagTypes: ['Currency'],
//   endpoints: (builder) => ({
//     // GET /api/z-currency/get - Requires: currency:read
//     getCurrencies: builder.query<Currency[], void>({
//       query: () => '/get',
//       providesTags: ['Currency'],
//       transformResponse: (response: any) => {
//         console.log('📊 Currency API Response:', response)
//         return Array.isArray(response) ? response : response?.data || []
//       },
//     }),

//     // GET /api/z-currency/get/:id - Requires: currency:read
//     getCurrencyById: builder.query<Currency, number>({
//       query: (id) => `/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Currency', id }],
//     }),

//     // POST /api/z-currency/create - Requires: currency:write
//     createCurrency: builder.mutation<{ success: boolean; data: Currency }, CreateCurrencyRequest>({
//       query: (newCurrency) => ({
//         url: '/create',
//         method: 'POST',
//         body: newCurrency,
//       }),
//       invalidatesTags: ['Currency'],
//       onQueryStarted: async (arg, { queryFulfilled }) => {
//         try {
//           const result = await queryFulfilled
//           console.log(' Currency created successfully:', result.data)
//         } catch (error) {
//           console.error('❌ Currency creation failed:', error)
//         }
//       }
//     }),

//     // PUT /api/z-currency/put/:id - Requires: currency:write
//     updateCurrency: builder.mutation<{ success: boolean; data: Currency }, UpdateCurrencyRequest>({
//       query: ({ id, ...patch }) => ({
//         url: `/put/${id}`,
//         method: 'PUT',
//         body: patch,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: 'Currency', id }],
//     }),

//     // DELETE /api/z-currency/delete/:id - Requires: currency:delete
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



















































// store/slice/currencySlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { currencyBaseQuery } from '@/lib/baseQuery';

// Types
export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol?: string;
  exchangeRate?: number;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCurrencyRequest {
  name: string;
  code: string;
  symbol?: string;
  exchangeRate?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateCurrencyRequest {
  id: number;
  name?: string;
  code?: string;
  symbol?: string;
  exchangeRate?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export const currencyApi = createApi({
  reducerPath: 'currencyApi',
  baseQuery: currencyBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['Currency'],
  endpoints: (builder) => ({
    // GET /api/z-currency/get
    getCurrencies: builder.query<Currency[], void>({
      query: () => '/get',
      providesTags: ['Currency'],
      transformResponse: (response: any) => {
        console.log('📊 Currency API Response:', response);
        return Array.isArray(response) ? response : response?.data || [];
      },
    }),

    // GET /api/z-currency/get/:id
    getCurrencyById: builder.query<Currency, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Currency', id }],
    }),

    // POST /api/z-currency/create
    createCurrency: builder.mutation<{ success: boolean; data: Currency }, CreateCurrencyRequest>({
      query: (newCurrency) => ({
        url: '/create',
        method: 'POST',
        body: newCurrency,
      }),
      invalidatesTags: ['Currency'],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log('✅ Currency created successfully:', result.data);
        } catch (error) {
          console.error('❌ Currency creation failed:', error);
        }
      },
    }),

    // PUT /api/z-currency/put/:id
    updateCurrency: builder.mutation<{ success: boolean; data: Currency }, UpdateCurrencyRequest>({
      query: ({ id, ...patch }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Currency', id }, 'Currency'],
    }),

    // DELETE /api/z-currency/delete/:id
    deleteCurrency: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Currency'],
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetCurrencyByIdQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = currencyApi;
