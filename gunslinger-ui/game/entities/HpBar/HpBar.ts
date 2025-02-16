import { drawRect } from '~/game/game.helpers'
import { AbstractGameElement } from '../AbstractGameElement'
import type { Application, Sprite } from 'pixi.js'

const HP_BAR_WIDTH = 200
const HP_BAR_HEIGHT = 30
const HP_BAR_NAME = 'hp_bar'

export class HpBar extends AbstractGameElement {
  constructor(app: Application) {
    super(app)
    this.#renderOutline()
    this.render()
  }

  /** @param hp in percents */
  #computeCoords(hp = 100) {
    const rightMargin = HP_BAR_HEIGHT

    return {
      x: document.body.clientWidth - (HP_BAR_WIDTH + rightMargin),
      y: 15,
      width: (HP_BAR_WIDTH * hp) / 100,
      height: HP_BAR_HEIGHT
    }
  }

  #renderOutline() {
    const { x, y, width, height } = this.#computeCoords()

    const rect = drawRect({
      params: [x, y, width, height],
      outline: {
        width: 1,
        color: '#000000'
      }
    })
    this.app.stage.addChild(rect)
  }

  render() {
    const { x, y, width, height } = this.#computeCoords()

    const rect = drawRect({
      params: [x, y, width, height],
      fillColor: '#FF0000'
    })

    rect.name = HP_BAR_NAME
    this.app.stage.addChild(rect)
  }

  updateHp(hp: number) {
    const hpBar = this.app.stage.getChildByName(HP_BAR_NAME) as Sprite
    if (hpBar) {
      const { width } = this.#computeCoords(hp)
      hpBar.width = width
    }
  }

  protected update(): void {}
}
