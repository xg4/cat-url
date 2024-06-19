import { diffIcon, fetchHtml, fetchManifest, parseHtml } from '@/services/html'
import { urlInput } from '@/types'
import { md5 } from '@/utils/md5'
import dns from 'dns'
import createHttpError from 'http-errors'
import { isEmpty } from 'lodash'
import { promisify } from 'util'
import { ZodError } from 'zod'

const lookupAddress = promisify(dns.lookup)

export async function POST(req: Request) {
  try {
    const { url } = await req.json().then(urlInput.parse)
    const { address } = await lookupAddress(url.hostname)

    const htmlStr = await fetchHtml(url)
    const { title, description, icons, manifest } = await parseHtml(htmlStr)

    const defaultIcon = ['/favicon.ico']
    const icon = await diffIcon(icons.concat(defaultIcon).map((u: string) => new URL(u, url.origin)))

    if ([title, description, icon].every(isEmpty)) {
      throw createHttpError.BadRequest()
    }

    let manifestData
    if (manifest) {
      const manifestUrl = new URL(manifest, url.origin)
      manifestData = await fetchManifest(manifestUrl)
    }

    return Response.json({
      id: md5([url.origin, url.pathname].join('')),
      url: url.href,
      title,
      description,
      icon,
      manifest: manifestData,
      ip: address,
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
