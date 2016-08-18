import { utils, loader }  from 'pixi.js'
import { Howler, Howl }   from 'howler'
import { AUDIO_LOADED }   from '../Constants'
/**
 * Sound Store
 * Responsible to load, and play sounds of the audiosprite
 *
 */
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

  /**
   * Start to load the audio files, used during the preloader phase.
   */
  load () {
    this.sfx.load()
  }

  /**
   * Convert json data created using audiosprite to a Howler compatible format
   */
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

  /**
   * Play audiosprite
   * @param {string} Name of the audio sprite
   * @return {number} id of the audio
   */
  play (name, volume) {
    if( !this.isSpriteDefined ) {
      this.setupAudiosprite()
    }
    
    let soundId = this.sfx.play( name )
    this.sfx.volume(volume || 1, soundId)

    return soundId;
  }
  /**
   * Stop Audio
   * @param {number} ID of the audio
   */
  stop (id) {
    this.sfx.stop( id )
  }

  /**
   * Dispatched after finishes load the audio
   */
  onLoadComplete() {
    this.emit(AUDIO_LOADED, this.sfx)
  }

  /**
   * Add function to listen to load complete event. Used during the preloader
   */
  addLoadListener ( callback, callbackContext ) {
    this.on(AUDIO_LOADED, callback, callbackContext, this.sfx)
  }


  
}

export default new SoundManager()
