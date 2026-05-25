/**
 * Proxies `/hf-api/*` to Hugging Face Inference Router on production (Netlify).
 * Dev continues to use Vite's proxy — see vite.config.ts.
 */

const HF_ORIGIN = (process.env.HF_ROUTER_ORIGIN || 'https://router.huggingface.co').replace(/\/$/, '')
const TOKEN = process.env.HF_ACCESS_TOKEN || ''

function upstreamPath(event) {
  const qp = event.queryStringParameters?.hfpath?.trim()
  if (qp) {
    try {
      const decoded = decodeURIComponent(qp)
      return decoded.replace(/^\/+/, '')
    } catch {
      return qp.replace(/^\/+/, '')
    }
  }
  try {
    const raw = event.rawUrl
    if (raw) {
      const u = new URL(raw)
      const prefix = '/hf-api/'
      if (u.pathname.startsWith(prefix)) {
        return u.pathname.slice(prefix.length).replace(/^\/+/, '')
      }
    }
  } catch {
    /* ignore */
  }
  return ''
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: {}, body: '' }
    }

    if (!TOKEN) {
      return {
        statusCode: 503,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: {
            message:
              'Hugging Face is not configured: set HF_ACCESS_TOKEN in Netlify → Site configuration → Environment variables, then redeploy.',
          },
        }),
      }
    }

    let subpath = upstreamPath(event)
    if (!subpath) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ error: { message: 'Missing upstream path after /hf-api/' } }),
      }
    }

    const targetUrl = `${HF_ORIGIN}/${subpath}`

    /** @type Record<string, string> */
    const forwardHeaders = { Authorization: `Bearer ${TOKEN}` }
    const ct = event.headers['content-type']
    if (ct) forwardHeaders['content-type'] = ct

    const body =
      ['GET', 'HEAD'].includes(event.httpMethod) ?
        undefined
      : event.isBase64Encoded && event.body ?
        Buffer.from(event.body, 'base64').toString('utf8')
      : event.body

    const res = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: forwardHeaders,
      body,
    })

    const text = await res.text()
    const outCt = res.headers.get('content-type') || 'application/json; charset=utf-8'

    return {
      statusCode: res.status,
      headers: { 'content-type': outCt },
      body: text,
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        error: {
          message: e instanceof Error ? e.message : 'Hugging Face proxy failed',
        },
      }),
    }
  }
}
