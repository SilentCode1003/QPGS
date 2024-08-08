import { z } from 'zod'

export const getTermsAndConditionsByIdParamDto = z.object({
  termsAndConditionsId: z.coerce.number(),
})
