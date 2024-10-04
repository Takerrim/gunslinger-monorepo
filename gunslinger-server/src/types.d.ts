export type Position = {
  x: number
  y: number
}

export type Dimensions = {
  width: number
  height: number
}

export type PlayerData = {
  position: Position
  /** @value in radians */
  rotation: number | null
  dimensions: PlayerDimensions
  address: string
  /** In percents */
  hp: number
  bonus: null
}

type UserAddress = string

export type Duel = {
  players: Record<UserAddress, PlayerData>
  winnerAddress: null | string
  status: 'active'
}

export as namespace Types
