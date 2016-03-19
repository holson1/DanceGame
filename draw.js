// draw functions go here

// draw the catcher
function drawCatcher() {

	// right rect
	ctx.beginPath();
	ctx.rect(x + radius - overlap, y - (rectHeight/2), rectWidth, rectHeight);
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 2;
	ctx.stroke();
	if (buttonArr[1] && cooldown[1] > 0) {
		ctx.fillStyle = "blue";
		ctx.fill();
	}
	ctx.closePath();

	// square animation
	
	if (cooldown[1] > 0 && collisions[1]) {
		var factor = 0.8 + (1/cooldown[1]);
		ctx.beginPath();
		//ctx.rect(x + radius - overlap, y - ((rectHeight*factor)/2), rectWidth*factor, rectHeight*factor);
		ctx.rect(x + radius - overlap, y - ((rectHeight*factor)/2), rectWidth*factor, rectHeight*factor);
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.closePath();
	}
	

	// bottom rect
	ctx.beginPath();
	ctx.rect(x - (rectHeight/2), y + radius - overlap, rectHeight, rectWidth);
	ctx.strokeStyle = "green";
	ctx.lineWidth = 2;
	ctx.stroke();
	if (buttonArr[2] && cooldown[2] > 0) {
		ctx.fillStyle = "green";
		ctx.fill();
	}
	ctx.closePath();

	// square animation
	/*
	if (cooldown[2] > 0) {
		var factor = 0.8 + (1/cooldown[2]);
		ctx.beginPath();
		//ctx.rect(x + radius - overlap, y - ((rectHeight*factor)/2), rectWidth*factor, rectHeight*factor);
		ctx.rect(x - ((rectHeight*factor)/2), y + radius - overlap, rectHeight*factor, rectWidth*factor);
		ctx.strokeStyle = "green";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	}
	*/

	// left rect
	ctx.beginPath();
	ctx.rect(x - radius - rectWidth + overlap, y - (rectHeight/2), rectWidth, rectHeight);
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	ctx.stroke();
	if (buttonArr[3] && cooldown[3] > 0) {
		ctx.fillStyle = "yellow";
		ctx.fill();
	}
	ctx.closePath();

	// square animation
	/*
	if (cooldown[3] > 0) {
		var factor = 0.8 + (1/cooldown[3]);
		ctx.beginPath();
		//ctx.rect(x + radius - overlap, y - ((rectHeight*factor)/2), rectWidth*factor, rectHeight*factor);
		ctx.rect(x - radius - (rectWidth*factor) + overlap, y - ((rectHeight*factor)/2), rectWidth*factor, rectHeight*factor);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();
		ctx.closePath();
	}
	*/

	// top rect
	ctx.beginPath();
	ctx.rect(x - (rectHeight/2), y - radius - rectWidth + overlap, rectHeight, rectWidth);
	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.stroke();
	if (buttonArr[0] && cooldown[0] > 0) {
		ctx.fillStyle = "red";
		ctx.fill();
	}
	ctx.closePath();

	// square animation
	/*
	if (cooldown[0] > 0) {
		var factor = 0.8 + (1/cooldown[0]);
		ctx.beginPath();
		//ctx.rect(x + radius - overlap, y - ((rectHeight*factor)/2), rectWidth*factor, rectHeight*factor);
		ctx.rect(x - ((rectHeight*factor)/2), y - radius - (rectWidth*factor) + overlap, rectHeight*factor, rectWidth*factor);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	}
	*/

	// circle
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, false);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.stroke();
	if (/*buttonArr[4] && */cooldown[4] > 0) {
		ctx.fillStyle = "white";
	}
	else {
		ctx.fillStyle = "black";
	}
	ctx.fill();
	ctx.closePath();

	// just a fun animation test
	// just kidding, this is awesome! animation for the super power
	if (cooldown[4] > 0) {
		var factor = 1 + (((70-radius) / 10)/cooldown[4]);
		ctx.beginPath();
		ctx.arc(x, y, radius * factor, 0, Math.PI*2, false);
		ctx.strokeStyle = "white";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.closePath();
	}


}

// draw the score
function drawScore() {

	ctx.beginPath();
	ctx.rect(0, 5, 145, 30);
	ctx.fillStyle = "#2A3E45";
	ctx.fill();
	ctx.closePath();

	var scoreString = score + "";
	while(scoreString.length < 8) {
		scoreString = " " + scoreString;
	}

	var scoreX = 0;
	var scoreY = 30;

	ctx.font = "30px Courier";
	ctx.strokeStyle = "white";
	for(i=0; i<6; i++) {
		if(cooldown[i] > 0) {
			ctx.font = "30px Courier";
			//ctx.strokeStyle = "#1EF9FC";
			//scoreX-=2;
			//scoreY--;
		}
	}
	
	ctx.strokeText(scoreString, scoreX, scoreY);
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