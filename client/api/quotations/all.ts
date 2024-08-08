import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { User } from '../auth/me'
import { Category } from '../categories/all'
import { Client } from '../clients/all'

export type Quotation = {
  id: number
  reference_id: string
  month_year: string
  category_id: number
  category: Category
  subject: string
  date: string
  expiry_date: string
  note: string | null
  terms_and_conditions: string
  client_id: number
  client: Client
  grand_total: string
  quotation_status: string
  created_by_id: number
  created_by_user: Omit<User, 'role'>
  approved_by_id: number | null
  approved_by_user: Omit<User, 'role'> | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type GetAllQuotationsResponse = {
  data: Quotation[]
}

// String because it is converted to string in the url
type QueryParams = {
  category_id?: string
  client_id?: string
  quotation_status_id?: string
  created_by_id?: string
  approved_by_id?: string
}

export const useGetAllQuotations = (queryParams?: QueryParams) => {
  const filteredParams =
    queryParams && Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))

  const queryKey = filteredParams ? ['quotations', { queryParams: filteredParams }] : ['quotations']

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<GetAllQuotationsResponse>(
        '/quotations?' + new URLSearchParams(filteredParams)
      )
      return res.data
    },
  })
}
