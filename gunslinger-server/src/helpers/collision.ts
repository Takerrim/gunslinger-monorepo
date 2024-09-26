type CollisionItem = {
  position: Types.Position
  dimensions: Types.Dimensions
}

export const testCollision = (object: CollisionItem, target: CollisionItem) =>
  object.position.x >= target.position.x &&
  object.position.x <= target.position.x + target.dimensions.width &&
  object.position.y >= target.position.y &&
  object.position.y <= target.position.y + target.dimensions.height
