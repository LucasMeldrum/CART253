/**
 * Frogfrogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Track whether we're on the title screen or playing
let gameState = "title";

// Our frog
const frog = {
  body: {
    x: 320,
    y: 520,
    size: 150
  },
  tongue: {
    x: undefined,
    y: 480,
    size: 20,
    speed: 20,
    state: "idle"
  }
};

// Our fly (used in both title and game)
const fly = {
  x: 0,
  y: 200,
  size: 10,
  speed: 3
};

// Button properties for title screen
const playButton = {
  x: 320,
  y: 380,
  width: 200,
  height: 60
};

function setup() {
  createCanvas(640, 480);
  resetFly();
}

function draw() {

  if (gameState === "title") {
    drawTitleScreen();
  }
  else if (gameState === "game") {
    background("#87ceeb");
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
  }
}

/**
 * Draws the title screen with a frog, fly, and "Play Now" button
 */
function drawTitleScreen() {
  background("#960000ff");

  // Title text
  push();
  textAlign(CENTER, CENTER);
  fill("#004400");
  textSize(64);
  text("Frogfrogfrog", width / 2, 120);
  pop();

  // Move the fly for animation
  moveFly(true);
  drawFly();

  // Draw a frog (static, centered)
  push();
  fill("#00ff00");
  noStroke();
  ellipse(width / 2, height - 100, 150);
  pop();

  // Draw play button
  push();
  rectMode(CENTER);
  fill("#00aa00");
  stroke("#004400");
  strokeWeight(3);
  rect(playButton.x, playButton.y, playButton.width, playButton.height, 20);

  fill("#ffffff");
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Play Now", playButton.x, playButton.y);
  pop();
}

/**
 * Moves the fly for both title and game modes
 */
function moveFly(isTitleScreen) {
  if (isTitleScreen) {
    // Orbiting motion around the title
    fly.angle += 0.03;
    const titleX = width / 2;
    const titleY = 120;
    fly.x = titleX + cos(fly.angle) * fly.radius;
    fly.y = titleY + sin(fly.angle) * fly.radius * 0.5;
  } 
  else {
    // Normal linear movement in game
    fly.x += fly.speed;
    if (fly.x > width) {
      resetFly();
    }
  }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
  push();
  noStroke();
  fill("#000000");
  ellipse(fly.x, fly.y, fly.size);
  pop();
}

/**
 * Resets the fly to a random vertical position
 */
function resetFly() {
  fly.x = 0;
  fly.y = random(50, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
  frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
  frog.tongue.x = frog.body.x;

  if (frog.tongue.state === "outbound") {
    frog.tongue.y -= frog.tongue.speed;
    if (frog.tongue.y <= 0) {
      frog.tongue.state = "inbound";
    }
  } else if (frog.tongue.state === "inbound") {
    frog.tongue.y += frog.tongue.speed;
    if (frog.tongue.y >= height) {
      frog.tongue.state = "idle";
    }
  }
}

/**
 * Draws the frog (body and tongue)
 */
function drawFrog() {
  // Tongue
  push();
  fill("#ff0000");
  noStroke();
  ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
  pop();

  push();
  stroke("#ff0000");
  strokeWeight(frog.tongue.size);
  line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
  pop();

  // Body
  push();
  fill("#00ff00");
  noStroke();
  ellipse(frog.body.x, frog.body.y, frog.body.size);
  pop();
}

/**
 * Checks for tongue-fly overlap
 */
function checkTongueFlyOverlap() {
  const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
  const eaten = d < frog.tongue.size / 2 + fly.size / 2;
  if (eaten) {
    resetFly();
    frog.tongue.state = "inbound";
  }
}

/**
 * Mouse click handler
 */
function mousePressed() {
  if (gameState === "title") {
    // Check if the user clicked the Play button
    if (
      mouseX > playButton.x - playButton.width / 2 &&
      mouseX < playButton.x + playButton.width / 2 &&
      mouseY > playButton.y - playButton.height / 2 &&
      mouseY < playButton.y + playButton.height / 2
    ) {
      gameState = "game";
      return;
    }
  } else if (gameState === "game") {
    if (frog.tongue.state === "idle") {
      frog.tongue.state = "outbound";
    }
  }
}
