/**
 * Variation Menu
 * Pippin Barr
 * 
 * A relatively simple example of a set of variations within a single
 * project. (When we learn Object-Oriented Programming this will be a
 * LOT easier.)
 */

"use strict";

//Setup function
function setup() {
    createCanvas(500, 500);
    noCursor(); 
}

//Draw function
function draw() {
    switch (state) {
        case "menu":
            menuDraw();
            break;

        case "v1":
            v1Draw();
            break;

        case "v2":
            v2Draw();
            break;

        case "v3":
            v3Draw();
            break;
    }
}

//Mouse pressed listener 
function mousePressed() {
    switch (state) {
        case "menu":
            menuMousePressed();
            break;

        case "v1":
            v1MousePressed();
            break;

        case "v2":
            v2MousePressed();
            break;

        case "v3":
            v3MousePressed();
            break;
    }
}

//Key pressed listener 
function keyPressed(event) {
    switch (state) {
        case "menu":
            menuKeyPressed(event);
            break;

        case "v1":
            v1KeyPressed(event);
            break;

        case "v2":
            v2KeyPressed(event);
            break;

        case "v3":
            v3KeyPressed(event);
            break;
    }
}

/**
 * Variation #1 — Yars Revenge default
 */

let v1Player = {
    x: 0,
    y: 0,
    speed: 3,
    size: 26,
};

let v1Missile = {
    x: null,
    y: null,
    speed: 8,
    w: 8,
    h: 3
};

let v1Boss = {
    x: 0,
    y: 0,
    size: 45,
    ySpeed: 2,
    fireCooldown: 0,
    health: 5
};

let v1EnemyShot = {
    x: null,
    y: null,
    speed: 2,
    size: 16
};

let v1StraightShot = {
    x: null,
    y: null,
    speed: 3,
    size: 14
};

let v1Zone = {
    x: 75,
    w: 55,
    h: 0
};

function v1Setup() {
    resetStats();
}

function resetStats() {
    //Reset player
    v1Player.x = 20;
    v1Player.y = height / 2;

    //Reset boss
    v1Boss.x = width - 140;
    v1Boss.y = height / 2;
    v1Boss.health = 5;
    v1Boss.fireCooldown = 0;

    //Reset missiles
    v1Missile.x = null;
    v1EnemyShot.x = null;
    v1StraightShot.x = null;

    //Zone height
    v1Zone.h = height;
}

