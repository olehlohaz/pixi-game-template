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
import { loader }       	from 'pixi.js'

RendererManager.resizeHandler()


StateManager.addState( 'Game',      GameScene )
StateManager.addState( 'Preloader', PreloaderScene )

// loader.add('preloader', 'assets/preloader.json').load(setup)

function setup() { 
  StateManager.setActive( 'Preloader' )
  RendererManager.start()
}

setup()