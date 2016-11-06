import {PreloaderBar, StateManager, SoundManager, StateContainer}       from '../../core/core'


import { loader }       from 'pixi.js'


export default class Preloader extends StateContainer {

  constructor () {

    super()

    
    this.audioLoaded = false
    this.dataLoaded = false

    SoundManager.addLoadListener(this.onLoadAudioComplete, this)
    
  }

  Init() {

    this.preloaderBar = new PreloaderBar( 0xff9a00, 0xffca00 )
    this.addChild( this.preloaderBar )

    loader.add('SaranaiGame-Bold',  'assets/SaranaiGame-Bold.fnt')
    // loader.add('animations',        'assets/animations.json')
    // loader.add('background1',       'assets/background1.png')
    // loader.add('background2',       'assets/background2.jpg')
    // loader.add( { name: "sfx", url: 'assets/sfx.mp3', loadType: PIXI.loaders.Resource.LOAD_TYPE.AUDIO } )

    loader.on('progress', this.onLoaderProgress, this)
    loader.once('complete', this.onLoaderComplete, this)


    loader.load()
    // SoundStore.load()
  }


  onLoadAudioComplete () {

    this.audioLoaded = true
    this.checkForLoadComplete()

  }

  onLoaderComplete (data, file) {
    
    this.initGame()
    
  }

  initGame() {
    StateManager.switchFade( 'Game', 2000 )
  }

  checkForLoadComplete() {
    if(!this.dataLoaded || !this.audioLoaded) {
      return;
    }

  }


  onLoaderProgress (loader, resource) {
    
    this.preloaderBar.setProgress(loader.progress)
    
  }
}



