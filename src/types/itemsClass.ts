export interface ControlHead1 {
  id: number
  zHead1: string
  createdAt?: string
  updatedAt?: string
}

export interface ItemClass {
  id: number
  zHead2: string
  zHead1Id: number
  createdAt?: string
  updatedAt?: string
  "Control-Head-2"?: ControlHead1 // Your nested object structure
}

export interface CreateItemClassRequest {
  zHead2: string
  zHead1Id: number
}

export interface UpdateItemClassRequest {
  id: number
  zHead2: string
  zHead1Id?: number
}
