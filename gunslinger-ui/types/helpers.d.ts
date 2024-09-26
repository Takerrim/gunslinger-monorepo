import { Graphics } from 'pixi.js'
import type { ColorSource } from 'pixi.js'

export type DrawRectParams = {
  params: Parameters<InstanceType<typeof Graphics>['drawRect']>
  fillColor?: ColorSource
  radius?: number
  outline?: {
    width: number
    color: ColorSource
  }
}

export as namespace HelpersTypes
