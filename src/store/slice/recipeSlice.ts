// store/slice/recipeSlice.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { recipeBaseQuery } from '@/lib/baseQuery';

// =============================================
// TYPES
// =============================================

export interface RecipeDetail {
  id?: number;
  zRp_Main_id?: number;
  Item_id: number;
  qty: number;
  Uom_Id: number | null;
  item?: {
    id: number;
    itemName: string;
    uom1?: { id: number; uom: string };
    uomTwo?: { id: number; uom: string };
    uomThree?: { id: number; uom: string };
  };
  uom?: {
    id: number;
    uom: string;
  };
}

export interface Recipe {
  id: number;
  Item_id: number;
  qty: number;
  Uom_Id: number | null;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  item?: {
    id: number;
    itemName: string;
    uom1?: { id: number; uom: string };
    uomTwo?: { id: number; uom: string };
    uomThree?: { id: number; uom: string };
  };
  uom?: {
    id: number;
    uom: string;
  };
  details?: RecipeDetail[];
}

export interface CreateRecipeRequest {
  Item_id: number;
  qty: number;
  Uom_Id?: number | null;
  details: {
    Item_id: number;
    qty: number;
    Uom_Id?: number | null;
  }[];
}

export interface UpdateRecipeRequest extends CreateRecipeRequest {
  id: number;
}

// =============================================
// API SLICE
// =============================================

export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: recipeBaseQuery,
  tagTypes: ['Recipe', 'UsedItemIds'],
  endpoints: (builder) => ({

    getAllRecipes: builder.query<Recipe[], void>({
      query: () => '/get',
      providesTags: ['Recipe'],
      transformResponse: (response: any) => response?.data || []
    }),

    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Recipe', id }],
      transformResponse: (response: any) => response?.data
    }),

    getRecipeByItemId: builder.query<Recipe, number>({
      query: (itemId) => `/by-item/${itemId}`,
      providesTags: ['Recipe'],
      transformResponse: (response: any) => response?.data
    }),

    getUsedItemIds: builder.query<number[], number | void>({
      query: (excludeId) => excludeId
        ? `/used-item-ids?excludeId=${excludeId}`
        : '/used-item-ids',
      providesTags: ['UsedItemIds'],
      transformResponse: (response: any) => response?.data || []
    }),

    createRecipe: builder.mutation<{ success: boolean; data: Recipe }, CreateRecipeRequest>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Recipe', 'UsedItemIds']
    }),

    updateRecipe: builder.mutation<{ success: boolean; data: Recipe }, UpdateRecipeRequest>({
      query: ({ id, ...data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Recipe', 'UsedItemIds']
    }),

    deleteRecipe: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Recipe', 'UsedItemIds']
    }),

    toggleRecipeStatus: builder.mutation<{ success: boolean; data: Recipe }, number>({
      query: (id) => ({
        url: `/toggle-status/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Recipe']
    })
  })
});

export const {
  useGetAllRecipesQuery,
  useGetRecipeByIdQuery,
  useGetRecipeByItemIdQuery,
  useLazyGetRecipeByItemIdQuery,
  useGetUsedItemIdsQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useToggleRecipeStatusMutation
} = recipeApi;
