import { RendererManager, P2Manager, P2Body, AnimationManager, Tween }         from '../core'
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

    this._globalPos

    this.viewPort = new Point( RendererManager.viewport.x + RendererManager.viewport.width * 0.5, RendererManager.viewport.y + RendererManager.viewport.height * 0.5 )
  }

  resize() {
    this.viewPort = new Point( RendererManager.viewport.x + RendererManager.viewport.width * 0.5, RendererManager.viewport.y + RendererManager.viewport.height * 0.5 ) 
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

  updateFolllow() {

    if( !this._target || !this._target.parent || !this._container ) {
      return
    }
    this._globalPos = this._target.toGlobal({x:0, y: 0})

    this._container.x += this.viewPort.x - this._globalPos.x
    this._container.y += this.viewPort.y - this._globalPos.y

  }

  update() {
    this.updateFolllow()
  }
}