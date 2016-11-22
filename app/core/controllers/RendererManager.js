import {AnimationManager, TweenManager, StateManager, EVENTS }      from '../core'

import { CanvasRenderer, WebGLRenderer, utils, loader, Point, Rectangle, ticker }  from 'pixi.js'
import { config } from '../../../package.json'

/**
 * RendererManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */

class RendererManager extends WebGLRenderer {

  constructor() {

    super( config.stageWidth, config.stageHeight )
    
    this.center = new Point(this.width * 0.5, this.height * 0.5)

    this._paused = false

    this.viewport = new Rectangle(0,0, config.viewport.width, config.viewport.height )
    this.screen = new Rectangle(0,0, config.viewport.width, config.viewport.height )


    document.body.appendChild(this.view)
    this.autoResize = false

    window.addEventListener('resize', () => this.resizeHandler() )
    
  }

  start () {

    this.stop()
    this.animateFunc = (time) => this.animate(time)
    ticker.shared.add( this.animateFunc, this )

  }

  get pause() {
    return this._paused
  }

  set pause( value ) {
    this._paused = value

    console.log( this._paused, ticker )

    if(this._paused) {
      ticker.shared.stop()
    } else {
      ticker.shared.start()
    }
  }

  stop () {
    
    if(!this.animateFunc) {
      return
    }
    ticker.shared.remove( this.animateFunc, this )

  }

  animate ( time ) {
    this.render( StateManager.stageContainer )
  }

  resizeHandler() {
    window.scrollTo(0,1)

    setTimeout( () => window.scrollTo(0,1), 400)

    this.scale = Math.min(window.innerWidth / config.viewport.width, window.innerHeight / config.viewport.height )

    const width  = Math.floor( config.viewport.width * this.scale )
    const height = Math.floor( config.viewport.height * this.scale )

    const offsetX = (window.innerWidth - width)
    const offsetY = (window.innerHeight - height)

    this.resize( (width + offsetX) / this.scale, (height + offsetY) / this.scale )
    
    this.view.style.transformOrigin = "0 0"
    this.view.style.transform = `scale( ${this.scale/this.resolution} )`

    this.center.x = this.width * 0.5 / this.resolution
    this.center.y = this.height * 0.5 / this.resolution

    this.viewport.x = -this.viewport.width * 0.5
    this.viewport.y = -this.viewport.height * 0.5


    this.screen.x =  -this.center.x
    this.screen.y =  -this.center.y

    this.screen.width = this.width
    this.screen.height = this.height
    
    StateManager.stageContainer.position.set( this.width * 0.5 / this.resolution, this.height * 0.5 / this.resolution )

    this.emit( EVENTS.RESIZE, { width: this.width, height: this.height } )
  }

}

export default new RendererManager()