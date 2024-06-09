import { initGame } from '~/game/bootstrap'
import { RealtimeManager } from '~/game/services/RealtimeManager'

export default () => {
  const duelStore = useDuelStore()

  const blockchainStore = useBlockchainStore()

  const { playerAddress } = storeToRefs(blockchainStore)

  onMounted(async () => {
    const realtimeManager = RealtimeManager.getInstance()

    realtimeManager.on('duelStarted', async (duel: GameTypes.Duel) => {
      duelStore.setDuel(duel)

      const map = await $fetch<GameTypes.Map>(
        'http://localhost:5005/api/config/map',
        {
          method: 'GET'
        }
      )

      initGame(map)
    })

    realtimeManager.initConnection(
      `ws://localhost:5005/api/realtime/duel?userAddress=${playerAddress.value}`
    )
    realtimeManager.checkIsDuelReady()
  })
}
