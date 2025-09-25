/**
 * Circle Master
 * Pippin Barr
 *
 * This will be a program in which the user can push a circle
 * on the canvas using their own circle.
 */

let click = false;

const puck = {
  x: 200,
  y: 200,
  size: 100,
  fill: "#ff0000",
  fills: {
    noOverlap: "#ff0000",
    overlap: "#00ff00"
  },
   velocity: {
        x: 0,
        y: 0
    },
    acceleration: {
        x: -0.00025,
        y: -0.0005
    }
};

const user = {
  x: undefined, // will be mouseX
  y: undefined, // will be mouseY
  size: 75,
  fill: "#000000"
};

const target = {
    x: 0,
    y: 200,
    size: 50,
    fill: "#0000ff",
    fills: {
        noOverlap: "#0000ff",
        overlap: "#000000"
    }
}
/**
 * Create the canvas
 */
function setup() {
  createCanvas(400, 400);
}

/**
 * Move the user circle, check for overlap, draw the two circles
 */
function draw() {
  background("#aaaaaa");
  
  puck.x = constrain(puck.x, 50, width - 50);
  puck.y = constrain(puck.y, 50, height - 50);
  
  // Move user circle
  moveUser();
  
  // Move the puck
  movePuck();

  // Draw the user, puck and target
  drawPuck();
  drawUser();
  drawTarget();

  checkTarget();
}

/**
 * Sets the user position to the mouse position
 */
function moveUser() {
  user.x = mouseX;
  user.y = mouseY;
}

/**
 * Displays the user circle
 */
function drawUser() {
  push();
  noStroke();
  fill(user.fill);
  ellipse(user.x, user.y, user.size);
  pop();
}

/**
 * Displays the puck circle
 */
function drawPuck() {
  push();
  noStroke();
  fill(puck.fill);
  ellipse(puck.x, puck.y, puck.size);
  pop();
}

/**
 * Displays the target
 */
function drawTarget() {
    push();
    noStroke();
    fill(target.fill);
    ellipse(target.x, target.y, target.size);
    pop();
}

/**
 * Move the puck
 */
function movePuck() {

    puck.velocity.x = puck.velocity.x + puck.acceleration.x;
    puck.velocity.y = puck.velocity.y + puck.acceleration.y;

    puck.x = puck.x + puck.velocity.x;
    puck.y = puck.y + puck.velocity.y;

    // distance between puck and user
    const d = dist(user.x, user.y, puck.x, puck.y);

    // overlap of user and puck
    const overlap = (d < user.size/2 + puck.size/2);

    if (overlap) {
       puck.fill = puck.fills.overlap;
       puck.velocity.x += ((puck.x - user.x) * puck.acceleration.x) * 1.5;
       puck.velocity.y += ((puck.y - user.y) * puck.acceleration.y) * 1.5;
    }
    else {
        puck.fill = puck.fills.noOverlap;
        puck.velocity.x -= (puck.x - user.x) * puck.acceleration.x;
        puck.velocity.y -= (puck.y - user.y) * puck.acceleration.y;
    }
}

function checkTarget() {

    const d = dist(puck.x, puck.y, target.x, target.y);

    const overlap = (d < puck.size/2 + target.size/2);

    if (overlap) {
        target.fill = target.fills.overlap;
    }
    else {
        target.fill = target.fills.noOverlap;
    }
}

function mouseClicked() {
    puck.x = 200;
    puck.y = 200;
}