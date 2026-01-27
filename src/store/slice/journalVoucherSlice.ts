// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { 
//   CreateJournalVoucherRequest,
//   CoaAccount,
//   Currency
// } from '@/types/journalVoucher'

// // ✅ FIXED: LAN Support function
// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   } else {
//     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
//   }
// }

// export const journalVoucherApi = createApi({
//   reducerPath: 'journalVoucherApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: getApiBaseUrl(),
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json')
//       return headers
//     },
//   }),
//   tagTypes: ['JournalVoucher', 'CoaAccount', 'Currency'],
//   endpoints: (builder) => ({
//     // ✅ GET /api/journal-master/get-all
//     getJournalVouchers: builder.query<any[], void>({
//       query: () => '/journal-master/get-all',
//       providesTags: ['JournalVoucher'],
//       transformResponse: (response: any) => {
//         console.log('Journal Vouchers API Response:', response)
//         if (Array.isArray(response)) {
//           return response
//         } else if (response?.data && Array.isArray(response.data)) {
//           return response.data
//         } else {
//           return []
//         }
//       },
//     }),

//     // ✅ GET /api/journal-master/get/:id
//     getJournalVoucherById: builder.query<any, number>({
//       query: (id) => `/journal-master/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'JournalVoucher', id }],
//     }),

//     // ✅ POST /api/journal-master/create-complete
//     createJournalVoucher: builder.mutation<any, CreateJournalVoucherRequest>({
//       query: (journalData) => ({
//         url: '/journal-master/create-complete',
//         method: 'POST',
//         body: journalData,
//       }),
//       invalidatesTags: ['JournalVoucher'],
//     }),

//     // ✅ PUT /api/journal-master/update/:id
//     updateJournalVoucher: builder.mutation<any, { id: number } & any>({
//       query: ({ id, ...patch }) => ({
//         url: `/journal-master/update/${id}`,
//         method: 'PUT',
//         body: patch,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: 'JournalVoucher', id }],
//     }),

//     // ✅ DELETE /api/journal-master/delete/:id
//     deleteJournalVoucher: builder.mutation<any, number>({
//       query: (id) => ({
//         url: `/journal-master/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['JournalVoucher'],
//     }),

//     // ✅ GET /api/z-coa/get - FIXED FOR zCoaRecords STRUCTURE
//     getCoaAccounts: builder.query<CoaAccount[], void>({
//       query: () => '/z-coa/get',
//       providesTags: ['CoaAccount'],
//       transformResponse: (response: any) => {
//         console.log('🔍 COA API Full Response:', response)
//         console.log('🔍 COA Response Type:', typeof response)

//         let coaArray = []

//         // ✅ FIXED: Handle zCoaRecords structure
//         if (response?.zCoaRecords && Array.isArray(response.zCoaRecords)) {
//           console.log('✅ Found zCoaRecords array with length:', response.zCoaRecords.length)
//           coaArray = response.zCoaRecords
//         } else if (Array.isArray(response)) {
//           console.log('✅ Found direct array with length:', response.length)
//           coaArray = response
//         } else if (response?.data && Array.isArray(response.data)) {
//           console.log('✅ Found data array with length:', response.data.length)
//           coaArray = response.data
//         } else {
//           console.warn('❌ COA API returned unexpected structure:', response)
//           return []
//         }

//         // Transform and log each account
//         const transformedAccounts = coaArray.map((coa: any) => {
//           const transformed = {
//             id: coa.id,
//             acName: coa.acName,
//             acCode: coa.acCode || `COA-${coa.id}`,
//             isJvBalance: coa.isJvBalance === true || coa.isJvBalance === 1,
//             isPettyCash: coa.isPettyCash === true || coa.isPettyCash === 1,
//             // Include other fields
//             ch1Id: coa.ch1Id,
//             ch2Id: coa.ch2Id,
//             coaTypeId: coa.coaTypeId,
//             setupName: coa.setupName
//           }

//           console.log(`🏷️ COA ${coa.id}: ${coa.acName} - JV:${transformed.isJvBalance}, PC:${transformed.isPettyCash}`)
//           return transformed
//         })

//         console.log('✅ Total transformed COA accounts:', transformedAccounts.length)
//         console.log('✅ JV Balance accounts:', transformedAccounts.filter(a => a.isJvBalance).length)
//         console.log('✅ Petty Cash accounts:', transformedAccounts.filter(a => a.isPettyCash).length)

//         return transformedAccounts
//       },
//     }),

