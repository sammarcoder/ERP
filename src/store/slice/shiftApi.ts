import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

export const shiftApi = createApi({
  reducerPath: 'shiftApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Shift'],
  endpoints: (builder) => ({
    getShifts: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/shift/get?page=${page}&limit=${limit}`,
      providesTags: ['Shift'],
    }),
    getShiftById: builder.query<any, number>({
      query: (id) => `/shift/get/${id}`,
      providesTags: ['Shift'],
    }),
    createShift: builder.mutation<any, { name: string; startTime: string; endTime: string }>({
      query: (data) => ({
        url: '/shift/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shift'],
    }),
    updateShift: builder.mutation<any, { id: number; data: { name: string; startTime: string; endTime: string } }>({
      query: ({ id, data }) => ({
        url: `/shift/put/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Shift'],
    }),
    deleteShift: builder.mutation<any, number>({
      query: (id) => ({
        url: `/shift/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shift'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftByIdQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = shiftApi;
