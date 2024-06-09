import {
  TilingSprite,
  type Application,
  Texture,
  type IPointData,
  Rectangle
} from 'pixi.js'
import { AbstractGameElement } from '../AbstractGameElement'

export class Wall extends AbstractGameElement {
  #sprite: TilingSprite

  constructor(app: Application) {
    super(app)
    this.#sprite = new TilingSprite(Texture.from('/img/walls/green-wall.png'))
    this.#sprite.name = 'wall'
    this.#sprite.width = 10
    this.#sprite.height = 50

    // const { getCoordsInRect, getPlacement } = Randomizer.getInstance()

    // const { x, y } = getCoordsInRect(this.viewport.getBounds())
    // this.#sprite.position.set(x, y)

    // const placement = getPlacement()
    // if (placement === 'horizontal') {
    //   this.#sprite.rotation = Math.PI / 2
    // }

    this.viewport.addChild(this.#sprite)
  }

  get wallSprite() {
    return this.#sprite
  }

  setCoords({ x, y }: IPointData) {
    this.#sprite.position.set(
      x - this.app.view.width / 2,
      y - this.app.view.height / 2
    )
  }

  setDimensions({ width, height }: Pick<Rectangle, 'width' | 'height'>) {
    this.#sprite.width = width
    this.#sprite.height = height
  }

  // setPlacement(placement: CommonTypes.Placement) {
  //   if (placement === 'horizontal') {
  //     this.#sprite.rotation = Math.PI / 2
  //   }
  // }

  update() {}
}
