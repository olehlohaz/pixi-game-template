/**
 * App.js
 *
 * The main entry point, appends PIXI to the DOM
 * and starts a render and animation loop
 *
 */

import './index.html'
import { config }         from '../package.json'
import { StateManager, RendererManager }  from './core/core'
import { PreloaderScene, GameScene }        from './game/game'

RendererManager.resizeHandler()


StateManager.addState( 'Game',      GameScene )
StateManager.addState( 'Preloader', PreloaderScene )


StateManager.setActive( 'Preloader' )
RendererManager.start()
