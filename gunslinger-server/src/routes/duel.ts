import { Elysia, t } from 'elysia'
import { setup } from './setup'
import { GAME_MAP } from '../constants'

export const duel = new Elysia({ name: 'duel', prefix: '/duel' })
  .use(setup)
  .post(
    '/start',
    ({ body, store }) => {
      // Client has to start listening ws to know there is enemy to play
      store.pendingPlayers.push(body.playerAddress)

      const isPendingPlayersEven =
        store.pendingPlayers.length > 0 && store.pendingPlayers.length % 2 === 0

      /** If pendingUsers is even, pairs are ready to start duel */
      if (isPendingPlayersEven) {
        const [firstPlayerAddress, secondPlayerAddress] = store.pendingPlayers

        const newDuel: Types.Duel = {
          players: {
            [firstPlayerAddress]: {
              address: firstPlayerAddress,
              hp: 100,
              bonus: null,
              position: {
                x: 50,
                y: 0,
              },
              rotation: null,
              /** TODO: set individual dimensions */
              dimensions: body.playerDimensions,
            },
            [secondPlayerAddress]: {
              address: secondPlayerAddress,
              hp: 100,
              bonus: null,
              position: {
                x: GAME_MAP.width - 50,
                y: 0,
              },
              rotation: null,
              /** TODO: set individual dimensions */
              dimensions: body.playerDimensions,
            },
          } as Types.Duel['players'],
          winnerAddress: null,
          status: 'active',
        }

        store.activeDuels[firstPlayerAddress] = newDuel
        store.activeDuels[secondPlayerAddress] = newDuel

        /** Delete active players from pending */
        store.pendingPlayers = store.pendingPlayers.slice(2)

        /** TODO: Send info about pair is ready to blockchain and create duel */
      }
    },
    {
      body: t.Object({
        /** Public key of wallet */
        playerAddress: t.String(),
        playerDimensions: t.Object({
          width: t.Number(),
          height: t.Number(),
        }),
      }),
    }
  )
