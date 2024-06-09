import { AnimatedSprite, Application, BaseTexture, Spritesheet } from 'pixi.js'
// import playerShootingSpritesheetJson from './playerShooting.spritesheet.json'
import enemyWalkSpritesheetJson from './enemyWalk.spritesheet.json'
import { AbstractGameElement } from '../AbstractGameElement'
import { Shooting } from '../Shooting'

// const VELOCITY = 3

const ANIMATION_SPEED = 0.1666

export class Enemy extends AbstractGameElement {
  // firePlayerSpritesheet!: Spritesheet

  enemyWalkSpritesheet!: Spritesheet

  #enemy!: AnimatedSprite

  shooting!: Shooting

  constructor(app: Application) {
    super(app)

    this.#init().then(() => {
      this.shooting = new Shooting(app)
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

    // Make map camera to follow player
    // this.viewport.addChild(this.#enemy)
    // this.viewport.follow(this.#enemy, {
    //   speed: 1,
    //   acceleration: 1
    // })

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

  stop() {
    this.#enemy.stop()
  }

  // getGlobalPosition() {
  //   if (!this.background) return null
  //   // Subtract current player's position from background
  //   return Victor.fromObject(this.#enemy.position)
  //     .subtract(Victor.fromObject(this.background.position))
  //     .toObject()
  // }

  // get isIntersectedWithProjectile() {
  //   return
  // }

  protected update() {
    // if (KeyboardService.getInstance().isKeyPressed) {
    //   this.#move()
    // }
  }
}
