import { RendererManager, Utils } from '../../core/core'
import { ticker, Container, extras, Graphics }  from 'pixi.js'

export default class AnimatedSprite extends extras.AnimatedSprite {

  constructor( texture, frame, autoUpdate = false ) {

    super( [ Utils.getTexture( texture, frame ) ], autoUpdate )

    this.listTextures = new Map()

    this.currentTexture = new Array()
    
  }

  createAnimation( name, texture, prefix, initial, final, increment = 1, suffix = '', padding = 0 ) {

    const textures = new Array()


    if(typeof(initial) === 'number') {

      if(initial === final) {
        textures.push( Utils.getTexture(texture, prefix ) )
        textures.push( Utils.getTexture(texture, prefix ) )
      } else if(initial < final) {

        for(let i = initial; i <= final; i += increment) {
          const n = i.toString().padLeft(0, padding)
          textures.push( Utils.getTexture(texture, `${prefix}${n}${suffix}` ) )
        } 

      } else {

        for(let i = initial; i >= final; i -= increment) {
          const n = i.toString().padLeft(0, padding)
          textures.push( Utils.getTexture(texture, `${prefix}${n}${suffix}` ) )
        } 
      }
    } else {
      for(let i = 0; i < initial.length; i++) {
        const n = initial[i]
        textures.push( Utils.getTexture(texture, `${prefix}${n}${suffix}` ) )
      }       
    }

    this.listTextures.set( name, textures )

  }

  play(name, speed = 60, repeat = false, onCompleteCallback = null) {
    
    this.stop()

    this._textures = this.listTextures.get( name )

    this._onCompleteCallback = onCompleteCallback

    this.currentAnimation = name

    this.animationSpeed = speed / 60
    this.loop = repeat
    this._currentTime = 0
    this.playing = true
    ticker.shared.add( this.update, this )

  }
  
  stop() {
    if(!this.playing) {
      return
    }
    
    this.playing = false
    ticker.shared.remove( this.update, this )

    if(this._onCompleteCallback) {
      this._onCompleteCallback()
    }
  }
}