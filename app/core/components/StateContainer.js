import { EVENTS, TweenManager } from '../core'

import { Container, Graphics } from 'pixi.js'



export default class StateContainer extends Container {

  constructor() {
    
    super()

    this.id = Symbol('state')

    this.once(EVENTS.STATES.INIT, () => this.Init() )
    this.on(EVENTS.STATES.INIT, () => this.Start() )
    this.on(EVENTS.STATES.REMOVE, () => this.Remove() )
    this.on(EVENTS.RESIZE, ( width, height ) => this.Resize( width, height ) )

    this.destroyOnRemove = false

  }

  Init() {

  }

  Start() {

  }

  Resize(width, height) {
    
  }

  Remove() {
    if(this.destroyOnRemove) {
      this.destroy(true)
    }
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
