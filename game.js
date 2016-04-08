// SwapStepper (tempName)
// Copyright Henry Olson 2016

// get the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// game variables
var state = "start";

// timing vars
var FPS = 50;
// starting BPM, will change eventually
var BPM = 120;
var BPS = (BPM / 60);
// we always want a whole number closest to our BPM so that we can decrement it properly
function calcFramesPerBeat(FPS, BPM) {
	var BPS = BPM / 60;
	fpb = Math.ceil(FPS / BPS);

	// always return an even number so we can play the bass on the midpoint
	if (fpb % 2 != 0) {
		fpb++;
	}

	return fpb;
}
var framesPerBeat = calcFramesPerBeat(FPS, BPM);
//var framesPerBeat = Math.ceil(FPS / BPS);
//console.log(framesPerBeat);
// frames/beat
var frameCounter = framesPerBeat;


// animation timers
death_animT = 0;

// score vars
var health = 700;
var score = 0;
var combo = 0;
var longestCombo = 0;
var multiplier = 0;
var special = 0;
var scoreIncr = 100;
var healthIncr = 40;
var healthPenalty = 15;
var r = 0;
var g = 255;
var b = 255; 

// vars for drawing the catcher
var x = 265;
var y = 265;
var radius = 30;
var rectHeight = 35; //30
var rectWidth = 28; // 24
var overlap = 6;

// orb vars
var orbRadius = 6;

// calculate orbSpeed based on BPM
var distanceToRectCenter = x - radius - (rectWidth / 2) + (overlap/2);
// this could be a factor of BPM...the higher the BPM the faster the orb should move
var beatsToCenter = 2;
//var beatsToCenter = 200/BPM;

var distancePerBeat = distanceToRectCenter / beatsToCenter;
//var orbSpeed = 2;
var orbSpeed = distancePerBeat / framesPerBeat;

// collision vars
// these represent where we want to kill the orbs if they've passed the squares
var boundTop = y - radius + overlap;
var boundRight = x + radius - overlap;
var boundBot = y  + radius - overlap;
var boundLeft = x - radius + overlap;

// vars for controlling input
// up, right, down, left, power, pause
var buttonArr = [false, false, false, false, false, false];
var keyReady = [true, true, true, true, true, true];
var cooldown = [0, 0, 0, 0, 0, 0];
var collisions = [false, false, false, false, false, false];
var buttonSelect = 0;

// var for standard cooldown
var cooldownLength = 5;

// arrays for storing objects
var orbs = [];
var rects = [];

// add squares
rects.push(new Rect(x - (rectHeight/2), y - radius - rectWidth + overlap, rectHeight, rectWidth, "red", 0));
rects.push(new Rect(x + radius - overlap, y - (rectHeight/2), rectWidth, rectHeight, "blue", 1));
rects.push(new Rect(x - (rectHeight/2), y + radius - overlap, rectHeight, rectWidth, "green", 2));
rects.push(new Rect(x - radius - rectWidth + overlap, y - (rectHeight/2), rectWidth, rectHeight, "yellow", 3));


