/**
 * Portrait
 * Lucas Meldrum
 * 
 * A description of a portrait
 * 
 */

"use strict";

function setup() {
  createCanvas(500, 500, WEBGL);
  angleMode(DEGREES);
  normalMaterial();
}

function draw() {
  background(0);

  // Allows for control of the canvas, in the 3D space
  orbitControl();

  // Draw main face sphere using little spheres
  push();
  drawSphere(0, 0, 0, 200, 12); 
  pop();

  // Draw facial features (eyes, mouth, etc.)
  drawFace(0, 0, 0, 200);
}

function drawSphere(x, y, z, radius, amount) {
  // Loop through latitude and longitude
  // Calculations done on paper this was annoying, double for loop to iterate through
  for (let lat = -90; lat <= 90; lat += amount) {
    for (let lon = 0; lon < 360; lon += amount) {
      let px = radius * cos(lat) * cos(lon);
      let py = radius * sin(lat);
      let pz = radius * cos(lat) * sin(lon);

      push();
      translate(px, py, pz);
      fill(241, 194, 125); 
      sphere(7.5);
      pop();
    }
  }
}

function drawFace(x, y, z, radius) {

  // Rotate the eyes around the face
  rotateWithFrameCount();

  // Eyes
  // Left eye
  push();
  translate(-60, -50, radius - 10);
  fill(255);
  sphere(25);

  // Pupil
  translate(0, 0, 20);
  fill(0);
  sphere(10);
  pop();

  // Right eye
  push();
  translate(60, -50, radius - 10); 
  fill(255); 
  sphere(25);

  //Pupil
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
