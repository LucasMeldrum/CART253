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
  box(50);
  pop();

  push();
  box(10);
  pop();

  push();
  rotateWithFrameCount();
  box(100);
  pop();

  function rotateWithFrameCount() {
  rotateZ(frameCount);
  rotateX(frameCount);
  rotateY(frameCount);
}
}
