import { name, version, developer } from '../../../package.json'

/**
 * Hello.js
 *
 *
 */
 
 
class Hello {

  constructor() {

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      var args = [
          '\n %c ' + name + ' v' + version + ' %c Developed by ' + developer + ' \n\n',
          'color: #B44F00; background: #FFCC00; padding: 3px 0;',
          'color: #2408E2; background: #19DFFF; padding: 3px 0;'
      ]

      window.console.log.apply(console, args) //jshint ignore:line

    } else if (window.console) {
        window.console.log(  `${name} v${version} - Developed by ${developer} `) //jshint ignore:line
    }
    
  }

}

export default new Hello()