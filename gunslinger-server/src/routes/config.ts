import { Elysia } from 'elysia'
import { GAME_MAP } from '../constants'

export const configPlugin = new Elysia({
  name: 'config',
  prefix: '/config',
}).get('/map', () => GAME_MAP)
