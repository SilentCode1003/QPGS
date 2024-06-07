import { z } from 'zod'

export const numberIdParamSchema = z.object({
  id: z.coerce.number(),
})

export const stringIdParamSchema = z.object({
  id: z.string(),
})

// For /users/:userId/created-quotations in quotation router
export const numberUserIdSchema = z.object({
  userId: z.coerce.number(),
})