// *** INPUT HANDLING ***
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 39:
			if (cooldown[1] == 0 && keyReady[1]) {
				buttonArr[1] = true;
				// this is a little hacky, we should really integrate the inputHandling into the game loop
				handleCollisions();
				keyReady[1] = false;
				cooldown[1] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 38:
			if (cooldown[0] == 0 && keyReady[0]) {
				buttonArr[0] = true;
				handleCollisions();
				keyReady[0] = false;
				cooldown[0] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 40:
			if (cooldown[2] == 0 && keyReady[2]) {
				buttonArr[2] = true;
				handleCollisions();
				keyReady[2] = false;
				cooldown[2] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 37:
			if (cooldown[3] == 0 && keyReady[3]) {
				buttonArr[3] = true;
				handleCollisions();
				keyReady[3] = false;
				cooldown[3] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 32:
			if (cooldown[4] == 0 && keyReady[4]) {
				buttonArr[4] = true;
				keyReady[4] = false;
				cooldown[4] = 100;
			}
			break;
		default:
			break;
	}
}

function keyUpHandler(e) {
    switch (e.keyCode) {
		case 39:
			buttonArr[1] = false;
			keyReady[1] = true;
			break;
		case 38:
			buttonArr[0] = false;
			keyReady[0] = true;
			break;
		case 40:
			buttonArr[2] = false;
			keyReady[2] = true;
			break;
		case 37:
			buttonArr[3] = false;
			keyReady[3] = true;
			break;
		case 32:
			buttonArr[4] = false;
			keyReady[4] = true;
			break;
		default:
			break;
	}
}
// *** END INPUT HANDLING ***

// collision check
function handleCollisions() {

	// placeholder: check if any orbs are colliding w/ the top red box
	// need to make these boxes objects in the future
	rects.forEach(function(Rect) {

		if (buttonArr[Rect.side] && keyReady[Rect.side]) {

			hitOrb = false;

			orbs.forEach(function(Orb) {
				
					/*if ((Orb.x + (orbRadius / 2) < Rect.x + Rect.width) && (Orb.x + (orbRadius / 2) > Rect.x) && 
						(Orb.y + (orbRadius / 2) < Rect.y + Rect.height) && (Orb.y + (orbRadius / 2) > Rect.y)) {*/
					if ((Orb.x < Rect.x + Rect.width) && ((Orb.x + orbRadius) > Rect.x) && 
						(Orb.y < Rect.y + Rect.height) && ((Orb.y + orbRadius) > Rect.y)) {
						score += scoreIncr;
						health += healthIncr;
						combo += 1;
						Orb.active = false;
						collisions[Rect.side] = true;
						hitOrb = true;
					}
				
			});

			// take a health penalty for each missed button press
			if (hitOrb == false) {
				health -= healthPenalty;
			}
		}
	});
}


// generic constructor for orb
function Orb(xpos, ypos, dx, dy, color) {
	this.x = xpos;
	this.y = ypos;
	this.dx = dx;
	this.dy = dy;
	this.color = color;
	this.active = true;

	// move the orb
	this.update = function() {

		this.x += this.dx;
		this.y += this.dy;
		// check to see if the orb is active
		this.active = this.active && this.inbounds();

		// remove health if
		if (this.inbounds() == false) {
			health -= healthPenalty;
			combo = 0;
		}
	};

	// draw the orb 
	this.draw = function() {
		drawOrb(this.x, this.y, this.color);
	}

	// check to see if the orb is inbounds
	this.inbounds = function() {
		var inb = (this.dy > 0 && this.y < boundTop) || (this.dy < 0 && this.y > boundBot) || (this.dx > 0 && this.x < boundLeft) || (this.dx < 0 && this.x > boundRight);
		//console.log(inb);
		return inb;
	}
}

// constructor for rects of catcher...making these objects so we can run methods from them
function Rect(xpos, ypos, width, height, color, side) {

	this.x = xpos;
	this.y = ypos;
	this.width = width;
	this.height = height;
	this.color = color;
	this.side = side;

	this.draw = function() {
		drawRect(this.x, this.y, this.width, this.height, this.color, this.side);
	}

}

// main orb generation function
// args
// side: a number which corresponds to the side to generate the orb at
function orbGen(side) {

	switch(side) {
		case 0:
			// top
			temp = new Orb(x, 0, 0, orbSpeed, "red");
			orbs.push(temp);
			break;
		case 1:
			// right
			temp = new Orb(x*2, y, (orbSpeed * -1), 0, "blue");
			orbs.push(temp);
			break;
		case 2:
			// bottom
			temp = new Orb(x, y*2, 0, (orbSpeed * -1), "green");
			orbs.push(temp);
			break;
		case 3:
			// left
			temp = new Orb(0, y, orbSpeed, 0, "yellow");
			orbs.push(temp);
			break;
		default:
			console.log("bad side received: " + side.toString());
			break;
	}
}

// game over sound controller
var gameOverSound = true;
// pad sound controller
var padSoundDelay = frameCounter * 16;

// main draw loop
function main() {

	// clear screen
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// check for state == start
	if (state == "start") {
		health = 700;
		score = 0;
		combo = 0;
		longestCombo = 0;
		multiplier = 0;
		//BPM = BPM;
		gameOverSound = true;

		//if (buttonArr[4]) {
			state = "playing";
		//}
		
		return;
	}

	// check for state == gameover
	if (state == "gameover") {
		orbs = [];
		drawScore();

		if (gameOverSound) {
			//playSound("explosion");
			gameOverSound = false;
		}
		// dying animation...
		if (death_animT > 0) {

			deathAnimation(death_animT);
			death_animT--;
			return;
		}

		drawGameOver();
		
		// restart
		if (buttonArr[4]) {
			state = "start";
		}
		return;
	}

	// update frameCounter
	frameCounter--;
	// we have struck a beat
	if (frameCounter == 0) {

		// play our sound
		playSound("bassDrum");

		// random side chooser
		side = Math.floor(Math.random() * 4);
		orbGen(side);

		//BPM++;
		frameCounter = calcFramesPerBeat(FPS, BPM);
		//console.log(frameCounter);
	}
	else if (frameCounter == calcFramesPerBeat(FPS, BPM)/2) {
		playSound("bass");
	}

	padSoundDelay--;
	if (padSoundDelay == 0) {

		playSound("pad");

		padSoundDelay = calcFramesPerBeat(FPS, BPM) * 64;
	}

	drawTrack(0, y - (rectHeight / 2), x, rectHeight, 3);
	drawTrack(x - (rectHeight / 2), 0, rectHeight, y, 0);
	drawTrack(x, y - (rectHeight / 2), x, rectHeight, 1);
	drawTrack(x - (rectHeight / 2), y, rectHeight, y, 2);

	// draw the squares
	rects.forEach(function(Rect) {

		Rect.draw();
	});

	// update each orb
	orbs.forEach(function(Orb) {

		Orb.update();
		Orb.draw();
	});

	// draw the circle and its animations
	drawCatcher();

	// filter out inactive orbs
	orbs = orbs.filter(function(Orb) {
		return Orb.active;
	});

	//handleCollisions();

	// decrement cooldown
	var i = 0;
	for(i=0; i<6; i++) {
		if (cooldown[i] > 0) {
			//console.log(cooldown[i]);
			cooldown[i]--;
		}
		else {
			collisions[i] = false;
		}
	}


	health--;

	if (health < 0) {
		health = 0;
	}

	if (health == 0) {
		state = "gameover";
		death_animT = 50;
	}

	if (health > 1100) {
		health = 1100;
	}

	drawScore();
	drawHealth();

	if (combo > 1) {
		drawCombo(combo);
	}
}

setInterval(main, 1000/FPS);