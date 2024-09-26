import { Application, type IPointData } from 'pixi.js'
import { prepareMap } from './prepareMap'
import { playerActor } from '~/machines/player/playerMachine'
import { eventBus } from './services/EventBus/EventBus'
import { RealtimeManager } from './services/RealtimeManager'

export const initGame = (map: GameTypes.Map) => {
  const app = new Application({
    width: window.document.body.clientWidth,
    height: window.document.body.clientHeight,
    resizeTo: window,
    eventMode: 'static'
  })

  document.body.appendChild(app.view as HTMLCanvasElement)
  app.renderer.events.cursorStyles.default = 'url(/img/sprCursor.png), auto'

  prepareMap(app, map)

  const realtimeManager = RealtimeManager.getInstance()

  eventBus.on('playerMoved', (position: PlayerTypes.Position) => {
    playerActor.send({ type: 'move', payload: position })
    realtimeManager.sendPlayerPosition(position)
  })

  eventBus.on('playerStopped', () => {
    playerActor.send({ type: 'stopMoving' })
    realtimeManager.sendPlayerStoppedEvent()
  })

  eventBus.on('rotate', (rotation: number) => {
    playerActor.send({ type: 'rotate', payload: rotation })
    realtimeManager.sendPlayerRotation(rotation)
  })

  // eventBus.on('takeDamage', (damage: number) => {
  //   playerActor.send({ type: 'takeDamage', payload: damage })
  // })

  eventBus.on('fire', (projectile: IPointData) => {
    playerActor.send({ type: 'fire' })
    realtimeManager.sendPlayerFiredEvent(projectile)
  })

  eventBus.on('playerProjectilesChanged', (projectiles: IPointData[]) => {
    playerActor.send({ type: 'fire' })
    realtimeManager.sendProjectiles(projectiles)
  })

  eventBus.on('ceaseFire', () => {
    playerActor.send({ type: 'ceaseFire' })
  })

  playerActor.start()
  ;(globalThis as any).__PIXI_APP__ = app
}
