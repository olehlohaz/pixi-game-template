import {PreloaderBar, StateManager, SoundManager, StateContainer}       from '../../core/core'


import { loader, loaders }       from 'pixi.js'


export default class Preloader extends StateContainer {

  constructor () {

    super()
    
  }

  Init() {

    this.preloaderBar = new PreloaderBar( 0xff9a00, 0xffca00 )
    this.addChild( this.preloaderBar )

    loader.add( 'SaranaiGame-Bold',   'assets/SaranaiGame-Bold.fnt')
    loader.add( 'buttons',            'assets/buttons.json')

    loader.add( 'sfx',                'assets/audio/sfx.json')

    // loader.add( 'music',              'assets/audio/RetroBeat.*', { loadType: loaders.Resource.LOAD_TYPE.AUDIO, metadata: { extension: ['mp3', 'ogg'] } } )

    loader.add( 'music',              'assets/audio/RetroBeat.mp3' )

    loader.on('progress', this.onLoaderProgress, this)
    loader.once('complete', this.onLoaderComplete, this)


    loader.load()
  }

  onLoaderComplete (data, file) {
    
    this.initGame()
    
  }

  initGame() {
    // StateManager.switchFade( 'Game', 2000 )
    StateManager.switchFade( 'SoundDemo', 2000 )
  }


  onLoaderProgress (loader, resource) {
    
    this.preloaderBar.setProgress(loader.progress)
    
  }
}