function v1Draw() {
    background(40, 45, 60);

    //Draw neutral zone
    rectMode(CORNER);
    noStroke();
    fill(140, 110, 220, 100);
    rect(v1Zone.x, 0, v1Zone.w, v1Zone.h);

    //WASD for movement
    if (keyIsDown(87)) v1Player.y -= v1Player.speed;
    if (keyIsDown(83)) v1Player.y += v1Player.speed;
    if (keyIsDown(65)) v1Player.x -= v1Player.speed;
    if (keyIsDown(68)) v1Player.x += v1Player.speed;

    v1Player.x = constrain(v1Player.x, 0, width);
    v1Player.y = constrain(v1Player.y, 0, height);

    let inZone = v1Player.x > v1Zone.x && v1Player.x < v1Zone.x + v1Zone.w;

    //Player sprite
    push();
    translate(v1Player.x, v1Player.y);
    noStroke();
    fill(255, 180, 0);
    ellipse(0, 0, v1Player.size, v1Player.size * 0.6);
    fill(0);
    ellipse(8, -5, 6, 6);
    ellipse(8, 5, 6, 6);
    pop();

    //Player missile
    if (v1Missile.x !== null) {
        v1Missile.x += v1Missile.speed;
        fill(255, 240, 50);
        rectMode(CENTER);
        rect(v1Missile.x, v1Missile.y, v1Missile.w, v1Missile.h);
        if (v1Missile.x > width + 100) v1Missile.x = null;

        //Check for boss hit
        if (dist(v1Missile.x, v1Missile.y, v1Boss.x, v1Boss.y) < v1Boss.size / 2) {
            v1Missile.x = null;
            v1Boss.health--;
            if (v1Boss.health <= 0) {
                resetStats();
                state = "menu";
                return;
            }
        }
    }

    //Simple boss movement
    v1Boss.y += v1Boss.ySpeed;
    if (v1Boss.y < 40 || v1Boss.y > height - 40) v1Boss.ySpeed *= -1;

    //Boss sprite
    fill(255, 60, 80);
    ellipse(v1Boss.x, v1Boss.y, v1Boss.size, v1Boss.size);
    fill(255, 200, 200);
    ellipse(v1Boss.x + 10, v1Boss.y - 10, 10, 10);
    ellipse(v1Boss.x + 10, v1Boss.y + 10, 10, 10);

    //Boss homing missile
    if (v1EnemyShot.x === null) {
        v1Boss.fireCooldown--;
        if (v1Boss.fireCooldown <= 0) {
            v1EnemyShot.x = v1Boss.x - 20;
            v1EnemyShot.y = v1Boss.y;
            v1Boss.fireCooldown = 90;
        }
    }

    if (v1EnemyShot.x !== null) {
        let dx = v1Player.x - v1EnemyShot.x;
        let dy = v1Player.y - v1EnemyShot.y;
        let mag = sqrt(dx * dx + dy * dy);
        v1EnemyShot.x += (dx / mag) * v1EnemyShot.speed;
        v1EnemyShot.y += (dy / mag) * v1EnemyShot.speed;

        fill(255, 100, 140);
        ellipse(v1EnemyShot.x, v1EnemyShot.y, v1EnemyShot.size, v1EnemyShot.size);

        if (v1EnemyShot.x < -300) v1EnemyShot.x = null;

        if (!inZone) {
            let hit = dist(v1EnemyShot.x, v1EnemyShot.y, v1Player.x, v1Player.y);
            if (hit < v1Player.size / 2) {
                resetStats();
                state = "menu";

                //Spawn new homing shot immediately
                v1EnemyShot.x = v1Boss.x - 20;
                v1EnemyShot.y = v1Boss.y;
                v1Boss.fireCooldown = 90;
            }
        }
    }

    //Straight-line boss shot
    if (v1StraightShot.x === null) {
        v1StraightShot.x = v1Boss.x - 20;
        v1StraightShot.y = v1Boss.y;
    }

    if (v1StraightShot.x !== null) {
        v1StraightShot.x -= v1StraightShot.speed;
        fill(100, 255, 200);
        ellipse(v1StraightShot.x, v1StraightShot.y, v1StraightShot.size, v1StraightShot.size);

        //Out of bounds
        if (v1StraightShot.x < -50) v1StraightShot.x = null;

        //Player hit (only outside neutral zone)
        if (!inZone && dist(v1StraightShot.x, v1StraightShot.y, v1Player.x, v1Player.y) < v1Player.size / 2) {
            resetStats();
            state = "menu";

            //Spawn new straight shot
            v1StraightShot.x = v1Boss.x - 20;
            v1StraightShot.y = v1Boss.y;
        }
    }

    //UI + controls
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Click to shoot\nWASD to move\nNeutral zone = safe", 10, 10);
}

//Shoot if player is not in neutral zone
function v1MousePressed() {
    let inZone = v1Player.x > v1Zone.x && v1Player.x < v1Zone.x + v1Zone.w;

    if (mouseButton === LEFT && v1Missile.x === null && !inZone) {
        v1Missile.x = v1Player.x;
        v1Missile.y = v1Player.y;
    }
}

//Return to menu
function v1KeyPressed(event) {
    if (event.keyCode === 27) resetStats(), state = "menu";
}

/**
 * Variation #2 of Yars Revenge
 * x
 */

//Copy of v1 but different background
//Use JSON to parse and string v1 stats and copy them (will change later)
let v2Player = JSON.parse(JSON.stringify(v1Player));
let v2Missile = JSON.parse(JSON.stringify(v1Missile));
let v2Boss = JSON.parse(JSON.stringify(v1Boss));
let v2EnemyShot = JSON.parse(JSON.stringify(v1EnemyShot));
let v2StraightShot = JSON.parse(JSON.stringify(v1StraightShot));
let v2Zone = JSON.parse(JSON.stringify(v1Zone));

