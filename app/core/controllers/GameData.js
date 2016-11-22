/**
 * GameData.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */
 
class GameData {

  constructor() {

    this.enabled = ( typeof(Storage) !== "undefined" )

    this.storage = window.localStorage
  } 

  toObject( value ) {
    if(value === null) {
      return null
    }
    return JSON.parse( value ).value
  }

  toString( value ) {
    return JSON.stringify( { value: value } )
  }

  set( name, value ) {
    const type = (typeof value)

    this.storage.setItem( name, this.toString( value ) )
  }

  get( name ) {
    const data = this.storage.getItem( name )

    return this.toObject( data )
  }

  clean( value = null ) {
    this.storage.clear(value)
  }


}
export default new GameData()