import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:4000/api`;

export interface MouldingRecord {
  id: number;
  date: string;
  machineId: number;
  operatorId: number;
  shiftId: number;
  startTime: string;
  endTime: string;
  shutdownElectricity: number;
  shutdownMachine: number;
  shutdownNamaz: number;
  shutdownMould: number;
  shutdownOther: number;
  counterOne: number;
  counterTwo: number;
  finalCounter: number;
  mouldId: number;
  selectedOutputMaterialId: number;
  inputQty: number;
  outputQty: number;
  qualityCheckerId: number;
  machine?: { id: number; name: string; function: string };
  operator?: { id: number; employeeName: string; phone: string };
  shift?: { id: number; name: string; startTime: string; endTime: string };
  mould?: {
    id: number;
    name: string;
    cycleTime: number;
    totalCavities: number;
    effectiveCavities: number;
    inputMaterial?: { id: number; itemName: string; uom1?: { id: number; uom: string } };
    outputMaterials?: Array<{ id: number; itemName: string; uom1?: { id: number; uom: string } }>;
  };
  selectedOutputMaterial?: { id: number; itemName: string; uom1?: { id: number; uom: string } };
  qualityChecker?: { id: number; employeeName: string; phone: string };
}

export interface MouldingCreateInput {
  date: string;
  machineId: number;
  operatorId: number;
  shiftId: number;
  startTime: string;
  endTime: string;
  shutdownElectricity?: number;
  shutdownMachine?: number;
  shutdownNamaz?: number;
  shutdownMould?: number;
  shutdownOther?: number;
  counterOne: number;
  counterTwo: number;
  mouldId: number;
  selectedOutputMaterialId: number;
  inputQty: number;
  outputQty: number;
  qualityCheckerId: number;
}

export interface MouldingListResponse {
  total: number;
  page: number;
  totalPages: number;
  data: MouldingRecord[];
}

export const mouldingApi = createApi({
  reducerPath: 'mouldingApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Moulding'],
  endpoints: (builder) => ({
    getMouldings: builder.query<MouldingListResponse, { page?: number; limit?: number; date?: string; machineId?: number; shiftId?: number }>({
      query: ({ page = 1, limit = 10, date, machineId, shiftId }) => {
        let url = `/moulding/get?page=${page}&limit=${limit}`;
        if (date) url += `&date=${date}`;
        if (machineId) url += `&machineId=${machineId}`;
        if (shiftId) url += `&shiftId=${shiftId}`;
        return url;
      },
      providesTags: ['Moulding'],
    }),
    getMouldingById: builder.query<MouldingRecord, number>({
      query: (id) => `/moulding/get/${id}`,
      providesTags: ['Moulding'],
    }),
    createMoulding: builder.mutation<{ success: boolean; data: MouldingRecord }, MouldingCreateInput>({
      query: (data) => ({
        url: '/moulding/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Moulding'],
    }),
    updateMoulding: builder.mutation<{ success: boolean; data: MouldingRecord }, { id: number; data: MouldingCreateInput }>({
      query: ({ id, data }) => ({
        url: `/moulding/put/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Moulding'],
    }),
    deleteMoulding: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/moulding/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Moulding'],
    }),
  }),
});

export const {
  useGetMouldingsQuery,
  useGetMouldingByIdQuery,
  useCreateMouldingMutation,
  useUpdateMouldingMutation,
  useDeleteMouldingMutation,
} = mouldingApi;
