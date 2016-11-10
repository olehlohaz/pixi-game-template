import { CONFIG } from '../core'

class Locker {

  constructor() {


    this.listSites = [
      'http://localhost'
    ]

    this.current = window.location.href

    this.isValid = this.verify()

    if(!CONFIG.TRAVAR) {
      this.isValid = true      
    }
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