import {
  Application,
  BaseTexture,
  Sprite,
  Spritesheet,
  type IPointData
} from 'pixi.js'
import bloodSpot from '~/game/spritesheets/bloodSpot.json'
import { AbstractGameElement } from '../AbstractGameElement'
import { ParticleSystem } from '../ParticleSystem'

export class BloodSpot extends AbstractGameElement {
  #particleSystem

  constructor(app: Application, position: IPointData) {
    super(app)
    this.#particleSystem = new ParticleSystem(app)

    this.#init(position)
  }

  async #init(position: IPointData) {
    const spritesheet = new Spritesheet(
      BaseTexture.from(bloodSpot.meta.image),
      bloodSpot
    )
    await spritesheet.parse()

    const renderSpot = () => {
      const spot = Sprite.from(spritesheet.textures.spot3)

      this.viewport.addChild(spot)

      spot.position.set(position.x, position.y)

      return spot
    }

    this.#particleSystem.start({ createParticle: renderSpot })

    // this.#spot.play()

    // this.#spot.onComplete = () => {
    //   this.#spot.stop()
    // }
  }

  protected update(): void {}
}
