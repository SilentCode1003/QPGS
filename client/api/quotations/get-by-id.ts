import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { Quotation } from './all'

enum VatType {
  vat_ex = 'vat_ex',
  vat_inc = 'vat_inc',
}

type QuotationProduct = {
  id: number
  quotation_id: number
  product_id: number
  entry_name: string
  entry_description: string
  entry_price: string
  markup: string
  vat_ex: string
  vat_inc: string
  vat_type: VatType
  duration: number
  quantity: number
  total_amount: string
}

type QuotationWithQuotationProduct = Quotation & {
  quotation_product: QuotationProduct[]
}

type GetQuotationByIdResponse = {
  data: QuotationWithQuotationProduct
}

export const useGetQuotationById = (quotationId: number) => {
  return useQuery({
    queryKey: ['quotations', quotationId],
    queryFn: async () => {
      const res = await apiClient.get<GetQuotationByIdResponse>(`/quotations/${quotationId}`)
      return res.data
    },
    retry: false,
  })
}
