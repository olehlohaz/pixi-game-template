import {WebGLRenderer, Point, Container}   from 'pixi.js'

import Renderer       from './RendererManager'
import Animation      from './AnimationManager'
import TweenManager   from './TweenManager'
import Tween          from '../effects/Tween'

/**
 * GL Renderer with hooks into a Store
 *
 * Manages main animation loop and resize canvas
 *
 * @exports Renderer
 * @extends WebGLRenderer
 */
class StateManager extends WebGLRenderer {

  constructor() {

    super()

    this.activeStates = new Map()
    this.states = new Map()

    this.stageContainer = new Container()
    
  }

  init (stageWidth, stageHeight) {

    this.resize( stageWidth, stageHeight )

    this.resolution = window.devicePixelRatio;

    window.addEventListener('resize', () => this.resizeHandler() )

    Renderer.resolution = this.resolution
    Renderer.width = stageWidth
    Renderer.height = stageHeight
    Renderer.center = new Point(stageWidth * 0.5, stageHeight * 0.5)

    this.resizeHandler()

    Animation.addEventListener( () => TweenManager.update() )

    document.body.appendChild(this.view)
    this.autoResize = true

  }

  resizeHandler () {
    
    window.scrollTo(0,1)

    const scale = Math.min(window.innerWidth / Renderer.width, window.innerHeight / Renderer.height );
  
    const width  = Math.floor( Renderer.width * scale )
    const height = Math.floor( Renderer.height * scale )

    const offsetX = (window.innerWidth - width) * 0.5
    const offsetY = (window.innerHeight - height) * 0.5

    this.view.style.width = width + "px"
    this.view.style.height = height + "px"

    this.view.style.marginTop = offsetY + 'px'
    this.view.style.marginLeft = offsetX + 'px'

    Renderer.emitChange()
  }

  start () {
    this.active = true
    window.requestAnimationFrame( () => this.animate() )
  }


  stop () {
    this.active = false
  }

  animate () {
    this.renderStates()

    if(this.active) {
      window.requestAnimationFrame( () => this.animate() )
      Animation.emitChange()
    }
  }


  addState ( key, state ) {
    this.states.set( key, state )
  }

  
  removeActive (key) {
    if( !this.activeStates.has( key ) ) {
      return
    }

    this.activeStates.delete( key )
  }

  addActive ( key, clear = false ) {
    if( !this.states.has( key ) ) {
      return
    }

    const state = this.states.get( key )

    if( state ) {
      if(clear) {
        this.activeStates.clear()
        this.stageContainer.removeChildren()
      }
      this.activeStates.set(key, state)
      this.stageContainer.addChild(state)
      if(state.init) {
        state.init()
      }
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

  renderStates() {
    this.render( this.stageContainer )
  }
}


export default new StateManager()