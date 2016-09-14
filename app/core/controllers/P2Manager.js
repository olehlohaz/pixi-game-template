import { AnimationManager, RendererManager }  from '../core'
import { Container, utils, TARGET_FPMS }  from 'pixi.js'
import p2  from 'p2'

class P2Manager extends utils.EventEmitter {

  constructor() {

    super()

    this.EVENTS = {
      BEGIN_CONTACT:  'beginContact',
      END_CONTACT:    'endContact',
      IMPACT:         'impact'
    }

    this._world
    this.maxSubSteps = 10
    this.SIZE = 50
    this.debug = false
    this.outOfBoundsKill = false
  }

  get world() {
    return this._world
  }


  // impact
  // endContact
  // beginContact


  start() {
    AnimationManager.addEventListener( (time) => this.update(time) )
  }

  createWorld( gravityX = 0, gravityY = 9.82) {
    this._world = new p2.World({
        gravity: [ gravityX, gravityY ]
    })


    this._world.on('postStep', () => this.postUpdate() )

    return this._world
  }

  
  update(time) {
    this._world.step(TARGET_FPMS, time*TARGET_FPMS, this.maxSubSteps )
  }
  postUpdate() {
    this._world.bodies.forEach( (body) => this.updateBody(body) )
  }

  updateBody(body) {
    
    body.sprite.position.set( body.interpolatedPosition[0] * this.SIZE, body.interpolatedPosition[1] * this.SIZE )
    body.sprite.rotation = body.angle
    
    if(this.outOfBoundsKill || body.sprite.outOfBoundsKill) {
      const p = body.sprite.toGlobal({x:0, y: 0})
      if(p.x + body.sprite.width < 0 || 
            p.y + body.sprite.height < 0 || 
            p.x - body.sprite.width > RendererManager.width || 
            p.y - body.sprite.height > RendererManager.height) {

        body.sprite.destroy()

      }
    }
  }
  
}

export default new P2Manager()