// // store/slice/lcVoucherSlice.ts

// import { createApi } from '@reduxjs/toolkit/query/react';
// import { lcVoucherBaseQuery } from '@/lib/baseQuery';

// // =============================================
// // TYPES
// // =============================================

// interface Coa {
//   id: number
//   acCode?: string
//   acName: string
// }

// interface ZlcvRow {
//   id: number
//   coaId: number | null
//   description: string
//   order: number
//   status: boolean
//   isCost: boolean
//   isDb: boolean
//   coa?: Coa
// }

// interface LcVoucherDetail {
//   lineId?: number
//   coaId: number | null
//   description: string
//   recieptNo?: string
//   currencyId?: number | null
//   rate?: number
//   ownDb?: number
//   ownCr?: number
//   amountDb: number
//   amountCr: number
//   idCard?: string
//   bank?: string
//   bankDate?: string | null
//   isCost: boolean
//   status: boolean
//   coa?: Coa
// }

// interface LcVoucherMaster {
//   id?: number
//   voucherNo: string
//   date: string
//   coaId: number
//   voucherTypeId: number
//   status: number
//   details?: LcVoucherDetail[]
//   createdAt?: string
//   updatedAt?: string
// }

// interface ZlcvListResponse {
//   success: boolean
//   data: ZlcvRow[]
// }

// interface CoaCheckResponse {
//   success: boolean
//   isUsed: boolean
//   message: string
//   existingVoucher?: {
//     id: number
//     voucherNo: string
//     date: string
//   }
// }

// interface LcVoucherResponse {
//   success: boolean
//   data: LcVoucherMaster
//   message?: string
// }

// interface LcVouchersListResponse {
//   success: boolean
//   total: number
//   page: number
//   totalPages: number
//   data: LcVoucherMaster[]
// }

// // =============================================
// // API SLICE
// // =============================================

// export const lcVoucherApi = createApi({
//   reducerPath: 'lcVoucherApi',
//   baseQuery: lcVoucherBaseQuery,
//   tagTypes: ['LcVoucher', 'Zlcv'],
//   endpoints: (builder) => ({
    
//     // ✅ GET ZLCV template rows (status = true, sorted by order)
//     getZlcvTemplate: builder.query<ZlcvListResponse, void>({
//       query: () => '/zlcv?status=true&sortBy=order&sortOrder=ASC',
//       providesTags: ['Zlcv']
//     }),

//     // ✅ GET ALL LC VOUCHERS (voucherTypeId = 13)
//     getLcVouchers: builder.query<LcVoucherMaster[], void>({
//       query: () => '/journal-master/get-all?voucherTypeId=13',
//       providesTags: ['LcVoucher'],
//       transformResponse: (response: LcVouchersListResponse) => {
//         console.log('📋 LC Vouchers Response:', response);
//         return response?.data || [];
//       }
//     }),

//     // ✅ CHECK COA usage for LC voucher (voucherTypeId = 13)
//     checkCoaUsage: builder.query<CoaCheckResponse, { coaId: number; excludeId?: number }>({
//       query: ({ coaId, excludeId }) => {
//         let url = `/journal-master/check-coa-lc?coaId=${coaId}&voucherTypeId=13`;
//         if (excludeId) url += `&excludeId=${excludeId}`;
//         return url;
//       }
//     }),

//     // ✅ GET LC voucher by ID
//     getLcVoucherById: builder.query<LcVoucherResponse, number>({
//       query: (id) => `/journal-master/get/${id}`,
//       providesTags: (result, error, id) => [{ type: 'LcVoucher', id }],
//       transformResponse: (response: any) => {
//         console.log('🔍 LC Voucher Edit Data:', response);
//         return {
//           success: true,
//           data: response?.data || response
//         };
//       }
//     }),

//     // ✅ CREATE LC voucher
//     createLcVoucher: builder.mutation<LcVoucherResponse, any>({
//       query: (data) => {
//         console.log('📤 LC Create Payload:', data);
//         return {
//           url: '/journal-master/create-complete',
//           method: 'POST',
//           body: {
//             master: {
//               voucherNo: data.voucherNo,
//               date: data.date,
//               coaId: data.coaId,
//               voucherTypeId: 13,
//               status: data.status
//             },
//             details: data.details
//           }
//         };
//       },
//       invalidatesTags: ['LcVoucher']
//     }),

//     // ✅ UPDATE LC voucher
//     updateLcVoucher: builder.mutation<LcVoucherResponse, any>({
//       query: ({ id, ...data }) => {
//         console.log('📤 LC Update Payload:', { id, ...data });
//         return {
//           url: `/journal-master/update/${id}`,
//           method: 'PUT',
//           body: {
//             master: {
//               voucherNo: data.voucherNo,
//               date: data.date,
//               coaId: data.coaId,
//               voucherTypeId: 13,
//               status: data.status
//             },
//             details: data.details
//           }
//         };
//       },
//       invalidatesTags: ['LcVoucher']
//     }),

//     // ✅ DELETE LC voucher
//     deleteLcVoucher: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/journal-master/delete/${id}`,
//         method: 'DELETE'
//       }),
//       invalidatesTags: ['LcVoucher']
//     }),

//     // ✅ POST/UNPOST LC voucher
//     postUnpostLcVoucher: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/journal-master/post-unpost/${id}`,
//         method: 'PUT'
//       }),
//       invalidatesTags: ['LcVoucher']
//     })
//   })
// });

