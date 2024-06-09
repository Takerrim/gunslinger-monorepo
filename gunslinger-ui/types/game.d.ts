export type Duel = {
  players: PlayerTypes.Data[]
  winnerAddress: null | string
  status: 'active'
  duelId: number
}

export type Map = {
  width: number
  height: number
  obstagles: {
    width: number
    height: number
    position: { x: number; y: number }
  }[]
}

export as namespace GameTypes
