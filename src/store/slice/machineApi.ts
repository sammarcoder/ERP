// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

// export const machineApi = createApi({
//   reducerPath: 'machineApi',
//   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
//   tagTypes: ['Machine'],
//   endpoints: (builder) => ({
//     getMachines: builder.query<any, { page?: number; limit?: number }>({
//       query: ({ page = 1, limit = 10 }) => `/machine/get?page=${page}&limit=${limit}`,
//       providesTags: ['Machine'],
//     }),
//     getMachineById: builder.query<any, number>({
//       query: (id) => `/machine/get/${id}`,
//       providesTags: ['Machine'],
//     }),
//     createMachine: builder.mutation<any, { name: string; function: string }>({
//       query: (data) => ({
//         url: '/machine/create',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Machine'],
//     }),
//     updateMachine: builder.mutation<any, { id: number; data: { name: string; function: string } }>({
//       query: ({ id, data }) => ({
//         url: `/machine/put/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['Machine'],
//     }),
//     deleteMachine: builder.mutation<any, number>({
//       query: (id) => ({
//         url: `/machine/delete/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Machine'],
//     }),
//   }),
// });

// export const {
//   useGetMachinesQuery,
//   useGetMachineByIdQuery,
//   useCreateMachineMutation,
//   useUpdateMachineMutation,
//   useDeleteMachineMutation,
// } = machineApi;
































// store/slice/machineApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { machineBaseQuery } from '@/lib/baseQuery';

export const machineApi = createApi({
  reducerPath: 'machineApi',
  baseQuery: machineBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['Machine'],
  endpoints: (builder) => ({
    getMachines: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/get?page=${page}&limit=${limit}`,
      providesTags: ['Machine'],
    }),
    getMachineById: builder.query<any, number>({
      query: (id) => `/get/${id}`,
      providesTags: ['Machine'],
    }),
    createMachine: builder.mutation<any, { name: string; function: string }>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Machine'],
    }),
    updateMachine: builder.mutation<any, { id: number; data: { name: string; function: string } }>({
      query: ({ id, data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Machine'],
    }),
    deleteMachine: builder.mutation<any, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Machine'],
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useGetMachineByIdQuery,
  useCreateMachineMutation,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
} = machineApi;