// export const {
//   useGetZlcvTemplateQuery,
//   useLazyGetZlcvTemplateQuery,
//   useGetLcVouchersQuery,
//   useCheckCoaUsageQuery,
//   useLazyCheckCoaUsageQuery,
//   useGetLcVoucherByIdQuery,
//   useCreateLcVoucherMutation,
//   useUpdateLcVoucherMutation,
//   useDeleteLcVoucherMutation,
//   usePostUnpostLcVoucherMutation
// } = lcVoucherApi;










































// store/slice/lcVoucherSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { lcVoucherBaseQuery } from '@/lib/baseQuery';

// =============================================
// TYPES
// =============================================

interface ZlcvRow {
  id: number
  coaId: number | null
  description: string
  order: number
  status: boolean
  isCost: boolean
  isDb: boolean
  coa?: {
    id: number
    acCode?: string
    acName: string
  }
}

interface LcVoucherDetail {
  lineId?: number
  coaId: number | null
  description: string
  recieptNo?: string
  currencyId?: number | null
  rate?: number
  ownDb?: number
  ownCr?: number
  amountDb: number
  amountCr: number
  idCard?: string
  bank?: string
  bankDate?: string | null
  isCost: boolean
  status: boolean
  coa?: {
    id: number
    acCode?: string
    acName: string
  }
}

interface LcVoucherMaster {
  id?: number
  voucherNo: string
  date: string
  coaId: number
  voucherTypeId: number
  status: number | boolean
  details?: LcVoucherDetail[]
  coa?: {
    id: number
    acCode?: string
    acName: string
  }
  createdAt?: string
  updatedAt?: string
}

interface CoaCheckResponse {
  success: boolean
  isUsed: boolean
  message: string
  existingVoucher?: {
    id: number
    voucherNo: string
    date: string
  }
}

// =============================================
// API SLICE
// =============================================

export const lcVoucherApi = createApi({
  reducerPath: 'lcVoucherApi',
  baseQuery: lcVoucherBaseQuery,
  tagTypes: ['LcVoucher', 'Zlcv'],
  endpoints: (builder) => ({

    // 1. ✅ GET ZLCV template rows
    getZlcvTemplate: builder.query<{ success: boolean; data: ZlcvRow[] }, void>({
      query: () => '/zlcv?status=true&sortBy=order&sortOrder=ASC',
      providesTags: ['Zlcv']
    }),

    // 2. ✅ LAZY GET ZLCV template rows
    // (Auto-generated as useLazyGetZlcvTemplateQuery)

    // 3. ✅ GET ALL LC VOUCHERS (voucherTypeId = 13)
    getLcVouchers: builder.query<LcVoucherMaster[], void>({
      query: () => '/journal-master/get-all?voucherTypeId=13',
      providesTags: ['LcVoucher'],
      transformResponse: (response: any) => {
        console.log('📋 LC Vouchers Response:', response);
        return response?.data || [];
      }
    }),

    // 4. ✅ CHECK COA usage for LC voucher
    checkCoaUsage: builder.query<CoaCheckResponse, { coaId: number; excludeId?: number }>({
      query: ({ coaId, excludeId }) => {
        let url = `/journal-master/check-coa-lc?coaId=${coaId}&voucherTypeId=13`;
        if (excludeId) url += `&excludeId=${excludeId}`;
        return url;
      }
    }),

    // 5. ✅ LAZY CHECK COA usage
    // (Auto-generated as useLazyCheckCoaUsageQuery)

    // 6. ✅ GET LC voucher by ID
    getLcVoucherById: builder.query<{ success: boolean; data: LcVoucherMaster }, number>({
      query: (id) => `/journal-master/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'LcVoucher', id }]
    }),

    // 7. ✅ CREATE LC voucher
    createLcVoucher: builder.mutation<any, any>({
      query: (data) => {
        console.log('📤 LC Create Payload:', data);
        return {
          url: '/journal-master/create-complete',
          method: 'POST',
          body: {
            master: {
              voucherNo: data.voucherNo,
              date: data.date,
              coaId: data.coaId,
              voucherTypeId: 13,
              status: data.status
            },
            details: data.details
          }
        };
      },
      invalidatesTags: ['LcVoucher']
    }),

    // 8. ✅ UPDATE LC voucher
    updateLcVoucher: builder.mutation<any, any>({
      query: ({ id, ...data }) => {
        console.log('📤 LC Update Payload:', { id, ...data });
        return {
          url: `/journal-master/update/${id}`,
          method: 'PUT',
          body: {
            master: {
              voucherNo: data.voucherNo,
              date: data.date,
              coaId: data.coaId,
              voucherTypeId: 13,
              status: data.status
            },
            details: data.details
          }
        };
      },
      invalidatesTags: ['LcVoucher']
    }),

    // 9. ✅ DELETE LC voucher
    deleteLcVoucher: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/journal-master/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['LcVoucher']
    }),

    // 10. ✅ POST/UNPOST LC voucher
    postUnpostLcVoucher: builder.mutation<any, number>({
      query: (id) => ({
        url: `/journal-master/post-unpost/${id}`,
        method: 'POST'  // Same as journalVoucherSlice
      }),
      invalidatesTags: ['LcVoucher']
    })
  })
});

// ✅ ALL 10 HOOKS EXPORTED
export const {
  useGetZlcvTemplateQuery,            
  useLazyGetZlcvTemplateQuery,        
  useGetLcVouchersQuery,              
  useCheckCoaUsageQuery,              
  useLazyCheckCoaUsageQuery,          
  useGetLcVoucherByIdQuery,           
  useCreateLcVoucherMutation,         
  useUpdateLcVoucherMutation,         
  useDeleteLcVoucherMutation,         
  usePostUnpostLcVoucherMutation      
} = lcVoucherApi;
