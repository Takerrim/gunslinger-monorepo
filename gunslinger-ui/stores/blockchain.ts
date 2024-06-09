import { defineStore } from 'pinia'

export const useBlockchainStore = defineStore('blockchain', () => {
  // TODO: get address from wallet
  const playerAddress = computed(
    () => `0x000${Math.floor(Math.random() * 100)}`
  )

  return {
    playerAddress
  }
})
