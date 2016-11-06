import { Utils }              from '../core'

import { extras, Sprite, utils }  from 'pixi.js'

export default class Button extends Sprite {

  constructor ( texture, frame, frameOver, frameOut, frameClicked, frameDisabled ) {
    super( Utils.getTexture(texture, frame) )

    this.anchor.set(0.5)
  
    this.isDisabled = false
    this.interactive = true
    this.buttonMode = true

    this.states = new Map()
    this.currentState = null

    this.addState('default', texture, frame)
    if(frameOver) {
      this.addState('onMouseOver', texture, frameOver)
      this.on( 'mouseover', () => { this.state = 'onMouseOver' } )
    }
    if(frameOut) {
      this.addState('onMouseOut', texture, frameOut)
      this.on( 'mouseout', () => { this.state = 'onMouseOut' } )
    }
    if(frameClicked) {
      this.addState('onClick', texture, frameClicked)

      this.on( 'mousedown', () => { this.state = 'onClick' } )
      this.on( 'touchstart', () => { this.state = 'onClick' } )

      this.on( 'mouseup', () => { this.state = 'default' } )
      this.on( 'touchend', () => { this.state = 'default' } )
    }
    if(frameDisabled) {
      this.addState('disabled', texture, frameDisabled)
    }
  }

  addText( x, y, text, font) {
    this.textLabel = new extras.BitmapText( text, { font: font } )
    this.addChild( this.textLabel )
    this.setTextPosition( x, y )
    return this.textLabel
  }
  setTextPosition(x,y) {
    this.textLabel.position.set( x, y )
  }
  set text(value) {
    if(!this.textLabel) {
      return
    } 
    this.textLabel.text = value
  }

  onMouseOver(callback) {

    this.on( 'mouseover', callback )
    
  }
  onMouseOut(callback) {

    this.on( 'mouseout', callback )

  }
  onClick(callback) {

    this.on( 'mousedown', callback )
    this.on( 'touchstart', callback )

  }
  onRelease( callback ) {
    this.on( 'mouseup', callback )
    this.on( 'touchend', callback )
  }

  addState( name, texture, frame ) {
    this.states.set( name, Utils.getTexture( texture, frame ) )
  }

  set state( name ) {
    if( !this.states.has(name) ) {
      return
    }
    this.currentState = name
    this.texture = this.states.get( name )
  }

  get state() {
    return this.currentState
  }

  set disabled(value) {
    if(value) {
      this.state = 'disabled'
    } else {
      this.state = 'default'
    }
    this.interactive = !value
    this.isDisabled = value
  }
  get disabled() {
    return this.isDisabled
  }

}






