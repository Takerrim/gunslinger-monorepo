export type Message = {
  event: 'duelStarted' | 'enemyDataUpdated' | 'enemyStopped'
  data: any
}

export as namespace RealtimeTypes
