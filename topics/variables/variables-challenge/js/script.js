/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
let mrFurious = {
    // Position and size
    x: 200,
    y: 200,
    size: 100,
    // Rage
    rage: 1,
    // Colour
    fill: {
        r: 255,
        g: 225,
        b: 225
  }
};

// The sky
let sky = {
    // Position and size
    x: 400,
    y: 400,
    // Color 
    fill: {
        r: 160,
        g: 180,
        b: 200
    }
};

// Flying bird
let bird = {
    // Position
    body: {
        x1: 30,
        y1: 75,
        x2: 58,
        y2: 35,
        x3: 150,    
        y3: 75,
    },
    // Eye of the bird
    eye: {
        x: 65,
        y: 55,
        size: 15
    },
    // Color
    fill: {
        r: 255,
        g: 255,
        b: 255
    },
    // Speed
    velocity: {
        x: 1,
        y: 0
    }
};

/**
 * Create the canvas
 */
function setup() {
  createCanvas(sky.x, sky.y);
}

/**
 * Draw (and update) Mr. Furious
 */
function draw() {
  background(sky.fill.r, sky.fill.g, sky.fill.b);
  
  // Make mrFurious redder
  mrFurious.fill.g -= 0.5;
  mrFurious.fill.b -= 0.5;

  //Make the sky black
  sky.fill.r -= 0.75;
  sky.fill.g -= 0.75;
  sky.fill.b -= 0.5;

  // Draw Mr. Furious as a coloured circle
  push();
  noStroke();
  fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
  ellipse(mrFurious.x, mrFurious.y, mrFurious.size);
  pop();

  // Make mrFurious get madder and madder (shaking) and constrain it
  mrFurious.rage += 0.025

  mrFurious.x += random(mrFurious.rage);
  mrFurious.y += random(mrFurious.rage);
  mrFurious.x -= random(mrFurious.rage);
  mrFurious.y -= random(mrFurious.rage);

  mrFurious.x = constrain(mrFurious.x, 0, width);
  mrFurious.y = constrain(mrFurious.y, 0, height);
  mrFurious.rage = constrain(mrFurious.rage, 0, 25);

  // Draw the bird 
  // Body
  push();
  noStroke();
  fill(bird.fill.r, bird.fill.g, bird.fill.b);
  triangle(bird.body.x1, bird.body.y1, 
           bird.body.x2, bird.body.y2, 
           bird.body.x3, bird.body.y3);
  pop();

  // Eye
  push();
  noStroke();
  fill(0, 0, 255)
  ellipse(bird.eye.x, bird.eye.y, bird.eye.size);
  pop();

  // Move the bird from left to right at a constant velocity
  bird.body.x1 += bird.velocity.x;
  bird.body.x2 += bird.velocity.x;
  bird.body.x3 += bird.velocity.x;
  bird.eye.x += bird.velocity.x;
}