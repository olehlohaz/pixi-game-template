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
  removeFrom( elem, dispatchComplete = false ) {
    for( const [indx, value] of this._tweens.entries() ) {
      if(value.target.tweenID === elem.tweenID) {
        this.remove( value, dispatchComplete )
      }
    }
  }
  remove ( tween, dispatchComplete = false ) {
    if(this._tweens.has(tween)) {
      this._tweens.delete(tween)

      if(dispatchComplete === true) {
        tween.emit( tween.EVENTS.COMPLETE )
      }
      return true
    } 
    return false
  }
  update(time) {
    if (this._tweens.length === 0) {
      return false
    }

    for( let tween of this._tweens.values() ) {
      if(!tween.update( time )) {
        this.remove( tween, true )
      }
    }

    return true
  }
}

export default new TweenManager()