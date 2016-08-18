import PreloaderBar       from '../../core/components/PreloaderBar'
import StateManager       from '../../core/controllers/StateManager'
import Sound              from '../../core/controllers/SoundManager'
import RendererStore      from '../../core/controllers/RendererManager'
import Utils              from '../../core/utils/Utils'
import Game               from './Game'

import { loader, Sprite }       from 'pixi.js'
/**
 * Preloader Class
 *
 * Add a preloader bar and load all assets and sound files
 *
 * @exports Preloader
 * @extends PIXI.Container
 */
export default class Preloader extends PIXI.Container {

  constructor () {

    super()

    
    this.audioLoaded = false
    this.dataLoaded = false

    Sound.addLoadListener(this.onLoadAudioComplete, this)
    
  }

  /**
   * initialize function. Called by the renderer when it's set to active
   */
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

  /**
   * mark audio as loaded and check if all assets are loaded too
   */
  onLoadAudioComplete () {

    this.audioLoaded = true
    this.checkForLoadComplete()

  }
  /**
   * mark data as loaded and check for audio
   */
  onLoaderComplete (data, file) {
    
    this.initGame()
    
  }

  initGame() {
    StateManager.switchFade( 'Game', 2000 )
  }

  /**
   * check if audio and data are loaded and change renderable to MainMenu
   */
  checkForLoadComplete() {
    if(!this.dataLoaded || !this.audioLoaded) {
      return;
    }

    // StateManager.setActive( 'MainMenu' )
  }

  /**
   * update progress bar as files are loaded
   */
  onLoaderProgress (loader, resource) {
    
    this.preloaderBar.setProgress(loader.progress)
    
  }
}



