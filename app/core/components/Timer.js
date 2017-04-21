import { RendererManager } from '../core'
import { Container, ticker, settings } from 'pixi.js'
import eventemitter3 from 'eventemitter3'

/**
 * RendererManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */
class TimeEvent {

  constructor(callback, timeInterval = 1000, repeatTotal = 0) {
    this.id = Symbol('id')
    this.callback = callback
    this.repeatTotal = repeatTotal
    this.repeatCounter = 0
    this.timeCounter = 0
    this.timeInterval = timeInterval
    this.isRunning = true
  }
  update(time) {
    if(!this.isRunning) {
      return false
    }

    this.timeCounter += time
    if(this.timeCounter >= this.timeInterval) {
      try {
        this.callback()
      } catch(e) {
        console.log(e)
        return false
      }
      if(this.repeatCounter >= this.repeatTotal) {
        this.isRunning = false
        return false
      }
      this.repeatCounter++
      this.timeCounter -= this.timeInterval
    }
    return true
  }
}


class Timer extends eventemitter3 {

  constructor() {
    
    super()

    this.events = new Map()
    
    ticker.shared.add( this.update, this )
  }

  setTimeout(callback, time = 1000) {
    return this.setInterval(callback, time, 0)
  }

  clear(id) {
    if(id) {
      this.events.delete(id)
    } else {
      this.events.clear()
    }
  }

  setInterval(callback, time = 1000, repeat = 0) {

    const _repeat = (repeat < 0) ? Infinity : repeat
    const timeEvent = new TimeEvent(callback, time, _repeat)

    this.events.set( timeEvent.id, timeEvent )

    return timeEvent
  }

  update(time) {

    for( const [name, data] of this.events.entries() ) {
      if( !data.update( time / settings.TARGET_FPMS ) ) {
        this.events.delete( name )
      }
    }

  }
}

export default new Timer()