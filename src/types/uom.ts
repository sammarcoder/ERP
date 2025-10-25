export interface Uom {
  id: number
  uom: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUomRequest {
  uom: string
}

export interface UpdateUomRequest {
  id: number
  uom: string
}
