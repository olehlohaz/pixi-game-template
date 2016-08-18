/**
 * App.js
 *
 * The main entry point, appends PIXI to the DOM
 * and starts a render and animation loop
 *
 */

import './index.html'
import {config}         from '../package.json'
import StateManager     from './core/controllers/StateManager'
import Preloader        from './game/scenes/Preloader'
import Game             from './game/scenes/Game'
import {loader}       	from 'pixi.js'

StateManager.init( config.stageWidth, config.stageHeight )

const preloader = new Preloader()
const game      = new Game()

StateManager.addState( 'Game', game )
StateManager.addState( 'Preloader', preloader )

// loader.add('preloader', 'assets/preloader.json').load(setup)

function setup() { 
  StateManager.setActive( 'Preloader' )
  StateManager.start()  
}

setup()