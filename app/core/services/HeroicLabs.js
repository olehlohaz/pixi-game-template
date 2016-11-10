import { GameData, RendererManager, TweenManager } from '../core'

import { utils } from 'pixi.js'
// import CryptoJS, { MD5, enc } from 'crypto-js'
// import platform from 'platform'



class HeroicLabs extends utils.EventEmitter {

  constructor() {

    super()

    this._leaderboard = '00000000000000000000000000000000'
    this.writeAPI = '00000000000000000000000000000000'
    this.readAPI = '00000000000000000000000000000000'


    const s2 = this.s4()
    this.suffix = `sharbelfscom${s2}`
  }
  init() {
    this.initClient()
    this.initSession()
  }
  initNew() {
    this.initClient()
    this.anonymousLogin()
  }

  s4() {
    return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 )
  }
  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()
  }

  initSession() {

    const cachedSession = GameData.get( "HeroicLabsSession" )

    if (cachedSession == null || cachedSession.length == 0 ) {
      this.anonymousLogin()
    } else {
      this.session = new Heroic.Session( cachedSession._token )
      this.emit('session_started', this.session)
    }
  }


  set leaderboard(value) {
    this._leaderboard = value
  }
  get leaderboard() {
    return this._leaderboard
  }


  getPlayerRank() {

    var request = new Heroic.LeaderboardAndRankGetRequest( this.session, this._leaderboard )

    this.execute(request, (response) => {

      if(callback) {
        callback(response.body)
      }

    })
  }

  getName(data) {
    return data.split('_')[0]
    // return data.split(`_${this.suffix}`)[0]
  }

  getLeaderboard(callback = null) {
    
    const request = new Heroic.LeaderboardGetRequest( this._leaderboard )

    this.execute( request, (response) => {

      if(callback) {
        callback(response.body)
      }
    })
  }

  submitLeaderboard( score = 0, callback = null ) {
    
    const request = new Heroic.LeaderboardUpdateRequest( this.session, this._leaderboard, score )

    this.execute(request, (response) => {

      if(callback) {
        callback( response.body )
      }
    })
  }

  execute( request, callback ) {
    this.client.execute( request )
    .then( callback )
    .catch( (error) => this.onError(error) )
  }

  onError( response ) {
    console.log( 'onError', response )
  }

  updateName( name, callback = null ) {

    var request = new Heroic.GamerUpdateRequest(this.session,  `${name}_${this.suffix}` )

    this.execute(request, (response) => {
      console.log( 'nickname', response )

      if(callback) {
        callback( response.body )
      }

    })

  }

  anonymousLogin() {

    const uniqueId = this.guid()

    const request = new Heroic.LoginAnonymousRequest( uniqueId )

    this.execute( request, (response) => {
      GameData.set( "HeroicLabsSession", response.body )
      this.session = response.body
      this.emit('session_started', this.session)
    } )

  }

  ping() {
    const pingRequest = new Heroic.PingRequest()

    this.execute( pingRequest, (response) => {
      console.log( 'Ping was successful', response )
    })
  }

  initClient() {
    this.client = new Heroic.Client( this.writeAPI )
  }
}

export default new HeroicLabs()

