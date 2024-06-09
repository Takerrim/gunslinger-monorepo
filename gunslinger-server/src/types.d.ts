export type PlayerPosition = {
  x: number
  y: number
}

export type PlayerDimensions = {
  width: number
  height: number
}

export type PlayerData = {
  position: PlayerPosition | null
  initialPosition: PlayerPosition
  /** @value in radians */
  rotation: number | null
  dimensions: PlayerDimensions
  address: string
  hp: number
  bonus: null
}

export type Duel = {
  players: PlayerData[]
  winnerAddress: null | string
  status: 'active'
}

export as namespace Types
