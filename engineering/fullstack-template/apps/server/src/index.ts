import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { join } from 'path'

// TODO: import route modules here

const frontendDist = join(import.meta.dir, '../../web/dist')

export const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
  }))
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: '资源不存在', code: 'NOT_FOUND' }
    }
    if (code === 'VALIDATION') {
      set.status = 400
      return { error: (error as Error).message, code: 'INVALID_INPUT' }
    }
    set.status = 500
    return { error: '服务器内部错误', code: 'INTERNAL_ERROR' }
  })
  // TODO: mount route groups here, e.g.:
  // .group('/api', app => app.use(exampleRouter))

  // Production static file serving (populated after bun run build)
  .get('/assets/*', ({ params }) =>
    Bun.file(join(frontendDist, 'assets', params['*'])))
  .get('/', () => Bun.file(join(frontendDist, 'index.html')))
  .get('/*', ({ request }) => {
    const { pathname } = new URL(request.url)
    if (/\.[a-zA-Z0-9]+$/.test(pathname))
      return new Response('Not Found', { status: 404 })
    return Bun.file(join(frontendDist, 'index.html'))
  })
  .listen(process.env.PORT ? Number(process.env.PORT) : 3000)

console.log(`Server running at http://localhost:${app.server?.port}`)

export type App = typeof app
