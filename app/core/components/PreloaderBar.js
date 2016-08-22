import {RendererManager, Tween } from '../core'

import { Container, Graphics } from 'pixi.js'



export default class PreloaderBar extends Container {

  constructor() {
    
    super()


    this.progressBar = new Graphics()
    
    this.progressBar.beginFill(0x666666, 0.8)
    this.progressBar.drawRect(RendererManager.width*0.1, RendererManager.center.y, RendererManager.width*0.8, 30)
    this.progressBar.endFill()

    this.addChild( this.progressBar )

    this.preloaderFront = new Graphics()
    this.preloaderFront.beginFill(0xCCFFCC, 1)
    this.preloaderFront.drawRect(RendererManager.width*0.1, RendererManager.center.y, RendererManager.width*0.8, 30)
    this.preloaderFront.endFill()
    this.addChild( this.preloaderFront )

    this.tween = new Tween(this.preloaderFront.scale)
  }


  setProgress(value) {
    this.tween.to({x: value * 0.01}, 200).start()
  }

}
