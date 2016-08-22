import { RendererManager }           from '../../core/core'

import {Graphics, Container, extras}  from 'pixi.js'


export default class Game extends Container {

  constructor() {
    super()
  }

  init () {


  	const text = new extras.BitmapText('Hello World!', { font: '40px SaranaiGame-Bold', align: 'center' })
  	text.position.set( RendererManager.center.x - text.textWidth*0.5, RendererManager.center.y - text.textHeight*0.5 )

  	this.addChild( text )


  }
}