import { DisplayObject, Graphics, Point, Sprite } from 'pixi.js'

export const drawRect = ({
  params,
  fillColor,
  radius,
  outline
}: HelpersTypes.DrawRectParams) => {
  const graphics = new Graphics()
  if (fillColor) {
    graphics.beginFill(fillColor)
  }

  if (outline) {
    graphics.lineStyle({ width: outline.width, color: outline.color })
  }

  if (radius) {
    graphics.drawRoundedRect(...params, radius)
  } else {
    graphics.drawRect(...params)
  }

  return graphics
}

// export const degreeToRadian = (degree: number) =>  degree * (Math.PI / 180)

export const calculateAngle = (dx: number, dy: number) => Math.atan2(dy, dx)

/** Calculate position relatively top-left side of viewport */
export const toViewport = (obj: DisplayObject) => obj.toGlobal(new Point(0, 0))

export const getDistance = (target1: Sprite, target2: Sprite) =>
  Math.hypot(Math.abs(target2.x - target1.x), Math.abs(target2.y - target1.y))
