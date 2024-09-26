import type { Application } from 'pixi.js'
import { Player } from './entities/Player'
import { eventBus } from './services/EventBus/EventBus'

export const renderPlayer = (app: Application, map: GameTypes.Map) => {
  const player = new Player(app)

  const duelStore = useDuelStore()

  // Needed to display player to initial position
  queueMicrotask(() => {
    if (!duelStore.player) return

    player.sprite.position.set(duelStore.player.position.x - map.width / 2, 0)

    eventBus.emit('playerMoved', player.getGlobalPosition(player.sprite))
  })
}