function v2Setup() {
    resetV2Stats();
}

function resetV2Stats() {
    v2Player.x = 20;
    v2Player.y = height / 2;
    v2Boss.x = width - 140;
    v2Boss.y = height / 2;
    v2Boss.health = 5;
    v2Boss.fireCooldown = 0;
    v2Missile.x = null;
    v2EnemyShot.x = null;
    v2StraightShot.x = null;
    v2Zone.h = height;
}

function v2Draw() {
    background(100, 200, 100); //Different bg

    //Everything else same as v1 but with v2 variables
    //Draw neutral zone
    rectMode(CORNER);
    noStroke();
    fill(140, 110, 220, 100);
    rect(v2Zone.x, 0, v2Zone.w, v2Zone.h);

    //WASD movement
    if (keyIsDown(87)) v2Player.y -= v2Player.speed;
    if (keyIsDown(83)) v2Player.y += v2Player.speed;
    if (keyIsDown(65)) v2Player.x -= v2Player.speed;
    if (keyIsDown(68)) v2Player.x += v2Player.speed;

    v2Player.x = constrain(v2Player.x, 0, width);
    v2Player.y = constrain(v2Player.y, 0, height);

    let inZone = v2Player.x > v2Zone.x && v2Player.x < v2Zone.x + v2Zone.w;

    //Player sprite
    push();
    translate(v2Player.x, v2Player.y);
    noStroke();
    fill(255, 180, 0);
    ellipse(0, 0, v2Player.size, v2Player.size * 0.6);
    fill(0);
    ellipse(8, -5, 6, 6);
    ellipse(8, 5, 6, 6);
    pop();

    //Player missile
    if (v2Missile.x !== null) {
        v2Missile.x += v2Missile.speed;
        fill(255, 240, 50);
        rectMode(CENTER);
        rect(v2Missile.x, v2Missile.y, v2Missile.w, v2Missile.h);
        if (v2Missile.x > width + 100) v2Missile.x = null;

        if (dist(v2Missile.x, v2Missile.y, v2Boss.x, v2Boss.y) < v2Boss.size / 2) {
            v2Missile.x = null;
            v2Boss.health--;
            if (v2Boss.health <= 0) {
                resetV2Stats();
                state = "menu";
                return;
            }
        }
    }

    //Simple boss movement
    v2Boss.y += v2Boss.ySpeed;
    if (v2Boss.y < 40 || v2Boss.y > height - 40) v2Boss.ySpeed *= -1;

    //Boss sprite
    fill(255, 60, 80);
    ellipse(v2Boss.x, v2Boss.y, v2Boss.size, v2Boss.size);
    fill(255, 200, 200);
    ellipse(v2Boss.x + 10, v2Boss.y - 10, 10, 10);
    ellipse(v2Boss.x + 10, v2Boss.y + 10, 10, 10);

    //Boss homing missile
    if (v2EnemyShot.x === null) {
        v2Boss.fireCooldown--;
        if (v2Boss.fireCooldown <= 0) {
            v2EnemyShot.x = v2Boss.x - 20;
            v2EnemyShot.y = v2Boss.y;
            v2Boss.fireCooldown = 90;
        }
    }

    if (v2EnemyShot.x !== null) {
        let dx = v2Player.x - v2EnemyShot.x;
        let dy = v2Player.y - v2EnemyShot.y;
        let mag = sqrt(dx * dx + dy * dy);
        v2EnemyShot.x += (dx / mag) * v2EnemyShot.speed;
        v2EnemyShot.y += (dy / mag) * v2EnemyShot.speed;

        fill(255, 100, 140);
        ellipse(v2EnemyShot.x, v2EnemyShot.y, v2EnemyShot.size, v2EnemyShot.size);

        if (v2EnemyShot.x < -300) v2EnemyShot.x = null;

        if (!inZone) {
            let hit = dist(v2EnemyShot.x, v2EnemyShot.y, v2Player.x, v2Player.y);
            if (hit < v2Player.size / 2) {
                resetV2Stats();
                state = "menu";

                v2EnemyShot.x = v2Boss.x - 20;
                v2EnemyShot.y = v2Boss.y;
                v2Boss.fireCooldown = 90;
            }
        }
    }

    //Straight-line boss shot
    if (v2StraightShot.x === null) {
        v2StraightShot.x = v2Boss.x - 20;
        v2StraightShot.y = v2Boss.y;
    }

    if (v2StraightShot.x !== null) {
        v2StraightShot.x -= v2StraightShot.speed;
        fill(100, 255, 200);
        ellipse(v2StraightShot.x, v2StraightShot.y, v2StraightShot.size, v2StraightShot.size);

        if (v2StraightShot.x < -50) v2StraightShot.x = null;

        if (!inZone && dist(v2StraightShot.x, v2StraightShot.y, v2Player.x, v2Player.y) < v2Player.size / 2) {
            resetV2Stats();
            state = "menu";

            v2StraightShot.x = v2Boss.x - 20;
            v2StraightShot.y = v2Boss.y;
        }
    }

    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Click to shoot\nWASD to move\nNeutral zone = safe", 10, 10);
}

