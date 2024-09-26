import { treaty } from '@elysiajs/eden'
import type { Server } from '../../gunslinger-server/src'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: treaty<Server>('http://localhost:5005').api
    }
  }
})
