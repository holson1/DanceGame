// draw functions go here

// generic square-drawing function
function drawRect(xpos, ypos, width, height, color, side) {

	ctx.beginPath();
	ctx.rect(xpos, ypos, width, height);
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.stroke();
	if (buttonArr[side] && cooldown[side] > 0) {
		ctx.fillStyle = color;
		ctx.fill();
	}
	ctx.closePath();

	// square animation
	/*
	if (cooldown[side] > 0 && collisions[side]) {
		var factor = 0.8 + (1/cooldown[side]);
		ctx.beginPath();
		ctx.rect(xpos, ypos, width, height*factor);
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();
	}
	*/
}

function drawTrack(xpos, ypos, width, height, side) {

	var grd=ctx.createLinearGradient(0,0,200,0);
	grd.addColorStop(0,"gray");
	grd.addColorStop(1,"white");
	ctx.beginPath();
	ctx.rect(xpos, ypos, width, height);
	ctx.strokeStyle = grd;
	// we can use this code for a new animation
	
	if (cooldown[side] > 0 && collisions[side]) {
		ctx.fillStyle = "rgba(255,255,255,0.2)";
		// rgb(255,255,255);
		//trackFillColor = "rgba" + rects[side].color.substring(3,15) + ",0.2)";
		//console.log(trackFillColor);
		//trackFillColor = "rgba(255,255,0,0.2)";
		//ctx.fillStyle = trackFillColor;
		ctx.fill();
	}
	ctx.lineWidth = 0.2;
	ctx.stroke();

	/*
	for (i=1; i<beatsToCenter; i++) {

		// draw beat marks
		if (side == 3) {
			ctx.beginPath();
			ctx.rect(xpos, ypos, (distancePerBeat * i), height);
			ctx.strokeStyle = grd;
			ctx.lineWidth = 0.2;
			ctx.stroke();
		}

		if (side == 0) {
			ctx.beginPath();
			ctx.rect(xpos, ypos, width, (distancePerBeat * i));
			ctx.strokeStyle = grd;
			ctx.lineWidth = 0.2;
			ctx.stroke();
		}
	}
	*/
}

// draw the catcher
function drawCatcher() {

	// circle
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, false);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.stroke();
	//if (/*buttonArr[4] && */cooldown[4] > 0) {
	//	ctx.fillStyle = "white";
	//}
	//else {
		ctx.fillStyle = "black";
	//}
	ctx.fill();
	ctx.closePath();


	// just a fun animation test
	// just kidding, this is awesome! animation for the super power
	/*
	if (cooldown[4] > 0) {
		var factor = 1 + (((70-radius) / 10)/cooldown[4]);
		ctx.beginPath();
		ctx.arc(x, y, radius * factor, 0, Math.PI*2, false);
		ctx.strokeStyle = "white";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.closePath();
	}*/
}

// draw the score
function drawScore() {

	ctx.beginPath();
	ctx.rect(0, 5, 145, 30);
	ctx.fillStyle = "#2A3E45";
	ctx.fill();
	ctx.closePath();


	var scoreString = score + "";
	//while(scoreString.length < 8) {
	//	scoreString = " " + scoreString;
	//}

	var scoreX = 140 - (scoreString.length * 18);
	var scoreY = 30;

	ctx.font = "20px Unibody-reg";
	ctx.fillStyle = "white";
	//for(i=0; i<6; i++) {
	//	if(cooldown[i] > 0) {
	//		ctx.font = "30px Courier";
			//ctx.strokeStyle = "#1EF9FC";
			//scoreX-=2;
			//scoreY--;
	//	}
	//}
	
	ctx.fillText(scoreString, scoreX, scoreY);
}

function drawCombo(combo) {

	ctx.font = "20px Unibody-reg";
	ctx.fillStyle = "white";

	var comboString = combo + "";

	ctx.fillText(comboString, 35 - ((comboString.length - 1) * 5), 100);

	ctx.fillText("COMBO!", 0, 130);

}

