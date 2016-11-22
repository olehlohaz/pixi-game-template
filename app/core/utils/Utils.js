import { utils, loader }  from 'pixi.js'
import { TEXT_FORMAT } from '../core'

/**
 * Utils.js
 *
 *
 */
 
 
class Utils {

  constructor() {
    
  }

  getTexture(name, frame) {
    const data = loader.resources[ name ]
    if(frame) {
      return data.textures[frame]
    }
    return data.texture
  }
  
  formatText(value, format) {
    switch(format) {
      case TEXT_FORMAT.STRING:
        return value.toString()
      break;
      case TEXT_FORMAT.INTEGER:
        return parseInt(value)
      break;
      case TEXT_FORMAT.FLOAT:
        return parseFloat(value)
      break;
      default:
        return value
      break;
    }
  }
  getParams() {
    
    const params = {}
    const list = window.location.search.substr(1).split('&').map( (elem) => {
      const item = elem.split('=')
      params[ item[0] ] = item[1]
    })

    return params
  }
}

export default new Utils()