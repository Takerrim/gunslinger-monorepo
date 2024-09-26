import { setup } from 'xstate'

export const playerSetup = setup({
  types: {
    context: {} as {
      bonus: PlayerTypes.Bonus | null
      position: PlayerTypes.Position
      rotation: number
      hp: number
    },
    events: {} as
      | { type: 'move'; payload: PlayerTypes.Position }
      | { type: 'fire' }
      | { type: 'ceaseFire' }
      | { type: 'takeDamage'; payload: PlayerTypes.Data['hp'] }
      | { type: 'stopMoving' }
      | { type: 'stopMovingAndFiring' }
      | { type: 'collectBonus'; payload: PlayerTypes.Data['bonus'] }
      | { type: 'rotate'; payload: PlayerTypes.Data['rotation'] }
  }
})
