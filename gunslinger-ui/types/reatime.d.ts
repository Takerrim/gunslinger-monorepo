export type Message = {
  event:
    | 'duelStarted'
    | 'win'
    | 'loss'
    | 'enemyDataUpdated'
    | 'enemyStopped'
    | 'enemyFired'
    | 'enemyCeasedFire'
    | 'enemyProjectilesChanged'
    | 'damageReceived'
    | 'hitEnemy'
  data: any
}

export as namespace RealtimeTypes