function v2MousePressed() {
    let inZone = v2Player.x > v2Zone.x && v2Player.x < v2Zone.x + v2Zone.w;

    if (mouseButton === LEFT && v2Missile.x === null && !inZone) {
        v2Missile.x = v2Player.x;
        v2Missile.y = v2Player.y;
    }
}

function v2KeyPressed(event) {
    if (event.keyCode === 27) resetV2Stats(), state = "menu";
}


/**
 * Variation #3 of Yars Revenge
 * x
 */

//Copy of v1 but different background
//Use JSON to parse and string v1 stats and copy them (will change later)
let v3Player = JSON.parse(JSON.stringify(v1Player));
let v3Missile = JSON.parse(JSON.stringify(v1Missile));
let v3Boss = JSON.parse(JSON.stringify(v1Boss));
let v3EnemyShot = JSON.parse(JSON.stringify(v1EnemyShot));
let v3StraightShot = JSON.parse(JSON.stringify(v1StraightShot));
let v3Zone = JSON.parse(JSON.stringify(v1Zone));

function v3Setup() {
    resetV3Stats();
}

function resetV3Stats() {
    v3Player.x = 20;
    v3Player.y = height / 2;
    v3Boss.x = width - 140;
    v3Boss.y = height / 2;
    v3Boss.health = 5;
    v3Boss.fireCooldown = 0;
    v3Missile.x = null;
    v3EnemyShot.x = null;
    v3StraightShot.x = null;
    v3Zone.h = height;
}

