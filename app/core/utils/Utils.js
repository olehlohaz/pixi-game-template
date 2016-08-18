import { utils, loader }  from 'pixi.js'
import { TEXT_FORMAT } from '../Constants'

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
}

export default new Utils()