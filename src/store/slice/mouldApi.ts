// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

// export interface MouldItem {
//   id: number;
//   itemName: string;
//   uom1?: {
//     id: number;
//     uom: string;
//   };
// }

// export interface Mould {
//   id: number;
//   name: string;
//   cycleTime: number;
//   totalCavities: number;
//   effectiveCavities: number;
//   inputMaterialId: number;
//   inputMaterial?: MouldItem;
//   outputMaterials?: MouldItem[];
// }

// export interface MouldCreateInput {
//   name: string;
//   cycleTime: number;
//   totalCavities: number;
//   effectiveCavities: number;
//   inputMaterialId: number;
//   outputMaterialIds?: number[];
// }

// export interface MouldUpdateInput {
//   id: number;
//   data: MouldCreateInput;
// }

// export interface MouldListResponse {
//   total: number;
//   page: number;
//   totalPages: number;
//   data: Mould[];
// }

// export const mouldApi = createApi({
//   reducerPath: 'mouldApi',
//   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
//   tagTypes: ['Mould'],
//   endpoints: (builder) => ({
//     getMoulds: builder.query<MouldListResponse, { page?: number; limit?: number }>({
//       query: ({ page = 1, limit = 10 }) => `/mould/get?page=${page}&limit=${limit}`,
//       providesTags: ['Mould'],
//     }),
//     getMouldById: builder.query<Mould, number>({
//       query: (id) => `/mould/get/${id}`,
//       providesTags: ['Mould'],
//     }),
//     createMould: builder.mutation<{ success: boolean; data: Mould }, MouldCreateInput>({
//       query: (data) => ({
//         url: '/mould/create',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Mould'],
//     }),
//     updateMould: builder.mutation<{ success: boolean; data: Mould }, MouldUpdateInput>({
//       query: ({ id, data }) => ({
//         url: `/mould/put/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['Mould'],
//     }),
//     deleteMould: builder.mutation<{ success: boolean; message: string }, number>({
//       query: (id) => ({
//         url: `/mould/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Mould'],
//     }),
//   }),
// });

// export const {
//   useGetMouldsQuery,
//   useGetMouldByIdQuery,
//   useCreateMouldMutation,
//   useUpdateMouldMutation,
//   useDeleteMouldMutation,
// } = mouldApi;





























































// store/slice/mouldApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { mouldBaseQuery } from '@/lib/baseQuery';

export interface MouldItem {
  id: number;
  itemName: string;
  uom1?: {
    id: number;
    uom: string;
  };
}

export interface Mould {
  id: number;
  name: string;
  cycleTime: number;
  totalCavities: number;
  effectiveCavities: number;
  inputMaterialId: number;
  inputMaterial?: MouldItem;
  outputMaterials?: MouldItem[];
}

export interface MouldCreateInput {
  name: string;
  cycleTime: number;
  totalCavities: number;
  effectiveCavities: number;
  inputMaterialId: number;
  outputMaterialIds?: number[];
}

export interface MouldUpdateInput {
  id: number;
  data: MouldCreateInput;
}

export interface MouldListResponse {
  total: number;
  page: number;
  totalPages: number;
  data: Mould[];
}

export const mouldApi = createApi({
  reducerPath: 'mouldApi',
  baseQuery: mouldBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['Mould'],
  endpoints: (builder) => ({
    getMoulds: builder.query<MouldListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/get?page=${page}&limit=${limit}`,
      providesTags: ['Mould'],
    }),
    getMouldById: builder.query<Mould, number>({
      query: (id) => `/get/${id}`,
      providesTags: ['Mould'],
    }),
    createMould: builder.mutation<{ success: boolean; data: Mould }, MouldCreateInput>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Mould'],
    }),
    updateMould: builder.mutation<{ success: boolean; data: Mould }, MouldUpdateInput>({
      query: ({ id, data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Mould'],
    }),
    deleteMould: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Mould'],
    }),
  }),
});

export const {
  useGetMouldsQuery,
  useGetMouldByIdQuery,
  useCreateMouldMutation,
  useUpdateMouldMutation,
  useDeleteMouldMutation,
} = mouldApi;
