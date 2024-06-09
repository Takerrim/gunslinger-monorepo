import type { Application } from 'pixi.js'
import { Player } from './entities/Player'
import { eventBus } from './services/EventBus/EventBus'

export const renderPlayer = (app: Application, map: GameTypes.Map) => {
  const player = new Player(app)

  const duelStore = useDuelStore()

  queueMicrotask(() => {
    if (!duelStore.player) return

    player.sprite.position.set(
      duelStore.player.initialPosition.x - map.width / 2,
      duelStore.player.initialPosition.y - map.height / 2
    )

    eventBus.emit('playerMoved', player.getGlobalPosition(player.sprite))
  })
}
