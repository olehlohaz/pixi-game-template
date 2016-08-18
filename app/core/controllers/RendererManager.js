import { utils, loader }  from 'pixi.js'
import { EVENTS } from '../Constants'

/**
 * Render Store
 * Keeps render variables
 *
 * @data
 * 	width : window width
 * 	height : window height
 * 	stage : stage width and height
 * 	stageCenter : center point of stage
 * 	resolution : display density
 */
class RendererManager extends utils.EventEmitter {

  constructor() {
    super();

    this.width = 0;
    this.height = 0;
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.center = {x: 0, y: 0}
    this.resolution = 1

  }

  emitChange() {
    this.emit(EVENTS.RESIZE, this.data)
  }

  addEventListener(callback) {
    this.on(EVENTS.RESIZE, callback, callbackContext)
  }
}

export default new RendererManager()