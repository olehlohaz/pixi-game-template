import { GameData, RendererManager, TweenManager } from '../core'

import { utils } from 'pixi.js'
// import CryptoJS, { MD5, enc } from 'crypto-js'
// import platform from 'platform'



class App42Shepartz extends utils.EventEmitter {

  constructor() {

    super()

    this.leaderboardId = '2061eb60e5de461b89a819d0ea091cea'
    this.writeAPI = '10e48559e5294ccdbf6c614396eef6ac'
    this.readAPI = '54a63478baf44f1fb845527d33fdda67'


    const s2 = this.s4()
    this.suffix = `sharbelfscom${s2}`
  }
  
  init() {

    App42.initialize("d1ae5870a8bc085ee7f4c2f7a54f892e5d280f0f235bb396b5c8a2a0d312398c","b5b86e1eb48c91e3809eff66171dd6143b81871400b7326f2259ed9441f66dfb")

    this.scoreBoardService = new App42ScoreBoard()
    this.gameName = "Crazy Racers"

    console.log(this.scoreBoardService)


    this.sendScore('myname', 12.45, (response) => {
      const game = JSON.parse(response)
      console.log(game)
    })


    this.getLeaderboard(10, (response) => {
      console.log(response)
      const game = JSON.parse(response)
      console.log(game)
    })
  }

  sendScore( name, value, callback ) {

    this.scoreBoardService.saveUserScore( this.gameName, name + this.suffix, value, {
        success: callback, error: (error) => this.onError()
    })
  }

  onError(error) {
    console.log(error)
  }

  getLeaderboard( max, callback ) {

    this.scoreBoardService.getTopNRankings( this.gameName, max, {
        success: callback, error: (error) => this.onError()
    })

    // getTopRankings(gamename, callback)

    // getTopNRankers(gamename, max , callback)

    // getTopNRankings(gamename, max , callback)
  }

  s4() {
    return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 )
  }
  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()
  }

}

export default new App42Shepartz()

