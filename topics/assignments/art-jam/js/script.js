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
  background(95, 50, 115);

  orbitControl(); // Allow mouse rotation

  // Draw main face-like sphere using little spheres
  push();
  drawSphere(0, 0, 0, 200, 15); 
  pop();
}

function drawSphere(x, y, z, radius, detail) {
  translate(x, y, z);

  // Loop through latitude and longitude
  for (let lat = -90; lat <= 90; lat += detail) {
    for (let lon = 0; lon < 360; lon += detail) {
      let px = radius * cos(lat) * cos(lon);
      let py = radius * sin(lat);
      let pz = radius * cos(lat) * sin(lon);

      push();
      translate(px, py, pz);
      stroke(241,194,125);
      sphere(7.5); // small sphere size
      pop();
    }
  }
}

  function rotateWithFrameCount() {
  rotateZ(frameCount);
  rotateX(frameCount);
  rotateY(frameCount);
}