//     // ✅ GET /api/z-currency/get - All currencies
//     getCurrencies: builder.query<Currency[], void>({
//       query: () => '/z-currency/get',
//       providesTags: ['Currency'],
//       transformResponse: (response: any) => {
//         console.log('Currency API Response:', response)
//         if (Array.isArray(response)) {
//           return response
//         } else if (response?.data && Array.isArray(response.data)) {
//           return response.data
//         } else {
//           return []
//         }
//       },
//     }),
//   }),
// })

// // ✅ FIXED EXPORT
// export const {
//   useGetJournalVouchersQuery,
//   useGetJournalVoucherByIdQuery,
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useDeleteJournalVoucherMutation,
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
// } = journalVoucherApi

// export default journalVoucherApi














































// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import {
//   CreateJournalVoucherRequest,
//   CoaAccount,
//   Currency
// } from '@/types/journalVoucher'

// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   } else {
//     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
//   }
// }

// export const journalVoucherApi = createApi({
//   reducerPath: 'journalVoucherApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: getApiBaseUrl(),
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json')
//       return headers
//     },
//   }),
//   tagTypes: ['JournalVoucher', 'CoaAccount', 'Currency'],


//   endpoints: (builder) => ({


//     getJournalVoucherById: builder.query<any, number>({
//       query: (id) => `/journal-master/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'JournalVoucher', id }],
//       transformResponse: (response: any) => {
//         console.log('🔍 Edit Data Loaded:', response)
//         return response?.data || response
//       },
//     }),

//     updateJournalVoucher: builder.mutation<any, { id: number; master: any; details: any[] }>({
//       query: ({ id, master, details }) => ({
//         url: `/journal-master/update/${id}`,
//         method: 'PUT',
//         body: { master, details },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: 'JournalVoucher', id },
//         'JournalVoucher'
//       ],
//     }),

//     // ✅ EXISTING: Get all journal vouchers
//     getJournalVouchers: builder.query<any[], void>({
//       query: () => '/journal-master/get-all',
//       providesTags: ['JournalVoucher'],
//     }),

//     // ✅ NEW: Get journal vouchers by type (voucherTypeId = 10)
//     getJournalVouchersByType: builder.query<any[], void>({
//       query: () => '/journal-master/vtype/journal-vouchers',
//       providesTags: ['JournalVoucher'],
//       transformResponse: (response: any) => {
//         console.log('Journal Vouchers by Type Response:', response)
//         return response?.data || []
//       },
//     }),

//     // ✅ NEW: Get petty cash vouchers by type (voucherTypeId = 14)
//     getPettyCashVouchersByType: builder.query<any[], void>({
//       query: () => '/journal-master/vtype/petty-vouchers',
//       providesTags: ['JournalVoucher'],
//       transformResponse: (response: any) => {
//         console.log('Petty Cash Vouchers by Type Response:', response)
//         return response?.data || []
//       },
//     }),



//     // ✅ POST /api/journal-master/create-complete
//     createJournalVoucher: builder.mutation<any, CreateJournalVoucherRequest>({
//       query: (journalData) => ({
//         url: '/journal-master/create-complete',
//         method: 'POST',
//         body: journalData,
//       }),
//       invalidatesTags: ['JournalVoucher'],
//     }),


//     // ✅ DELETE /api/journal-master/delete/:id
//     deleteJournalVoucher: builder.mutation<any, number>({
//       query: (id) => ({
//         url: `/journal-master/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['JournalVoucher'],
//     }),

//     // ✅ NEW: Post/Unpost voucher functionality
//     postUnpostVoucher: builder.mutation<any, number>({
//       query: (id) => ({
//         url: `/journal-master/post-unpost/${id}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['JournalVoucher'],
//     }),

//     // ✅ GET /api/z-coa/get - FIXED FOR zCoaRecords
//     getCoaAccounts: builder.query<CoaAccount[], void>({
//       query: () => '/z-coa/get',
//       providesTags: ['CoaAccount'],
//       transformResponse: (response: any) => {
//         console.log('🔍 COA API Response:', response)

//         let coaArray = []

//         if (response?.zCoaRecords && Array.isArray(response.zCoaRecords)) {
//           coaArray = response.zCoaRecords
//         } else if (Array.isArray(response)) {
//           coaArray = response
//         } else {
//           console.warn('COA API returned unexpected format:', response)
//           return []
//         }

//         const transformed = coaArray.map((coa: any) => ({
//           id: coa.id,
//           acName: coa.acName,
//           acCode: coa.acCode || `COA-${coa.id}`,
//           isJvBalance: coa.isJvBalance === true,
//           isPettyCash: coa.isPettyCash === true,
//           ch1Id: coa.ch1Id,
//           ch2Id: coa.ch2Id,
//           coaTypeId: coa.coaTypeId,
//           setupName: coa.setupName
//         }))

