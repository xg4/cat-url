import createHttpError from 'http-errors'

export async function fetchIcon(url: string) {
  console.log('🚀 ~ fetchIcon ~ url:', url)
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
