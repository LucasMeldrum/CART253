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

// Track whether we're on the title, game, boss or end
let gameState = "title";

// Track score default for now
let score = 0;

// Player health (used in boss phases)
let playerHealth = 5;

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
  speed: 3,
  active: true
};

// Boss properties
const boss = {
  x: 320,
  y: 150,
  size: 80,
  speed: 5,
  direction: 1,
  health: 30,
  active: false,
  phase: 1,
  shootCooldown: 0
};

// Projectiles shot by boss
const projectiles = [];

// Flies summoned by boss (reusing same stats as fly)
const summonedFlies = [];

// Button properties for title screen
const playButton = {
  x: 320,
  y: 380,
  width: 200,
  height: 60,
  round: 20,
  text: "Play now",
};

// Setup function
function setup() {
  createCanvas(640, 480);
  resetFly();
}

// Draw function
function draw() {
  if (gameState === "title") {
    drawTitleScreen();
  }
  else if (gameState === "game") {
    drawGameStage();
  }
  else if (gameState === "boss") {
    drawBossStage();
  }
  else if (gameState === "endLose") {
    drawEndLoseScreen();  
  }
  else if (gameState === "endWin") {
    drawEndWinScreen();  
  }
}

/**
 * Title screen with a frog, fly, and "Play Now" button
 */
function drawTitleScreen() {
  background("#8b8484ff");

  // Title text
  push();
  textAlign(CENTER, CENTER);
  fill("#004400");
  textSize(64);
  text("Frogfrogfrog", width / 2, 120);
  pop();

  // Move the fly for animation
  moveFly();
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
  rect(playButton.x, playButton.y, playButton.width, playButton.height, playButton.round);
  fill("#ffffff");
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text(playButton.text, playButton.x, playButton.y);
  pop();
}

/**
 * Main game stage before boss, fly moving left and right
 */
function drawGameStage() {
  background("#87ceeb");

  // Normal fly movement
  if (fly.active) {
    moveFly();
    drawFly();
  }

  // Frog and tongue
  moveFrog();
  moveTongue();
  drawFrog();

  // Checking for fly being eaten
  if (fly.active) {
    checkTongueFlyOverlap();
  }
}


/**
 * Moves the fly
 */
function moveFly() {
  fly.x += fly.speed;
  if (fly.x > width) {
    resetFly();
  }
}

/**
 * Draws the fly
 */
function drawFly() {
  if (!fly.active) return;

  push();
  noStroke();
  fill("#000000");
  ellipse(fly.x, fly.y, fly.size);
  pop();
}

/**
 * Resets fly position
 */
function resetFly() {
  fly.x = 0;
  fly.y = random(50, 300);
}

/**
 * Moves frog horizontally with mouse
 */
function moveFrog() {
  frog.body.x = mouseX;
}

/**
 * Handles tongue movement
 */
function moveTongue() {
  frog.tongue.x = frog.body.x;

  if (frog.tongue.state === "outbound") {
    frog.tongue.y -= frog.tongue.speed;
    if (frog.tongue.y <= 0) {
      frog.tongue.state = "inbound";
    }
  }
  else if (frog.tongue.state === "inbound") {
    frog.tongue.y += frog.tongue.speed;
    if (frog.tongue.y >= height) {
      frog.tongue.state = "idle";
    }
  }
}

/**
 * Draws frog and tongue
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
 * Tongue-Fly overlap check
 */
function checkTongueFlyOverlap() {
  const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
  const eaten = d < frog.tongue.size / 2 + fly.size / 2;

  if (eaten) {
    score++;
    fly.active = false;
    frog.tongue.state = "inbound";
    startBossFight();
  }
}

/**
 * Boss fight stage with 3 phases
 */
function drawBossStage() {
  background("#a8a8a8ff");

  // Frog and tongue functions
  moveFrog();
  moveTongue();
  drawFrog();

  // Boss and phases functions
  moveBoss();
  drawBoss();
  handleBossPhases();

  // Projectiles and summoned flies (phase 2 and 3)
  drawProjectiles();
  moveProjectiles();
  drawSummonedFlies();
  moveSummonedFlies();

  // Tongue overlap with boss and flies and collisions with frog functions
  checkTongueBossOverlap();
  checkProjectileFrogCollision();
  checkFlyFrogCollision();
  checkTongueSummonedFlyOverlap();

  // Boss stats function
  drawBossStageStats();

  // End if player dies at any point
  if (playerHealth <= 0) {
    gameState = "endLose";
    boss.active = false;
  }
}

/**
 * Handles boss behavior based on phases (1,2,3)
 */
