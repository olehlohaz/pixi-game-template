import TweenManager  from '../controllers/TweenManager'
import { utils }  from 'pixi.js'

export default class Tween extends utils.EventEmitter {

  constructor(object) {

    super()

    this.EVENTS = {
      START:    Symbol('event_start'),
      STOP:     Symbol('event_stop'),
      UPDATE:   Symbol('event_update'),
      REPEAT:   Symbol('event_update'),
      COMPLETE: Symbol('event_complete')
    }


    this._object = object
    this.reset()
  
  }

  reset() {
    this._valuesStart = new Map()
    this._valuesEnd = new Map()
    this._valuesStartRepeat = new Map()
    this._duration = 0
    this._repeat = 0
    this._repeatDelayTime
    this._yoyo = false
    this._isPlaying = false
    this._reversed = false
    this._delayTime = 0
    this._startTime = null
    this._easingFunction = TWEEN.Easing.Linear.None
    this._interpolationFunction = TWEEN.Interpolation.Linear
    this._chainedTweens = new Set()

    this.hasStarted = false
  }


  to(properties, duration = 1000) {

    this._duration = duration

    for (const k of Object.keys(properties)) {
        this._valuesEnd.set( k, properties[k] )
    }

    return this
  }

  start ( time = TweenManager.now() ) {

    TweenManager.add(this)

    this._valuesStart.clear()

    this._isPlaying = true

    this._startTime = time
    this._startTime += this._delayTime

    for (const [property, value] of this._valuesEnd.entries() ) {

      // console.log(property, value)
      // Check if an Array was provided as property value
      if (value instanceof Array) {

        if (value.length === 0) {
          continue;
        }

        // Create a local copy of the Array with the start value at the front
        value.unshift( this._object[ property ] )

      }

      // If `to()` specifies a property that doesn't exist in the source object,
      // we should not set that property in the object
      if (this._object[property] === undefined) {
        continue;
      }

      this._valuesStart.set(property, this._object[property] )

      this._valuesStartRepeat.set(property, this._valuesStart.get(property) || 0 )

    }

    return this
  }


  stop() {
    if (!this._isPlaying) {
      return this;
    }

    TweenManager.remove(this)
    this._isPlaying = false;

    if (this._onStopCallback !== null) {
      this._onStopCallback.call(this._object)
    }

    this.stopChainedTweens()
    return this
  }

  end() {
    this.update( this._startTime + this._duration)
    return this
  }

  stopChainedTweens () {

    for (let tween of this._chainedTweens) {
      tween.stop()
    }

  }

  delay (amount) {
    this._delayTime = amount
    return this
  }
  repeat (times) {
    this._repeat = times
    return this
  }
  repeatDelay (amount) {
    _repeatDelayTime = amount
    return this
  }
  yoyo (yoyo) {
    _yoyo = yoyo
    return this
  }
  easing (easing) {
    this._easingFunction = easing
    return this
  }
  interpolation (interpolation) {
    this._interpolationFunction = interpolation
    return this
  }
  chain(...args) {
    this._chainedTweens = new Set(args)
    return this
  }
  onStart (callback) {
    this.once(this.EVENTS.START, callback)
    return this
  }
  onUpdate (callback) {
    this.on(this.EVENTS.UPDATE, callback)
    return this
  }
  onComplete (callback) {
    this.once(this.EVENTS.COMPLETE, callback)
    return this
  }
  onStop (callback) {
    this.once(this.EVENTS.STOP, callback)
    return this
  }
  onRepeat (callback) {
    this.on(this.EVENTS.REPEAT, callback)
    return this
  }


  update (time) {

    let property
    let elapsed
    let value

    if (time < this._startTime) {
      return true;
    }

    if (this.hasStarted === false) {

      this.emit( this.EVENTS.START, this._object )

      this.hasStarted = true

    }


    elapsed = (time - this._startTime) / this._duration
    elapsed = elapsed > 1 ? 1 : elapsed

    value = this._easingFunction(elapsed)

    for ( const property of this._valuesEnd.keys() ) {

      // Don't update properties that do not exist in the source object
      if ( !this._valuesStart.has(property) ) {
        continue
      }

      var start = this._valuesStart.get(property) || 0
      var end = this._valuesEnd.get(property)

      if (end instanceof Array) {

        this._object[property] = this._interpolationFunction(end, value)

      } else {

        // Parses relative end values with start as base (e.g.: +10, -3)
        if (typeof (end) === 'string') {

          if (end.charAt(0) === '+' || end.charAt(0) === '-') {
            end = start + parseFloat(end)
          } else {
            end = parseFloat(end)
          }
        }

        // Protect against non numeric properties.
        if (typeof (end) === 'number') {
          this._object[property] = start + (end - start) * value
        }

      }

    }

    
    this.emit( this.EVENTS.UPDATE, this._object, value )

    if (elapsed === 1) {

      if (this._repeat > 0) {

        this.emit( this.EVENTS.REPEAT, this._object, this._repeat )

        if (isFinite(this._repeat)) {
          this._repeat--
        }

        // Reassign starting values, restart by making startTime = now
        for ( const property of this._valuesStartRepeat.keys() ) {

          if (typeof ( this._valuesEnd.get(property) ) === 'string') {
            this._valuesStartRepeat.set(property, this._valuesStartRepeat.get(property) + parseFloat(this._valuesEnd.get(property) ) )
          }

          if (this._yoyo) {
            const tmp = this._valuesStartRepeat.get(property)

            this._valuesStartRepeat.set(property, _valuesEnd.get(property) )
            this._valuesEnd.set(property, tmp)
          }

          this._valuesStart.set(property, this._valuesStartRepeat.get(property) )
        }

        if (this._yoyo) {
          this._reversed = !this._reversed
        }

        if (this._repeatDelayTime !== undefined) {
          this._startTime = time + this._repeatDelayTime
        } else {
          this._startTime = time + this._delayTime
        }

        return true

      } else {

        this.emit( this.EVENTS.COMPLETE, this._object )

        for (const chain of this._chainedTweens.values() ) {
          chain.start(this._startTime + this._duration)
        }
        return false
      }
    }
    return true
  }
}

