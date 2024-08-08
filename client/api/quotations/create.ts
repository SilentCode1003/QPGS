import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type QuotationProducts = {
  product_id: number
  entry_name: string
  entry_description: string
  entry_price: string
  markup: number
  vat_ex: string
  vat_inc: string
  vat_type: 'vat_ex' | 'vat_inc'
  duration: number
  quantity: number
  total_amount: string
}

export type CreateQuotationPayload = {
  category_id: number
  subject: string
  date: string
  expiry_date: string
  note: string | null
  terms_and_conditions: string
  client_id: number
  grand_total: string
  quotation_products: QuotationProducts[]
}

export const useCreateQuotation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateQuotationPayload) => {
      const res = await apiClient.post('/quotations', payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'], type: 'all' })
    },
  })
}
