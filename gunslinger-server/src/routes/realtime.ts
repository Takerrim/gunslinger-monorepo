import { Elysia, t } from 'elysia'
import { setup } from './setup'

const getDuelStartedTopic = (userAddress: string) =>
  `duelStarted_${userAddress}`

const getUpdatedEnemyDataTopic = (userAddress: string) =>
  `enemyDataUpdated_${userAddress}`

const getEnemyStoppedTopic = (userAddress: string) =>
  `enemyStopped_${userAddress}`

export const realtime = new Elysia({
  name: 'realtime',
  prefix: '/realtime',
})
  .use(setup)
  // Websocket connection for handling all manupulations to duel
  .ws('/duel', {
    body: t.Object({
      event: t.Union([
        t.Literal('waitDuel'),
        t.Literal('changePlayerPosition'),
        t.Literal('changePlayerRotation'),
        t.Literal('collectBonus'),
        t.Literal('setProjectiles'),
        t.Literal('playerStopped'),
      ]),
      data: t.Optional(t.Any()),
    }),
    query: t.Object({
      userAddress: t.String(),
    }),
    open(ws) {
      // Subscribe to specific user topic
      ws.subscribe(getDuelStartedTopic(ws.data.query.userAddress))
    },
    close(ws) {
      // Unsubscribe to specific user topics
      ws.unsubscribe(getDuelStartedTopic(ws.data.query.userAddress))
      ws.unsubscribe(getUpdatedEnemyDataTopic(ws.data.query.userAddress))
      ws.unsubscribe(getEnemyStoppedTopic(ws.data.query.userAddress))

      // TODO: Remove duel from active ones if ws connection suddenly closed
    },
    message(ws, message) {
      switch (message.event) {
        case 'waitDuel':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            if (activeDuel) {
              const payload = {
                event: 'duelStarted',
                data: activeDuel,
              }

              const enemyAddress = activeDuel.players.find(
                (player) => player.address !== ws.data.query.userAddress
              )?.address
              console.log(enemyAddress)
              if (enemyAddress) {
                // Unicast event to enemy
                ws.publish(getDuelStartedTopic(enemyAddress), payload)
                ws.send(payload)

                console.log(
                  'subscribed to enemy data topic --------------',
                  ws.data.query.userAddress
                )
                // Subscribe to enemy's data update
                ws.subscribe(
                  getUpdatedEnemyDataTopic(ws.data.query.userAddress)
                )

                // Subscribe when enemy stopped
                ws.subscribe(getEnemyStoppedTopic(ws.data.query.userAddress))
              }
            }
          }
          break
        case 'changePlayerPosition':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            if (!activeDuel) return

            const playerIdx = activeDuel.players.findIndex(
              (player) => player.address === ws.data.query.userAddress
            )

            if (playerIdx === -1) {
              ws.send({
                event: 'error',
                data: `player not found ${ws.data.query.userAddress}`,
              })
              return
            }

            const playerWithUpdatedPosition: Types.PlayerData = {
              ...ws.data.store.activeDuels[ws.data.query.userAddress].players[
                playerIdx
              ],
              position: message.data,
            }

            const enemyAddress = activeDuel.players.find(
              (player) => player.address !== ws.data.query.userAddress
            )?.address

            ws.data.store.activeDuels[ws.data.query.userAddress].players.splice(
              playerIdx,
              1,
              playerWithUpdatedPosition
            )

            if (enemyAddress) {
              // Send updated position of player to enemy
              ws.publish(getUpdatedEnemyDataTopic(enemyAddress), {
                event: 'enemyDataUpdated',
                data: {
                  position: message.data,
                },
              })
            }
          }
          break
        case 'playerStopped':
          const activeDuel =
            ws.data.store.activeDuels[ws.data.query.userAddress]

          if (!activeDuel) return
          const enemyAddress = activeDuel.players.find(
            (player) => player.address !== ws.data.query.userAddress
          )?.address

          if (!enemyAddress) return
          ws.publish(getEnemyStoppedTopic(enemyAddress), {
            event: 'enemyStopped',
          })
          break
        case 'changePlayerRotation':
          {
          }
          break
        case 'setProjectiles':
          {
          }
          break
        default:
          ws.send({
            event: 'eventNotFound',
          })
      }
    },
  })
