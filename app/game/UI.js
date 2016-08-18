import Button           from '../core/ui/Button'

import { DATA_CHANGE, EVENTS, TEXT_FORMAT, GAME_STATE }  from '../core/Constants'
import { Container, utils }  from 'pixi.js'


export default class UI extends Container {

  constructor(x,y) {

  	super()

    this.buttonInfo = this.createInfoButton()
    this.createAutoSpinButtons()
    this.createLinesText()
    this.createLineBetText()
    this.createTotalBetText()
    this.createWinText()

    this.createBalanceText()
    this.buttonAutoStart = this.createAutoStartButton()
    this.buttonLines = this.createLinesButton()
    this.buttonBetPerLine = this.createBetPerLinesButton()
    this.buttonMaxBet = this.createMaxBetButton()
    this.buttonSpin = this.createSpinButton()

    GameStates.addEventListener(EVENTS.STATE_CHANGE, (state) => this.onChanceState(state) )

  }

  onChanceState(newState) {
    switch(newState) {
      case GAME_STATE.SPINNING:
        this.setButtonsEnabled(false)
      break;
      case GAME_STATE.STOPPED:
        this.setButtonsEnabled(true)
      break;
    }
  }

  setButtonsEnabled(value) {
    this.buttonInfo.disabled = !value
    this.buttonAutoStart.disabled = !value
    this.buttonSpin.disabled = !value
    this.buttonLines.disabled = !value
    this.buttonBetPerLine.disabled = !value
    this.buttonMaxBet.disabled = !value
  }

  createInfoButton() {
    const buttonInfo = new Button( 'buttons', 'info1', 'info2', 'info1', 'info3', 'info4' )
    this.addChild(buttonInfo)
    buttonInfo.onClick(this.onClickInfo, this )

    buttonInfo.position.set(110, 840)

    return buttonInfo
  }
  createAutoSpinButtons() {
    const labelAutospin = new LabelWithText('buttons', 'LabelSpins', '30px SaranaiGame-Bold', '0', 0, 4)
    this.addChild( labelAutospin )
    labelAutospin.position.set( 308, 840)
  }

  createLinesText() {
    const linesText = new LabelWithText('buttons', 'labelLines', '30px SaranaiGame-Bold', '20', 0, 4)
    this.addChild( linesText )
    linesText.position.set( 482, 840)
    linesText.updateText( GameData.winlines )

    GameData.addEventListener( DATA_CHANGE.WINLINES, (value) => linesText.updateText(value) )

    return linesText
  }

  createLineBetText() {
    const lineBetText = new LabelWithText('buttons', 'LabelLineBet', '30px SaranaiGame-Bold', '20', 0, 4)
    this.addChild( lineBetText )
    lineBetText.position.set( 650, 840)
    lineBetText.updateText( GameData.linesBet )

    GameData.addEventListener( DATA_CHANGE.LINESBET,  (value) => lineBetText.updateText(value) )

    return lineBetText
  }

  createTotalBetText() {
    const totalBetText = new LabelWithText('buttons', 'LabelTotalBet', '30px SaranaiGame-Bold', '20', 0, 4)
    this.addChild( totalBetText )
    totalBetText.position.set( 826, 840)
    
    totalBetText.textFormat = TEXT_FORMAT.MONEY
    totalBetText.updateText( GameData.totalBet )

    GameData.addEventListener( DATA_CHANGE.TOTALBET,  (value) => totalBetText.updateText(value) )

    return totalBetText
  }

  createWinText() {
    const winText = new LabelWithText('buttons', 'LabelWin', '35px SaranaiGame-Bold', '000000', 160, -5, 'right')
    this.addChild( winText )
    winText.position.set( 1100, 840)

    return winText
  }


  createBalanceText() {
    const balanceText = new LabelWithText('buttons', 'credits balance', '30px SaranaiGame-Bold', '000000', 90, 5, 'right')
    this.addChild( balanceText )
    balanceText.position.set( 110, 917)

    balanceText.textFormat = TEXT_FORMAT.MONEY_DECIMAL
    balanceText.updateText( GameData.balance )

    GameData.addEventListener( DATA_CHANGE.BALANCE, (value) => balanceText.updateText(value) )

    return balanceText
  }
  createAutoStartButton() {
    const buttonAutoStart = new Button('buttons', 'Auto start1', 'Auto start2', 'Auto start1', 'Auto start3', 'Auto start4')
    this.addChild(buttonAutoStart)
    buttonAutoStart.onClick( (evt) => this.onClickAutoStart(evt) )

    buttonAutoStart.position.set(308, 917)

    return buttonAutoStart
  }
  createLinesButton() {

    const linesButton = new Button('buttons', 'Lines1', 'Lines2', 'Lines1', 'Lines3', 'Lines4')
    this.addChild(linesButton)
    linesButton.onClick( (evt) => this.onClickLines(evt) )

    linesButton.position.set(482, 917)

    return linesButton
  }

  createBetPerLinesButton(){

    const buttonBetPerLine = new Button('buttons', 'Bet per line1', 'Bet per line2', 'Bet per line1', 'Bet per line3', 'Bet per line4' )
    this.addChild(buttonBetPerLine)
    
    buttonBetPerLine.onClick( (evt) => this.onClickLinesBet(evt) )

    buttonBetPerLine.position.set(650, 917)

    return buttonBetPerLine
  }

  createMaxBetButton() {
    const buttonMaxBet = new Button('buttons', 'Max bet1', 'Max bet2', 'Max bet1', 'Max bet3', 'Max bet4')
    this.addChild(buttonMaxBet)

    buttonMaxBet.onClick( (evt) => this.onClickMaxBet(evt) )

    buttonMaxBet.position.set(826, 917)

    return buttonMaxBet
  }
  createSpinButton() {

  	const buttonSpin = new Button('buttons', 'Spin1', 'Spin2', 'Spin1', 'Spin3', 'Spin4')
    this.addChild(buttonSpin)

    buttonSpin.onClick( (evt) => this.onClickSpin(evt) )
    
    buttonSpin.position.set(1100, 917)

    return buttonSpin
  }

  disabledSpin () {

  }

  onClickLinesBet () {
    const bets = GameData.allBets.entries()
    let bet = bets.next()
    let currentValue = bet.value[0]

    while(!bet.done) {
      
      if(currentValue === GameData.linesBet) {
        bet = bets.next()
        if(bet.value) {
          GameData.linesBet = bet.value[0]
        } else {
          GameData.linesBet = GameData.allBets.entries().next().value[0]
        }
        return
      }
      bet = bets.next()
      currentValue = bet.value[0]
    }
  }

  onClickLines() {
    let lines = GameData.winlines + 1
    if(lines > 20) {
      lines = 1
    }
    GameData.winlines = lines
  }

  onClickAutoStart() {

  }

  onClickMaxBet() {

    const bets = GameData.allBets.entries()
    let bet = bets.next()
    let currentValue = bet.value[0]

    while(!bet.done) {

      currentValue = bet.value[0]
      bet = bets.next()
      if(bet.done) {
        GameData.linesBet = currentValue
      }

    }
  }

  onClickSpin() {
    GameStates.state = GAME_STATE.SPINNING
  } 

  onClickInfo() {
    
  }

}




