import type { Sprite } from 'pixi.js'
import { rectangleCollision } from '~/game/collision'
import { toViewport } from '~/game/game.helpers'

let instance: IntersectionManager | null = null

export class IntersectionManager {
  targets: Sprite[] = []

  static getInstance() {
    if (!instance) {
      instance = new IntersectionManager()
    }

    return instance
  }

  private constructor() {}

  addTarget(target: Sprite) {
    this.targets.push(target)
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
    for (let i = 0; i < this.targets.length; ++i) {
      const collisionSide = rectangleCollision(target, this.targets[i])
      if (collisionSide) return collisionSide
    }
  }

  isOverlappedWithObstacles = (target: Sprite) => {
    const { x, y } = toViewport(target)
    return this.targets.some((intersectionTarget) => {
      return intersectionTarget.getBounds().contains(x, y)
    })
  }
}
