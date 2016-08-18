import { utils, loader }  from 'pixi.js'
import { EVENTS } from '../Constants'


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
