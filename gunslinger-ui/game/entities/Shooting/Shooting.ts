import { Sprite, type Application, Spritesheet, BaseTexture } from 'pixi.js'
import { AbstractGameElement } from '../AbstractGameElement'
import bulletsSpritesheetJson from './bullets.spritesheet.json'
import { toGlobal } from '~/game/game.helpers'
import { eventBus } from '~/game/services/EventBus/EventBus'

const BULLET_SPEED_FACTOR = 20

export class Shooting extends AbstractGameElement {
  spritesheet!: Spritesheet

  timerId: NodeJS.Timeout | null = null

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
    return this.viewport.getChildByName('player')
  }

  fire() {
    if (this.player) {
      const { player } = this

      this.timerId = setInterval(() => {
        const projectile = Sprite.from(this.spritesheet.textures.bullet1)
        const playerGlobalPosition = toGlobal(player)
        projectile.position.set(playerGlobalPosition.x, playerGlobalPosition.y)
        projectile.rotation = player.rotation
        projectile.cullable = true
        projectile.name = 'projectile'
        this.app.stage.addChild(projectile)
      }, 100)
    }
  }

  get isShooting() {
    return Boolean(this.timerId)
  }

  get projectiles() {
    return this.app.stage.children.filter(
      (child) => child.name === 'projectile'
    ) as Sprite[]
  }

  ceaseFire() {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  protected update() {
    if (this.projectiles.length) {
      this.projectiles.forEach((projectile) => {
        this.#changeBulletPosition(projectile)

        if (this.isIntersected(projectile) || this.isOutOfMap(projectile)) {
          projectile.removeFromParent()
        }
      })

      eventBus.emit('fire', this.projectiles)
    }
  }
}
