/**
 * GameData.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */
 

class VariableStorage {

  constructor() {
    this.data = new Object()
  }

  setItem(name, value) {
    this.data[name] = value
  }
  getItem(name) {
    return this.data[name]
  }
  clear() {
    this.data = new Object()
  }

}

class GameData {

  constructor() {

    this.enabled = ( typeof(Storage) !== "undefined" )
    this.setStorage()
  } 
  setStorage() {
    this.storage = window.localStorage
  }
  setVariable() {
    this.storage = new VariableStorage()
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
    this.storage.setItem( name, this.toString( value ) )
  }

  get( name ) {
    const data = this.storage.getItem( name )
    if( !data ) {
      return null
    }

    return this.toObject( data )
  }

  clean( value = null ) {
    this.storage.clear(value)
  }
}

export default new GameData()