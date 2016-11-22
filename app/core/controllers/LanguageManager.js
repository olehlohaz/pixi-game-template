import { Language }      from '../core'
import { WebGLRenderer, utils, loader, Point }  from 'pixi.js'

/**
 * LanguageManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */
 
class LanguageManager {

  constructor() {

  	this.languages = new Map()
  	this.codes = new Set()
    
    this.currentLanguage = null
  }

  get current() { return this.currentLanguage }

  getWord(language, code) {
  	return this.getLanguage(language).word(code)
  }

  setDefault(name) {
  	this.currentLanguage = this.getLanguage(name)
  }

  getLanguage(name) {
  	if(this.languages.has(name)) {
  		return this.languages.get(name)
  	}
  	let language = new Language(name)
  	this.languages.set(name, language)

  	return language
  }

  addWord(languageCode, code, value) {

  	let language = this.getLanguage(languageCode)
  	language.add(code, value)
  }

  addWords(languageCode, wordList) {
	let language = this.getLanguage(languageCode)

	for(const [code, value] of wordList.entries()) {
		language.add(code, value)	
	}

  }
  
}

export default new LanguageManager()