function handleBossPhases() {
  // Boss phases: 1st phase until 20 health, 2nd phase when boss is at <20 health, and 3rd phase until boss is dead
  if (boss.health <= 20 && boss.health > 10) {
    boss.phase = 2;
  }
  else if (boss.health <= 10) {
    boss.phase = 3;
  }
  else {
    boss.phase = 1;
  }

  // Phase 2: shoots projectiles downward
  if (boss.phase === 2) {
    boss.shootCooldown--;
    if (boss.shootCooldown <= 0) {
      shootProjectile();
      boss.shootCooldown = 60;
    }
  }
  // Phase 3: summons flies periodically that can be shot
  else if (boss.phase === 3) {
    boss.shootCooldown--;
    if (boss.shootCooldown <= 0) {
      summonFly();
      boss.shootCooldown = 100;
    }
  }
}

/**
 * Starts boss fight
 */
function startBossFight() {
  gameState = "boss";
  boss.active = true;
  boss.health = 30;
  boss.phase = 1;
  playerHealth = 3;
  projectiles.length = 0;
  summonedFlies.length = 0;
}

/**
 * Draws the boss as a large fly that gets angrier each phase
 */
function drawBoss() {
  if (!boss.active) return;

  push();
  translate(boss.x, boss.y);
  noStroke();

  // Phase-based body color (gets angrier)
  let bodyColor;
  if (boss.phase === 1) {
    bodyColor = "#444444"; // calm
  } else if (boss.phase === 2) {
    bodyColor = "#662222"; // angry
  } else {
    bodyColor = "#aa0000"; // furious
  }

  // Draw wings (semi-transparent white)
  fill(255, 255, 255, 150);
  ellipse(-boss.size * 0.6, -boss.size * 0.3, boss.size * 0.8, boss.size * 0.5);
  ellipse(boss.size * 0.6, -boss.size * 0.3, boss.size * 0.8, boss.size * 0.5);

  // Body
  fill(bodyColor);
  ellipse(0, 0, boss.size * 1.2, boss.size); // main body

  // Eyes (get redder as phase increases)
  if (boss.phase === 1) fill("#222222");
  else if (boss.phase === 2) fill("#880000");
  else fill("#ff0000");
  ellipse(-boss.size * 0.3, -boss.size * 0.1, boss.size * 0.3);
  ellipse(boss.size * 0.3, -boss.size * 0.1, boss.size * 0.3);

  pop();
}


/**
 * Moves boss side-to-side
 */
function moveBoss() {
  boss.x += boss.speed * boss.direction;
  if (boss.x < 0 || boss.x > width) {
    boss.direction *= -1;
  }
}

/**
 * Shoots a projectile downward
 */
function shootProjectile() {
  const p = {
    x: boss.x,
    y: boss.y + boss.size / 2,
    size: 15,
    speed: 7
  };
  projectiles.push(p);
}

/**
 * Moves projectiles
 */
function moveProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].y += projectiles[i].speed;
    if (projectiles[i].y > height) {
      projectiles.splice(i, 1);
    }
  }
}

/**
 * Draws projectiles
 */
function drawProjectiles() {
  push();
  fill("#ff8800");
  noStroke();
  for (const p of projectiles) {
    ellipse(p.x, p.y, p.size);
  }
  pop();
}

/**
 * Checks projectile-frog collisions
 */
function checkProjectileFrogCollision() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    const d = dist(p.x, p.y, frog.body.x, frog.body.y);
    if (d < p.size / 2 + frog.body.size / 2) {
      projectiles.splice(i, 1);
      playerHealth--;
    }
  }
}

/**
 * Summons a fly that moves toward frog (reusing fly size/speed but slower)
 */
function summonFly() {
  const s = {
    x: random(0, width),
    y: boss.y + boss.size / 2,
    size: fly.size,
    speed: fly.speed * 0.75,
    active: true
  };
  summonedFlies.push(s);
}

/**
 * Moves summoned flies
 */
function moveSummonedFlies() {
  for (let i = summonedFlies.length - 1; i >= 0; i--) {
    const f = summonedFlies[i];
    if (!f.active) continue;

    const dx = frog.body.x - f.x;
    const dy = frog.body.y - f.y;
    const distToFrog = dist(f.x, f.y, frog.body.x, frog.body.y);

    f.x += (dx / distToFrog) * f.speed;
    f.y += (dy / distToFrog) * f.speed;

    if (f.y > height) {
      summonedFlies.splice(i, 1);
    }
  }
}

/**
 * Draws summoned flies
 */
