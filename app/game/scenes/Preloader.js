import PreloaderBar       from '../../core/components/PreloaderBar'
import StateManager       from '../../core/controllers/StateManager'
import Sound              from '../../core/controllers/SoundManager'
import Game               from './Game'

import { loader, Sprite }       from 'pixi.js'


export default class Preloader extends PIXI.Container {

  constructor () {

    super()

    
    this.audioLoaded = false
    this.dataLoaded = false

    Sound.addLoadListener(this.onLoadAudioComplete, this)
    
  }

  init() {

    this.preloaderBar = new PreloaderBar()
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



