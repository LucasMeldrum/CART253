/**
 * Portrait
 * Lucas Meldrum
 * 
 * A description of a portrait
 * 
 */

"use strict";

// Pulse time
let pulse = 0;

// Pupils
let pupilOffsetX, pupilOffsetY;

// Minisphere color
let miniSphereColor = {
  fills: {
    r: 0,
    g: 0,
    b: 0
  }
};

// Background color
let backgroundColor = {
  fills: {
    r: 0,
    g: 0,
    b: 0
  }
};

function setup() {
  createCanvas(500, 500, WEBGL);
  angleMode(DEGREES);
  normalMaterial();
}

function draw() {
  // Copy current sphere colors
  backgroundColor.fills.r = miniSphereColor.fills.r;
  backgroundColor.fills.g = miniSphereColor.fills.g;
  backgroundColor.fills.b = miniSphereColor.fills.b;

  // Whichever color dominates the background is reduced by half
  if (miniSphereColor.fills.r > miniSphereColor.fills.g && miniSphereColor.fills.r > miniSphereColor.fills.b) {
    backgroundColor.fills.r = miniSphereColor.fills.r * 0.5;
  }
  else if (miniSphereColor.fills.g > miniSphereColor.fills.r && miniSphereColor.fills.g > miniSphereColor.fills.b) {
    backgroundColor.fills.g = miniSphereColor.fills.g * 0.5;
  }
  else if (miniSphereColor.fills.b > miniSphereColor.fills.r && miniSphereColor.fills.b > miniSphereColor.fills.g) {
    backgroundColor.fills.b = miniSphereColor.fills.b * 0.5;
  }

  // Change background based on conditionals
  background(backgroundColor.fills.r, backgroundColor.fills.g, backgroundColor.fills.b);

  // Pulse
  if (pulse > 0) {
    scale(1 + sin(frameCount * 10) * 0.2);
    pulse--;
  }

  // Allows for control of the canvas, in the 3D space
  orbitControl();

  // Draw main face sphere using little spheres
  push();
  drawSphere(0, 0, 0, 200, 8);
  pop();

  // Draw eyes
  drawEyes(0, 0, 0, 200);

  resetMatrix();
  textAlign(CENTER, CENTER);
  textSize(32); 
  fill(255); 
  text("Click!", width / 2, height - 50);
}

// Draw all spheres
function drawSphere(x, y, z, radius, amount) {
  for (let lat = -90; lat <= 90; lat += amount) {
    for (let lon = 0; lon < 360; lon += amount) {
      let px = radius * cos(lat) * cos(lon);
      let py = radius * sin(lat);
      let pz = radius * cos(lat) * sin(lon);

      push();
      translate(px, py, pz);

      // Body of the mini-sphere
      fill(miniSphereColor.fills.r, miniSphereColor.fills.g, miniSphereColor.fills.b);
      sphere(7.5);

      // Add tiny eyes
      drawMiniEyes(7.5);
      pop();
    }
  }
}

// Pulse on mouse press
function mousePressed() {
  pulse = 50;

  // Update .fills values with random colors
  miniSphereColor.fills.r = random(255);
  miniSphereColor.fills.g = random(255);
  miniSphereColor.fills.b = random(255);
}

// Draws eyes on a mini-sphere
function drawMiniEyes(r) {
  pupilOffsetX = map(mouseX, 0, width, -r / 4, r / 4);
  pupilOffsetY = map(mouseY, 0, height, -r / 4, r / 4);

  // Left eye
  push();
  translate(-r / 2, -r / 2, r + 2);
  fill(255);
  sphere(r / 4);
  translate(pupilOffsetX, pupilOffsetY, r / 4);
  fill(0);
  sphere(r / 8);
  pop();

  // Right eye
  push();
  translate(r / 2, -r / 2, r + 2);
  fill(255);
  sphere(r / 4);
  translate(pupilOffsetX, pupilOffsetY, r / 4);
  fill(0);
  sphere(r / 8);
  pop();
}

// Draw the main eyes
function drawEyes(x, y, z, radius) {
  
  rotateWithFrameCount();

  // Left eye
  push();
  translate(-60, -50, radius - 10);
  fill(255);
  sphere(25);
  translate(0, 0, 20);
  fill(0);
  sphere(10);
  pop();

  // Right eye
  push();
  translate(60, -50, radius - 10);
  fill(255);
  sphere(25);
  translate(0, 0, 20);
  fill(0);
  sphere(10);
  pop();
}

// Rotate function found on the p5 documentation
function rotateWithFrameCount() {
  rotateZ(frameCount);
  rotateX(frameCount);
  rotateY(frameCount);
}

