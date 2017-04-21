/**
 * App.js
 *
 * The main entry point, appends PIXI to the DOM
 * and starts a render and animation loop
 *
 */

import './index.html'
import { config }         from '../package.json'
import { loader, loaders }         from 'pixi.js'
import { SoundManager, GameData, Device, StateManager, RendererManager }  from './core/core'
import { SoundDemo, PreloaderScene, GameScene }        from './game/game'

Device.init()
GameData.setVariable()
RendererManager.init()
SoundManager.init( loader, loaders.Resource )

StateManager.addState( 'Game',      GameScene )
StateManager.addState( 'Preloader', PreloaderScene )
StateManager.addState( 'SoundDemo', SoundDemo )


StateManager.setActive( 'Preloader' )
RendererManager.start()
