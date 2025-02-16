import { Sprite, type Application, Spritesheet, BaseTexture } from 'pixi.js'
import { AbstractGameElement } from '../AbstractGameElement'
import bulletsSpritesheetJson from '~/game/spritesheets/bullets.spritesheet.json'
import { eventBus } from '~/game/services/EventBus/EventBus'
import { IntersectionManager } from '~/game/services/IntersectionManager'

const BULLET_SPEED_FACTOR = 20

const PROJECTILE_RENDER_NAME = 'projectile'

export class Shooting extends AbstractGameElement {
  spritesheet!: Spritesheet

  timerId: number | null = null

  constructor(app: Application) {
    super(app)

    this.spritesheet = new Spritesheet(
      BaseTexture.from(bulletsSpritesheetJson.meta.image),
      bulletsSpritesheetJson
    )
    this.spritesheet.parse()
  }

  #changeBulletPosition(projectile: Sprite) {
    projectile.position.set(
      projectile.position.x +
        Math.cos(projectile.rotation) * BULLET_SPEED_FACTOR,
      projectile.position.y +
        Math.sin(projectile.rotation) * BULLET_SPEED_FACTOR
    )
  }

  get player() {
    return this.viewport.getChildByName('player') as Sprite
  }

  fire() {
    if (this.player) {
      const { player } = this

      this.timerId = window.setInterval(() => {
        const projectile = Sprite.from(this.spritesheet.textures.bullet1)
        projectile.position.set(player.position.x, player.position.y)
        projectile.rotation = player.rotation
        projectile.cullable = true
        projectile.name = PROJECTILE_RENDER_NAME
        this.viewport.addChild(projectile)

        eventBus.emit('fire', {
          x: projectile.position.x,
          y: projectile.position.y
        })
      }, 100)
    }
  }

  get isShooting() {
    return Boolean(this.timerId)
  }

  get projectiles() {
    return this.viewport.children.filter(
      (child) => child.name === PROJECTILE_RENDER_NAME
    ) as Sprite[]
  }

  ceaseFire() {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  protected update() {
    if (this.projectiles.length) {
      const { isOverlappedWithProjectile } = IntersectionManager.getInstance()
      eventBus.emit(
        'playerProjectilesChanged',
        this.projectiles.map((projectile) => ({
          x: projectile.position.x,
          y: projectile.position.y
        }))
      )

      this.projectiles.forEach((projectile) => {
        this.#changeBulletPosition(projectile)

        if (
          this.isIntersectedWithObstagles(projectile) ||
          this.isOutOfMap(projectile) ||
          isOverlappedWithProjectile({
            target: this.player,
            projectile
          })
        ) {
          projectile.removeFromParent()

          if (this.projectiles.length === 0) {
            eventBus.emit('playerProjectilesChanged', [])
          }
        }
      })
    }
  }
}
