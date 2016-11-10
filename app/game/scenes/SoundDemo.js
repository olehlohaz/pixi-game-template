import { SoundManager, Button, RendererManager, StateContainer }           from '../../core/core'

import {Graphics, extras }  from 'pixi.js'


export default class SoundDemo extends StateContainer {

  constructor() {
    super()
  }

  Init () {


    const button = new Button('buttons', 'button_green', 'button_yellow', 'button_green', 'button_orange')
    button.onClick( () => this.onPlaySound() )
    button.addText( 0, 0, 'CLICK ME', '50px SaranaiGame-Bold')

    this.addChild( button )

  }

  onPlaySound() {
    if( !SoundManager.getSound('music_id') ) {

      const music_id = SoundManager.audio('music').play()

      SoundManager.audio('music').loop( true, music_id )

      SoundManager.setSound('music_id', music_id)


    } else {

      SoundManager.audio('sfx').play('Game_collect')

    }

  }

}