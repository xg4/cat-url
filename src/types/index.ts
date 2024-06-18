import { parseUrl } from '@/utils/url'
import { z } from 'zod'

function isUrl(val: string) {
  try {
    return z.string().url().safeParse(parseUrl(val).href).success
  } catch {
    return false
  }
}

export const urlInput = z.object({
  url: z.string().trim().refine(isUrl).transform(parseUrl),
})

export type UrlInput = z.infer<typeof urlInput>

export const urlSchema = z.object({
  id: z.string(),
  url: z.string().trim().url(),
  title: z.string().trim(),
  description: z.string().trim(),
  icon: z.string().url().optional().nullable(),
})

export type Url = z.infer<typeof urlSchema>
