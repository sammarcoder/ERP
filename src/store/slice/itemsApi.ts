








// store/slice/itemsApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { itemsBaseQuery } from '@/lib/baseQuery';

// ✅ TypeScript interfaces for Items
interface Item {
  id: number;
  itemName: string;
  itemClass1?: number;
  itemClass2?: number;
  itemClass3?: number;
  itemClass4?: number;
  skuUOM?: number;
  uom2?: number;
  uom2_qty?: number;
  uom3?: number;
  uom3_qty?: number;
  assessmentUOM?: number;
  weight_per_pcs?: number;
  barCode?: string;
  sellingPrice?: number;
  purchasePricePKR?: number;
  purchasePriceFC?: number;
  assessedPrice?: number;
  hsCode?: string;
  cd?: number;
  ftaCd?: number;
  acd?: number;
  rd?: number;
  salesTax?: number;
  addSalesTax?: number;
  itaxImport?: number;
  furtherTax?: number;
  supplier?: string;
  purchaseAccount?: string;
  salesAccount?: string;
  salesTaxAccount?: string;
  wastageItem?: boolean;
  isNonInventory?: boolean;
  
  // ✅ Associations
  class1?: { id: number; classId: string; className: string };
  class2?: { id: number; classId: string; className: string };
  class3?: { id: number; classId: string; className: string };
  class4?: { id: number; classId: string; className: string };
  uom1?: { uom: string };
  uomTwo?: { uom: string };
  uomThree?: { uom: string };
}

interface ItemsResponse {
  success: boolean;
  data: Item[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SingleItemResponse {
  success: boolean;
  data: Item;
}

interface ItemsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  includeClasses?: boolean;
}

interface ClassFilterParams {
  class1?: string;
  class2?: string;
  class3?: string;
  class4?: string;
}

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: itemsBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    // ✅ Get all items with pagination and search
    getAllItems: builder.query<ItemsResponse, ItemsQueryParams>({
      query: ({ page = 1, limit = 50, search = '', includeClasses = true } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          includeClasses: includeClasses.toString(),
          ...(search && { search }),
        });
        return `/items?${params}`;
      },
      transformResponse: (response: ItemsResponse) => {
        console.log('🔍 Items API Response:', response);
        
        if (response.success && Array.isArray(response.data)) {
          console.log(`✅ Items loaded: ${response.data.length}`);
          return response;
        }
        
        console.warn('⚠️ Unexpected items response structure:', response);
        return {
          success: false,
          data: [],
          pagination: { total: 0, page: 1, limit: 50, totalPages: 0 }
        };
      },
      providesTags: ['Item'],
    }),

    // ✅ Search items quickly
    searchItems: builder.query<Item[], string>({
      query: (searchQuery) => `/items/search?query=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response: { success: boolean; data: Item[] }) => {
        console.log('🔍 Items Search Response:', response);
        
        if (response.success && Array.isArray(response.data)) {
          console.log(`🔎 Search results: ${response.data.length} items found`);
          return response.data;
        }
        
        console.warn('⚠️ Search failed or empty results');
        return [];
      },
      providesTags: ['Item'],
    }),

    // ✅ Get single item by ID
    getItemById: builder.query<Item, string | number>({
      query: (id) => `/items/${id}`,
      transformResponse: (response: SingleItemResponse) => {
        console.log('🔍 Single Item Response:', response);
        
        if (response.success && response.data) {
          console.log(`✅ Item loaded: ${response.data.itemName}`);
          return response.data;
        }
        
        throw new Error('Item not found');
      },
      providesTags: ['Item'],
    }),

    // ✅ Get items by class filters
    getItemsByClassFilters: builder.query<Item[], ClassFilterParams>({
      query: ({ class1, class2, class3, class4 }) => {
        const params = new URLSearchParams();
        if (class1 && class1 !== '0') params.append('class1', class1);
        if (class2 && class2 !== '0') params.append('class2', class2);
        if (class3 && class3 !== '0') params.append('class3', class3);
        if (class4 && class4 !== '0') params.append('class4', class4);
        
        return `/items/by-class-filters?${params}`;
      },
      transformResponse: (response: { success: boolean; data: Item[] }) => {
        console.log('🎯 Filtered Items Response:', response);
        
        if (response.success && Array.isArray(response.data)) {
          console.log(`✅ Filtered items: ${response.data.length}`);
          return response.data;
        }
        
        return [];
      },
      providesTags: ['Item'],
    }),

    // ✅ Get items by specific class and level
    getItemsByClass: builder.query<Item[], { classId: string; classLevel: '1' | '2' | '3' | '4' }>({
      query: ({ classId, classLevel }) => `/items/class/${classId}/level/${classLevel}`,
      transformResponse: (response: { success: boolean; data: Item[]; count: number }) => {
        console.log(`🔍 Items by Class ${classLevel} Response:`, response);
        
        if (response.success && Array.isArray(response.data)) {
          console.log(`✅ Items in class: ${response.count}`);
          return response.data;
        }
        
        return [];
      },
      providesTags: ['Item'],
    }),

    // ✅ Create new item
    createItem: builder.mutation<Item, Partial<Item>>({
      query: (itemData) => ({
        url: '/items',
        method: 'POST',
        body: itemData,
      }),
      transformResponse: (response: SingleItemResponse) => {
        console.log('✅ Item Created:', response);
        
        if (response.success && response.data) {
          return response.data;
        }
        
        throw new Error('Failed to create item');
      },
      invalidatesTags: ['Item'],
    }),

    // ✅ Update item
    updateItem: builder.mutation<Item, { id: string | number; data: Partial<Item> }>({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: SingleItemResponse) => {
        console.log('✅ Item Updated:', response);
        
        if (response.success && response.data) {
          return response.data;
        }
        
        throw new Error('Failed to update item');
      },
      invalidatesTags: ['Item'],
    }),

    // ✅ Delete item
    deleteItem: builder.mutation<{ success: boolean; message: string }, string | number>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { success: boolean; message: string }) => {
        console.log('✅ Item Deleted:', response);
        return response;
      },
      invalidatesTags: ['Item'],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAllItemsQuery,
  useSearchItemsQuery,
  useGetItemByIdQuery,
  useGetItemsByClassFiltersQuery,
  useGetItemsByClassQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;

// ✅ Export types
export type { Item, ItemsResponse, ItemsQueryParams, ClassFilterParams };
