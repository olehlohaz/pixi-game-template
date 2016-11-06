import { CONFIG } from '../core'
import CryptoJS, { AES, enc } from 'crypto-js'

class Crypto {

  constructor() {


    this._secret = null

    // Encrypt
    
    // var ciphertext = AES.encrypt(JSON.stringify(data), 'secret key 123')

    // Decrypt

    // var bytes  = AES.decrypt(ciphertext.toString(), 'secret key 123')
    // var decryptedData = JSON.parse(bytes.toString(enc.Utf8))
    
  }
  

  encode( data ) {
    // Encrypt
    const ciphertext = AES.encrypt( JSON.stringify( data ), this._secret )

    return ciphertext
  }

  decode( data ) {
    const bytes  = AES.decrypt( data.toString(), this._secret )
    const decryptedData = JSON.parse( bytes.toString( enc.Utf8 ) )

    return decryptedData
  }
  

}

export default new Crypto()