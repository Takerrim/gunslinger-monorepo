export class RealtimeService {
  getEnemyAddress(players: Types.Duel['players'], userAddress: string) {
    return Object.values(players).find(
      (player) => player.address !== userAddress
    )?.address
  }

  getErrorData(data: string) {
    return {
      event: 'error',
      data,
    }
  }
}
