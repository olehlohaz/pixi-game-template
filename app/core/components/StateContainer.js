import { EVENTS } from '../core'

import { Container, Graphics } from 'pixi.js'



export default class StateContainer extends Container {

  constructor() {
    
    super()

    this.id = Symbol('state')

    this.once(EVENTS.STATES.INIT, () => this.Init() )
    this.on(EVENTS.STATES.INIT, () => this.Start() )
    this.on(EVENTS.STATES.REMOVE, () => this.Remove() )
    this.on(EVENTS.RESIZE, () => this.Resize() )

    this.destroyOnRemove = false

  }

  Init() {

  }

  Start() {

  }

  Remove() {
    if(this.destroyOnRemove) {
      this.destroy(true)
    }
  }

}
