import type { Application } from 'pixi.js'
import { Enemy } from './entities/Enemy'
import { RealtimeManager } from './services/RealtimeManager'

export const renderEnemy = (app: Application) => {
  const enemy = new Enemy(app)

  const realtimeManager = RealtimeManager.getInstance()

  realtimeManager.on('enemyDataUpdated', (data) => {
    switch (true) {
      case !!data.position:
        enemy.move(data.position)
        break
      case !!data.rotation:
        enemy.rotate(data.rotation)
        break
      default:
        break
    }
  })

  realtimeManager.on('enemyStopped', () => {
    enemy.stop()
  })
}
