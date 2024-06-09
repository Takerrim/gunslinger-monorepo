import type { IPointData, Rectangle } from 'pixi.js'

let instance: Randomizer | null = null

export class Randomizer {
  private constructor() {}

  static getInstance() {
    if (!instance) {
      instance = new Randomizer()
    }
    return instance
  }

  getCoordsInRect(rect: Rectangle): IPointData {
    const x = Math.floor(Math.random() * rect.width) / 2
    const y = Math.floor(Math.random() * rect.height) / 2

    return {
      x,
      y,
    }
  }

  getPlacement() {
    return Math.random() > 0.5 ? 'horizontal' : 'vertical'
  }
}
