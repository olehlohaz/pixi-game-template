import eventemitter3  from 'eventemitter3'

class GameEvent extends eventemitter3 {

  constructor() {

    super()
    
  } 

  clean() {
    this.removeAllListeners()
  }


}
export default new GameEvent()