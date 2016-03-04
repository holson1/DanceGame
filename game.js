// get the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// score vars
health = 700;
score = 0;
special = 0;
value = 100;
r = 0;
g = 255;
b = 255; 

// vars for drawing the catcher
var x = 240;
var y = 240;
var radius = 50;
var rectHeight = 50;
var rectWidth = 40;
var overlap = 10;

// vars for controlling input
// up, right, down, left, power, pause
var buttonArr = [false, false, false, false, false, false];
var keyReady = [true, true, true, true, true, true];
var cooldown = [0, 0, 0, 0, 0, 0];
buttonSelect = 0;

// var for standard cooldown
cooldownLength = 5;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
	switch (e.keyCode) {
		case 39:
			if (cooldown[1] == 0 && keyReady[1]) {
				buttonArr[1] = true;
				keyReady[1] = false;
				cooldown[1] = cooldownLength;
				score += value;
				health += 50;
			}
			break;
		case 38:
			if (cooldown[0] == 0 && keyReady[0]) {
				buttonArr[0] = true;
				keyReady[0] = false;
				cooldown[0] = cooldownLength;
				score += value;
				health += 50;
			}
			break;
		case 40:
			if (cooldown[2] == 0 && keyReady[2]) {
				buttonArr[2] = true;
				keyReady[2] = false;
				cooldown[2] = cooldownLength;
				score += value;
				health += 50;
			}
			break;
		case 37:
			if (cooldown[3] == 0 && keyReady[3]) {
				buttonArr[3] = true;
				keyReady[3] = false;
				cooldown[3] = cooldownLength;
				score += value;
				health += 50;
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

yPos = 0;
dy = 5;

// main draw loop
function draw() {

	// clear screen
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// flash colors
	/*for (i=0;i<4;i++) {
		buttonArr[i] = false;
	}
	buttonArr[buttonSelect] = true;
	buttonSelect++;
	if (buttonSelect > 3) {
		buttonSelect = 0;
	}*/

	drawCatcher();
	
	// orb generator
	//side = Math.floor(Math.random() * 4 + 1);

	
	orbRadius = 10;
	yPos = yPos + dy;

	// draw top orb
	ctx.beginPath();
	ctx.arc(x, yPos, orbRadius, 0, Math.PI*2, false);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();

	// draw right orb
	ctx.beginPath();
	ctx.arc(x*2, y, orbRadius, 0, Math.PI*2, false);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();

	// draw bottom orb
	ctx.beginPath();
	ctx.arc(x, y*2, orbRadius, 0, Math.PI*2, false);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath();

	// draw left orb
	ctx.beginPath();
	ctx.arc(0, y, orbRadius, 0, Math.PI*2, false);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();


	// decrement cooldown
	var i = 0;
	for(i=0; i<6; i++) {
		if (cooldown[i] > 0) {
			//console.log(cooldown[i]);
			cooldown[i]--;
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

setInterval(draw, 10);