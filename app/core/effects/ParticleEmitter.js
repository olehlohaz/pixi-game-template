import Utils      from '../utils/Utils'
import Animation  from '../controllers/AnimationManager'
import Particles  from 'pixi-particles'

import { Container, ParticleContainer, particles, loader } from 'pixi.js'

export default class ParticleEmitter extends Container {

  constructor(imageList, config, type) {

    super()

    this.emitter = null

    this.elapsed = Date.now()

    let assets = new Array()

    for( const [frame, texture] of imageList.entries() ) {
      assets.push( Utils.getTexture( texture, frame ) )
      // console.log(key, value, Utils.getTexture( key, value ) )
    }

    // Create the new emitter and attach it to the stage
    const emitterContainer = new ParticleContainer(5000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    } )


    this.addChild(emitterContainer)


    this.emitter = new particles.Emitter(
      emitterContainer,
      assets,
      config
    )

    // Center on the stage
    this.emitter.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2)


    Animation.addEventListener( () => this.update() )

  }

  // Update function every frame
  update() {

    const now = Date.now()
    if (this.emitter) {
      this.emitter.update((now - this.elapsed) * 0.001)
    }
    
    this.elapsed = now
  }

  
}