export type Message = {
  event:
    | 'duelStarted'
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
