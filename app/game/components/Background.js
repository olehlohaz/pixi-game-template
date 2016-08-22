import { RendererManager, Utils, ParticleEmitter}         from '../../core/core'

import { Container, Sprite, Graphics, tween as Tween }  from 'pixi.js'

export default class Background extends Container {

  constructor() {

    super()

    this.addColorBackground()

    this.createParticlesBackground()

    this.createSpinBackground()

  }

  addColorBackground () {
  	let backgroundColor = new Graphics()

  	backgroundColor.beginFill( 0x8f0096, 1 )
  	backgroundColor.drawRect( 0, 0, RendererManager.width, RendererManager.height )
  	this.addChild( backgroundColor )

  }

  createParticlesBackground () {

    const listAssets = new Map([
      // ['small_ball', 'animations'],
      ['star', 'animations']
    ])

    const config = {
      alpha: { start: 0.5,        end: 0.2 },
      scale: { start: 0.7,        end: 1 },
      color: { start: '000000',  end: 'ffffff' },
      speed: { start: 50,        end: 10 },

      startRotation:  { min: 30,    max: 150 },
      rotationSpeed:  { min: 20,    max: 50 },
      lifetime:       { min: 3.5,   max: 5 },

      blendMode: 'overlay',
      frequency: 0.016,
      emitterLifetime: 0,
      maxParticles: 150,
      addAtBack: false,
      spawnType: 'rect',

      pos: { x: -RendererManager.center.x, y: -RendererManager.center.y - 50 },
      spawnRect: { x: 0, y: 0, w: 1500, h: 0 }
    }

    let particle = new ParticleEmitter(listAssets, config)
    this.addChild(particle)
  }

  createSpinBackground (x = 0, y = 0) {
  	let bgImage = new Sprite( Utils.getTexture( 'background1') )
  	this.addChild( bgImage )
  	return bgImage
  }
}