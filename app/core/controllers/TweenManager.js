import { Container, utils, ticker }  from 'pixi.js'


/**
 * TweenManager.js
 *
 *
 */

class TweenManager {

  constructor() {

    this._tweens = new Set()
    ticker.shared.add( (time) => this.update(time) )

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
  removeFrom(elem) {
    for( const [indx, value] of this._tweens.entries() ) {
      if(value.target == elem) {
        this.remove( value )
      }
    }
  }
  remove (tween) {
    if(this._tweens.has(tween)) {
      this._tweens.delete(tween)
      tween.emit(tween.EVENTS.COMPLETE)
    }
  }
  update(time) {
    if (this._tweens.length === 0) {
      return false
    }


    for( let tween of this._tweens.values() ) {
      if(!tween.update( time )) {
        this.remove( tween )
      }
    }

    return true
  }
}

export default new TweenManager()