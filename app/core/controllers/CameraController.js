import { Timer, RendererManager, P2Manager, P2Body, AnimationManager, Tween }         from '../core'
import { Sprite, Point, ticker }  from 'pixi.js'

/**
 * RendererManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */
export default class CameraController {

  constructor() {
    this._container = null
    this._target = null

    const variation = 0.2
    
    this.leftX  = 1 - variation
    this.rightX = 1 + variation

    this._globalPos
    this.isActive = true
    this.shakeValue = new Point( 0, 0 )

    this.viewPort = new Point( RendererManager.viewport.width * 0.5, RendererManager.viewport.height * 0.5 )
  }

  xMinMax(min, max) {
    this.minX = min
    this.maxX = max
  }

  lock( x = false, y = false ) {
    this.lockX = x
    this.lockY = y
  }

  resize() {
    this.viewPort = new Point( RendererManager.viewport.width * 0.5, RendererManager.viewport.height * 0.5 ) 
  }

  set container(value) {
    this._container = value
  }
  get container() {
    return this._container
  }


  follow(target) {
    this._target = target

  }

  shake(dx = 5, dy = 5, time = 300) {
    
    this.shakeValue.set( dx, dy )
    Timer.setTimeout(() => {
      this.shakeValue.set( 0, 0 )
    }, time)
  }
  getShakeX() {
    return Math.random() * this.shakeValue.x
  }
  getShakeY() {
    return Math.random() * this.shakeValue.y
  }

  updateFolllow() {

    if( !this.isActive || !this._target || !this._target.parent || !this._container ) {
      return
    }

    this._globalPos = this._target.toGlobal({x:0, y: 0})

    if(!this.lockX) {

      let dx = this._container.x


      if(this._globalPos.x < this.viewPort.x * this.leftX ) {

        dx = this._container.x + this.viewPort.x * this.leftX - this._globalPos.x

      } else if(this._globalPos.x > this.viewPort.x * this.rightX) {

        dx = this._container.x + this.viewPort.x * this.rightX - this._globalPos.x

      }


      if(this.minX && dx < this.minX) {
        this._container.x = this.minX + this.getShakeX()
      } else if(this.maxX && dx > this.maxX) {
        this._container.x = this.maxX + this.getShakeX()
      } else {
        this._container.x = dx + this.getShakeX()
      }

      
    }
    if(!this.lockY) {
      this._container.y += this.viewPort.y - this._globalPos.y + this.getShakeY()
    }

  }

  update() {
    this.updateFolllow()
  }
}