//         console.log('✅ Total COA accounts:', transformed.length)
//         console.log('✅ JV Balance accounts:', transformed.filter(a => a.isJvBalance).length)
//         console.log('✅ Petty Cash accounts:', transformed.filter(a => a.isPettyCash).length)

//         return transformed
//       },
//     }),

//     // ✅ GET /api/z-currency/get
//     getCurrencies: builder.query<Currency[], void>({
//       query: () => '/z-currency/get',
//       providesTags: ['Currency'],
//       transformResponse: (response: any) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response?.data && Array.isArray(response.data)) {
//           return response.data
//         } else {
//           return []
//         }
//       },
//     }),
//   }),
// })

// // ✅ EXPORT ALL HOOKS INCLUDING NEW ONES
// export const {
//   useGetJournalVouchersQuery,
//   useGetJournalVouchersByTypeQuery, // ✅ NEW
//   useGetPettyCashVouchersByTypeQuery, // ✅ NEW
//   useGetJournalVoucherByIdQuery,
//   useCreateJournalVoucherMutation,
//   useUpdateJournalVoucherMutation,
//   useDeleteJournalVoucherMutation,
//   usePostUnpostVoucherMutation, // ✅ NEW
//   useGetCoaAccountsQuery,
//   useGetCurrenciesQuery,
// } = journalVoucherApi

// export default journalVoucherApi
































































// store/slice/journalVoucherSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { journalVoucherBaseQuery } from '@/lib/baseQuery';
import {
  CreateJournalVoucherRequest,
  CoaAccount,
  Currency
} from '@/types/journalVoucher';

