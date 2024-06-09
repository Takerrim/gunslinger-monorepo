import { Graphics } from 'pixi.js'
import type { ColorSource } from 'pixi.js'

export type MovingDirection =
  | 'right-up'
  | 'up'
  | 'left-up'
  | 'down'
  | 'right'
  | 'right-down'
  | 'left'
  | 'left-down'

export as namespace KeyboardServiceTypes
