import { CONFIG } from '../core'

class Locker {

  constructor() {


    this.listSites = [
      'aHR0cDovL3NoYXJiZWwuaW5mbw==', // http://sharbel.info
      // 'aHR0cDovL2xvY2FsaG9zdA==', // http://localhost
    ]

    // console.log( window[atob('bG9jYXRpb24=')]['aHJlZg=='] )

    this.current = window[atob('bG9jYXRpb24=')][atob('aHJlZg==')]

    this.isValid = this.verify()

    if(!CONFIG.TRAVAR) {
      this.isValid = true      
    }
    // console.log(CONFIG.TRAVAR)
    // console.log( btoa('http://sharbel.info'), btoa('http://localhost') )
    
  }

  verify() {
    let isValid = false
    for(const data of this.listSites) {
      
      if(this.current.indexOf(atob(data)) === 0) {
        isValid = true
      }
    }

    return isValid
  }

  check() {
    return ( this.isValid === true ) ? 1 : Math.random()
  }

}

export default new Locker()