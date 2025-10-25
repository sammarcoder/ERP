export interface Salesman {
  id: number
  name: string
  city: string
  adress: string  // Note: matches your backend spelling
  telephone: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSalesmanRequest {
  name: string
  city: string
  adress: string
  telephone: string
}

export interface UpdateSalesmanRequest {
  id: number
  name: string
  city: string
  adress: string
  telephone: string
}

export interface SalesmanListResponse {
  total: number
  page: number
  totalPages: number
  data: Salesman[]
}

export interface FetchSalesmanParams {
  page?: number
  limit?: number
}
