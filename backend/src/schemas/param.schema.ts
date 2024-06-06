import { z } from 'zod'

export const numberIdParamSchema = z.object({
  id: z.coerce.number(),
})

// For /users/:userId/created-quotations in quotation router
export const numberUserIdSchema = z.object({
  userId: z.coerce.number(),
})
