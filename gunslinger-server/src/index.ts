import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { logger } from '@bogeychan/elysia-logger'
import { duel, setup, realtime } from './routes'
import { configPlugin } from './routes/config'

const app = new Elysia({ prefix: '/api' })
  .onError(({ code }) => {
    if (code === 'NOT_FOUND') return 'Route not found'
  })
  .use(cors({ origin: 'localhost:3000' }))
  .use(logger({ level: 'debug' }))
  .use(setup)
  .use(configPlugin)
  .use(duel)
  .use(realtime)
  .listen(5005)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
