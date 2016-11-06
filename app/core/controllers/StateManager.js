import { Tween, EVENTS, RendererManager }          from '../core'
import { Container}   from 'pixi.js'



class StateManager {

  constructor() {

    this.activeStates = new Map()
    this.states = new Map()

    this.stageContainer = new Container()
    this.stageContainer.position.set(RendererManager.center.x, RendererManager.center.y)

  }

  addState ( key, state ) {
    this.states.set( key, state )
  }

  
  removeActive (key) {
    if( !this.activeStates.has( key ) ) {
      return
    }
    let oldState = this.activeStates.get( key )
    oldState.emit( EVENTS.STATES.REMOVE )

    this.activeStates.delete( key )

    return oldState
  }

  removeAllActives(exceptionKey) {
    for(const [key, oldState] of this.activeStates.entries() ) {
      if( key !== exceptionKey ) {
        this.removeActive( key )
      }
    }
  }

  restart( name ) {

    const oldState = this.removeActive( name )
    this.addActive( name )
  }

  addActive ( key, clear = false, ...data ) {
    if( !this.states.has( key ) ) {
      return
    }

    const stateClass = this.states.get( key )
    const state = new stateClass()

    if( state ) {
      if(clear) {
        this.removeAllActives()
        this.stageContainer.removeChildren()
      }
      this.activeStates.set(key, state)
      this.stageContainer.addChild(state)
      state.emit(EVENTS.STATES.INIT, ...data )
      
    }
    return state
  }

  setActive ( key, ...data ) {
    this.addActive( key, true, ...data )
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