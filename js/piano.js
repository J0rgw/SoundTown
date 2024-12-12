var keys = [];
var satellites = [];
var toneOsc = [];
var frequencies = [262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494];
var stars = [];

function setup(){
    var canvas = createCanvas(windowWidth, 300); // Adjust height as needed
    canvas.parent('piano');
    background(50);
    noStroke();
    createOsc(); //create the oscillators here
    onScreenKeyboard();  //creates the keys
    createSat();  //creates the satellites
    for (var i = 0; i < 75; i++) {
        stars.push(new Star(random(width), random(height)));
    }
}

function draw() {
	background(25, 20);
	//update the starry background
	for (var i = 0; i < stars.length; i ++) {
		stars[i].display();
	}
	//update the satellites or shooting star thingies
	for (var i = 0; i < satellites.length; i ++) {
		satellites[i].display();
	}
	//check for key presses
	for (var i = 0; i < keys.length; i ++) {
		keys[i].checkMouse();
		keys[i].display();
		if (keys[i].clicked) {
			satellites[i].play = true;
		}
	}
}

function keyPressed() {
	for (var i = 0; i < keys.length; i++) {
		if (keyCode === keys[i].keyboardKey) {
			//register key as pressed and tell the satellite to move
			keys[i].keyPress = true;
			satellites[i].play = true;
		}
	}
}

function keyReleased() {
	for (var i = 0; i < keys.length; i++) {
		if (keyCode === keys[i].keyboardKey) {
			//turn them off
			keys[i].keyPress = false;
			satellites[i].play = false;
		}
	}
}

function touchStarted() {
	for (var i = 0; i < keys.length; i++) {
		keys[i].checkTouch();
		if (keys[i].touched) {
			//same as above, just touched
			satellites[i].play = true;
		}
	}
}

function touchEnded() {
	for (var i = 0; i < keys.length; i++) {
		keys[i].touched = false;
		if (!keys[i].touched) {
			//stopped touching
			satellites[i].play = false;
		}
	}
}

function mouseReleased() {
	for (var i = 0; i < keys.length; i ++) {
		satellites[i].play = false;
	}
}

//-------------

function onScreenKeyboard() {
	//7 keys for the major scale stuff
	var w = 65;  //key width
	var h = 150;  //key height
	var inc = w + 5;  //space between keys
	var xPos = width/2 - w/2 - inc * 3;  //center keys in non rectmode center
	var unActive = color(200, 20);  //color when not clicked
	var active = color(250, 20);  //color when clicked
	var rounded = 10;  //bevel for the rects

	//keycodes a - 65, s - 83, d - 68, f - 70, g - 71, h - 72, j - 74
	//w - 87, e - 69, t - 84, y - 89, u - 85

	//LMRLMMR
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "left", 65, toneOsc[0], satellites[0]));
	xPos += inc;
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "middle", 83, toneOsc[2], satellites[2]));
	xPos += inc;
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "right", 68, toneOsc[4], satellites[4]));
	xPos += inc;
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "left", 70, toneOsc[5], satellites[5]));
	xPos += inc;
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "middle", 71, toneOsc[7], satellites[7]));
	xPos += inc;
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "middle", 72, toneOsc[9], satellites[9]));
	xPos += inc;
	keys.push(new Key(xPos, height - h, w, h, unActive, active, rounded, "right", 74, toneOsc[11], satellites[11]));

	//5 black for the half step stuff, similar to above
	var wb = w * .8;
	var hb = h/2;
	var xPosB = width/2 - w/2 - inc * 3 + inc/2 + w * .1;  //this ugly thing is so the keys will be centered in non rectmode center
	var bUnActive = color(40);
	var bActive = color(10);
	fill(25, 25, 25);

	keys.push(new Key(xPosB, height - h, wb, hb, bUnActive, bActive, rounded, "black", 87, toneOsc[1], satellites[1]));
	xPosB += inc;
	keys.push(new Key(xPosB, height - h, wb, hb, bUnActive, bActive, rounded, "black", 69, toneOsc[3], satellites[3]));
	xPosB += 2 * inc; //skip a key
	keys.push(new Key(xPosB, height - h, wb, hb, bUnActive, bActive, rounded, "black", 84, toneOsc[6], satellites[6]));
	xPosB += inc;
	keys.push(new Key(xPosB, height - h, wb, hb, bUnActive, bActive, rounded, "black", 89, toneOsc[8], satellites[8]));
	xPosB += inc;
	keys.push(new Key(xPosB, height - h, wb, hb, bUnActive, bActive, rounded, "black", 85, toneOsc[10], satellites[10]));	
}

