import { drawRect } from '~/game/game.helpers'
import { AbstractGameElement } from '../AbstractGameElement'
import type { Application } from 'pixi.js'

const HP_BAR_WIDTH = 200
const HP_BAR_HEIGHT = 30

export class HpBar extends AbstractGameElement {
  constructor(app: Application) {
    super(app)
    this.#renderOutline()
    this.render(100)
  }

  #computeCoords() {
    const rightMargin = HP_BAR_HEIGHT
    return {
      x: document.body.clientWidth - (HP_BAR_WIDTH + rightMargin),
      y: 15,
      width: HP_BAR_WIDTH,
      height: HP_BAR_HEIGHT,
    }
  }

  #renderOutline() {
    const { x, y, width, height } = this.#computeCoords()

    drawRect({
      params: [x, y, width, height],
      anchor: this.app.stage,
      outline: {
        width: 1,
        color: '#000000',
      },
    })
  }

  render(hp: number) {
    const { x, y, width, height } = this.#computeCoords()

    drawRect({
      params: [x, y, width - HP_BAR_HEIGHT, height],
      anchor: this.app.stage,
      fillColor: '#FF0000',
    })
  }

  protected update(): void {}
}
