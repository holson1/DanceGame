// SwapStepper (tempName)
// Copyright Henry Olson 2016

// get the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// game variables
var state = "start";

// timing vars
var FPS = 60;
// starting BPM, will change eventually
var BPM = 120;
var BPS = (BPM / 60);
// we always want a whole number closest to our BPM so that we can decrement it properly
function calcFramesPerBeat(FPS, BPM) {
	var BPS = BPM / 60;
	fpb = Math.ceil(FPS / BPS);

	return fpb;
}
var framesPerBeat = calcFramesPerBeat(FPS, BPM);
//var framesPerBeat = Math.ceil(FPS / BPS);
console.log(framesPerBeat);
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
rects.push(new Rect(x - (rectHeight/2), y - radius - rectWidth + overlap, rectHeight, rectWidth, "rgb(255,000,000)", 0));
rects.push(new Rect(x + radius - overlap, y - (rectHeight/2), rectWidth, rectHeight, "rgb(000,000,255)", 1));
rects.push(new Rect(x - (rectHeight/2), y + radius - overlap, rectHeight, rectWidth, "rgb(000,144,000)", 2));
rects.push(new Rect(x - radius - rectWidth + overlap, y - (rectHeight/2), rectWidth, rectHeight, "rgb(255,255,000)", 3));