function v3Draw() {
    background(150, 150, 255); //Different bg

    //Everything else same as v1 but with v3 variables
    //Draw neutral zone
    rectMode(CORNER);
    noStroke();
    fill(140, 110, 220, 100);
    rect(v3Zone.x, 0, v3Zone.w, v3Zone.h);

    //WASD movement
    if (keyIsDown(87)) v3Player.y -= v3Player.speed;
    if (keyIsDown(83)) v3Player.y += v3Player.speed;
    if (keyIsDown(65)) v3Player.x -= v3Player.speed;
    if (keyIsDown(68)) v3Player.x += v3Player.speed;

    v3Player.x = constrain(v3Player.x, 0, width);
    v3Player.y = constrain(v3Player.y, 0, height);

    let inZone = v3Player.x > v3Zone.x && v3Player.x < v3Zone.x + v3Zone.w;

    //Player sprite
    push();
    translate(v3Player.x, v3Player.y);
    noStroke();
    fill(255, 180, 0);
    ellipse(0, 0, v3Player.size, v3Player.size * 0.6);
    fill(0);
    ellipse(8, -5, 6, 6);
    ellipse(8, 5, 6, 6);
    pop();

    //Player missile
    if (v3Missile.x !== null) {
        v3Missile.x += v3Missile.speed;
        fill(255, 240, 50);
        rectMode(CENTER);
        rect(v3Missile.x, v3Missile.y, v3Missile.w, v3Missile.h);
        if (v3Missile.x > width + 100) v3Missile.x = null;

        if (dist(v3Missile.x, v3Missile.y, v3Boss.x, v3Boss.y) < v3Boss.size / 2) {
            v3Missile.x = null;
            v3Boss.health--;
            if (v3Boss.health <= 0) {
                resetV3Stats();
                state = "menu";
                return;
            }
        }
    }

    //Simple boss movement
    v3Boss.y += v3Boss.ySpeed;
    if (v3Boss.y < 40 || v3Boss.y > height - 40) v3Boss.ySpeed *= -1;

    //Boss sprite
    fill(255, 60, 80);
    ellipse(v3Boss.x, v3Boss.y, v3Boss.size, v3Boss.size);
    fill(255, 200, 200);
    ellipse(v3Boss.x + 10, v3Boss.y - 10, 10, 10);
    ellipse(v3Boss.x + 10, v3Boss.y + 10, 10, 10);

    //Boss homing missile
    if (v3EnemyShot.x === null) {
        v3Boss.fireCooldown--;
        if (v3Boss.fireCooldown <= 0) {
            v3EnemyShot.x = v3Boss.x - 20;
            v3EnemyShot.y = v3Boss.y;
            v3Boss.fireCooldown = 90;
        }
    }

    if (v3EnemyShot.x !== null) {
        let dx = v3Player.x - v3EnemyShot.x;
        let dy = v3Player.y - v3EnemyShot.y;
        let mag = sqrt(dx * dx + dy * dy);
        v3EnemyShot.x += (dx / mag) * v3EnemyShot.speed;
        v3EnemyShot.y += (dy / mag) * v3EnemyShot.speed;

        fill(255, 100, 140);
        ellipse(v3EnemyShot.x, v3EnemyShot.y, v3EnemyShot.size, v3EnemyShot.size);

        if (v3EnemyShot.x < -300) v3EnemyShot.x = null;

        if (!inZone) {
            let hit = dist(v3EnemyShot.x, v3EnemyShot.y, v3Player.x, v3Player.y);
            if (hit < v3Player.size / 2) {
                resetV3Stats();
                state = "menu";

                v3EnemyShot.x = v3Boss.x - 20;
                v3EnemyShot.y = v3Boss.y;
                v3Boss.fireCooldown = 90;
            }
        }
    }

    //Straight-line boss shot
    if (v3StraightShot.x === null) {
        v3StraightShot.x = v3Boss.x - 20;
        v3StraightShot.y = v3Boss.y;
    }

    if (v3StraightShot.x !== null) {
        v3StraightShot.x -= v3StraightShot.speed;
        fill(100, 255, 200);
        ellipse(v3StraightShot.x, v3StraightShot.y, v3StraightShot.size, v3StraightShot.size);

        if (v3StraightShot.x < -50) v3StraightShot.x = null;

        if (!inZone && dist(v3StraightShot.x, v3StraightShot.y, v3Player.x, v3Player.y) < v3Player.size / 2) {
            resetV3Stats();
            state = "menu";

            v3StraightShot.x = v3Boss.x - 20;
            v3StraightShot.y = v3Boss.y;
        }
    }

    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Click to shoot\nWASD to move\nNeutral zone = safe", 10, 10);
}

function v3MousePressed() {
    let inZone = v3Player.x > v3Zone.x && v3Player.x < v3Zone.x + v3Zone.w;

    if (mouseButton === LEFT && v3Missile.x === null && !inZone) {
        v3Missile.x = v3Player.x;
        v3Missile.y = v3Player.y;
    }
}

function v3KeyPressed(event) {
    if (event.keyCode === 27) resetV3Stats(), state = "menu";
}
