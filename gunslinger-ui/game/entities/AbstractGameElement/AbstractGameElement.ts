import type { Viewport } from 'pixi-viewport'
import type { Application, Sprite } from 'pixi.js'
import Victor from 'victor'
import { IntersectionManager } from '~/game/services/IntersectionManager'

export abstract class AbstractGameElement {
  protected app!: Application

  constructor(app: Application) {
    this.app = app
    this.app.ticker.add(this.update.bind(this))
  }

  get viewport() {
    return this.app.stage.getChildByName('viewport') as Viewport
  }

  protected isOutOfMap(target: Sprite) {
    const map = this.viewport.getChildByName('background')
    return Boolean(
      map &&
        IntersectionManager.getInstance().testMapCollision(
          target,
          map as Sprite
        )
    )
  }

  protected isIntersected(target: Sprite) {
    return IntersectionManager.getInstance().isOverlappedWithObstacles(target)
  }

  /** @description Because follow method of pixi-viewport makes starting point of map to center we have to subtract target position from background starting point */
  getGlobalPosition(target: Sprite) {
    const map = this.viewport.getChildByName('background') as Sprite
    return Victor.fromObject(target.position)
      .subtract(Victor.fromObject(map.position))
      .toObject()
  }

  /** @description update logic for render tick  */
  protected abstract update(): void
}
