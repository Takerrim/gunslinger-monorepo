<template>
  <div></div>
</template>

<script lang="ts" setup>
import useGame from '~/composables/useGame'

const blockchainStore = useBlockchainStore()

const { playerAddress } = storeToRefs(blockchainStore)

useAppFetch('/api/duel/start', {
  method: 'POST',
  body: {
    playerAddress: playerAddress.value,
    playerDimensions: {
      width: 40,
      height: 30,
    },
  },
})

useGame()
</script>
