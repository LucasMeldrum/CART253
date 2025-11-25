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

function v2Setup() {}

function v2Draw() {
    background(150, 255, 150);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Variation 2", width / 2, height / 2);
}

function v2KeyPressed(event) {
    if (event.keyCode === 27) state = "menu";
}

function v2MousePressed() {}

/**
 * Variation #3 of Yars Revenge
 * x
 */

function v3Setup() {}

function v3Draw() {
    background(150, 150, 255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Variation 3", width / 2, height / 2);
}

function v3KeyPressed(event) {
    if (event.keyCode === 27) state = "menu";
}

function v3MousePressed() {}
