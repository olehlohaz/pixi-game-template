import {AnimationManager, TweenManager, StateManager, EVENTS }      from '../core'

import { WebGLRenderer, utils, loader, Point }  from 'pixi.js'
import { config } from '../../../package.json'

class RendererManager extends WebGLRenderer {

  constructor() {

    super();

    this.resolution = window.devicePixelRatio

    this.width = config.stageWidth
    this.height = config.stageHeight
    this.center = new Point(this.width * 0.5, this.height * 0.5)

    this.resize( this.width, this.height )


    document.body.appendChild(this.view)
    this.autoResize = true

    AnimationManager.addEventListener( () => TweenManager.update() )
    window.addEventListener('resize', () => this.resizeHandler() )
  }

  start () {
    this.active = true
    window.requestAnimationFrame( () => this.animate() )
  }

  stop () {
    this.active = false
  }

  animate () {

    this.render( StateManager.stageContainer )


    if(this.active) {

      window.requestAnimationFrame( () => this.animate() )
      AnimationManager.emitChange()

    }
  }

  resizeHandler () {

    window.scrollTo(0,1)

    const scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height );
  
    const width  = Math.floor( this.width * scale )
    const height = Math.floor( this.height * scale )

    const offsetX = (window.innerWidth - width) * 0.5
    const offsetY = (window.innerHeight - height) * 0.5

    this.view.style.width = width + "px"
    this.view.style.height = height + "px"

    this.view.style.marginTop = offsetY + 'px'
    this.view.style.marginLeft = offsetX + 'px'

    this.emit( EVENTS.RESIZE, { width: this.width, height: this.height } )

  }
}

export default new RendererManager()