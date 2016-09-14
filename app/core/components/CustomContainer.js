import { RendererManager, TweenManager } from '../core'

import { Container, Graphics } from 'pixi.js'



export default class CustomContainer extends Container {

  constructor() {
    
    super()

    this._id = Symbol('id')

    

  }

  destroy() {

    for( const [indx, value] of this.children.entries() ) {
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
