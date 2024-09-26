import { TilingSprite, type Application, Texture } from 'pixi.js'
import { AbstractGameElement } from '../AbstractGameElement'

export class Background extends AbstractGameElement {
  #background = new TilingSprite(Texture.from('/img/background2.png'))

  constructor(app: Application, map: GameTypes.Map) {
    super(app)

    this.#background.width = map.width
    this.#background.height = map.height
    this.#background.position.set(-(map.width / 2), -(map.height / 2))

    this.#background.name = 'background'
  }

  get sprite() {
    return this.#background
  }

  protected update() {}
}
