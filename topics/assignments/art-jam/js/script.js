/**
 * Portrait
 * Lucas Meldrum
 * 
 * A description of a portrait
 * 
 */

"use strict";

/**
 * 
*/
// Click and drag the mouse to view the scene from different angles.

function setup() {
  createCanvas(500, 500, WEBGL);

  angleMode(DEGREES);
  normalMaterial();
}

function draw() {
  background(95,50,115);

  // Enable orbiting with the mouse.
  orbitControl();

  // Draw the box.
  push();
  translate(0,-100,0);
  box(50);
  pop();
  
  push();
  translate(100,0,0);
  box(50);
  pop();

  push();
  translate(-100,0,0);
  box(50);
  pop();

  push();
  translate(0,100,0);
  box(50);
  pop();

  push();
  translate(0,0,100);
  box(50);
  pop();

  push();
  translate(0,0,-100);
  box(50);
  pop();

  push();
  rotateWithFrameCount();
  box(50);
  pop();

  push();
  box(10);
  pop();

  // Sphere
  push();
  rotateWithFrameCount();

  // Show black stroke to help visualize movement
  stroke(0);
  sphere(75);
  pop();

  // Draw the box.
  push();
  translate(0,-200,0);
  box(50);
  pop();
  
  push();
  translate(200,0,0);
  box(50);
  pop();

  push();
  translate(-200,0,0);
  box(50);
  pop();

  push();
  translate(0,200,0);
  box(50);
  pop();

  push();
  translate(0,0,200);
  box(50);
  pop();

  push();
  translate(0,0,-200);
  box(50);
  pop();

  // Sphere
  push();
  rotateWithFrameCount();

  // Show black stroke to help visualize movement
  stroke(0);
  translate(0,0,250);
  sphere(75);
  pop();

   // Sphere
  push();
  rotateWithFrameCount();

  // Show black stroke to help visualize movement
  stroke(0);
  translate(0,250,0);
  sphere(75);
  pop();


  function rotateWithFrameCount() {
  rotateZ(frameCount);
  rotateX(frameCount);
  rotateY(frameCount);
}
}
