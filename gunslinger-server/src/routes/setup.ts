import { Elysia } from 'elysia'

export const setup = new Elysia({ name: 'setup' })
  .state('pendingPlayers', [] as string[])
  .state('activeDuels', {} as Record<string, Types.Duel>)
