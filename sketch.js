// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Sound classification using SpeechCommands18w and p5.js
This example uses a callback pattern to create the classifier
=== */

// Initialize a sound classifier method with SpeechCommands18w model. A callback needs to be passed.
let classifier;
// Options for the SpeechCommands18w model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.7 };
// Two variable to hold the label and confidence of the result
let label;
let confidence;

let mic;

//how big the 'brush' is
let numberOptions = ["zero","one","two",
                     "three","four","five","six","seven","eight","nine"];
//which direction it's moving in
let directionOptions = ["up","down","left","right"];
let directionState = null;
//whether it's moving
let goOptions = ["go","stop"];
let goState = "stop";
//whether it's painting
let paintOptions = ["yes", "no"];
let paintState = "no";
let currentInput = null;

let ellipseDiam = 20;
let ellipseX = 250;
let oldEllipseX = 250;
let ellipseY = 250;
let oldEllipseY = 250;

let ellipses = [];

class Ellipse {

  constructor(posx,posy,diam,fill1,fill2,fill3) {

    this.x = posx;
    this.y = posy;
    this.diam = diam;
    this.fill1 = fill1;
    this.fill2 = fill2;
    this.fill3 = fill3;
  }

  draw() {

  noStroke();
  fill(this.fill1, this.fill2, this.fill3);
  ellipse(this.x, this.y, this.diam);

  }
}

function preload() {
  // Load SpeechCommands18w sound classifier model
  classifier = ml5.soundClassifier('SpeechCommands18w', options);
}

function setup() {
  //noCanvas();
  createCanvas(500,500);
  background("white");
  mic = new p5.AudioIn();
  mic.start();
  // Create 'label' and 'confidence' div to hold results
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');
  // Classify the sound from microphone in real time
  let vol = mic.getLevel();
  classifier.classify(gotResult);
  ellipses.push(new Ellipse(250,250,10,10));
  return false;
}

function draw() {

  //let vol = mic.getLevel();

  noStroke();
  fill(random(0,255),random(0,255),random(0,255));
  //ellipse(ellipseX,ellipseY,ellipseDiam,ellipseDiam);

  for (i=0; i<ellipses.length; i++) {
    ellipses[i].draw();
  }
  for (j=0; j<ellipses.length-1; j++) {
      ellipses.splice(j,1);
  }

  //0-10 increases ellipse size
  for (i=0; i<numberOptions.length; i++) {
    if(numberOptions[i] == currentInput) {
      ellipseDiam = i*5;
    }
  }

  //up-down-left-right tells circle which direction it needs to move
  for (i=0; i<directionOptions.length; i++) {
    if(directionOptions[i] == currentInput) {
      directionState = currentInput;
    }
  }

  //go and stop starts and stops movement
  for (i=0; i<goOptions.length; i++) {
    if(goOptions[i] == currentInput) {
      goState = currentInput;
    }
  }

  //yes and no starts and stops draw
  for (i=0; i<paintOptions.length; i++) {
    if(paintOptions[i] == currentInput) {
      paintState = currentInput;
    }
  }

  if (goState == "go") {
    //console.log("go");
    switch (directionState) {
      case "up":
        ellipseY -= 0.5
        break;
      case "down":
        ellipseY += 0.5
        break;
      case "left":
        ellipseX -= 0.5
        break;
      case "right":
        ellipseX += 0.5
        break;
    }
  }

  //if statement for whether or not it's painting
  //you can push every ellipse into an array and then draw the array
  //so that if it's "yes" you're pushing the new ellipse to the array and if it's "no" you're not
  if (paintState == "yes" && (ellipseX != oldEllipseX || ellipseY != oldEllipseY)) {
    ellipses.push(new Ellipse(ellipseX,ellipseY,ellipseDiam,
                             random(0,255),random(0,255),
                             random(0,255)));
  }
  //otherwise just move the one circle...

  console.log(ellipses);

  oldEllipseX = ellipseX;
  oldEllipseY = ellipseY;

}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  //console.log(results);
  currentInput = results[0].label;
  // Show the first label and confidence
  //console.log(currentInput);

  label.html('Label: ' + results[0].label);
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
}