function drawSummonedFlies() {
  push();
  fill("#000000");
  noStroke();
  for (const f of summonedFlies) {
    if (f.active) {
      ellipse(f.x, f.y, f.size);
    }
  }
  pop();
}

/**
 * Checks summoned fly collisions with frog
 */
function checkFlyFrogCollision() {
  for (let i = summonedFlies.length - 1; i >= 0; i--) {
    const f = summonedFlies[i];
    const d = dist(f.x, f.y, frog.body.x, frog.body.y);
    if (d < f.size / 2 + frog.body.size / 2) {
      summonedFlies.splice(i, 1);
      playerHealth--;
    }
  }
}

/**
 * Tongue-Summoned Fly overlap check (can eat them)
 */
function checkTongueSummonedFlyOverlap() {
  for (let i = summonedFlies.length - 1; i >= 0; i--) {
    const f = summonedFlies[i];
    const d = dist(frog.tongue.x, frog.tongue.y, f.x, f.y);
    const eaten = d < frog.tongue.size / 2 + f.size / 2;

    if (eaten && frog.tongue.state === "outbound") {
      score++;
      summonedFlies.splice(i, 1);
      frog.tongue.state = "inbound";
    }
  }
}

/**
 * Tongue-Boss overlap
 */
function checkTongueBossOverlap() {
  const d = dist(frog.tongue.x, frog.tongue.y, boss.x, boss.y);
  const hit = d < frog.tongue.size / 2 + boss.size / 2;

  if (hit && frog.tongue.state === "outbound") {
    score++;
    boss.health--;
    frog.tongue.state = "inbound";

    if (boss.health <= 0) {
      boss.active = false;
      gameState = "endWin";
    }
  }
}

 // Display boss health and player health
  function drawBossStageStats() {
    push();
    fill("#ffffff");
    textSize(20);
    textAlign(LEFT, TOP);
    text("Boss HP: " + boss.health, 20, 20);
    text("Frog HP: " + playerHealth, 20, 45);
    text("Phase: " + boss.phase, 20, 70);
    pop();
  }

/**
 * Mouse click handler
 */
function mousePressed() {
  if (gameState === "title") {
    // Play button
    if (
      mouseX > playButton.x - playButton.width / 2 &&
      mouseX < playButton.x + playButton.width / 2 &&
      mouseY > playButton.y - playButton.height / 2 &&
      mouseY < playButton.y + playButton.height / 2
    ) {
      gameState = "game";
      fly.active = true;
      resetFly();
      return;
    }
  }
  else if (gameState === "game" || gameState === "boss") {
    if (frog.tongue.state === "idle") {
      frog.tongue.state = "outbound";
    }
  }
  else if (gameState === "endLose" || gameState === "endWin") {
    // Restart
    gameState = "title";
    fly.active = true;
    boss.active = false;
    score = 0;
    playerHealth = 3;
    resetFly();
  }
}

/**
 * End title screen
 */
function drawEndLoseScreen() {
  background("#000000ff");

  // Title text
  push();
  textAlign(CENTER, CENTER);
  fill("#004400");
  textSize(64);
  text("You Lose!", width / 2, 120);
  pop();

  // Draw frog and fly
  moveFly();
  drawFly();

  push();
  fill("#00ff00");
  noStroke();
  ellipse(width / 2, height - 100, 150);
  pop();

  // Draw restart button
  push();
  rectMode(CENTER);
  fill("#00aa00");
  stroke("#004400");
  strokeWeight(3);
  rect(playButton.x, playButton.y, playButton.width, playButton.height, playButton.round);

  fill("#ffffff");
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Play again", playButton.x, playButton.y);
  pop();

  // Display final score
  push();
  fill("#ffffff");
  textSize(24);
  textAlign(CENTER);
  text("Final Score: " + score, width / 2, 320);
  pop();
}

function drawEndWinScreen() {
  background("#000000ff");

  // Title text
  push();
  textAlign(CENTER, CENTER);
  fill("#004400");
  textSize(64);
  text("You Win!", width / 2, 120);
  pop();

  // Draw frog and fly
  moveFly();
  drawFly();

  push();
  fill("#00ff00");
  noStroke();
  ellipse(width / 2, height - 100, 150);
  pop();

  // Draw restart button
  push();
  rectMode(CENTER);
  fill("#00aa00");
  stroke("#004400");
  strokeWeight(3);
  rect(playButton.x, playButton.y, playButton.width, playButton.height, playButton.round);

  fill("#ffffff");
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Play again", playButton.x, playButton.y);
  pop();

  // Display final score
  push();
  fill("#ffffff");
  textSize(24);
  textAlign(CENTER);
  text("Final Score: " + score, width / 2, 320);
  pop();
}
