 
export default class Constant {

  constructor(object, canSet = false) {
    
    for(const key in object) {

      
      const isObject = (typeof(object[key]) === 'object')

      const GetterSetter = new Object()

      if(isObject) {
        GetterSetter['get'] = function() { 
          return new Constant( object[key], canSet )
        } 
      } else {
        GetterSetter['get'] = function() { return object[key] } 
      }

      if(canSet && !isObject) {
        GetterSetter['set'] = function(value) {
          object[key] = value
        }
      }

      Object.defineProperty( this, key, GetterSetter )
    }

  }  
  
}