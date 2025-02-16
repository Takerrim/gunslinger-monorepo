import type { Application, IPointData } from 'pixi.js'
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

  realtimeManager.on('enemyFired', (projectilePosition: IPointData) => {
    enemy.fire(projectilePosition)
  })

  // TODO: Нужно где-то хранить все позиции пуль полученных из сервера, чтобы сверять их с пулями, отренденренных на клиенте
  // realtimeManager.on('enemyProjectilesChanged', (projectiles: IPointData[]) => {
  //   enemyShooting.fire(projectiles)
  // })

  realtimeManager.on('enemyCeasedFire', () => {})

  realtimeManager.on('hitEnemy', () => {
    enemy.takeDamage()
  })

  realtimeManager.on('enemyStopped', () => {
    enemy.stop()
  })
}