function drawResultScreen(passed) {

	var resultText = "FAILED";
	var resultTextX = 115;
	var resultTextY = 150;
	var resultColor = "rgb(215,50,50)";

	if (passed) {
		
		resultText = "COMPLETE!";
		resultTextX = 30;
		resultTextY = 150;
		resultColor = "rgb(50, 215, 215)";
	}

	ctx.font = "64px Unibody-reg";
	ctx.fillStyle = resultColor;
	ctx.fillText(resultText, resultTextX, resultTextY);
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.strokeText(resultText, resultTextX, resultTextY);

	var col1_X = 85;
	var scoreChartY = 250;
	var col2_X = 355;

	// final score
	ctx.fillStyle = "rgb(225,225,225)";
	ctx.font = "18px Unibody-reg";
	ctx.fillText("Final Score", col1_X, scoreChartY);
	ctx.fillText("500", col2_X, scoreChartY);
	
	ctx.beginPath();
	ctx.rect(col1_X, scoreChartY + 30 - 25, 360, 30);
	ctx.fillStyle = "#2A3E45";
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = "rgb(225,225,225)";
	ctx.fillText("Num of Misses", col1_X, scoreChartY + 30);
	ctx.fillText("20", col2_X, scoreChartY + 30);
	ctx.fillText("Longest Combo", col1_X, scoreChartY + 60);
	ctx.fillText("15", col2_X, scoreChartY + 60);
	
	ctx.beginPath();
	ctx.rect(col1_X, scoreChartY + 90 - 25, 360, 30);
	ctx.fillStyle = "#2A3E45";
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = "rgb(225,225,225)";
	ctx.fillText("% Hit", col1_X, scoreChartY + 90);
	ctx.fillText("98", col2_X, scoreChartY + 90);
	ctx.fillText("GRADE", col1_X, scoreChartY + 120);
	ctx.fillText("A", col2_X, scoreChartY + 120);
	
	ctx.fillText("Restart", 215, 450);
	ctx.fillStyle = "#2A3E45";
	ctx.fillText("Song Select", 185, 480);
}

function drawTitle() {

	var titleTextX = 0;
	var titleTextY = 100;

	ctx.font = "55px Unibody-reg";
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText("SwapStepper", titleTextX, titleTextY);
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.strokeText("SwapStepper", titleTextX, titleTextY);

	

	ctx.font = "15px Unibody-reg";
	ctx.fillText("Press <space> to play!", 145, 450);
	ctx.font = "9px Unibody-reg";
	ctx.fillText("Copyright Henry Olson 2016", 180, 500);
	
	rects.forEach(function(Rect) {
			
		Rect.draw();
	});
	drawCatcher();
}

function deathAnimation(timer) {
	drawTrack(0, y - (rectHeight / 2), x, rectHeight, 3);
	drawTrack(x - (rectHeight / 2), 0, rectHeight, y, 0);
	drawTrack(x, y - (rectHeight / 2), x, rectHeight, 1);
	drawTrack(x - (rectHeight / 2), y, rectHeight, y, 2);

	// draw the squares
	rects.forEach(function(Rect) {

		Rect.draw();
	});
	drawCatcher();

	deathColor = "rgba(255, 255, 0, 0.5)";
	if (timer % 2 == 0) {
		deathColor = "rgba(255, 0, 0, 0.5)";
	}

	ctx.beginPath();
	//ctx.rect(0, 0, 530, 530);
	ctx.arc(x, y, radius * (10 - (timer % 10)), 0, Math.PI*2, false);
	ctx.fillStyle = deathColor;
	ctx.fill();
	ctx.closePath();
}

function drawHealth() {

	var factor = health/1000;
	if (factor > 1) {
		factor = 1;
	}
	var healthBarWidth = 175 * factor;

	// border
	ctx.beginPath();
	ctx.rect(0, 40, 180, 25);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();

	// darkness
	ctx.beginPath();
	ctx.rect(2, 42, 175, 21);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();

	var gb = Math.ceil(255 * factor);
	var gbString = gb.toString();
	var r = Math.floor(255 * (1-factor));
	var rString = r.toString();

	//console.log(gbString);

	// health
	ctx.beginPath();
	ctx.rect(2, 42, healthBarWidth, 21);
	ctx.fillStyle = "rgb(" + rString + "," + gbString + "," + "230" + ")";
	//ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();	
}

// draw an orb at any position
function drawOrb(xpos, ypos, color) {

	ctx.beginPath();
	ctx.arc(xpos, ypos, orbRadius, 0, Math.PI*2, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

// draw the "outside circle"
function drawOutsideCircle() {
	
	ctx.beginPath();
	ctx.arc(x, y, 264, Math.PI * .25, Math.PI * 0.75, false);
	ctx.strokeStyle = convertToAlpha(sideColors[2]);
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.arc(x, y, 264, Math.PI * .75, Math.PI * 1.25, false);
	ctx.strokeStyle = convertToAlpha(sideColors[3]);
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.arc(x, y, 264, Math.PI * 1.25, Math.PI * 1.75, false);
	ctx.strokeStyle = convertToAlpha(sideColors[0]);
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.arc(x, y, 264, Math.PI * 1.75, Math.PI * 0.25, false);
	ctx.strokeStyle = convertToAlpha(sideColors[1]);
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
}

// convert an rgb color into an rgba
function convertToAlpha(colorStr) {
	
	// rbg(000,000,000)
	colorStr = "rgba" + colorStr.substring(3, 15) + ",0.5)";
	
	return colorStr;
}