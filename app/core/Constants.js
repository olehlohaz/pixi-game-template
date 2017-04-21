/**
* App constants definition
*/

import { Constant }      from './core'

Object.assign(String.prototype, {
  padLeft(letter, length) {
    return String( letter.repeat( length ) + this ).slice( -length )
  }
})


Object.assign(Array.prototype, {
  List() {
    let index = -1
    let values = this
    return {
      next() {
        (index + 1 < values.length) ? ++index : index
        return { hasNext: (index + 1 < values.length), hasPrev: index > 0, value: values[index], index: index }
      },
      prev() {
        (index - 1 > 0) ? --index : index
        return { hasPrev: (index - 1 > 0), hasNext: index < values.length-1, value: values[index], index: index }
      },
      first() {
        index = 0
        return { hasPrev: false, hasNext: index < values.length-1, value: values[index], index: index }
      },
      last() {
        index = values.length-1
        return { hasPrev: false, hasNext: false, value: values[index], index: index }
      }
    }
  }
})


Math.rangeInt = function(min, max) {
  return Math.floor( Math.random() * ( max - min ) + min )
}
Math.rangeFloat = function(min, max) {
  return Math.random() * ( max - min ) + min
}
Math.radians = (degrees) => {
  return degrees * Math.PI / 180
}
Math.degrees = (radians) => {
  return radians * 180 / Math.PI
}


export const CONFIG = new Constant({
  DEBUG: true,
  PROXY: true,
  TRAVAR: false,
  DRAW: false
}, true);

export const BUTTON_STATE = new Constant({
  PRESSED:            Symbol('button.pressed'),
  RELEASED:           Symbol('button.released'),
});

export const EVENTS = new Constant({
  KEY_PRESSED:        Symbol('event.key.pressed'),
  PAUSE:              Symbol('event.pause'),
  STATE_CHANGE:       Symbol('event.state.change'),
  ANIMATE:            Symbol('event.animate'),
  LOADED:             Symbol('event.loaded'),
  RESIZE:             Symbol('event.resize'),
  STATES: {
    INIT:             Symbol('event.state.init'),
    REMOVE:           Symbol('event.state.remove'),
  }
});

export const TEXT_FORMAT = new Constant({
  STRING:         Symbol('text_format.string'),
  INTEGER:        Symbol('text_format.integer'),
  FLOAT:          Symbol('text_format.float'),
  MONEY:          Symbol('text_format.money'),
  MONEY_DECIMAL:  Symbol('text_format.money_decimal'),
});