function createOsc() {
    for (var i = 0; i < frequencies.length; i++) {
        //new p5 sound oscillators for audio generation
        toneOsc.push(new p5.Oscillator());
        toneOsc[i].setType('square');
        toneOsc[i].freq(frequencies[i]);
        toneOsc[i].amp(0);
        toneOsc[i].start();
    }
}

function createSat() {

	//this is a bit goofy, frequencies are out of order so I typed them manually, shouldve reordered and used another for loop
	//create a satellite with size, radius, growth value, and volume(sound)
	satellites.push(new Satellite(1, frequencies[0] - 200, frequencies[0], toneOsc[0].output.gain.value));
	satellites.push(new Satellite(1, frequencies[2] - 200, frequencies[2], toneOsc[2].output.gain.value));
	satellites.push(new Satellite(1, frequencies[4] - 200, frequencies[4], toneOsc[4].output.gain.value));
	satellites.push(new Satellite(1, frequencies[5] - 200, frequencies[5], toneOsc[5].output.gain.value));
	satellites.push(new Satellite(1, frequencies[7] - 200, frequencies[7], toneOsc[7].output.gain.value));
	satellites.push(new Satellite(1, frequencies[9] - 200, frequencies[9], toneOsc[9].output.gain.value));
	satellites.push(new Satellite(1, frequencies[11] - 200, frequencies[11], toneOsc[11].output.gain.value));
	satellites.push(new Satellite(1, frequencies[1] - 200, frequencies[1], toneOsc[1].output.gain.value));
	satellites.push(new Satellite(1, frequencies[3] - 200, frequencies[3], toneOsc[3].output.gain.value));
	satellites.push(new Satellite(1, frequencies[6] - 200, frequencies[6], toneOsc[6].output.gain.value));
	satellites.push(new Satellite(1, frequencies[8] - 200, frequencies[8], toneOsc[8].output.gain.value));
	satellites.push(new Satellite(1, frequencies[10] - 200, frequencies[10], toneOsc[10].output.gain.value));
}

//-------------------------

function Star(x, y) {
	//quick random stars in the background
	this.x = x;
	this.y = y;
	this.strokeW = random(2, 8);
	this.alpha = random(10, 50);

	this.display = function() {
		this.x = this.x + random(-1, 1);
		this.y = this.y + random(-1, 1);
		noStroke();
		fill(255, this.alpha);
		ellipse(this.x, this.y, this.strokeW, this.strokeW);
	}
}

//-------------------------

