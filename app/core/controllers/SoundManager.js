import { utils, Resource }  from 'pixi.js'
import { Howler, Howl }   from 'howler'
import { EVENTS }         from '../core'



class SoundManager extends utils.EventEmitter {

  constructor() {

    super()

    
  }
  init( loader, Resource ) {
    this.listAudioExtensions = ['wav', 'mp3', 'ogg', 'ac3', 'm4a', 'webm']

    this.Resource = Resource
    this.loader = loader

    for(const ext of this.listAudioExtensions) {
      Resource.setExtensionLoadType( ext, Resource.LOAD_TYPE.AUDIO )
    }

    loader.use( this.middlewhere() )
    loader.pre( this.preMiddlewhere() )

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

  getPath(urlPath) {
    const index = urlPath.lastIndexOf('/')
    const path = urlPath.substr(0, index)

    return path
  }
  removePathExtension(urlPath) {
    const index = urlPath.lastIndexOf('.')
    const path = urlPath.substr(0, index)

    return path
  }
  getExtension( urlPath ) {
    const index = urlPath.lastIndexOf('.')
    const ext = urlPath.substr( index + 1 )

    return ext
  }

  preMiddlewhere() {
    const self = this

    return function(resource, next) {

      if(resource.loadType === self.Resource.LOAD_TYPE.AUDIO) {
        const ext = self.getExtension(resource.url)
        if(ext === '*') {
          resource.isComplete = true
          resource.type = self.Resource.TYPE.AUDIO
        }
      }

      next()
    }
  }

  middlewhere() {
    const self = this

    return function(resource, next) {

      // console.log(resource.isJson, resource.data.resources)

      if ( resource && resource.type === self.Resource.TYPE.JSON && resource.data && resource.data.resources ) {
        
        const path = self.getPath(resource.url)

        const spritename = self.setupAudiosprite( resource.data.spritemap )

        const audioFiles = resource.data.resources.map( (sound) => { return `${path}/${sound}` } )

        resource.data = new Howl({
          src: audioFiles,
          preload: true,
          sprite: spritename
        })

        self._audios.set( resource.name, resource.data )

        resource.data.once( 'load', next )

      } else if(resource && resource.type === self.Resource.TYPE.AUDIO) {

        let audioFiles = [ resource.url ]
        const path = self.removePathExtension(resource.url)

        if(self.getExtension(resource.url) === '*') {
          audioFiles = resource.metadata.extension.map( (ext) => { return `${path}.${ext}` } )
        } else {

          if(resource.metadata.fallback) {
            audioFiles = audioFiles.concat(resource.metadata.fallback.map( (ext) => { return `${path}.${ext}` } ))
          }

        }
  
        resource.data = new Howl({
          src: audioFiles,
          preload: true
        })

        self._audios.set( resource.name, resource.data )

        resource.data.once( 'load', next )

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