import { utils, loader }  from 'pixi.js'
import { EVENTS } from '../Constants'

/**
 * Animation Store
 *
 * Manages a few aspects of the animation loop and provides callbacks
 * for things such as Tween.js
 *
 * @data
 * 	tick : number of times render has been called
 * 	startTime : float ms of animation time start
 * 	currentTime : current float ms
 */
class AnimationManager extends utils.EventEmitter {

  constructor() {
    
    super()

    this.tick = 0
    this.startTime = window.performance.now()
    this.currentTime = window.performance.now()

    this.setMaxListeners(1000) 
  }

  emitChange() {
    this.tick++
    this.currentTime = window.performance.now()
    this.emit(EVENTS.ANIMATE)
  }

  addEventListener(callback) {
    this.on(EVENTS.ANIMATE, callback)
    return callback
  }
  removeEventListener(callback) {
    this.off(EVENTS.ANIMATE, callback)
    return callback
  }
}

export default new AnimationManager()
