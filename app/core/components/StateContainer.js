import { RendererManager, EVENTS, TweenManager } from '../core'

import { Container, Graphics, ticker } from 'pixi.js'



export default class StateContainer extends Container {

  constructor() {
    
    super()

    this.id = Symbol('state')

    this.destroyOnRemove = true

    this.resizeFunc = ( width, height ) => this.Resize( width, height )
    this.updateFunc = (time) => this.Update(time)


    this.once(EVENTS.STATES.INIT, (...data) => this.Init(...data) )
    this.on(EVENTS.STATES.INIT, (...data) => this.Start(...data) )
    this.on(EVENTS.STATES.REMOVE, () => this.Remove() )

    RendererManager.on(EVENTS.RESIZE, this.resizeFunc )

    ticker.shared.add( this.updateFunc )

  }

  Init() {

  }

  Start() {

  }
  Update() {

  }

  Resize(width, height) {
    
  }

  Remove() {
    if( this.destroyOnRemove ) {
      this.destroy( true )
    }
  }
  destroy() {

    RendererManager.off(EVENTS.RESIZE, this.resizeFunc )

    ticker.shared.remove( this.updateFunc )

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
