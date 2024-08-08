import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'

// const generateQuotation = async (quotationId: number) => {
//   const res = await apiClient.get(`/quotations/${quotationId}/generate`)
//   return res.data
// }

export const useGenerateQuotation = (quotationId: number) => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.get(`/quotations/${quotationId}/generate`, {
        responseType: 'blob',
      })

      const fileName = (res.headers['content-disposition'] as string).split('"')[1]

      return {
        data: res.data,
        fileName,
      }
    },
  })
}