const TWEEN = {}

TWEEN.Easing = {

  Linear: {
    None: function (k) {
      return k
    }
  },

  Quadratic: {
    In: function (k) {
      return k * k
    },
    Out: function (k) {
      return k * (2 - k)
    },

    InOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k
      }
      return - 0.5 * (--k * (k - 2) - 1)
    }
  },

  Cubic: {
    In: function (k) {
      return k * k * k
    },
    Out: function (k) {
      return --k * k * k + 1
    },
    InOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k
      }
      return 0.5 * ((k -= 2) * k * k + 2)
    }
  },

  Quartic: {
    In: function (k) {
      return k * k * k * k
    },
    Out: function (k) {
      return 1 - (--k * k * k * k)
    },

    InOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k
      }
      return - 0.5 * ((k -= 2) * k * k * k - 2)
    }
  },

  Quintic: {
    In: function (k) {
      return k * k * k * k * k
    },
    Out: function (k) {
      return --k * k * k * k * k + 1
    },
    InOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k
      }
      return 0.5 * ((k -= 2) * k * k * k * k + 2)
    }
  },

  Sinusoidal: {
    In: function (k) {
      return 1 - Math.cos(k * Math.PI * 0.5)
    },
    Out: function (k) {
      return Math.sin(k * Math.PI * 0.5)
    },
    InOut: function (k) {
      return 0.5 * (1 - Math.cos(Math.PI * k))
    }
  },

  Exponential: {
    In: function (k) {
      return k === 0 ? 0 : Math.pow(1024, k - 1)
    },

    Out: function (k) {
      return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k)
    },
    InOut: function (k) {
      if (k === 0) {
        return 0
      }
      if (k === 1) {
        return 1
      }
      if ((k *= 2) < 1) {
        return 0.5 * Math.pow(1024, k - 1)
      }
      return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2)
    }
  },

  Circular: {
    In: function (k) {
      return 1 - Math.sqrt(1 - k * k)
    },

    Out: function (k) {
      return Math.sqrt(1 - (--k * k))
    },

    InOut: function (k) {
      if ((k *= 2) < 1) {
        return - 0.5 * (Math.sqrt(1 - k * k) - 1)
      }
      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1)
    }

  },

  Elastic: {
    In: function (k) {
      if (k === 0) {
        return 0
      }
      if (k === 1) {
        return 1
      }
      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI)
    },

    Out: function (k) {
      if (k === 0) {
        return 0
      }
      if (k === 1) {
        return 1
      }
      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1
    },

    InOut: function (k) {
      if (k === 0) {
        return 0
      }
      if (k === 1) {
        return 1
      }
      k *= 2
      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI)
      }
      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1
    }
  },

  Back: {
    In: function (k) {
      var s = 1.70158;
      return k * k * ((s + 1) * k - s)
    },

    Out: function (k) {
      var s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1
    },

    InOut: function (k) {
      var s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s))
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2)
    }
  },

  Bounce: {

    In: function (k) {
      return 1 - TWEEN.Easing.Bounce.Out(1 - k)
    },

    Out: function (k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375
      }
    },
    InOut: function (k) {
      if (k < 0.5) {
        return TWEEN.Easing.Bounce.In(k * 2) * 0.5
      }
      return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5
    }
  }
};

TWEEN.Interpolation = {

  Linear: function (v, k) {
    const m = v.length - 1
    const f = m * k
    const i = Math.floor(f)
    const fn = TWEEN.Interpolation.Utils.Linear

    if (k < 0) {
      return fn(v[0], v[1], f)
    }

    if (k > 1) {
      return fn(v[m], v[m - 1], m - f)
    }

    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i)

  },

  Bezier: function (v, k) {

    let b = 0
    let n = v.length - 1
    let pw = Math.pow
    const bn = TWEEN.Interpolation.Utils.Bernstein

    for (let i = 0; i <= n; i++) {
      b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i)
    }
    return b
  },

  CatmullRom: function (v, k) {

    let m = v.length - 1
    let f = m * k
    let i = Math.floor(f)
    const fn = TWEEN.Interpolation.Utils.CatmullRom

    if (v[0] === v[m]) {

      if (k < 0) {
        i = Math.floor(f = m * (1 + k))
      }

      return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)

    } else {

      if (k < 0) {
        return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0])
      }

      if (k > 1) {
        return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m])
      }

      return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i)
    }
  },

  Utils: {

    Linear: (p0, p1, t) => {
      return (p1 - p0) * t + p0
    },

    Bernstein: (n, i) => {
      const fc = TWEEN.Interpolation.Utils.Factorial()
      return fc(n) / fc(i) / fc(n - i)
    },

    Factorial: () => {
      let a = [1];
      return (n) => {
        let s = 1

        if (a[n]) {
          return a[n]
        }

        for (var i = n; i > 1; i--) {
          s *= i
        }

        a[n] = s
        return s
      }

    },

    CatmullRom: (p0, p1, p2, p3, t) => {

      var v0 = (p2 - p0) * 0.5
      var v1 = (p3 - p1) * 0.5
      var t2 = t * t
      var t3 = t * t2

      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1

    }

  }

}

export { TWEEN }