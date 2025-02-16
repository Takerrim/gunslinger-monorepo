import {
  Sprite,
  type Application,
  Spritesheet,
  BaseTexture,
  type IPointData
} from 'pixi.js'
import { AbstractGameElement } from '../AbstractGameElement'
import bulletsSpritesheetJson from '~/game/spritesheets/bullets.spritesheet.json'

const BULLET_SPEED_FACTOR = 20

export class EnemyShooting extends AbstractGameElement {
  spritesheet!: Spritesheet

  constructor(app: Application) {
    super(app)

    this.spritesheet = new Spritesheet(
      BaseTexture.from(bulletsSpritesheetJson.meta.image),
      bulletsSpritesheetJson
    )
    this.spritesheet.parse()
  }

  #changeBulletPosition(projectile: Sprite) {
    projectile.position.x += Math.cos(projectile.rotation) * BULLET_SPEED_FACTOR
    projectile.position.y += Math.sin(projectile.rotation) * BULLET_SPEED_FACTOR
  }

  get enemy() {
    return this.viewport.getChildByName('enemy')
  }

  fire(projectilePosition: IPointData) {
    if (this.enemy) {
      const projectile = Sprite.from(this.spritesheet.textures.bullet1)
      projectile.position.set(projectilePosition.x, projectilePosition.y)
      projectile.rotation = this.enemy.rotation
      projectile.cullable = true
      projectile.name = 'enemyProjectile'
      this.viewport.addChild(projectile)
    }
  }

  get projectiles() {
    return this.viewport.children.filter(
      (child) => child.name === 'enemyProjectile'
    ) as Sprite[]
  }

  protected update() {
    if (this.projectiles.length) {
      this.projectiles.forEach((projectile) => {
        this.#changeBulletPosition(projectile)

        if (
          this.isIntersectedWithObstagles(projectile) ||
          this.isOutOfMap(projectile)
        ) {
          projectile.removeFromParent()
        }
      })
    }
  }
}
