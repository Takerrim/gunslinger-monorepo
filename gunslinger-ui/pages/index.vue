<template>
  <div></div>
</template>

<script lang="ts" setup>
import useGame from '~/composables/useGame'

const blockchainStore = useBlockchainStore()

const { playerAddress } = storeToRefs(blockchainStore)

const { $api } = useNuxtApp()

$api.duel.start.post({
  playerAddress: playerAddress.value,
  playerDimensions: {
    width: 40,
    height: 30
  }
})

useGame()
</script>
