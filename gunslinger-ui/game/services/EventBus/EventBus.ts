import EventEmitter from 'eventemitter3'

type TEvents =
  | 'playerMoved'
  | 'fire'
  | 'ceaseFire'
  | 'rotate'
  | 'takeDamage'
  | 'playerStopped'

class EventBus extends EventEmitter<TEvents> {}

export const eventBus = new EventBus()
