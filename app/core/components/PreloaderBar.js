import { TweenManager, RendererManager, Tween, TWEEN } from '../core'

import { Sprite, Rectangle, Texture, Container, Graphics } from 'pixi.js'


/**
 * RendererManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */
export default class PreloaderBar extends Container {

  constructor(colorLoader, colorDot, useImage = false) {
    
    super()


    if(useImage) {
        const logo = Sprite.fromImage('logo.png')
        this.addChild( logo )
        logo.anchor.set(0.5)
    }

      
    const texture = Texture.fromImage('assets/preloader.png')



    const loaderBg = this.createImage( texture, new Rectangle( 1, 40, 765, 31 ) )
    loaderBg.tint = 0x333333

    const loaderFront = this.createImage( texture, new Rectangle( 1, 1, 771, 37 ) )
    loaderFront.tint = colorLoader // 0xff9a00 // color front

    const loaderDot = this.createImage( texture, new Rectangle( 774, 1, 92, 42 ) )
    loaderDot.tint = colorDot // 0xffca00 // color dot


    this.imageMask = this.createMask(1, 1, 771, 37)
    this.imageMask.scale.set(0.1, 1)


    loaderBg.position.y = loaderFront.position.y = loaderDot.position.y = this.imageMask.position.y = RendererManager.height * 0.3


    loaderFront.mask = this.imageMask
    loaderDot.mask = this.imageMask

    loaderDot.position.x = -loaderFront.width * 0.5
    new Tween(loaderDot).to({ x: loaderFront.width * 0.5 }, 900).repeat(-1).start()

  }

  createMask( x, y, w, h ) {

    const imageMask = new Graphics()
    imageMask.beginFill(0xff0000)
    imageMask.drawRect( x, y - h * 0.5, w, h )
    imageMask.endFill()
    imageMask.position.x = -w * 0.5

    this.addChild( imageMask )

    return imageMask
  }

  createImage(texture, rect) {
    const text = new Texture( texture.baseTexture, rect )
    const img = new Sprite(text)
    img.anchor.set(0.5)
    this.addChild( img )

    return img
  }

  setProgress(value) {
    
    const scale = Math.min(value*0.01, 1)

    TweenManager.removeFrom(this.imageMask)

    new Tween(this.imageMask.scale).to( {x: scale }, 200).start()
  }

}
