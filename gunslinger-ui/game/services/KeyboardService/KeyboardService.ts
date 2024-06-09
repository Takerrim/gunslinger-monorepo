let instance: KeyboardService | null = null

export class KeyboardService {
  #pressedKeysMap: Record<string, boolean> = {}

  private constructor() {}

  static getInstance() {
    if (instance) return instance
    instance = new KeyboardService()
    return instance
  }

  get isKeyPressed() {
    return Object.keys(this.#pressedKeysMap).length > 0
  }

  get movementDirection(): KeyboardServiceTypes.MovingDirection | null {
    if (!this.isKeyPressed) {
      return null
    }

    switch (true) {
      case this.#pressedKeysMap.w:
        if (this.#pressedKeysMap.d) {
          return 'right-up'
        }

        if (this.#pressedKeysMap.a) {
          return 'left-up'
        }

        return 'up'
      case this.#pressedKeysMap.s:
        if (this.#pressedKeysMap.a) {
          return 'left-down'
        }

        if (this.#pressedKeysMap.d) {
          return 'right-down'
        }

        return 'down'
      case this.#pressedKeysMap.a:
        if (this.#pressedKeysMap.w) {
          return 'left-up'
        }
        if (this.#pressedKeysMap.s) {
          return 'left-down'
        }

        return 'left'
      case this.#pressedKeysMap.d:
        if (this.#pressedKeysMap.w) {
          return 'right-up'
        }
        if (this.#pressedKeysMap.s) {
          return 'right-down'
        }

        return 'right'
    }

    return null
  }

  subscribeToKeyUp() {
    document.addEventListener('keyup', ({ key }) => {
      if (this.#pressedKeysMap[key]) {
        delete this.#pressedKeysMap[key]
      }
    })
  }

  subscribeToKeyPress() {
    document.addEventListener('keypress', ({ key }) => {
      this.#pressedKeysMap[key] = true
    })
  }
}
