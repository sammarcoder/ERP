import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

export interface Department {
  id: number;
  departmentName: string;
  departmentCode: string;
  description?: string;
  location?: string;
  managerId?: number;
  isActive: boolean;
}

export const departmentApi = createApi({
  reducerPath: 'departmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    getDepartments: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/department/get?page=${page}&limit=${limit}`,
      providesTags: ['Department'],
    }),
    getAllDepartments: builder.query<any, void>({
      query: () => `/department/get?limit=1000`,
      providesTags: ['Department'],
    }),
    getDepartmentById: builder.query<any, number>({
      query: (id) => `/department/get/${id}`,
      providesTags: ['Department'],
    }),
    createDepartment: builder.mutation<any, Partial<Department>>({
      query: (data) => ({
        url: '/department/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation<any, { id: number; data: Partial<Department> }>({
      query: ({ id, data }) => ({
        url: `/department/put/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation<any, number>({
      query: (id) => ({
        url: `/department/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
