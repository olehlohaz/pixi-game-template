import {AnimationManager, TweenManager, StateManager, EVENTS }      from '../core'

import { CanvasRenderer, WebGLRenderer, utils, loader, Point, Rectangle, ticker }  from 'pixi.js'
import { config } from '../../../package.json'

class RendererManager extends WebGLRenderer {

  constructor() {

    super(config.stageWidth, config.stageHeight)

    this.resolution = 1
    
    this.center = new Point(this.width * 0.5, this.height * 0.5)

    this._paused = false

    this.viewport = new Rectangle(0,0, config.viewport.width, config.viewport.height )
    this.screen = new Rectangle(0,0, config.viewport.width, config.viewport.height )


    document.body.appendChild(this.view)
    this.autoResize = true

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

    this.scale = Math.min(window.innerWidth / this.viewport.width, window.innerHeight / this.viewport.height )

    // basic size counting just the viewport scale
    const width  = Math.floor( this.viewport.width * this.scale )
    const height = Math.floor( this.viewport.height * this.scale )

    const offsetX = (window.innerWidth - width)
    const offsetY = (window.innerHeight - height)


    this.resize( (width + offsetX) / this.scale, (height + offsetY) / this.scale )

    this.view.style.width = `${window.innerWidth}px`
    this.view.style.height = `${window.innerHeight}px`

    this.center.x = this.width * 0.5
    this.center.y = this.height * 0.5

    this.viewport.x = offsetX * 0.5 / this.scale
    this.viewport.y = offsetY * 0.5 / this.scale


    this.screen.x =  -this.center.x
    this.screen.y =  -this.center.y

    this.screen.width = this.width
    this.screen.height = this.height
    

    StateManager.stageContainer.position.set( this.center.x, this.center.y )

    this.emit( EVENTS.RESIZE, { width: this.width, height: this.height } )
    
  }

}

export default new RendererManager()