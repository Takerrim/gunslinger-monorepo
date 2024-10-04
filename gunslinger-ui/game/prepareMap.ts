import { Viewport } from 'pixi-viewport'
import type { Application } from 'pixi.js'
import { Background } from './entities/Background'
import { HpBar } from './entities/HpBar'
import { Wall } from './entities/Wall'
import { IntersectionManager } from './services/IntersectionManager'
import { renderEnemy } from './renderEnemy'
import { renderPlayer } from './renderPlayer'
import { RealtimeManager } from './services/RealtimeManager'

const buildWalls = (app: Application, map: GameTypes.Map) => {
  map.obstagles.forEach((obstagles) => {
    const wall = new Wall(app)
    wall.setCoords({ x: obstagles.position.x, y: obstagles.position.y })
    wall.setDimensions({ width: obstagles.width, height: obstagles.height })
    IntersectionManager.getInstance().addObstacle(wall.wallSprite)
  })
}

export const prepareMap = (app: Application, map: GameTypes.Map) => {
  const viewport = new Viewport({
    worldWidth: window.document.body.clientWidth,
    worldHeight: window.document.body.clientHeight,
    events: app.renderer.events
  })

  viewport.name = 'viewport'

  app.stage.addChild(viewport)

  const background = new Background(app, map)
  viewport.addChild(background.sprite)

  const hpBar = new HpBar(app)

  const realtimeManager = RealtimeManager.getInstance()

  realtimeManager.on('damageReceived', (data: { hp: number }) => {
    hpBar.updateHp(data.hp)
  })

  renderPlayer(app, map)
  renderEnemy(app)

  buildWalls(app, map)
}
