import { env } from '@/config'
import createHttpError from 'http-errors'
import { JSDOM } from 'jsdom'
import { compact, last, sortBy } from 'lodash'
import { MetadataRoute } from 'next'

export async function fetchManifest(url: URL): Promise<MetadataRoute.Manifest> {
  const response = await fetch(url, { method: 'GET' })
  if (!response.ok) {
    throw createHttpError(response.status)
  }
  return response.json()
}

async function fetchIcon(url: URL) {
  const response = await fetch(url, { method: 'GET' })
  if (!response.ok) {
    throw createHttpError(response.status)
  }
  const contentType = response.headers.get('content-type')
  if (contentType && !contentType.startsWith('image/')) {
    throw createHttpError(400)
  }

  const length = response.headers.get('content-length')
  const fileSize = length ? parseInt(length, 10) : 0

  return {
    url,
    fileSize: isNaN(fileSize) ? 0 : fileSize,
  }
}

export const diffIcon = async (icons: URL[]) => {
  const iconData = await Promise.allSettled(icons.map(fetchIcon))
    .then(iconData =>
      iconData.map(i => {
        if (i.status === 'fulfilled') {
          return i.value
        }
        return null
      }),
    )
    .then(compact)
  const best = last(sortBy(iconData, 'fileSize'))
  return best?.url
}

export async function fetchHtml(url: URL) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': env.USER_AGENT,
    },
  })

  if (!response.ok) {
    throw createHttpError(response.status)
  }

  const contentType = response.headers.get('content-type')

  let encoding = 'utf-8' // 默认编码
  if (contentType) {
    const charsetMatch = contentType.match(/charset=([^;]+)/)
    if (charsetMatch) {
      encoding = charsetMatch[1]
    }
  }

  const buffer = await response.arrayBuffer()
  const decoder = new TextDecoder(encoding)
  const text = decoder.decode(buffer)

  const metaMatch = text.match(/<meta[^>]*charset=["']?([^"'>]+)["']?/i)
  if (metaMatch) {
    const metaEncoding = metaMatch[1]
    if (metaEncoding.toLowerCase() !== encoding.toLowerCase()) {
      const newDecoder = new TextDecoder(metaEncoding)
      const text = newDecoder.decode(buffer)
      return text
    }
  }

  return text
}

export async function parseHtml(htmlStr: string) {
  const {
    window: { document },
  } = new JSDOM(htmlStr)

  const title = document.title
  const metaDescription = document.querySelector('meta[name="description"]')
  const description = metaDescription?.getAttribute('content') ?? ''
  const iconTags = ['link[rel="icon"]', 'link[rel="shortcut icon"]']
  const icons = iconTags
    .map(tag => document.querySelectorAll<HTMLLinkElement>(tag))
    .map(nodeList => Array.from(nodeList))
    .flat()
    .map(i => i.href)

  const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')

  return {
    title,
    description,
    icons,
    manifest: manifest?.href,
  }
}
