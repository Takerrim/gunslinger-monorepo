import Elysia, { t } from 'elysia'

export const model = new Elysia({ name: 'Model.Realtime' }).model({
  message: t.Object({
    event: t.Union([
      t.Literal('waitDuel'),
      t.Literal('changePlayerPosition'),
      t.Literal('changePlayerRotation'),
      t.Literal('collectBonus'),
      t.Literal('playerFired'),
      t.Literal('updateProjectiles'),
      t.Literal('playerStopped'),
    ]),
    data: t.Optional(t.Any()),
  }),
  query: t.Object({
    userAddress: t.String(),
  }),
})
