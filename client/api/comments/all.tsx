import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

type ApiComment = {
  id: number
  quotation_id: number
  body: string
  commenter_id: number
  commenter_user: {
    first_name: string
    last_name: string
    username: string
    role: {
      name: string
    }
  }
  is_active: boolean
  created_at: Date
  updated_at: Date
}

type GetCommentsResponse = {
  data: ApiComment[]
}

type QueryParams = {
  is_active?: 'true' | 'false'
}

export const useGetComments = (quotationId: number, queryParams?: QueryParams) => {
  const filteredParams =
    queryParams && Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))

  const queryKey: Array<string | number | object> = ['comments', quotationId]

  if (filteredParams) {
    queryKey.push({ queryParams: filteredParams })
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<GetCommentsResponse>(
        `/quotations/${quotationId}/comments?` + new URLSearchParams(filteredParams)
      )
      return res.data
    },
  })
}
