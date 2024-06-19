import { parseUrl } from '@/utils/url'
import { MetadataRoute } from 'next'
import { z } from 'zod'

export const urlInput = z.object({
  url: z.string().trim().transform(parseUrl),
})

export type UrlInput = z.infer<typeof urlInput>

export const urlSchema = z.object({
  id: z.string(),
  url: z.string().trim().url(),
  title: z.string().trim(),
  description: z.string().trim(),
  icon: z.string().url().optional().nullable(),
})

export type Url = {
  id: string
  url: string
  title: string
  description?: string
  icon?: string
  manifest?: MetadataRoute.Manifest
  ip?: string
}
