import { GAME_MAP } from '../constants'

/**
 * TODO: Неправильно
 * @description normalize position relatively to map center
 * @returns normalized position
 */
export const normalizeProjectilePosition = (position: Types.Position) => {
  return {
    x: position.x,
    y: position.y,
  }
}
