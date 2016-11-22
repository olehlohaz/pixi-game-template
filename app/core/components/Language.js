/**
 * RendererManager.js
 *
 * The main entry point, appends PIXI to the DOM
 *
 */

export default class Language {

  constructor() {

    this.words = new Map()
    
  }
  add(code, value) {
    this.words.set(code, value)
  }
  word(code) {
    return this.word.get(code)
  }
}