import { Timer, GameData, RendererManager, TweenManager } from '../core'

import { utils } from 'pixi.js'
import CryptoJS, { MD5, enc } from 'crypto-js'
import platform from 'platform'



class GameAnalytics extends utils.EventEmitter {

  constructor() {

    super()

    this.enabled = false

    this.sandBoxKey = '5c6bcb5402204249437fb5a7a80a4959'
    this.sandBoxSecret = '16813a12f718bc5c620f56944e1abc3ea13ccbac'
    
    this.gameKey = '28cced813ea37c0ba62e4e6f6e4e7d1a'
    this.secretKey = '7b6737ff7bd7afcaa5bdd69468a8403f0cb64c1d'

    var category = 'design'

    this.UUID = this.guid()

    this.queue = new Array()

    this.session_num = GameData.get('session_num')
    if(!GameData.get('session_num')) {
      this.session_num = 1
    } else {
      this.session_num++
    }

    GameData.set( 'session_num', this.session_num )

  }

  s4() {
    return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 )
  }
  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()
  }

  init() {

    const data = {
      platform: 'web',
      sdk_version: 'rest api v2'
    }

    this.send( 'init', data, (response) => this.onInit(response) )
  }

  onInit(response) {
    console.log( 'onInit', response )
    
    this.enabled = response.enabled
    this.server_ts = response.server_ts

    this.offset = (Date.now() * 0.001 || 0) - this.server_ts

    if( this.enabled ) {

      console.log('Analytics Enabled')

      Timer.setTimeout( () => this.sendData(), 30000 )

    }

    // this.design( 'TRIAL:track1:car1:lap1', 10 )
    // this.design( 'TRIAL:track1:car1:lap2', 10.4 )
    // this.design( 'TRIAL:track1:car1:lap2', 9.8 )

    // this.sendData()
  }

  sendData() {

    const listToSend = new Array()
    const total = this.queue.length

    if(total === 0) {
      return
    }
    console.log('sendData', total)

    for(let i = 0; i < total; i++) {
      if(this.queue.length > 0) {
        listToSend.push( this.queue.pop() )
      }
    }

    if(listToSend.length > 0) {
      this.send('events', listToSend, (response) => this.onFinishSendData(response) )
    }
  }
  onFinishSendData(response ) {
    console.log( '-- GameAnalytics - SENT --', response )
  }

  design( id, value = 1 ) {
    // gameMode:screen:action
    // gameMode:track:car:

    let platformName = platform.os.family.replace(' ', '').toLowerCase()
    if(platformName === 'osx') {
      platformName = 'mac_' + platformName
    }

    const data = {
      device: platform.name,
      v: 2,
      user_id: `user-${this.UUID}`,
      sdk_version: 'rest api v2',
      client_ts: parseInt( (Date.now() * 0.001 || 0) + this.offset),
      session_id: this.UUID,
      session_num: this.session_num,
      os_version:  ( platformName+' '+platform.os.version ),
      manufacturer: platform.manufacturer || 'unknown',
      platform: platformName,

      category: "design",
      event_id: id,
      value: value
    }

    console.log( data )

    this.queue.push( data )
  }

  createHeader(jsonData) {

    const encryptedMessage = CryptoJS.HmacSHA256( jsonData, this.secretKey )
    // const encryptedMessage = CryptoJS.HmacSHA256( jsonData, this.sandBoxSecret )
    const authHeader = CryptoJS.enc.Base64.stringify( encryptedMessage )

    return authHeader
  }

  request(url, data) {

    const jsonMessage = JSON.stringify( data ) 
    
    const xhr = new XMLHttpRequest()
    return new Promise( (resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve( JSON.parse( xhr.responseText ) )
          } else {
            reject( xhr.responseText )
          }
        }
      }

      try {
        xhr.open( 'POST', url, true )
        xhr.setRequestHeader( 'Authorization', this.createHeader( jsonMessage ) )
        xhr.setRequestHeader( 'Content-Type', 'application/json' )
        xhr.send( jsonMessage )
      } catch (e) {
        reject({
          success: false,
          message: 'Error: Unable to send request, CORS not allowed.'
        })
      }
    })
  }

  send( type, data, callback ) {
    
    // this.request( `http://sandbox-api.gameanalytics.com/v2/${this.sandBoxKey}/${type}`, data )
    this.request( `http://api.gameanalytics.com/v2/${this.gameKey}/${type}`, data )
    .then( function ( response = {} ) {
      callback( response )
    } )
  }
}

export default new GameAnalytics()

