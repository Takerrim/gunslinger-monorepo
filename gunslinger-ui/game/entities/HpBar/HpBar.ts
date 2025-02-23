import { drawRect } from '~/game/game.helpers'
import { AbstractGameElement } from '../AbstractGameElement'
import { Text, TextStyle, type Application, type Graphics } from 'pixi.js'
import FontFaceObserver from 'fontfaceobserver'

const HP_BAR_WIDTH = 200
const HP_BAR_HEIGHT = 30
const HP_BAR_NAME = 'hp_bar'
const TEXT = 'progress_text'

const FONT_FAMILY = 'Press Start 2P'

export class HpBar extends AbstractGameElement {
  constructor(app: Application) {
    super(app)
    this.#renderOutlineRect()
    this.renderProgressBar()
    this.#renderHpValue()
  }

  /** @param hp in percents */
  #computeCoords(hp = 100) {
    const rightMargin = HP_BAR_HEIGHT

    return {
      x: document.body.clientWidth - (HP_BAR_WIDTH + rightMargin),
      y: 14,
      width: (HP_BAR_WIDTH * hp) / 100,
      height: HP_BAR_HEIGHT
    }
  }

  #renderOutlineRect() {
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

  renderProgressBar(hp = 100) {
    const { x, y, width, height } = this.#computeCoords(hp)

    const rect = drawRect({
      params: [x, y, width, height],
      fillColor: '#FF0000'
    })

    rect.name = HP_BAR_NAME
    this.app.stage.addChild(rect)
  }

  async #renderHpValue() {
    const fontObserver = new FontFaceObserver(FONT_FAMILY)
    await fontObserver.load()

    const styles = new TextStyle({
      fontFamily: FONT_FAMILY,
      fill: '#ffffff',
      fontSize: 12
    })

    const text = new Text('100%', styles)
    text.name = TEXT
    text.x = document.body.clientWidth - 90
    text.y = 24
    this.app.stage.addChild(text)
  }

  // width of Graphics rect is changed with horizontal shift, i do not know why, cause of this, recreate progress bar with updated width
  updateHp(hp: number) {
    const hpBar = this.app.stage.getChildByName<Graphics>(HP_BAR_NAME)
    if (hpBar) {
      hpBar.removeFromParent()
    }

    const hpBarText = this.app.stage.getChildByName<Text>(TEXT)

    if (hpBarText) {
      hpBarText.text = `${hp}%`
    }

    this.renderProgressBar(hp)
  }

  protected update(): void {}
}
