import { CONFIG } from '../core'

/**
 * Debug.js
 *
 *
 */
 
class Debug {

  constructor() {
    
    if(!CONFIG.DEBUG) {
      console.log = function() {}
    }
    
  }
}

export default new Debug()