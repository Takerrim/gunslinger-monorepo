export const GAME_MAP = {
  width: 3000,
  height: 1500,
  obstagles: [
    {
      width: 40,
      height: 300,
      position: {
        x: 400,
        y: 500,
      },
    },
  ],
}

export const WEAPON = {
  riffle: {
    projectileDimensions: {
      width: 12,
      height: 3,
    },
    // In percensts
    // TODO: replace value with blockchain constant of specific weapon
    damage: 13,
  },
}
