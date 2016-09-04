import { Tween, EVENTS }          from '../core'
import { Container}   from 'pixi.js'



class StateManager {

  constructor() {

    this.activeStates = new Map()
    this.states = new Map()

    this.stageContainer = new Container()

  }

  addState ( key, state ) {
    this.states.set( key, state )
  }

  
  removeActive (key) {
    if( !this.activeStates.has( key ) ) {
      return
    }
    let oldState = this.activeStates.get( key )
    oldState.emit(EVENTS.STATES.REMOVE)

    this.activeStates.delete( key )
  }
  removeAllActives(exceptionKey) {
    for(const [key, oldState] of this.activeStates.entries() ) {
      if( key !== exceptionKey ) {
        this.removeActive( key )
      }
    }
  }

  addActive ( key, clear = false ) {
    if( !this.states.has( key ) ) {
      return
    }

    const state = this.states.get( key )

    if( state ) {
      if(clear) {
        this.removeAllActives()
        this.stageContainer.removeChildren()
      }
      this.activeStates.set(key, state)
      this.stageContainer.addChild(state)
      state.emit(EVENTS.STATES.INIT)
      
    }
    return state
  }

  setActive ( key ) {
    this.addActive( key, true )
  }

  switchFade (newKey, time = 1000) {

    const oldStateName = this.activeStates.keys().next().value
    const oldState = this.activeStates.values().next().value
    const newState = this.addActive( newKey )

    this.fadeToState(oldState, 1, 0, time )
    this.fadeToState(newState, 0, 1, time, time*0.5 ).onComplete( () => this.removeActive( oldStateName ) )

  }

  fadeToState (state, fromValue = 0, toValue = 1, time=1000, delay = 0) {
    
    state.alpha = fromValue
    const tweenOld = new Tween( state )
    tweenOld.delay(delay).to( {alpha: toValue}, time )
    tweenOld.start()

    return tweenOld
  }

}


export default new StateManager()