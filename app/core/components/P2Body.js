import { P2Manager }  from '../core'
import { Container, Graphics, utils }  from 'pixi.js'
import p2  from 'p2'

export default class P2Body extends Container {

  constructor( world, x = 0, y = 0, mass = 1, angle = 0 ) {

    super()

    this.world = world

    this.createBody({
      position: [ x/P2Manager.SIZE, y/P2Manager.SIZE ],
      mass: mass,
      angle: Math.radians( angle )
      // collisionGroup // Math.pow(2,3)  // Belongs to the SHIP group
      // collisionMask   BULLET | SHIP  // Math.pow(2,3)  // Only collide with the ASTEROID group
      // fixedRotation
      // damping
      // angularDamping
    })

    this.position.set( x, y )
    this.angle = angle
    this.outOfBoundsKill = false

  }

  set kinematic(value) {
    if(value) {
      this.body.type = p2.Body.KINEMATIC
    } else {
      this.body.type = p2.Body.DYNAMIC
    }
  }

  // applyForceLocal([0, keyUp * 2]);

  // applyImpulse

  // applyForce

  // applyImpulseLocal


  get angle() {
    return Math.degrees(this.rotation) % 360
  }
  set angle(value) {
    this.rotation = Math.radians(value)
    this.body.angle = Math.radians(value)
  }

  set x(value) {
    this.body.position[0] = value/P2Manager.SIZE
  }
  set y(value) {
    this.body.position[1] = value/P2Manager.SIZE
  }
  get x() { return this.position.x }
  get y() { return this.position.y }

  createBody( config ) {

    this.body = new p2.Body(config)
    this.world.addBody( this.body )

    this.body.sprite = this
  }
  
  addCircle( radius = 10 ) {
    const shape = new p2.Circle( { radius: radius/P2Manager.SIZE } )
    this.body.addShape( shape )

    const image = new Graphics()
    image.lineStyle(1, 0x009900, 0.5)
    image.beginFill( 0x009900, 0.1 )
    image.drawCircle( 0, 0, radius)
    image.endFill()

    this.addChild(image)

    if( !P2Manager.debug ) {
      this.sprite = image
    }

    return shape
  }

  addBox(width = 10, height = 10) {

    const shape = new p2.Box( { width: width/P2Manager.SIZE, height: height/P2Manager.SIZE } )
    this.body.addShape( shape )

    const image = new Graphics()
    image.lineStyle(1, 0x009900, 0.5)
    image.beginFill( 0x009900, 0.1 )
    image.drawRect(-width*0.5, -height*0.5, width, height)
    image.endFill()

    this.addChild(image)

    if( !P2Manager.debug ) {
      this.sprite = image
    }

    return shape
  }

  setImage( image ) {

    if(this.sprite) {
      this.sprite.parent.removeChild( this.sprite )
      this.sprite.parent = null
      this.sprite.destroy()
      this.sprite = null
    }

    this.sprite = image
    this.addChild( this.sprite )

  }

  destroy() {
    console.log('destroy', this.x, this.y )
    this.world.removeBody( this.body )
    this.parent.removeChild( this )
    this.parent = null

    super.destroy()
  }
  
  update() {

    

  }
  
}