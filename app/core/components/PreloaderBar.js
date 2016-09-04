import {RendererManager, Tween } from '../core'

import { Container, Graphics } from 'pixi.js'



export default class PreloaderBar extends Container {

  constructor() {
    
    super()


    this.drawBarBack()

    this.drawBarFront()
    
    this.tween = new Tween(this.preloaderFront)
  }

  drawBarBack() {
    this.progressBar = new Graphics()
    
    this.progressBar.lineStyle(3, 0xb6b6b6, 1)
    this.progressBar.beginFill(0xFFFFFF, 1)
    this.progressBar.drawRect(0,0, RendererManager.width*0.8, 40)
    this.progressBar.endFill()
    this.progressBar.position.set( RendererManager.width*0.1, RendererManager.height * 0.8 )

    this.addChild( this.progressBar )
  }
  drawBarFront() {
    this.preloaderFront = new Graphics()
    this.preloaderFront.lineStyle(3, 0x1989b8, 1)
    this.preloaderFront.beginFill(0x35baf3, 1)
    this.preloaderFront.drawRect(0,0, RendererManager.width*0.8, 40)
    this.preloaderFront.endFill()
    this.preloaderFront.position.set( RendererManager.width*0.1, RendererManager.height * 0.8 )
    this.preloaderFront.scale.x = 0.01
    
    this.addChild( this.preloaderFront )
  }


  setProgress(value) {

    this.tween.to({scale: {x: 1} }, 200).start()
  }

}
