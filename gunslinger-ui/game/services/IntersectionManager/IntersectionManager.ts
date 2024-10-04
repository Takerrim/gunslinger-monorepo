import type { Sprite } from 'pixi.js'
import { rectangleCollision } from '~/game/collision'
import { toViewport } from '~/game/game.helpers'

let instance: IntersectionManager | null = null

export class IntersectionManager {
  obstacles: Sprite[] = []

  static getInstance() {
    if (!instance) {
      instance = new IntersectionManager()
    }

    return instance
  }

  private constructor() {}

  addObstacle(obstacle: Sprite) {
    this.obstacles.push(obstacle)
  }

  testMapCollision(target: Sprite, container: Sprite) {
    const containerGlobalPosition = toViewport(container)
    const targetGlobalPosition = toViewport(target)
    if (targetGlobalPosition.x <= containerGlobalPosition.x) return 'left'
    if (targetGlobalPosition.x >= containerGlobalPosition.x + container.width)
      return 'right'
    if (targetGlobalPosition.y <= containerGlobalPosition.y) return 'up'
    if (targetGlobalPosition.y >= containerGlobalPosition.y + container.height)
      return 'down'
  }

  /** @description Check whether target has reached boundary with obstacle */
  testObstacleCollisionSide(target: Sprite) {
    for (let i = 0; i < this.obstacles.length; ++i) {
      const collisionSide = rectangleCollision(target, this.obstacles[i])
      if (collisionSide) return collisionSide
    }
  }

  isOverlappedWithObstacles = (target: Sprite) => {
    const { x, y } = toViewport(target)
    return this.obstacles.some((obstacle) => {
      return obstacle.getBounds().contains(x, y)
    })
  }

  isOverlappedWithProjectile = (data: {
    target: Sprite
    projectile: Sprite
  }) => {
    const { x, y } = toViewport(data.target)
    return data.projectile.getBounds().contains(x, y)
  }
}
