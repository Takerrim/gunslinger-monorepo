import { initGame } from '~/game/bootstrap'
import { RealtimeManager } from '~/game/services/RealtimeManager'

export default () => {
  const duelStore = useDuelStore()

  const { $api } = useNuxtApp()

  const blockchainStore = useBlockchainStore()

  const { playerAddress } = storeToRefs(blockchainStore)

  onMounted(async () => {
    const realtimeManager = RealtimeManager.getInstance()

    realtimeManager.on('duelStarted', async (duel: GameTypes.Duel) => {
      duelStore.setDuel(duel)

      const { data: map } = await $api.config.map.get()

      if (map) {
        initGame(map)
      }
    })

    realtimeManager.initConnection(
      `ws://localhost:5005/api/realtime/duel?userAddress=${playerAddress.value}`
    )
    realtimeManager.checkIsDuelReady()
  })
}
