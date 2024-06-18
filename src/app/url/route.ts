import { diffIcon, fetchHtml, parseHtml } from '@/services/html'
import { urlInput } from '@/types'
import { md5 } from '@/utils/md5'
import createHttpError from 'http-errors'
import { isEmpty } from 'lodash'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const { url } = await req.json().then(urlInput.parse)
    const htmlStr = await fetchHtml(url)
    const { title, description, icons } = await parseHtml(htmlStr)

    const defaultIcon = ['/favicon.ico']
    const icon = await diffIcon(icons.concat(defaultIcon).map((u: string) => new URL(u, url.origin).href))

    if ([title, description, icon].every(isEmpty)) {
      throw createHttpError.BadRequest()
    }

    return Response.json({
      id: md5([url.origin, url.pathname].join('')),
      url: url.href,
      title,
      description,
      icon,
    })
  } catch (err) {
    if (createHttpError.isHttpError(err)) {
      return Response.json(err.message, { status: err.statusCode })
    }
    if (err instanceof ZodError) {
      return Response.json(err.issues[0].message, { status: 400 })
    }
    return Response.json('Internal Server Error', { status: 500 })
  }
}
