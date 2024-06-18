import { z } from 'zod'

const envSchema = z.object({
  USER_AGENT: z.string(),
})

export const env = envSchema.parse(process.env)
