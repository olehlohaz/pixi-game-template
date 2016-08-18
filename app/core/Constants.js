/**
* App constants definition
*/

Object.assign(String.prototype, {
    padLeft(letter, length) {
        return String( letter.repeat( length ) + this ).slice( -length )
    }
})

const BUTTON_STATE = {
	PRESSED: 	Symbol('button_pressed'),
	RELEASED: 	Symbol('button_released'),
}

const EVENTS = {
	STATE_CHANGE: 		Symbol('event_state_change'),
	ANIMATE: 			Symbol('event_animate'),
	RESIZE: 			Symbol('event_resize'),
}

const TEXT_FORMAT = {
	STRING: 		Symbol('text_format_string'),
	INTEGER: 		Symbol('text_format_integer'),
	FLOAT: 			Symbol('text_format_float'),
}

export { BUTTON_STATE, EVENTS, TEXT_FORMAT }