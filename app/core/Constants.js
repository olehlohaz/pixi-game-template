/**
* App constants definition
*/

Object.assign(String.prototype, {
    padLeft(letter, length) {
        return String( letter.repeat( length ) + this ).slice( -length )
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


export const BUTTON_STATE = {
  PRESSED:            Symbol('button.pressed'),
  RELEASED:           Symbol('button.released'),
}

export const EVENTS = {
  STATE_CHANGE:       Symbol('event.state.change'),
  ANIMATE:            Symbol('event.animate'),
  RESIZE:             Symbol('event.resize'),
  STATES: {
    INIT:             Symbol('event.state.init'),
    REMOVE:           Symbol('event.state.remove'),
  }
}

export const TEXT_FORMAT = {
  STRING:         Symbol('text_format.string'),
  INTEGER:        Symbol('text_format.integer'),
  FLOAT:          Symbol('text_format.float'),
  MONEY:          Symbol('text_format.money'),
  MONEY_DECIMAL:  Symbol('text_format.money_decimal'),
}
