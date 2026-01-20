// // lib/baseQuery.ts

// import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
// import { getApiPort } from '@/lib/apiConfig';

// // ═══════════════════════════════════════════════════════════════
// // ✅ Get Dynamic Base URL
// // ═══════════════════════════════════════════════════════════════
// const getDynamicBaseUrl = (endpoint: string): string => {
//   const port = getApiPort();
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:${port}/api${endpoint}`;
//   }
//   return `http://localhost:${port}/api${endpoint}`;
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ Create Dynamic Base Query (Working Version)
// // ═══════════════════════════════════════════════════════════════
// export const createDynamicBaseQuery = (endpoint: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
//   return async (args, api, extraOptions) => {
//     const baseUrl = getDynamicBaseUrl(endpoint);
    
//     const rawBaseQuery = fetchBaseQuery({
//       baseUrl,
//       prepareHeaders: (headers, { getState }) => {
//         headers.set('Content-Type', 'application/json');
        
//         // Add auth token if available
//         const token = (getState() as any).auth?.token;
//         if (token) {
//           headers.set('Authorization', `Bearer ${token}`);
//         }
//         return headers;
//       },
//     });
    
//     return rawBaseQuery(args, api, extraOptions);
//   };
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ Create Base Query With Auth (For legacy support)
// // ═══════════════════════════════════════════════════════════════
// export const createBaseQueryWithAuth = (baseUrl: string) => {
//   return fetchBaseQuery({
//     baseUrl,
//     prepareHeaders: (headers, { getState }) => {
//       headers.set('Content-Type', 'application/json');
      
//       const token = (getState() as any).auth?.token;
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   });
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ Pre-defined base queries for all slices
// // ═══════════════════════════════════════════════════════════════

// // Basic CRUD APIs with /z- prefix
// export const currencyBaseQuery = createDynamicBaseQuery('/z-currency');
// export const uomBaseQuery = createDynamicBaseQuery('/z-uom');
// export const coaBaseQuery = createDynamicBaseQuery('/z-coa');
// export const itemBaseQuery = createDynamicBaseQuery('/z-item');
// export const itemsBaseQuery = createDynamicBaseQuery('/z-items');
// export const itemClassBaseQuery = createDynamicBaseQuery('/z-item-class');
// export const stockBaseQuery = createDynamicBaseQuery('/z-stock');
// // export const orderBaseQuery = createDynamicBaseQuery('/z-order');
// export const carriageBaseQuery = createDynamicBaseQuery('/z-carriage');
// export const batchBaseQuery = createDynamicBaseQuery('/z-batch');
// export const salesmanBaseQuery = createDynamicBaseQuery('/z-salesman');
// export const journalVoucherBaseQuery = createDynamicBaseQuery('/z-journal-voucher');

// // APIs without /z- prefix
// export const transporterBaseQuery = createDynamicBaseQuery('/transporter');
// export const grnBaseQuery = createDynamicBaseQuery('/grn');

// // GDN - No prefix (uses /gdn and /dispatch in endpoints)
// export const gdnBaseQuery = createDynamicBaseQuery('');

// // Sales Voucher - No prefix (uses multiple routes)
// export const salesVoucherBaseQuery = createDynamicBaseQuery('');
// export const orderBaseQuery = createDynamicBaseQuery('/order');

// // Manufacturing APIs
// export const machineBaseQuery = createDynamicBaseQuery('/machine');
// export const shiftBaseQuery = createDynamicBaseQuery('/shift');
// export const departmentBaseQuery = createDynamicBaseQuery('/department');
// export const employeeBaseQuery = createDynamicBaseQuery('/employee');
// export const mouldBaseQuery = createDynamicBaseQuery('/mould');
// export const mouldingBaseQuery = createDynamicBaseQuery('/moulding');



















































// lib/baseQuery.ts

import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getApiPort } from '@/lib/apiConfig';

// ═══════════════════════════════════════════════════════════════
// ✅ Get Dynamic Base URL
// ═══════════════════════════════════════════════════════════════
const getDynamicBaseUrl = (endpoint: string): string => {
  const port = getApiPort();
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:${port}/api${endpoint}`;
  }
  return `http://localhost:${port}/api${endpoint}`;
};

// ═══════════════════════════════════════════════════════════════
// ✅ Create Dynamic Base Query
// ═══════════════════════════════════════════════════════════════
export const createDynamicBaseQuery = (endpoint: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async (args, api, extraOptions) => {
    const baseUrl = getDynamicBaseUrl(endpoint);
    
    const rawBaseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers, { getState }) => {
        headers.set('Content-Type', 'application/json');
        
        const token = (getState() as any).auth?.token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      },
    });
    
    return rawBaseQuery(args, api, extraOptions);
  };
};

// ═══════════════════════════════════════════════════════════════
// ✅ Create Base Query With Auth (Legacy)
// ═══════════════════════════════════════════════════════════════
export const createBaseQueryWithAuth = (baseUrl: string) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
};

// ═══════════════════════════════════════════════════════════════
// ✅ Pre-defined base queries for all slices
// ═══════════════════════════════════════════════════════════════

// Basic CRUD APIs with /z- prefix
export const currencyBaseQuery = createDynamicBaseQuery('/z-currency');
export const uomBaseQuery = createDynamicBaseQuery('/z-uom');
export const coaBaseQuery = createDynamicBaseQuery('/z-coa');
export const itemsBaseQuery = createDynamicBaseQuery('/z-items');
export const itemClassBaseQuery = createDynamicBaseQuery('/z-item-class');
export const stockBaseQuery = createDynamicBaseQuery('/z-stock');
export const carriageBaseQuery = createDynamicBaseQuery('/z-carriage');
export const batchBaseQuery = createDynamicBaseQuery('/z-batch');
export const salesmanBaseQuery = createDynamicBaseQuery('/salesman');

// APIs without /z- prefix
export const transporterBaseQuery = createDynamicBaseQuery('/transporter');
export const orderBaseQuery = createDynamicBaseQuery('/order');
export const grnBaseQuery = createDynamicBaseQuery('/grn');

// GDN - No prefix (uses /gdn and /dispatch in endpoints)
export const gdnBaseQuery = createDynamicBaseQuery('');

// Sales Voucher - No prefix (uses multiple routes)
export const salesVoucherBaseQuery = createDynamicBaseQuery('');

// Journal Voucher - No prefix (uses multiple routes)
export const journalVoucherBaseQuery = createDynamicBaseQuery('');

// Manufacturing APIs
export const machineBaseQuery = createDynamicBaseQuery('/machine');
export const shiftBaseQuery = createDynamicBaseQuery('/shift');
export const departmentBaseQuery = createDynamicBaseQuery('/department');
export const employeeBaseQuery = createDynamicBaseQuery('/employee');
export const mouldBaseQuery = createDynamicBaseQuery('/mould');
export const mouldingBaseQuery = createDynamicBaseQuery('/moulding');
