import { GameData, RendererManager, TweenManager } from '../core'

import { utils } from 'pixi.js'



/**
 * App42Shepartz.js
 *
 *
 */
 
class App42Shepartz extends utils.EventEmitter {

  constructor() {

    super()

    this.leaderboardId = ''
    this.writeAPI = ''
    this.readAPI = ''


    const s2 = this.s4()
    this.suffix = `suffix_name${s2}`
  }
  
  init() {

    App42.initialize("","")

    this.scoreBoardService = new App42ScoreBoard()
    this.gameName = "GameName"

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

