// get the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// timing vars
// ex: 50 FPS = 20 ms per frame
var FPS = 50;
// ex: 120 BPM = 500 ms per beat
var BPM = 60;
// hard code for now @ 25 frames/beat
var frameCounter = 50;

// score vars
var health = 700;
var score = 0;
var special = 0;
var value = 100;
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
//var yPos = 0;
//var dy = 2;
var delta = 2;

// collision vars
var colTop = y - radius;
var colRight = x + radius;
var colBot = y  + radius;
var colLeft = x - radius;

// vars for controlling input
// up, right, down, left, power, pause
var buttonArr = [false, false, false, false, false, false];
var keyReady = [true, true, true, true, true, true];
var cooldown = [0, 0, 0, 0, 0, 0];
var collisions = [false, false, false, false, false, false];
var buttonSelect = 0;

// var for standard cooldown
var cooldownLength = 5;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
	switch (e.keyCode) {
		case 39:
			if (cooldown[1] == 0 && keyReady[1]) {
				buttonArr[1] = true;
				keyReady[1] = false;
				cooldown[1] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 38:
			if (cooldown[0] == 0 && keyReady[0]) {
				buttonArr[0] = true;
				keyReady[0] = false;
				cooldown[0] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 40:
			if (cooldown[2] == 0 && keyReady[2]) {
				buttonArr[2] = true;
				keyReady[2] = false;
				cooldown[2] = cooldownLength;
				//score += value;
				//health += 50;
			}
			break;
		case 37:
			if (cooldown[3] == 0 && keyReady[3]) {
				buttonArr[3] = true;
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

// hard coded for now
//sideArr = [n, n, n, n];

var orbs = [];

// collision check
function handleCollisions() {

	// placeholder: check if any orbs are colliding w/ the top red box
	// need to make these boxes objects in the future
	orbs.forEach(function(Orb) {
		if (Orb.x > (x+radius-overlap) && Orb.x < (x+radius-overlap+rectWidth) && buttonArr[1]) {
			score += value;
			health += 50;
			Orb.active = false;
			collisions[1] = true;
		}
	});
}


// generic constructor for orb
function Orb(x, y, dx, dy, color) {
	this.x = x;
	this.y = y;
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
	};

	// draw the orb
	this.draw = function() {
		drawOrb(this.x, this.y, this.color);
	}

	// check to see if the orb is inbounds
	this.inbounds = function() {
		var inb = (this.dy > 0 && this.y < colTop) || (this.dy < 0 && this.y > colBot) || (this.dx > 0 && this.x < colLeft) || (this.dx < 0 && this.x > colRight);
		console.log(inb);
		return inb;
	}
}

// main orb generation function
// args
// side: a number which corresponds to the side to generate the orb at
function orbGen(side) {

	switch(side) {
		case 0:
			// top
			temp = new Orb(x, 0, 0, delta, "red");
			orbs.push(temp);
			break;
		case 1:
			// right
			temp = new Orb(x*2, y, (delta * -1), 0, "blue");
			orbs.push(temp);
			break;
		case 2:
			// bottom
			temp = new Orb(x, y*2, 0, (delta * -1), "green");
			orbs.push(temp);
			break;
		case 3:
			// left
			temp = new Orb(0, y, delta, 0, "yellow");
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

		frameCounter = 25;
	}

	drawCatcher();

	// update each orb
	orbs.forEach(function(Orb) {

		Orb.update();
		Orb.draw();
	});

	// filter out inactive orbs
	orbs = orbs.filter(function(Orb) {
		return Orb.active;
	});

	handleCollisions();

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