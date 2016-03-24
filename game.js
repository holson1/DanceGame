// get the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// timing vars
var FPS = 50;
// starting BPM, will change eventually
var BPM = 100;
var BPS = (BPM / 60);
// we always want a whole number closest to our BPM so that we can decrement it properly
var framesPerBeat = Math.ceil(FPS / BPS);
// frames/beat
var frameCounter = framesPerBeat;

function calcFramesPerBeat(FPS, BPM) {
	var BPS = BPM / 60;
	return Math.ceil(FPS / BPS);
}

// score vars
var health = 700;
var score = 0;
var special = 0;
var scoreIncr = 100;
var healthIncr = 40;
var healthPenalty = 20;
var r = 0;
var g = 255;
var b = 255; 

// vars for drawing the catcher
var x = 265;
var y = 265;
var radius = 30;
var rectHeight = 30;
var rectWidth = 24;
var overlap = 6;

// orb vars
var orbRadius = 6;

// calculate orbSpeed based on BPM
var distanceToRectCenter = x - radius - (rectWidth / 2) + overlap;
// this could be a factor of BPM...the higher the BPM the faster the orb should move
//var beatsToCenter = 2;
var beatsToCenter = 200/BPM;

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

			// take a health penalty for each button press, but only if the player has enough health so this won't kill them
			//if (health > (healthPenalty * 2)) {
			//	health -= healthPenalty;
			//}

			orbs.forEach(function(Orb) {
				
					if ((Orb.x + (orbRadius / 2) < Rect.x + Rect.width) && (Orb.x + (orbRadius / 2) > Rect.x) && 
						(Orb.y + (orbRadius / 2) < Rect.y + Rect.height) && (Orb.y + (orbRadius / 2) > Rect.y)) {
						score += scoreIncr;
						health += healthIncr;
						Orb.active = false;
						collisions[Rect.side] = true;
					}
				
			});
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
		}
	};

	// draw the orb 
	this.draw = function() {
		drawOrb(this.x, this.y, this.color);
	}

	// check to see if the orb is inbounds
	this.inbounds = function() {
		var inb = (this.dy > 0 && this.y < boundTop) || (this.dy < 0 && this.y > boundBot) || (this.dx > 0 && this.x < boundLeft) || (this.dx < 0 && this.x > boundRight);
		console.log(inb);
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

// main draw loop
function draw() {

	// clear screen
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// update frameCounter
	frameCounter--;
	// we have struck a beat
	if (frameCounter == 0) {

		//console.log("nts");

		// random side chooser
		side = Math.floor(Math.random() * 4);
		orbGen(side);

		BPM++;
		frameCounter = calcFramesPerBeat(FPS, BPM);
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
	if (health > 1100) {
		health = 1100;
	}

	drawScore();
	drawHealth();
}

setInterval(draw, 1000/FPS);