import { utils, loader }  from 'pixi.js'
import { Howler, Howl }   from 'howler'
import { EVENTS }   from '../core'



class SoundManager extends utils.EventEmitter {

  constructor() {

    super();

    this.isSpriteDefined = false

    const Resource = PIXI.loaders.Resource
    Resource.setExtensionLoadType( "wav", Resource.LOAD_TYPE.AUDIO )
    Resource.setExtensionLoadType( "mp3", Resource.LOAD_TYPE.AUDIO )
    Resource.setExtensionLoadType( "ogg", Resource.LOAD_TYPE.AUDIO )
    Resource.setExtensionLoadType( "webm", Resource.LOAD_TYPE.AUDIO )

    loader.use( this.middlewhere() )

    this._audios = new Map()
    this._sounds = new Map()
  }

  set mute(value) {

    this._mute = value
    Howler.mute( this._mute )

  }
  get mute() {
    return this._mute
  }

  muteAudio(sound, value = null) {
    if(value === null) {
      return this.audio(sound)._muted
    }

    this.audio(sound).mute(value)
  }

  audio( value ) {
    return this._audios.get( value )
  }
  setSound( name, id ) {
    this._sounds.set(name, id)
  }

  getSound( name ) {
    return this._sounds.get(name)
  }

  middlewhere() {
    const self = this

    return function(resource, next) {

      if ( resource && resource.isJson && resource.data && resource.data.resources ) {
          
          const _index = resource.url.lastIndexOf('/')
          const path = resource.url.substr(0, _index)

          const spritename = self.setupAudiosprite( resource.data.spritemap )

          const audioFiles = resource.data.resources.map( (sound) => { return `${path}/${sound}` } )

          resource.data = new Howl({
            src: audioFiles,
            preload: true,
            sprite: spritename
          })

          self._audios.set( resource.name, resource.data )

          resource.data.once( 'load', () => next() )

      } else {
        next()
      }
    }
  }


  setupAudiosprite( spritemap ) {
    
    let howlerSprite = {}
    
    for(let key of Object.keys( spritemap )) {
      howlerSprite[ key ] = this.AudiospriteToHowler( spritemap[ key ] )
    }

    return howlerSprite
  }


  AudiospriteToHowler(data) {
    return [
      data.start * 1000, (data.end - data.start) * 1000, data.loop
    ];
  }
  
}

export default new SoundManager()
