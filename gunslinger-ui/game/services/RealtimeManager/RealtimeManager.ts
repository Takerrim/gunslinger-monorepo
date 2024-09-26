import Sarus from '@anephenix/sarus'
import EventEmitter from 'eventemitter3'
import type { IPointData } from 'pixi.js'

let instance: RealtimeManager | null = null

export class RealtimeManager extends EventEmitter<
  RealtimeTypes.Message['event']
> {
  static getInstance() {
    if (!instance) {
      instance = new RealtimeManager()
    }

    return instance
  }

  #ws!: Sarus

  initConnection(url: string) {
    this.#ws = new Sarus({
      url,
      eventListeners: {
        message: [this.handleMessage.bind(this)]
      },
      reconnectAutomatically: false
    })
  }

  sendPlayerPosition(position: IPointData) {
    this.#ws.send(
      JSON.stringify({ event: 'changePlayerPosition', data: position })
    )
  }

  sendPlayerStoppedEvent() {
    this.#ws.send(JSON.stringify({ event: 'playerStopped' }))
  }

  sendPlayerRotation(rotation: number) {
    this.#ws.send(
      JSON.stringify({ event: 'changePlayerRotation', data: rotation })
    )
  }

  sendPlayerFiredEvent(projectile: IPointData) {
    this.#ws.send(JSON.stringify({ event: 'playerFired', data: projectile }))
  }

  sendProjectiles(projectiles: IPointData[]) {
    this.#ws.send(
      JSON.stringify({ event: 'updateProjectiles', data: projectiles })
    )
  }

  checkIsDuelReady() {
    this.#ws.send(JSON.stringify({ event: 'waitDuel' }))
  }

  handleMessage(event: any) {
    try {
      const parsedMessage = JSON.parse(event.data) as RealtimeTypes.Message
      this.emit(parsedMessage.event, parsedMessage.data)
    } catch (e) {
      console.error(e)
    }
  }
}
