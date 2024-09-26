import { Elysia } from 'elysia'
import { setup } from '../setup'
import { model } from './realtime.model'
import { RealtimeService } from './realtime.service'
import { testCollision } from '../../helpers/collision'
import { WEAPON } from '../../constants'
import { normalizeProjectilePosition } from '../../helpers/normalizeProjectilePosition'

const getDuelStartedTopic = (userAddress: string) =>
  `duelStarted_${userAddress}`

const getUpdatedEnemyDataTopic = (userAddress: string) =>
  `enemyDataUpdated_${userAddress}`

const getEnemyStoppedTopic = (userAddress: string) =>
  `enemyStopped_${userAddress}`

const getEnemyFiredTopic = (userAddress: string) => `enemyFired_${userAddress}`

const getPlayerHitEnemyTopic = (userAddress: string) =>
  `playerHitEnemy_${userAddress}`

export const realtime = new Elysia({
  name: 'realtime',
  prefix: '/realtime',
})
  .use(setup)
  .use(model)
  .decorate({
    Service: new RealtimeService(),
  })
  .state('projectiles', {} as { playerAddress: Types.Position[] })
  // Websocket connection for handling all manupulations to duel
  .ws('/duel', {
    body: 'message',
    query: 'query',
    open(ws) {
      // Subscribe to specific user topic
      ws.subscribe(getDuelStartedTopic(ws.data.query.userAddress))
    },
    close(ws) {
      // Unsubscribe to specific user topics
      ws.unsubscribe(getDuelStartedTopic(ws.data.query.userAddress))
      ws.unsubscribe(getUpdatedEnemyDataTopic(ws.data.query.userAddress))
      ws.unsubscribe(getEnemyStoppedTopic(ws.data.query.userAddress))
      ws.unsubscribe(getPlayerHitEnemyTopic(ws.data.query.userAddress))

      // TODO: Remove duel from active ones if ws connection suddenly closed
    },
    message(ws, message) {
      switch (message.event) {
        case 'waitDuel':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            // Subscribe to enemy's data update
            ws.subscribe(getUpdatedEnemyDataTopic(ws.data.query.userAddress))
            // Subscribe when enemy stopped
            ws.subscribe(getEnemyStoppedTopic(ws.data.query.userAddress))

            ws.subscribe(getPlayerHitEnemyTopic(ws.data.query.userAddress))

            ws.subscribe(getEnemyFiredTopic(ws.data.query.userAddress))

            if (activeDuel) {
              const payload = {
                event: 'duelStarted',
                data: activeDuel,
              }

              const enemyAddress = ws.data.Service.getEnemyAddress(
                activeDuel.players,
                ws.data.query.userAddress
              )

              if (enemyAddress) {
                // Unicast event to enemy
                ws.publish(getDuelStartedTopic(enemyAddress), payload)
                ws.send(payload)
              }
            }
          }
          break
        case 'changePlayerPosition':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            if (!activeDuel) {
              ws.send(ws.data.Service.getErrorData('duel not found'))
              return
            }

            if (!activeDuel.players[ws.data.query.userAddress]) {
              ws.send(
                ws.data.Service.getErrorData(
                  `player not found ${ws.data.query.userAddress}`
                )
              )
              return
            }

            const playerWithUpdatedPosition: Types.PlayerData = {
              ...activeDuel.players[ws.data.query.userAddress],
              position: message.data,
            }

            activeDuel.players[ws.data.query.userAddress] =
              playerWithUpdatedPosition

            const enemyAddress = ws.data.Service.getEnemyAddress(
              activeDuel.players,
              ws.data.query.userAddress
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

          if (!activeDuel) {
            ws.send(ws.data.Service.getErrorData('duel not found'))
            return
          }

          const enemyAddress = ws.data.Service.getEnemyAddress(
            activeDuel.players,
            ws.data.query.userAddress
          )

          if (!enemyAddress) return
          ws.publish(getEnemyStoppedTopic(enemyAddress), {
            event: 'enemyStopped',
          })
          break
        case 'changePlayerRotation':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            if (!activeDuel) {
              ws.send(ws.data.Service.getErrorData('duel not found'))
              return
            }

            const enemyAddress = ws.data.Service.getEnemyAddress(
              activeDuel.players,
              ws.data.query.userAddress
            )

            activeDuel.players[ws.data.query.userAddress] = {
              ...activeDuel.players[ws.data.query.userAddress],
              rotation: message.data,
            }

            if (!enemyAddress) return

            ws.publish(getUpdatedEnemyDataTopic(enemyAddress), {
              event: 'enemyDataUpdated',
              data: {
                rotation: message.data,
              },
            })
          }
          break
        case 'playerFired':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            if (!activeDuel) {
              ws.send(ws.data.Service.getErrorData('duel not found'))
              return
            }

            const playerProjectile = message.data as Types.Position

            // activeDuel.players[ws.data.query.userAddress].projectiles = [
            //   ...activeDuel.players[ws.data.query.userAddress].projectiles,
            //   playerProjectile,
            // ]

            const enemyAddress = ws.data.Service.getEnemyAddress(
              activeDuel.players,
              ws.data.query.userAddress
            )

            if (!enemyAddress) {
              ws.send(ws.data.Service.getErrorData('enemy address not found'))
              return
            }

            ws.publish(getEnemyFiredTopic(enemyAddress), {
              event: 'enemyFired',
              data: playerProjectile,
            })
          }
          break
        case 'updateProjectiles':
          {
            const activeDuel =
              ws.data.store.activeDuels[ws.data.query.userAddress]

            if (!activeDuel) {
              ws.send(ws.data.Service.getErrorData('duel not found'))
              return
            }

            const clientProjectiles = message.data as Types.Position[]
            const enemyAddress = ws.data.Service.getEnemyAddress(
              activeDuel.players,
              ws.data.query.userAddress
            )

            if (!enemyAddress) {
              ws.send(ws.data.Service.getErrorData('enemy address not found'))
              return
            }

            // Update projectiles of player in duel
            // activeDuel.players[ws.data.query.userAddress].projectiles =
            //   clientProjectiles

            // console.log(
            //   '[updateProjectiles]: ',
            //   activeDuel.players[enemyAddress].position
            // )

            const hasPlayerHitEnemy = clientProjectiles.some(
              (projectilePosition) => {
                return testCollision(
                  {
                    position: normalizeProjectilePosition(projectilePosition),
                    dimensions: WEAPON.riffle.projectileDimensions,
                  },
                  {
                    // TODO: Проблема сейчас в том, что позиции противника остается одной и той же, даже если он пошел, понять, почему
                    position: activeDuel.players[enemyAddress].position,
                    dimensions: activeDuel.players[enemyAddress].dimensions,
                  }
                )
              }
            )

            if (hasPlayerHitEnemy) {
              ws.send({
                event: 'hitEnemy',
                data: {
                  damage: WEAPON.riffle.damage,
                },
              })

              ws.publish(getPlayerHitEnemyTopic(enemyAddress), {
                event: 'damageReceived',
                data: {
                  damage: WEAPON.riffle.damage,
                },
              })
            }
          }
          break
        default:
          ws.send({
            event: 'eventNotFound',
          })
      }
    },
  })