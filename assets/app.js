/*
|--------------------------------------------------------------------------
| START MIDI MAMBO
|--------------------------------------------------------------------------
*/

var midi = require('midi');
midiOut = new midi.output();

try {
  midiOut.openPort(0);
} catch(error) {
  midiOut.openVirtualPort('MidiApp');
}

/*
|--------------------------------------------------------------------------
| VARS
|--------------------------------------------------------------------------
*/

var currentOctave = 0;
var maxOctave = 3;
var minOctave = -3;
var transpose = 60;
var sharps = [1,3,6,8,10];
var layout = [
	'q','2','w','3','e','r','5','t','6','y','7','u',
	'i','9','o','0','p','z','s','x','d','c','f','v',
	'b'
];
var keyCodes = {
    'Backspace': 8,
    'Tab': 9,
    'Enter': 13,
    'Shift': 16,
    'Ctrl': 17,
    'Alt': 18,
    'Pause': 19,
    'Capslock': 20,
    'Esc': 27,
    'Pageup': 33,
    'Pagedown': 34,
    'End': 35,
    'Home': 36,
    'Leftarrow': 37,
    'Uparrow': 38,
    'Rightarrow': 39,
    'Downarrow': 40,
    'Insert': 45,
    'Delete': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    '0numpad': 96,
    '1numpad': 97,
    '2numpad': 98,
    '3numpad': 99,
    '4numpad': 100,
    '5numpad': 101,
    '6numpad': 102,
    '7numpad': 103,
    '8numpad': 104,
    '9numpad': 105,
    'Multiply': 106,
    'Plus': 107,
    'Minut': 186,
    'Dot': 190,
    'Slash1': 111,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'curlyL': 219,
    'curlyR': 221,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,
    'Equal': 187,
    'Coma': 188,
    'Minus': 189,
    'Slash': 191,
    'Square': 219,
    'Backslash': 220
}
var mappedLayout = mapLayout(layout);

/*
|--------------------------------------------------------------------------
| KEYBOARD
|--------------------------------------------------------------------------
*/

function mapLayout(layout) {
	var map = [];
	layout.forEach(function(key){
		map.push(keyCodes[key]);
	});
	return map;
}

function createKeys() {
	var octave = 0;
	for (var i = 0; i < layout.length; i++) {
		var key = document.createElement("div");
		key.classList.add("key");
		key.setAttribute('index', i);		
		if(sharps.indexOf(i - (octave * 12)) > -1) {
			key.classList.add("sharp");	
		}
		keyboard.appendChild(key);
		if(i > 0 && i % 12 === 0) {
			octave++;
		}
	}
}

function octaveUp() {
	if (currentOctave === maxOctave ) return;
	currentOctave++;
}

function octaveDown() {
	if (currentOctave === minOctave ) return;
	currentOctave--;
}

function bindKeys() {
    document.addEventListener('keydown', function(e) {
    	if(e.keyCode == 189) {
    		octaveDown();
    	} else if (e.keyCode == 187) {
    		octaveUp();
    	} else {
    		var index = mappedLayout.indexOf(e.keyCode);
    		if(index > -1) {
    			playNote(index);
    		}
    	}
    });

    document.addEventListener('keyup', function(e) {
		var index = mappedLayout.indexOf(e.keyCode);
		if(index > -1) {
			stopNote(index);
		}
    });
}

function playNote(index) {
	var key = getKey(index);
	if(!key.classList.contains('active')) {
		noteDown(noteInOctave(index));
		key.classList.add('active');
	}	
}

function stopNote(index) {
	var key = getKey(index);
	if(key.classList.contains('active')) {
		noteUp(noteInOctave(index));
		key.classList.remove('active');
	}	
}

function getKey(index) {
	return keyboard.querySelector('[index="'+index+'"]');
}

function noteDown(MIDInote) {
	midiOut.sendMessage([144,MIDInote,100]);
}

function noteUp(MIDInote) {
	midiOut.sendMessage([128,MIDInote,100]);
}

function noteInOctave(i) {
	return (i + transpose) + (12 * currentOctave);
}

/*
|--------------------------------------------------------------------------
| FIRE UP
|--------------------------------------------------------------------------
*/

createKeys();
bindKeys();