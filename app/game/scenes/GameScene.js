import { RendererManager, StateContainer }           from '../../core/core'

import {Graphics, extras }  from 'pixi.js'


export default class Game extends StateContainer {

  constructor() {
    super()
  }

  Init () {


  	const text = new extras.BitmapText('Hello World!', { font: '40px SaranaiGame-Bold', align: 'center' })
  	text.position.set(  - text.textWidth*0.5,  - text.textHeight*0.5 )

  	this.addChild( text )


  }
}