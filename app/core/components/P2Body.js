import { P2Manager, CONFIG, CustomContainer }  from '../core'
import { Graphics, utils, Point }  from 'pixi.js'
import p2  from 'p2'

export default class P2Body extends CustomContainer {

  constructor( world, x = 0, y = 0, mass = 1, angle = 0 ) {

    super()

    this.world = world

    this.createBody({
      // position: [ x/P2Manager.SIZE, y/P2Manager.SIZE ],
      mass: mass,
      // angle: Math.radians( angle )
      // collisionGroup // Math.pow(2,3)  // Belongs to the SHIP group
      // collisionMask   BULLET | SHIP  // Math.pow(2,3)  // Only collide with the ASTEROID group
      // fixedRotation
      // damping
      // angularDamping
    })

    

    this.outOfBoundsKill = false

    this.visible = false

    

  }

  setDefaultCollisionGroup() {

    this.setCollisionMask( P2Manager.group( 'EVERYTHING' ) )
    this.setCollisionGroup( P2Manager.group( 'EVERYTHING' ) )

  }
  setCollisionGroup(value) {
    // console.log('setCollisionGroup', value)

    for( const elem of this.body.shapes ) {
      elem.collisionGroup = value
    }
  }

  setCollisionMask(value) {
    // console.log('setCollisionMask', value)

    for( const elem of this.body.shapes ) {
      elem.collisionMask = value
    }
  }

  localPos( worldPoint, framePosition, frameAngle ) {
    return this.rotate( this.subtract( worldPoint, framePosition), -frameAngle )
  }
  rotate(a, angle){
    if(angle !== 0){
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      const x = a[0]
      const y = a[1]
      return [c*x - s*y, s*x + c*y ]
    } else {
      return a
    }
  }
  subtract(a, b) {
    return [ a[0] - b[0], a[1] - b[1] ]
  }

  set kinematic(value) {
    if(value) {
      this.body.type = p2.Body.KINEMATIC
    } else {
      this.body.type = p2.Body.DYNAMIC
    }
  }


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
    
    this.body.sprite = this
  }
  addToWorld() {
    this.world.addBody( this.body )

    this.body.wakeUp()
  }
  
  addCircle( radius = 10, paddingLeft = 0, paddingTop = 0) {
    const shape = new p2.Circle( { radius: radius/P2Manager.SIZE } )

    this.body.addShape( shape, [ paddingLeft / P2Manager.SIZE, paddingTop / P2Manager.SIZE ] )

    if( CONFIG.DRAW ) {
      const image = new Graphics()
      image.lineStyle(1, 0x009900, 0.5)
      image.beginFill( 0x009900, 0.1 )
      image.drawCircle( paddingLeft, paddingTop, radius)
      image.endFill()

      this.addChild(image)

      this.sprite = image      
    }

    shape.collisionGroup = P2Manager.group( 'EVERYTHING' )
    shape.collisionMask = P2Manager.group( 'EVERYTHING' )

    return shape
  }


  addShape( vertices ) {
    // vertices = [[-1,-1], [1,-1], [1,1], [-1,1]]
    const convertedVertices = new Array()

    for(const data of vertices) {
      convertedVertices.push( [ (data[0])/P2Manager.SIZE*this.scale.x, (data[1])/P2Manager.SIZE*this.scale.y ] )
    }

    this.body.fromPolygon( convertedVertices )

    this.body.updateAABB()

    this.debugDraw()
    
    this.setDefaultCollisionGroup()

    return this.body.shapes

  }

  addVehicle() {
    return new p2.TopDownVehicle( this.body )
  }

  addConvex(vertices, paddingLeft = 0, paddingTop = 0) {

    const shape = new p2.Convex( { vertices: vertices } )
    this.body.addShape( shape, [paddingLeft / P2Manager.SIZE, paddingTop / P2Manager.SIZE] )


    this.debugDraw()

    this.setDefaultCollisionGroup()

    return this.body.shapes
  }

  addBox(width = 10, height = 10, paddingLeft = 0, paddingTop = 0) {

    const shape = new p2.Box( { width: width/P2Manager.SIZE, height: height/P2Manager.SIZE } )
    this.body.addShape( shape, [paddingLeft / P2Manager.SIZE, paddingTop / P2Manager.SIZE] )

    this.debugDraw()

    shape.collisionGroup = P2Manager.group( 'EVERYTHING' )
    shape.collisionMask = P2Manager.group( 'EVERYTHING' )

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
    
    this.world.removeBody( this.body )
    // this.parent.removeChild( this )
    // this.parent = null
    super.destroy()
  }

  debugDraw() {
    if(!CONFIG.DRAW) {
      return
    }

    if(!this.debugImage) {
      this.debugImage = new Graphics()
    }
    this.debugImage.clear()

    this.debugImage.beginFill( 0x009900, 0.1 )
    this.debugImage.lineStyle(1, 0x009900, 1)
    

    for( const elem of this.body.shapes ) {
      const p = elem.position
      const c = elem.centerOfMass
      
      let isInitial = true
      for(const pv of elem.vertices) {
        if(isInitial) {
          isInitial = false
          this.debugImage.moveTo( (p[0] + pv[0]) * P2Manager.SIZE / this.scale.x, (p[1] + pv[1]) * P2Manager.SIZE / this.scale.x )
        }
        this.debugImage.lineTo( (p[0] + pv[0]) * P2Manager.SIZE / this.scale.x, (p[1] + pv[1]) * P2Manager.SIZE / this.scale.x )
      }

      this.debugImage.drawCircle( p[0] * P2Manager.SIZE / this.scale.x, p[1] * P2Manager.SIZE / this.scale.x, 5 )

      this.debugImage.drawCircle( c[0] * P2Manager.SIZE / this.scale.x, c[1] * P2Manager.SIZE / this.scale.x, 15 )

    }

    this.debugImage.endFill()

    this.addChild(this.debugImage)
  }
  
  update() {

    

  }
  
}