export const journalVoucherApi = createApi({
  reducerPath: 'journalVoucherApi',
  baseQuery: journalVoucherBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['JournalVoucher', 'CoaAccount', 'Currency'],

  endpoints: (builder) => ({
    getJournalVoucherById: builder.query<any, number>({
      query: (id) => `/journal-master/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'JournalVoucher', id }],
      transformResponse: (response: any) => {
        console.log('🔍 Edit Data Loaded:', response);
        return response?.data || response;
      },
    }),

    updateJournalVoucher: builder.mutation<any, { id: number; master: any; details: any[] }>({
      query: ({ id, master, details }) => ({
        url: `/journal-master/update/${id}`,
        method: 'PUT',
        body: { master, details },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'JournalVoucher', id },
        'JournalVoucher'
      ],
    }),

    // ✅ Get all journal vouchers
    getJournalVouchers: builder.query<any[], void>({
      query: () => '/journal-master/get-all',
      providesTags: ['JournalVoucher'],
    }),

    // ✅ Get journal vouchers by type (voucherTypeId = 10)
    getJournalVouchersByType: builder.query<any[], void>({
      query: () => '/journal-master/vtype/journal-vouchers',
      providesTags: ['JournalVoucher'],
      transformResponse: (response: any) => {
        console.log('Journal Vouchers by Type Response:', response);
        return response?.data || [];
      },
    }),

    // ✅ Get petty cash vouchers by type (voucherTypeId = 14)
    getPettyCashVouchersByType: builder.query<any[], void>({
      query: () => '/journal-master/vtype/petty-vouchers',
      providesTags: ['JournalVoucher'],
      transformResponse: (response: any) => {
        console.log('Petty Cash Vouchers by Type Response:', response);
        return response?.data || [];
      },
    }),

    // ✅ POST /api/journal-master/create-complete
    createJournalVoucher: builder.mutation<any, CreateJournalVoucherRequest>({
      query: (journalData) => ({
        url: '/journal-master/create-complete',
        method: 'POST',
        body: journalData,
      }),
      invalidatesTags: ['JournalVoucher'],
    }),

    // ✅ DELETE /api/journal-master/delete/:id
    deleteJournalVoucher: builder.mutation<any, number>({
      query: (id) => ({
        url: `/journal-master/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JournalVoucher'],
    }),

    // ✅ Post/Unpost voucher functionality
    postUnpostVoucher: builder.mutation<any, number>({
      query: (id) => ({
        url: `/journal-master/post-unpost/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['JournalVoucher'],
    }),

    // ✅ GET /api/z-coa/get
    getCoaAccounts: builder.query<CoaAccount[], void>({
      query: () => '/z-coa/get',
      providesTags: ['CoaAccount'],
      transformResponse: (response: any) => {
        console.log('🔍 COA API Response:', response);

        let coaArray = [];

        if (response?.zCoaRecords && Array.isArray(response.zCoaRecords)) {
          coaArray = response.zCoaRecords;
        } else if (Array.isArray(response)) {
          coaArray = response;
        } else {
          console.warn('COA API returned unexpected format:', response);
          return [];
        }

        const transformed = coaArray.map((coa: any) => ({
          id: coa.id,
          acName: coa.acName,
          acCode: coa.acCode || `COA-${coa.id}`,
          isJvBalance: coa.isJvBalance === true,
          isPettyCash: coa.isPettyCash === true,
          ch1Id: coa.ch1Id,
          ch2Id: coa.ch2Id,
          coaTypeId: coa.coaTypeId,
          setupName: coa.setupName
        }));

        console.log('✅ Total COA accounts:', transformed.length);
        console.log('✅ JV Balance accounts:', transformed.filter((a: any) => a.isJvBalance).length);
        console.log('✅ Petty Cash accounts:', transformed.filter((a: any) => a.isPettyCash).length);

        return transformed;
      },
    }),

    // ✅ GET /api/z-currency/get
    getCurrencies: builder.query<Currency[], void>({
      query: () => '/z-currency/get',
      providesTags: ['Currency'],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response?.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          return [];
        }
      },
    }),

    // Add this endpoint
    // getBFRF: builder.query({
    //   query: (coaId) => `/journal-master/reports/get_BF_RF${coaId ? `?coaId=${coaId}` : ''}`,
    //   transformResponse: (response: any) => {
    //     if (!response.success) return { bf: 0, cf: 0, data: [] }

    //     const details = response.data?.flatMap((entry: any) => entry.details || []) || []

    //     // Calculate BF = Sum(Debit) - Sum(Credit)
    //     const totalDebit = details.reduce((sum: number, d: any) => sum + (parseFloat(d.amountDb) || 0), 0)
    //     const totalCredit = details.reduce((sum: number, d: any) => sum + (parseFloat(d.amountCr) || 0), 0)
    //     const bf = totalDebit - totalCredit

    //     return {
    //       bf: bf,
    //       totalDebit,
    //       totalCredit,
    //       upToDate: response.upToDate,
    //       count: response.count,
    //       data: response.data
    //     }
    //   }
    // }),
    // Add this endpoint to your journalVoucherApi

    // getBFRF: builder.query({
    //   query: (coaId) => `/journal-master/reports/get_BF_RF${coaId ? `?coaId=${coaId}` : ''}`,
    //   transformResponse: (response: any) => {
    //     if (!response.success) {
    //       return {
    //         bf: 0,
    //         allTotals: { debit: 0, credit: 0, difference: 0 },
    //         coaTotals: null,
    //         coaDetails: [],
    //         upToDate: null,
    //         count: 0,
    //         data: []
    //       }
    //     }

    //     return {
    //       bf: response.bf || 0,
    //       allTotals: response.allTotals || { debit: 0, credit: 0, difference: 0 },
    //       coaTotals: response.coaTotals || null,
    //       coaDetails: response.coaDetails || [],
    //       coaDetailsCount: response.coaDetailsCount || 0,
    //       upToDate: response.upToDate,
    //       coaId: response.coaId,
    //       count: response.count,
    //       data: response.data
    //     }
    //   }
    // }),





    // ✅ Updated getBFRF endpoint
getBFRF: builder.query({
  query: ({ coaId, mode, upToDate, excludeId }) => {
    let url = `/journal-master/reports/get_BF_RF?`;
    const params = [];
    
    if (coaId) params.push(`coaId=${coaId}`);
    if (mode) params.push(`mode=${mode}`);
    if (upToDate) params.push(`upToDate=${upToDate}`);
    if (excludeId) params.push(`excludeId=${excludeId}`);
    
    return url + params.join('&');
  },
  transformResponse: (response: any) => {
    if (!response.success) {
      return {
        bf: 0,
        allTotals: { debit: 0, credit: 0, difference: 0 },
        coaTotals: null,
        coaDetails: [],
        upToDate: null,
        count: 0,
        data: []
      }
    }

    return {
      bf: response.bf || 0,
      allTotals: response.allTotals || { debit: 0, credit: 0, difference: 0 },
      coaTotals: response.coaTotals || null,
      coaDetails: response.coaDetails || [],
      coaDetailsCount: response.coaDetailsCount || 0,
      upToDate: response.upToDate,
      excludedId: response.excludedId,
      mode: response.mode,
      coaId: response.coaId,
      count: response.count,
      data: response.data
    }
  }
}),





  }),
});

export const {
  useGetJournalVouchersQuery,
  useGetJournalVouchersByTypeQuery,
  useGetPettyCashVouchersByTypeQuery,
  useGetJournalVoucherByIdQuery,
  useCreateJournalVoucherMutation,
  useUpdateJournalVoucherMutation,
  useDeleteJournalVoucherMutation,
  usePostUnpostVoucherMutation,
  useGetCoaAccountsQuery,
  useGetCurrenciesQuery,
  useGetBFRFQuery
} = journalVoucherApi;

export default journalVoucherApi;
