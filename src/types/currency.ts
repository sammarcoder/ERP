export interface Currency {
  id: number
  currencyName: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCurrencyRequest {
  currencyName: string
}

export interface UpdateCurrencyRequest {
  id: number
  currencyName: string
}
