import type { Sprite } from 'pixi.js'

type AugmentedSprite = Sprite & {
  gx?: number
  gy?: number
  centerX?: number
  centerY?: number
  halfWidth?: number
  halfHeight?: number
  xAnchorOffset?: number
  yAnchorOffset?: number
  _bumpPropertiesAdded?: boolean
}

const addCollisionProperties = (sprite: AugmentedSprite) => {
  //Add properties to Pixi sprites
  //gx
  if (sprite.gx === undefined) {
    Object.defineProperty(sprite, 'gx', {
      get() {
        return sprite.getGlobalPosition().x
      },
      enumerable: true,
      configurable: true
    })
  }

  //gy
  if (sprite.gy === undefined) {
    Object.defineProperty(sprite, 'gy', {
      get() {
        return sprite.getGlobalPosition().y
      },
      enumerable: true,
      configurable: true
    })
  }

  //centerX
  if (sprite.centerX === undefined) {
    Object.defineProperty(sprite, 'centerX', {
      get() {
        return sprite.x + sprite.width / 2
      },
      enumerable: true,
      configurable: true
    })
  }

  //centerY
  if (sprite.centerY === undefined) {
    Object.defineProperty(sprite, 'centerY', {
      get() {
        return sprite.y + sprite.height / 2
      },
      enumerable: true,
      configurable: true
    })
  }

  //halfWidth
  if (sprite.halfWidth === undefined) {
    Object.defineProperty(sprite, 'halfWidth', {
      get() {
        return sprite.width / 2
      },
      enumerable: true,
      configurable: true
    })
  }

  //halfHeight
  if (sprite.halfHeight === undefined) {
    Object.defineProperty(sprite, 'halfHeight', {
      get() {
        return sprite.height / 2
      },
      enumerable: true,
      configurable: true
    })
  }

  //xAnchorOffset
  if (sprite.xAnchorOffset === undefined) {
    Object.defineProperty(sprite, 'xAnchorOffset', {
      get() {
        if (sprite.anchor !== undefined) {
          return sprite.width * sprite.anchor.x
        } else {
          return 0
        }
      },
      enumerable: true,
      configurable: true
    })
  }

  //yAnchorOffset
  if (sprite.yAnchorOffset === undefined) {
    Object.defineProperty(sprite, 'yAnchorOffset', {
      get() {
        if (sprite.anchor !== undefined) {
          return sprite.height * sprite.anchor.y
        } else {
          return 0
        }
      },
      enumerable: true,
      configurable: true
    })
  }

  sprite._bumpPropertiesAdded = true
}

export const rectangleCollision = (
  r1: AugmentedSprite,
  r2: AugmentedSprite,
  global = true
) => {
  //Add collision properties
  if (!r1._bumpPropertiesAdded) addCollisionProperties(r1)
  if (!r2._bumpPropertiesAdded) addCollisionProperties(r2)

  const augmentedR1 = r1 as Required<AugmentedSprite>
  const augmentedR2 = r2 as Required<AugmentedSprite>

  let collision,
    combinedHalfWidths,
    combinedHalfHeights,
    overlapX,
    overlapY,
    vx,
    vy

  //Calculate the distance vector
  if (global) {
    vx =
      augmentedR1.gx +
      Math.abs(augmentedR1.halfWidth) -
      augmentedR1.xAnchorOffset -
      (augmentedR2.gx +
        Math.abs(augmentedR2.halfWidth) -
        augmentedR2.xAnchorOffset)
    vy =
      augmentedR1.gy +
      Math.abs(augmentedR1.halfHeight) -
      augmentedR1.yAnchorOffset -
      (augmentedR2.gy +
        Math.abs(augmentedR2.halfHeight) -
        augmentedR2.yAnchorOffset)
  } else {
    //vx = augmentedR1.centerX - augmentedR2.centerX;
    //vy = augmentedR1.centerY - augmentedR2.centerY;
    // vx =
    //   augmentedR1.x +
    //   Math.abs(augmentedR1.halfWidth) -
    //   augmentedR1.xAnchorOffset -
    //   (augmentedR2.x + Math.abs(augmentedR2.halfWidth) - augmentedR2.xAnchorOffset)
    // vy =
    //   augmentedR1.y +
    //   Math.abs(augmentedR1.halfHeight) -
    //   augmentedR1.yAnchorOffset -
    //   (augmentedR2.y + Math.abs(augmentedR2.halfHeight) - augmentedR2.yAnchorOffset)
  }

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths =
    Math.abs(augmentedR1.halfWidth) + Math.abs(augmentedR2.halfWidth)
  combinedHalfHeights =
    Math.abs(augmentedR1.halfHeight) + Math.abs(augmentedR2.halfHeight)

  //Check whether vx is less than the combined half widths
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring!
    //Check whether vy is less than the combined half heights
    if (Math.abs(vy) < combinedHalfHeights) {
      //A collision has occurred! This is good!
      //Find out the size of the overlap on both the X and Y axes
      overlapX = combinedHalfWidths - Math.abs(vx)
      overlapY = combinedHalfHeights - Math.abs(vy)

      //The collision has occurred on the axis with the
      //*smallest* amount of overlap. Let's figure out which
      //axis that is

      if (overlapX >= overlapY) {
        //The collision is happening on the X axis
        //But on which side? vy can tell us

        if (vy > 0) {
          collision = 'top'
          //Move the rectangle out of the collision
          augmentedR1.y = augmentedR1.y + overlapY
        } else {
          collision = 'bottom'
          //Move the rectangle out of the collision
          augmentedR1.y = augmentedR1.y - overlapY
        }
      } else {
        //The collision is happening on the Y axis
        //But on which side? vx can tell us

        if (vx > 0) {
          collision = 'left'
          //Move the rectangle out of the collision
          augmentedR1.x = augmentedR1.x + overlapX
        } else {
          collision = 'right'
          //Move the rectangle out of the collision
          augmentedR1.x = augmentedR1.x - overlapX
        }
      }
    } else {
      //No collision
    }
  } else {
    //No collision
  }

  //Return the collision string. it will be either "top", "right",
  //"bottom", or "left" depending on which side of r1 is touching r2.
  return collision
}
