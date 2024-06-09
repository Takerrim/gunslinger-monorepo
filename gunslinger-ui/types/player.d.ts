import type { IPointData, Point } from 'pixi.js'

export type Bonus = 'a' | 'b' | 'c'

export type Position = IPointData

export type PlayerDimensions = {
  width: number
  height: number
}

export type Data = {
  position: Position
  initialPosition: Position
  /** @value in radians */
  rotation: number
  dimensions: PlayerDimensions
  address: string
  hp: number
  bonus: Bonus | null
}

export as namespace PlayerTypes
