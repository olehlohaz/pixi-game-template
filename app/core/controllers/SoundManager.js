import { utils, loader }  from 'pixi.js'
import { Howler, Howl }   from 'howler'
import { AUDIO_LOADED }   from '../core'



class SoundManager extends utils.EventEmitter {

  constructor() {

    super();

    this.isSpriteDefined = false

    this.sfx = new Howl({
      src: ['./assets/sfx.mp3', './assets/sfx.ogg'],
      preload: false
    })

    this.sfx.once( 'load', () => this.onLoadComplete() )

  }


  load () {
    this.sfx.load()
  }


  setupAudiosprite() {
    let rawSprites = loader.resources['audiosprite'].data.spritemap
    
    let howlerSprite = {}
    
    for(let key of Object.keys( rawSprites )) {

      howlerSprite[ key ] = this.AudiospriteToHowler( rawSprites[ key ] )

    }

    this.sfx._sprite = howlerSprite

    this.isSpriteDefined = true    
  }


  AudiospriteToHowler(data) {
    return [
      data.start * 1000, (data.end - data.start) * 1000, data.loop
    ];
  }


  play (name, volume) {
    if( !this.isSpriteDefined ) {
      this.setupAudiosprite()
    }
    
    let soundId = this.sfx.play( name )
    this.sfx.volume(volume || 1, soundId)

    return soundId;
  }

  stop (id) {
    this.sfx.stop( id )
  }


  onLoadComplete() {
    this.emit(AUDIO_LOADED, this.sfx)
  }

  addLoadListener ( callback, callbackContext ) {
    this.on(AUDIO_LOADED, callback, callbackContext, this.sfx)
  }


  
}

export default new SoundManager()
