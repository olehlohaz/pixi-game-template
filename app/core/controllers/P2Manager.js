import { Container, utils }  from 'pixi.js'
import p2  from 'p2'

class P2Manager extends utils.EventEmitter {

  constructor() {

    super()

    this._world
    this.lastTime
    this.fixedTimeStep = 1 / 60
    this.maxSubSteps = 10

  }

  get world() {
    return this._world
  }

  createWorld( gravityX = 0, gravityY = -9.82) {
    this._world = new p2.World({
        gravity: [ gravityX, gravityY ]
    })


    this._world.on('postStep', () => this.postUpdate() )

    return this._world
  }

  
  update(time) {

    const deltaTime = this.lastTime ? (time - this.lastTime) * 0.001 : 0;

    // Move bodies forward in time
    this._world.step(this.fixedTimeStep, deltaTime, this.maxSubSteps )

    this.lastTime = time

  }
  postUpdate() {

    this._world.bodies.forEach(function(elem) {
      elem.sprite.position.set( elem.position[0], elem.position[1] )
      elem.sprite.rotation = elem.angle
    })


  }

  
}

export default new P2Manager()