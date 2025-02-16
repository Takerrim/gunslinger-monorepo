import EventEmitter from 'eventemitter3'

type TEvents =
  | 'playerMoved'
  | 'fire'
  | 'playerProjectilesChanged'
  | 'ceaseFire'
  | 'rotate'
  | 'takeDamage'
  | 'playerStopped'

/** @description Transfer data from game entities to realtimeManager  */
class EventBus extends EventEmitter<TEvents> {}

export const eventBus = new EventBus()
