import { Container, utils }  from 'pixi.js'

class TweenManager {

  constructor() {

    this._tweens = new Set()
    this.defineNow()

  }

  get tweens() {
    return this._tweens 
  }

  removeAll() {
    this._tweens.clean()
  }

  add (tween) {
    this._tweens.add( tween )
  }
  remove (tween) {
    if(this._tweens.has(tween)) {
      this._tweens.delete(tween)
    }
  }
  update(time, preserve) {
    if (this._tweens.length === 0) {
      return false
    }


    time = time !== undefined ? time : this.now();

    for( let tween of this._tweens.values() ) {
      if(!tween.update( time ) && !preserve) {
        this.remove( tween )
      }
    }

    return true
  }

  defineNow() {
    if (this.window === undefined && this.process !== undefined) {

      this.now = () => {
        const time = process.hrtime()
        return time[0] * 1000 + time[1] / 1000
      }

    } else if (this.window !== undefined && window.performance !== undefined && window.performance.now !== undefined) {

      this.now = () => { return window.performance.now() }

    } else if (Date.now !== undefined) {

      this.now = Date.now;

    } else {

      this.now = () => { return new Date().getTime() }

    }
  }
}

export default new TweenManager()