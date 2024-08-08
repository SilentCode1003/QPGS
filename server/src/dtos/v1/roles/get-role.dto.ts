import { z } from 'zod'

export const getRoleParamDto = z.object({
  roleId: z.coerce.number(),
})
