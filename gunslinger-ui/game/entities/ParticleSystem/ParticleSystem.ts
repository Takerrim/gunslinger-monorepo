import type { Application, DisplayObject } from 'pixi.js'

type Params = {
  amount?: number
  step?: number
  createParticle: () => DisplayObject
}

export class ParticleSystem {
  #app!: Application

  constructor(_app: Application) {
    this.#app = _app
  }

  start(args: Params) {
    const { createParticle, amount, step } = Object.assign(
      { amount: 10, step: 10 },
      args
    )

    for (let i = 1; i <= amount; ++i) {
      const particle = createParticle()

      const speed = 2 + Math.random() * 4
      const angle = Math.random() * Math.PI * 2
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      }

      let tickCount = 0

      const tickHandler = () => {
        particle.position.x += velocity.x
        particle.position.y += velocity.y

        const friction = 0.95
        velocity.x *= friction
        velocity.y *= friction

        if (tickCount >= 10) {
          this.#app.ticker.remove(tickHandler)
        }

        tickCount += 1
      }

      this.#app.ticker.add(tickHandler)
    }
  }
}
