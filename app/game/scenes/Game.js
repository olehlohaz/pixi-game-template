import Renderer           from '../../core/controllers/RendererManager'

import {Graphics, Container, extras}  from 'pixi.js'


export default class Game extends Container {

  constructor() {
    super()
  }

  init () {


  	const text = new extras.BitmapText('Hello World!', { font: '40px SaranaiGame-Bold', align: 'center' })
  	text.position.set( Renderer.center.x - text.textWidth*0.5, Renderer.center.y - text.textHeight*0.5 )

  	this.addChild( text )


  }
}