// *** INPUT HANDLING ***
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 39:
			if (cooldown[1] == 0 && keyReady[1]) {
				
				buttonArr[1] = true;
				handleCollisions();
				keyReady[1] = false;
				cooldown[1] = cooldownLength;
			}
			break;
		case 38:
			if (cooldown[0] == 0 && keyReady[0]) {
				
				buttonArr[0] = true;
				handleCollisions();
				keyReady[0] = false;
				cooldown[0] = cooldownLength;
			}
			break;
		case 40:
			if (cooldown[2] == 0 && keyReady[2]) {
				
				buttonArr[2] = true;
				handleCollisions();
				keyReady[2] = false;
				cooldown[2] = cooldownLength;
			}
			break;
		case 37:
			if (cooldown[3] == 0 && keyReady[3]) {
				
				buttonArr[3] = true;
				handleCollisions();
				keyReady[3] = false;
				cooldown[3] = cooldownLength;
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

// constructor for a chartReader
function ChartReader() {
    
    this.chart = new Array();
    
    // load a new chart into the reader
    this.load = function(newChart) {
        this.chart = newChart;
    }
    
    // read a line from the chart
    this.read = function(songMS) {
        
        if (this.chart.length == 0) {

			//this.load(ChartGenerator(120, songMS, 0));
            return;
        }
        
		line = this.chart[0];
		var noteArrivalTime = line[0];
		var noteCreationTime = noteArrivalTime - 500;
		//console.log(noteCreationTime);
		//console.log(songMS);
		
		// if we're ready to create a note...
		if ((noteCreationTime - songMS < 15 && noteCreationTime - songMS > -15) && songMS > 0) {
			
			//console.log("ok");
			for (i = 1; i < line.length; i++) {
				if(line[i] > 0) {
					orbGen(i-1);
				}
        	}
			
			this.chart.shift();
		}
		else if(noteCreationTime - songMS < -15 && songMS > 0) {
			console.log("falls outside of region");
			this.chart.shift();
		}
    } 
}

// generate a chart in real time :O
function ChartGenerator(myBPM, songMS, startTime) {
	
	genChart = new Array();
	
	// get ms for every beat
	myBPS = myBPM/60;
	msPerBeat = 1000/myBPS;
	
	// next beat
	console.log(songMS);
	console.log(songMS % msPerBeat)
	chartBegin = songMS + (msPerBeat - (songMS % msPerBeat));
	
	chartLength = 16;
	for (k = 0; k < chartLength; k++) {
		
		// four on the floor standard
		line = [chartBegin, 1, 0, 0 ,0];
		console.log(line);
		genChart.push(line);
		
		chartBegin += msPerBeat;
		
	}
	return genChart;
}


// main orb generation function
// args
// side: a number which corresponds to the side to generate the orb at
function orbGen(side) {

	switch(side) {
		case 0:
			// top
			temp = new Orb(x, 0, 0, orbSpeed, "rgb(255,0,0)");
			orbs.push(temp);
			break;
		case 1:
			// right
			temp = new Orb(x*2, y, (orbSpeed * -1), 0, "rgb(0,0,255)");
			orbs.push(temp);
			break;
		case 2:
			// bottom
			temp = new Orb(x, y*2, 0, (orbSpeed * -1), "rgb(0,144,0)");
			orbs.push(temp);
			break;
		case 3:
			// left
			temp = new Orb(0, y, orbSpeed, 0, "rgb(255,255,0)");
			orbs.push(temp);
			break;
		default:
			console.log("bad side received: " + side.toString());
			break;
	}
}

function debug() {
	
	console.log("****************************");
	console.log("prevSongTime = " + prevSongTime);
    console.log("songTime before avg = " + pureSongTime);
    console.log("songPosition = " + mySong.position);
    console.log("songTime = " + songTime);
    console.log("diff = " + (songTime - mySong.position));
    console.log("avgDiff = " + avgDiff);
}

// game over sound controller
var gameOverSound = true;
// music controller
var musicPlaying = false;

// a chart reader
mainChartReader = new ChartReader();

// a sample chart...
sampChart = [  	
				[1000,0,0,0,1],
				[1500,1,0,0,0],
				[2000,0,1,0,0],
				[2500,0,0,1,0],
				[3000,0,0,0,1],
				[3500,1,0,0,0],
				[4000,0,1,0,0],
				[4500,0,0,1,0],
				[5000,0,0,0,1],
				[5500,0,1,0,1],
				[6000,0,1,0,1],
				[6500,1,0,0,0],
				[7000,0,1,0,0],
				[7500,0,0,1,0],
				[8000,0,0,0,1],
				[8500,1,0,0,0],
				[9000,0,1,0,0],
				[9500,0,0,1,0],
				[10000,0,0,0,1],
				[10500,1,0,0,0],
				[11000,0,1,0,0],
				[11500,0,0,1,0],
            ];
            
// load the sample chart
mainChartReader.load(sampChart);

//console.log(mainChartReader.chart);

var mySong;
// load the sounds
loadSounds();

// audio sync shit
var startTime = 0;
var songTime = 0;
var previousFrameTime = new Date().getTime();
var currentFrameTime = 0;
var ms = 0;
var lastReportedPlayheadPosition = 0;
var prevSongTime = 0;
var pureSongTime = 0;

var avgDiff = 0;
var diffCounter = 1;

var songTimeWeight = 1.0;
var songPositionWeight = 1.0;

// main draw loop
function main() {

    // check milliseconds passed in between each frameCounter
    //currentFrameTime = new Date().getTime();
    //ms = currentFrameTime - previousFrameTime;
    //console.log(ms);
    //previousFrameTime = new Date().getTime();

	// clear screen
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// *** START ***
	if (state == "start") {
		health = 700;
		score = 0;
		combo = 0;
		longestCombo = 0;
		multiplier = 0;
		//BPM = BPM;
		gameOverSound = true;

		if (buttonArr[4]) {
			state = "playing";
		}
		
		drawTitle();
		
		
		return;
	}
    // *** END START ***

	// *** GAME OVER ***
	if (state == "gameover") {
		orbs = [];
		drawScore();
		mySong.stop();
		musicPlaying = false;

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
    // *** END GAME OVER ***


    // *** PLAYING ***

    // MUSIC AND SYNCHRONIZATION
    // play music
    if (musicPlaying == false) {
        
        console.log("playing music");
        startTime = new Date().getTime();
        lastReportedPlayheadPosition = 0;
        mySong = playSound("120BPM");
        musicPlaying = true;
    }

	// debug var
	prevSongTime = songTime;

    // wait for song to actually start before recording song time
    if (mySong.position > 0) {
        songTime = new Date().getTime() - startTime;
    }
    else {
        startTime = new Date().getTime();
    }
    
	// debug var
	pureSongTime = songTime;
    
    // easing algorithm to keep song time (relatively) in sync with reported audio playhead
    if (mySong.position != lastReportedPlayheadPosition) {
        		
        //songTime = ((songTime * songTimeWeight) + (mySong.position * songPositionWeight)) / 2;
		songTime = (songTime + mySong.position) / 2;
    }
	
	// don't allow significant jumps around
	if (songTime - prevSongTime > 25) {
		songTime -= (songTime - prevSongTime - 25);
	}
	
	// calculate average diff
    avgDiff = ((avgDiff * diffCounter) + (songTime - mySong.position)) / (diffCounter + 1);
    
    if (mySong.position > 0) {
        diffCounter++;
    }
    
    // weight the value of the songTime and songPosition variables in the average to pull them 
    // as closely into sync as possible
	// DEPRECATED 4.17.16: This just trends towards using only the song position, which is not what we want
	/*
    if ((songTime - mySong.position) < 0 && avgDiff < -1) {
        songTimeWeight += 0.01;
        songPositionWeight -= 0.01;
    }
    else if ((songTime - mySong.position) > 0 && avgDiff > 1) {
        songPositionWeight += 0.01;
        songTimeWeight -= 0.01;
    }
    console.log("songPositionWeight = " + songPositionWeight);
	console.log("songTimeWeight = " + songTimeWeight);
    */

	// update frameCounter
	//frameCounter--;
    
    // TEST: rather than using a frameCounter, let's try measuring the beats by millisecond value and use song time to fire them
	// we have struck a beat
	//if (frameCounter == 0) {
    // 500 ms per beat at 120 BPM... if our songTime is within this range it's time to strike a beat
	
	/*
    if ((songTime % 500 <= 10 || 500 - (songTime % 500) <= 6) && songTime > 0))  {

        console.log("playing a beat, songTime = " + songTime);
		// play our sound
		//playSound("bassDrum");

		// random side chooser - to replace w/ generate charts for more variety
		side = Math.floor(Math.random() * 4);
		orbGen(side);
        
		//BPM++;
		frameCounter = calcFramesPerBeat(FPS, BPM);
		//console.log(frameCounter);
	}
	*/
	
	//debug();
	
    mainChartReader.read(songTime);

	// draw the tracks
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

	// decrement cooldown
	var i = 0;
	for(i=0; i<6; i++) {
		if (cooldown[i] > 0) {
			cooldown[i]--;
		}
		else {
			collisions[i] = false;
		}
	}


	// checking game state once again
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