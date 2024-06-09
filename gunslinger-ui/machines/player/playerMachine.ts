import { assign, createActor } from 'xstate'
import { playerSetup } from './playerSetup'

const playerMachine = playerSetup.createMachine({
  context: {
    bonus: null as PlayerTypes.Bonus | null,
    position: {
      x: 0,
      y: 0
    },
    rotation: 0,
    hp: 100,
    spawnSide: 'left'
  },
  id: 'player',
  initial: 'idle',
  on: {
    setSpawnSide: {
      actions: assign({ spawnSide: ({ event }) => event.payload })
    }
  },
  states: {
    idle: {
      on: {
        move: {
          target: 'active.moving.inMotion',
          actions: assign({
            position: ({ event }) => event.payload
          })
        },
        fire: {
          target: 'active.firing.firing'
        },
        takeDamage: {
          actions: assign({
            hp: ({ event, context }) => context.hp - event.payload
          })
        }
      },
      description: 'The player is not moving or firing, just standing still.'
    },
    active: {
      type: 'parallel',
      description:
        'The player is engaged in the game, either moving, firing or both.',
      on: {
        stopMovingAndFiring: {
          target: 'idle'
        },
        collectBonus: {
          actions: assign({
            bonus: ({ event }) => event.payload
          })
        },
        takeDamage: {
          actions: assign({
            hp: ({ event, context }) => context.hp - event.payload
          })
        }
      },
      states: {
        moving: {
          initial: 'still',
          states: {
            still: {
              on: {
                move: {
                  target: 'inMotion',
                  actions: assign({
                    position: ({ event }) => event.payload
                  })
                }
              },
              description: 'The player is not currently moving but is active.'
            },
            inMotion: {
              on: {
                stopMoving: {
                  target: 'still'
                },
                move: {
                  actions: assign({
                    position: ({ event }) => event.payload
                  })
                },
                rotate: {
                  actions: assign({
                    rotation: ({ event }) => event.payload
                  })
                }
              },
              description: 'The player is moving to a new position.'
            }
          }
        },
        firing: {
          initial: 'notFiring',
          states: {
            notFiring: {
              on: {
                fire: {
                  target: 'firing'
                }
              },
              description: 'The player is active but not currently firing.'
            },
            firing: {
              on: {
                ceaseFire: {
                  target: 'notFiring'
                }
              },
              description: 'The player is actively firing.'
            }
          }
        }
      }
    },
    died: {
      type: 'final'
    }
  }
})

export const playerActor = createActor(playerMachine)
