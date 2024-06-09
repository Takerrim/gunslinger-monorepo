export const useDuelStore = defineStore('duel', () => {
  const blockchainStore = useBlockchainStore()

  const duel = ref<GameTypes.Duel | null>(null)

  const player = computed(
    () =>
      duel.value?.players.find(
        (player) => player.address === blockchainStore.playerAddress
      )
  )

  const setDuel = (data: GameTypes.Duel | null) => {
    duel.value = data
  }

  return {
    duel,
    player,
    setDuel
  }
})
