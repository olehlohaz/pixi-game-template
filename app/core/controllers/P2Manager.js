import { AnimationManager, RendererManager, Timer }  from '../core'
import { Container, utils, TARGET_FPMS, ticker }  from 'pixi.js'
import p2  from 'p2'

/**
 * P2Manager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */

class P2Manager extends utils.EventEmitter {

  constructor() {

    super()

    

    this._world
    this.maxSubSteps = 1
    this.SIZE = 50
    this.debug = false
    this.outOfBoundsKill = false

    this.collisionGroups = new Map()

  }

  group( name ) {
    return this.collisionGroups.get( name )
  }

  createCollisionGroup( name ) {
    this.collisionGroups.set( name, Math.pow(2, this.collisionGroups.size ) )
  }

  setContactMaterial( material1, material2, config ) {

    const contactMaterial = new p2.ContactMaterial(material1, material2, config)
    this._world.addContactMaterial( contactMaterial )

  }


  onAddBody(data) {
    if(!data.body.sprite) {
      return
    }
    data.body.sprite.visible = true
  }

  get world() {
    return this._world
  }


  createMaterial() {
    return new p2.Material()
  }

  reset() {
    
    if( this.updateFunc ) {
      ticker.shared.remove( this.updateFunc, this )
    }

    if( this._world ) {


      this._world.off(this.POST_STEP, this.postUpdate, this )
      this._world.off(this.ADD_BODY, this.onAddBody, this )
      this._world.off(this.BEGIN_CONTACT, this.onBeginContact, this )
      this._world.off(this.END_CONTACT, this.onEndContact, this )


      this.collisionGroups.clear()
      
      this._world.clear()
    }
    this._world = null

  }

  start() {

    this.updateFunc = (time) => this.update(time)
    ticker.shared.add( this.updateFunc, this )

  }

  createWorld( gravityX = 0, gravityY = 9.82) {

    this.createCollisionGroup('EVERYTHING')

    this._world = new p2.World({
        gravity: [ gravityX, gravityY ]
    })

    this._world.on(this.POST_STEP, this.postUpdate, this )
    this._world.on(this.ADD_BODY, this.onAddBody, this )
    this._world.on(this.BEGIN_CONTACT, this.onBeginContact, this )
    this._world.on(this.END_CONTACT, this.onEndContact, this )

    return this._world
  }

  checkRaycast( shape1, shape2 ) {
    let rayClosest = new p2.Ray({
      mode: p2.Ray.CLOSEST
    })
    let result = new p2.RaycastResult()
    
    let global1 = []
    shape1.body.toWorldFrame(global1, shape1.position)

    let global2 = []
    shape2.body.toWorldFrame(global2, shape2.position)

    
    p2.vec2.copy( rayClosest.from, global1 )
    p2.vec2.copy( rayClosest.to, shape2.position )
    rayClosest.update()

    this._world.raycast( result, rayClosest )

    result.ray = rayClosest

    return result
  }

  onBeginContact(event) {

    if(event.bodyA.sprite) {
      event.bodyA.sprite.emit( this.BEGIN_CONTACT, event.bodyA, event.bodyB, event.shapeA, event.shapeB, this.checkRaycast( event.shapeA, event.shapeB ) )
    }
    if(event.bodyB.sprite) {
      event.bodyB.sprite.emit( this.BEGIN_CONTACT, event.bodyB, event.bodyA, event.shapeB, event.shapeA, this.checkRaycast( event.shapeB, event.shapeA ) )
    }
  }

  onEndContact(event) {

    if(event.bodyA.sprite) {
      event.bodyA.sprite.emit( this.END_CONTACT, event.bodyA, event.bodyB, event.shapeA, event.shapeB, this.checkRaycast( event.shapeA, event.shapeB ) )
    }
    if(event.bodyB.sprite) {
      event.bodyB.sprite.emit( this.END_CONTACT, event.bodyB, event.bodyA, event.shapeB, event.shapeA, this.checkRaycast( event.shapeB, event.shapeA ) )
    }
  }
  
  update(time) {
    if(!this._world) {
      return
    }
    this._world.step(TARGET_FPMS, time*TARGET_FPMS, this.maxSubSteps )
  }
  postUpdate() {
    this._world.bodies.forEach( (body) => this.updateBody(body) )
  }

  updateBody(body) {

    if(!body.sprite) {
      return
    }

    body.sprite.position.set( body.position[0] * this.SIZE, body.position[1] * this.SIZE )
    body.sprite.rotation = body.angle
    
  }

  get BEGIN_CONTACT() { return 'beginContact' }
  get END_CONTACT() { return 'endContact' }
  get IMPACT() { return 'impact' }
  get ADD_BODY() { return 'addBody' }
  get POST_STEP() { return 'postStep' }
  
}

export default new P2Manager()