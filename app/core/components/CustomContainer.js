import { RendererManager, TweenManager } from '../core'

import { Container, Graphics } from 'pixi.js'

/**
 * RendererManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */

export default class CustomContainer extends Container {

  constructor() {
    
    super()

    this._id = Symbol('id')
    this.resizeCulling()
    this.cullingPadding = 0

  }

  resizeCulling() {
    this.cullingScreen = new Rectangle( -RendererManager.width*0.5, -RendererManager.height*0.5, RendererManager.width, RendererManager.height )
  }

  culling() {
    this.children.forEach( (elem) => this.checkCulling(elem) )
  }

  checkCulling( elem ) {
    elem.renderable = this.overlap( this.cullingScreen, 
                              elem.x + this.x - this.cullingPadding, 
                              elem.y + this.y - this.cullingPadding, 
                              elem.width + this.cullingPadding, 
                              elem.height + this.cullingPadding )
  }

  overlap( b, ax, ay, aw, ah ) {
    return !( b.x > (ax + aw) || ax > (b.x + b.width) || b.y > (ay + ah) || ay > (b.y + b.height) )
  }

  destroy() {

    for( const [indx, value] of this.children.entries() ) {
      TweenManager.removeFrom(value)
      this.removeChild(value)
      value.destroy()
    }

    TweenManager.removeFrom(this)
    if(this.parent) {
      this.parent.removeChild(this)
    }
    this.parent = null

    this.removeAllListeners()
    super.destroy()

  }

}
