import {
  AnimatedSprite,
  Application,
  BaseTexture,
  Spritesheet,
  type IPointData
} from 'pixi.js'
// import playerShootingSpritesheetJson from './playerShooting.spritesheet.json'
import enemyWalkSpritesheetJson from '~/game/spritesheets/enemyWalk.spritesheet.json'
import { AbstractGameElement } from '../AbstractGameElement'
import { EnemyShooting } from '../EnemyShooting'
import { BloodSpot } from '../BloodSpot'

// const VELOCITY = 3

const ANIMATION_SPEED = 0.1666

export class Enemy extends AbstractGameElement {
  enemyFireSpritesheet!: Spritesheet

  enemyWalkSpritesheet!: Spritesheet

  #enemy!: AnimatedSprite

  shooting!: EnemyShooting

  constructor(app: Application) {
    super(app)

    this.#init().then(() => {
      this.shooting = new EnemyShooting(app)
    })
  }

  get sprite() {
    return this.#enemy
  }

  async #init() {
    this.enemyWalkSpritesheet = new Spritesheet(
      BaseTexture.from(enemyWalkSpritesheetJson.meta.image),
      enemyWalkSpritesheetJson
    )
    await this.enemyWalkSpritesheet.parse()

    this.#enemy = new AnimatedSprite(this.enemyWalkSpritesheet.animations.enemy)

    this.#enemy.name = 'enemy'
    this.#enemy.scale.set(1.2, 1.2)
    this.#enemy.anchor.set(0.15, 0.5)
    this.#enemy.animationSpeed = ANIMATION_SPEED

    this.viewport.addChild(this.#enemy)

    // this.firePlayerSpritesheet = new Spritesheet(
    //   BaseTexture.from(playerShootingSpritesheetJson.meta.image),
    //   playerShootingSpritesheetJson
    // )
    // this.firePlayerSpritesheet.parse()
  }

  get isReady() {
    return this.#enemy !== undefined
  }

  move(position: PlayerTypes.Position) {
    if (!this.#enemy.playing) {
      this.#enemy.play()
    }

    this.#enemy.position.set(position.x, position.y)
  }

  rotate(rotation: PlayerTypes.Data['rotation']) {
    this.#enemy.rotation = rotation
  }

  fire(projectilePosition: IPointData) {
    // this.#enemy.textures = this.firePlayerSpritesheet.animations.player
    this.#enemy.play()
    this.shooting.fire(projectilePosition)
  }

  takeDamage() {
    const spot = new BloodSpot(this.app, this.#enemy.position)
  }

  stop() {
    this.#enemy.stop()
    this.#enemy.textures = this.enemyWalkSpritesheet.animations.enemy
  }

  // get isIntersectedWithProjectile() {
  //   return
  // }

  protected update() {}
}
