// // store/slice/reports/reportApi.ts

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { getApiBaseUrl } from '@/lib/apiConfig';

// // ✅ Types
// interface ReportFilters {
//   dateFrom: string;
//   dateTo: string;
//   uom: '1' | '2' | '3';
//   coaId?: number | null;
//   itemIds?: number[];
// }

// interface ReportItem {
//   itemId: number;
//   itemName: string;
//   orderQty: number;
//   dispatchQty: number;
//   difference: number;
//   uomName: string;
//   status: 'Complete' | 'Partial' | 'Pending' | 'Over Dispatch';
// }

// interface OrderTotals {
//   totalOrderQty: number;
//   totalDispatchQty: number;
//   totalDifference: number;
// }

// interface OrderData {
//   orderId: number;
//   orderNumber: string;
//   orderDate: string;
//   orderStatus: string;
//   customerName: string;
//   customerCity: string;
//   subCustomer: string;
//   subCity: string;
//   gdnNumbers: string[];
//   items: ReportItem[];
//   orderTotals: OrderTotals;
// }

// interface GrandTotals {
//   totalOrders: number;
//   totalOrderQty: number;
//   totalDispatchQty: number;
//   totalDifference: number;
// }

// interface ReportResponse {
//   success: boolean;
//   data: OrderData[];
//   grandTotals: GrandTotals;
//   filters: ReportFilters;
// }

// export const reportApi = createApi({
//   reducerPath: 'reportApi',
//   baseQuery: fetchBaseQuery({ 
//     baseUrl: getApiBaseUrl('/reports')
//   }),
//   tagTypes: ['Reports'],
//   endpoints: (builder) => ({
//     getItemOrderDispatchReport: builder.query<ReportResponse, ReportFilters>({
//       query: (filters) => {
//         const params = new URLSearchParams({
//           dateFrom: filters.dateFrom,
//           dateTo: filters.dateTo,
//           uom: filters.uom
//         });
        
//         if (filters.coaId) params.append('coaId', String(filters.coaId));
//         if (filters.itemIds?.length) params.append('itemIds', filters.itemIds.join(','));
        
//         return `/item-order-dispatch?${params.toString()}`;
//       },
//       providesTags: ['Reports']
//     })
//   })
// });

// export const { 
//   useGetItemOrderDispatchReportQuery, 
//   useLazyGetItemOrderDispatchReportQuery 
// } = reportApi;

// // ✅ Export types for use in hook/page
// export type { ReportFilters, ReportItem, OrderData, GrandTotals, ReportResponse };















































// store/slice/reports/reportApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '@/lib/apiConfig';

// ✅ Types
interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  uom: '1' | '2' | '3';
  coaId?: number | null;
  itemIds?: number[];
}

interface CustomerItem {
  orderNumber: string;
  orderDate: string;
  orderStatus: string;  // ✅ Add Order Status
  itemId: number;
  itemName: string;
  orderQty: number;
  dispatchQty: number;
  difference: number;
  uomName: string;
  itemStatus: 'Complete' | 'Partial' | 'Pending' | 'Over Dispatch';
}

interface CustomerTotals {
  totalOrderQty: number;
  totalDispatchQty: number;
  totalDifference: number;
}

interface CustomerData {
  customerId: number;
  customerName: string;
  customerCity: string;
  items: CustomerItem[];
  customerTotals: CustomerTotals;
}

interface GrandTotals {
  totalCustomers: number;
  totalOrders: number;
  totalOrderQty: number;
  totalDispatchQty: number;
  totalDifference: number;
}

interface ReportResponse {
  success: boolean;
  data: CustomerData[];
  grandTotals: GrandTotals;
  filters: ReportFilters;
}

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getApiBaseUrl('/reports')
  }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getItemOrderDispatchReport: builder.query<ReportResponse, ReportFilters>({
      query: (filters) => {
        const params = new URLSearchParams({
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          uom: filters.uom
        });
        
        if (filters.coaId) params.append('coaId', String(filters.coaId));
        if (filters.itemIds?.length) params.append('itemIds', filters.itemIds.join(','));
        
        return `/item-order-dispatch?${params.toString()}`;
      },
      providesTags: ['Reports']
    })
  })
});

export const { 
  useGetItemOrderDispatchReportQuery, 
  useLazyGetItemOrderDispatchReportQuery 
} = reportApi;

// ✅ Export types
export type { ReportFilters, CustomerItem, CustomerData, GrandTotals, ReportResponse };
