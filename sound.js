// all sound related code goes here
//var soundIDArr = ["bassDrum"];
//var soundAssets = ["./assets/sounds/kick_drum.ogg"];

// simulate an associative array to store all the sounds we might want to load
var soundArr = {"bassDrum":"./assets/sounds/kick_drum.ogg",
				"shot":"./assets/sounds/Game-Shot.ogg",
				"bass":"./assets/sounds/bass.ogg",
				/*"explosion":"./assets/sounds/explosion.ogg",
				"pad":"./assets/sounds/110212__bluebloomers__pad-1.ogg",*/
                "120BPM":"./assets/sounds/120 Default.ogg"};

// load all the sounds we might want to use
function loadSounds () {

	for (ID in soundArr) {

		if (soundArr[ID] !== "") {
			createjs.Sound.registerSound(soundArr[ID], ID);
		}
	}
}

// play a single sound
function playSound (soundID) {

	sound = createjs.Sound.play(soundID);
    return sound;
}