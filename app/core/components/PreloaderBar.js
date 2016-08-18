import Renderer from '../controllers/RendererManager'
import Utils from '../utils/Utils'
import Tween from '../effects/Tween'

import { Container, Sprite, Graphics } from 'pixi.js'


/**
 * Preloader Bar
 * Create a preloader bar and animate the progress
 *
 * @exports PreloaderBar
 * @extends Container
 */
export default class PreloaderBar extends Container {

  constructor() {
    
    super()


    this.progressBar = new Graphics()
    
    this.progressBar.beginFill(0x666666, 0.8)
    this.progressBar.drawRect(Renderer.width*0.1, Renderer.center.y, Renderer.width*0.8, 30)
    this.progressBar.endFill()

    this.addChild( this.progressBar )

    this.preloaderFront = new Graphics()
    this.preloaderFront.beginFill(0xCCFFCC, 1)
    this.preloaderFront.drawRect(Renderer.width*0.1, Renderer.center.y, Renderer.width*0.8, 30)
    this.preloaderFront.endFill()
    this.addChild( this.preloaderFront )

    this.tween = new Tween(this.preloaderFront.scale)
  }


  setProgress(value) {
    this.tween.to({x: value * 0.01}, 200).start()
  }

}
