var keyboard = require('./keyboard_state.js');
var gamepad = require('./gamepad_state.js');

InputState  = function() {
  this.debug = true; // Set to true for some debug out in console

  gamepadButtonMappings = {
    'up': 12,
    'down': 13,
    'left': 14,
    'right': 15,
    'run': 0,
    'jump': 2,
    'menu': 9
  }

  keyboardButtonMappings = {
    'up': "W",
    'down': "S",
    'left': "A",
    'right': "D",
    'jump': 'J',
    'run': 'K',
    'menu': 'enter'
  }
}

InputState.prototype.pressed = function(button_id) {
  return keyboard.pressed(keyboardButtonMappings[button_id]) ||
         gamepad.pressed(gamepadButtonMappings[button_id])

}

// X => 0
// Circle => 1
// Square => 2
// Triangle => 3
//
module.exports = new InputState;