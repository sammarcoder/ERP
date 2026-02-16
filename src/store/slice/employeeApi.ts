

// store/slice/employeeApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { employeeBaseQuery } from '@/lib/baseQuery';

export interface Employee {
  id: number;
  employeeName: string;
  phone: string;
  address?: string;
  departmentId: number;
  department?: {
    id: number;
    departmentName: string;
    departmentCode: string;
  };
}

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: employeeBaseQuery,  // ✅ Uses dynamic port (4000 or 4001)
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getEmployees: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/get?page=${page}&limit=${limit}`,
      providesTags: ['Employee'],
    }),
    getEmployeeById: builder.query<any, number>({
      query: (id) => `/get/${id}`,
      providesTags: ['Employee'],
    }),
    createEmployee: builder.mutation<any, Partial<Employee>>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation<any, { id: number; data: Partial<Employee> }>({
      query: ({ id, data }) => ({
        url: `/put/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    deleteEmployee: builder.mutation<any, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