function Key(x, y, w, h, col, actCol, border, keyType, keyboardKey, osc, sat) {  //later link it to a sound? //keytype is either left, middle, right, or black
	this.x = x;  //xpos
	this.y = y;  //ypos
	this.w = w;  //width
	this.h = h;  //height
	this.mx;  //mouse x below
	this.my;  //mouse y below
	this.col = col;  //normal color
	this.actCol = actCol;  //active color
	this.border = border;  //bevel
	this.keyType = keyType;  //left, middle, right, black piano key
	this.keyboardKey = keyboardKey;  //physical key on a keyboard
	this.osc = osc;  //this is an oscillator object
	this.sat = sat; //this is the satellite associated with this key
	this.keyPress = false;  //is a key pressed?
	this.touched = false;	//is a key touched?
	this.clicked = false;	//is a key clicked?

	var fillCol;  //local variable used to store temp color info

	this.checkMouse = function(){
		this.mx = mouseX;
		this.my = mouseY;

		//what style of piano key is it
		if (this.keyType == "left") {
			//these god awful things are the "collision" points on the keys, they change depending on the style of piano key
			if ( (this.mx > this.x) && (this.mx < this.x + this.w) && (this.my > this.y + this.h/2) && (this.my < this.y + this.h) && mouseIsPressed || (this.mx > this.x) && (this.mx < this.x + this.w * .8 - 10) && (this.my > this.y && this.my < this.y + this.h/2) && mouseIsPressed ) { //bleh, the .8 came from the sketch.js script
				this.clicked = true;
			} else {
				this.clicked = false;
			} 
		}

		else if (this.keyType == "middle") {
			if ( (this.mx > this.x) && (this.mx < this.x + this.w) && (this.my > this.y + this.h/2) && (this.my < this.y + this.h) && mouseIsPressed || (this.mx > this.x + this.w - this.w * .8 + 10) && (this.mx < this.x + this.w * .8 - 10) && (this.my > this.y && this.my < this.y + this.h/2) && mouseIsPressed ) {
				this.clicked = true;
			} else {
				this.clicked = false;
			} 
		}

		else if (this.keyType == "right") {
			if ( (this.mx > this.x) && (this.mx < this.x + this.w) && (this.my > this.y + this.h/2) && (this.my < this.y + this.h) && mouseIsPressed || (this.mx > this.x + this.w - this.w * .8 + 10) && (this.mx < this.x + this.w) && (this.my > this.y && this.my < this.y + this.h/2) && mouseIsPressed ) {
				this.clicked = true;
			} else {
				this.clicked = false;
			} 
		}

		else if (this.keyType == "black") {
			if (this.mx > this.x && this.mx < this.x + this.w && this.my > this.y && this.my < this.y  + this.h && mouseIsPressed) {
				this.clicked = true;
			} else {
				this.clicked = false;
			} 
		}
	}

	this.checkTouch = function() {
		//similar to above, just checking touch input
		if (touches.length > 0) {
			for (var i = 0; i < touches.length; i++) {
				if (this.keyType == "left") {
					if ( (touches[i].x > this.x) && (touches[i].x < this.x + this.w) && (touches[i].y > this.y + this.h/2) && (touches[i].y < this.y + this.h) || (touches[i].x > this.x) && (touches[i].x < this.x + this.w * .8 - 10) && (touches[i].y > this.y && touches[i].y < this.y + this.h/2) ) { //bleh, the .8 came from the sketch.js script
						this.touched = true;
					} else {
						this.touched = false;
					}
				}

				else if (this.keyType == "middle") {
					if ( (touches[i].x > this.x) && (touches[i].x < this.x + this.w) && (touches[i].y > this.y + this.h/2) && (touches[i].y < this.y + this.h) || (touches[i].x > this.x + this.w - this.w * .8 + 10) && (touches[i].x < this.x + this.w * .8 - 10) && (touches[i].y > this.y && touches[i].y < this.y + this.h/2) ) {
						this.touched = true;
					} else {
						this.touched = false;
					}
				}

				else if (this.keyType == "right") {
					if ( (touches[i].x > this.x) && (touches[i].x < this.x + this.w) && (touches[i].y > this.y + this.h/2) && (touches[i].y < this.y + this.h) || (touches[i].x > this.x + this.w - this.w * .8 + 10) && (touches[i].x < this.x + this.w) && (touches[i].y > this.y && touches[i].y < this.y + this.h/2) ) {
						this.touched = true;
					} else {
						this.touched = false;
					}
				}

				else if (this.keyType == "black") {
					if (touches[i].x > this.x && touches[i].x < this.x + this.w && touches[i].y > this.y && touches[i].y < this.y  + this.h) {
						this.touched = true;
					} else {
						this.touched = false;
					}
				}
			}
		}
	}

	this.display = function(){
		//is it clicked, touched, or pressed
		if (this.clicked == false && this.touched == false && this.keyPress == false) {
			//normal color, stop audio
			fillCol = this.col;
			this.osc.amp(0, 0.5);
		} else if (this.keyPress || this.touched || this.clicked) {
			//active color, start audio
			fillCol = this.actCol;
			this.osc.amp(0.5, 0.05);
		}
		pop();
		fill(fillCol);
		rect(this.x, this.y, this.w, this.h, 0, 0, border, border);
		push();
	}
}

//---------------------------

function Satellite(satSize, satRadius, satGrowth, vol) {	
	this.satSize = satSize;
	this.satRadius = satRadius;
	this.satGrowth = satGrowth;
	this.angle = 0.0005;
	this.x;
	this.y;
	this.col = 255;
	this.play = false;
	this.vol = vol;

	this.display = function() {

		//this.play is set by the touch/key function
		if (this.play) {
			if (this.satSize < satGrowth/20) {
				this.satSize += this.vol/4;
			}

			push();
			this.x = sin(this.angle) * satRadius;
			this.y = cos(this.angle) * satRadius/2 - 30;
			fill(this.col);
			noStroke();
			translate(width/2, height/2);
			ellipse(this.x, this.y, this.satSize, this.satSize);
			this.angle += .01;
			pop();
		} else {
			if (this.satSize > satSize) {
				this.satSize -= 5;
			}

			if (this.satSize <= 0) {
				this.satSize == 1;
			}
		}
	}
}