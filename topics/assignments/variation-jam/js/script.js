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

        case "win":
            winDraw();
            break;

        case "lose":
            loseDraw();
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

        case "win":
            if (event.keyCode === 32) state = "menu";
            break;

        case "lose":
            if (event.keyCode === 32) state = "menu";
            break;

    }
}

//Win Screen
function winDraw() {
    background(20, 200, 80);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("YOU WIN!", width / 2, height / 2 - 40);

    textSize(20);
    text("Press SPACE to return to menu", width / 2, height / 2 + 20);
}

//Lose Screen
function loseDraw() {
    background(200, 40, 40);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("YOU LOSE!", width / 2, height / 2 - 40);

    textSize(20);
    text("Press SPACE to return to menu", width / 2, height / 2 + 20);
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
    speed: 1.5,
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

//Shockwave attack
let v1Shockwave = {
    active: false,
    radius: 0,
    maxRadius: 1200,
    cooldown: 300 
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

    //Reset projectiles
    v1Missile.x = null;
    v1EnemyShot.x = null;
    v1StraightShot.x = null;

    //Zone
    v1Zone.h = height;

    //Shockwave
    v1Shockwave.active = false;
    v1Shockwave.radius = 0;
    v1Shockwave.cooldown = 300;
}

function v1Draw() {
    background(40, 45, 60);

    //Neutral zone
    rectMode(CORNER);
    noStroke();
    fill(140, 110, 220, 100);
    rect(v1Zone.x, 0, v1Zone.w, v1Zone.h);

    //Movement
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

        //Boss hit
        if (dist(v1Missile.x, v1Missile.y, v1Boss.x, v1Boss.y) < v1Boss.size / 2) {
            v1Missile.x = null;
            v1Boss.health--;

            if (v1Boss.health <= 0) {
                resetStats();
                state = "win";
                return;
            }
        }
    }

    //Boss movement
    v1Boss.y += v1Boss.ySpeed;
    if (v1Boss.y < 40 || v1Boss.y > height - 40) v1Boss.ySpeed *= -1;

    //Boss sprite
    fill(255, 60, 80);
    ellipse(v1Boss.x, v1Boss.y, v1Boss.size, v1Boss.size);
    fill(255, 200, 200);
    ellipse(v1Boss.x + 10, v1Boss.y - 10, 10, 10);
    ellipse(v1Boss.x + 10, v1Boss.y + 10, 10, 10);

    //Boss health bar
    rectMode(CORNER);

    fill(255);
    rect(20, 20, 200, 12);

    fill(255, 80, 100);
    rect(20, 20, (v1Boss.health / 5) * 200, 12);


    //Boss homing shot
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

        if (!inZone && dist(v1EnemyShot.x, v1EnemyShot.y, v1Player.x, v1Player.y) < v1Player.size / 2) {
            resetStats();
            state = "lose";
            return;
        }

        if (v1EnemyShot.x < -300) v1EnemyShot.x = null;
    }

    //Straight shot
    if (v1StraightShot.x === null) {
        v1StraightShot.x = v1Boss.x - 20;
        v1StraightShot.y = v1Boss.y;
    }

    if (v1StraightShot.x !== null) {
        v1StraightShot.x -= v1StraightShot.speed;
        fill(100, 255, 200);
        ellipse(v1StraightShot.x, v1StraightShot.y, v1StraightShot.size, v1StraightShot.size);

        if (!inZone && dist(v1StraightShot.x, v1StraightShot.y, v1Player.x, v1Player.y) < v1Player.size / 2) {
            resetStats();
            state = "lose";
            return;
        }

        if (v1StraightShot.x < -50) v1StraightShot.x = null;
    }

    //Shockwave attack
    v1Shockwave.cooldown--;
    if (v1Shockwave.cooldown <= 0 && !v1Shockwave.active) {
        v1Shockwave.active = true;
        v1Shockwave.radius = 0;
        v1Shockwave.cooldown = 300;
    }

    if (v1Shockwave.active) {
        v1Shockwave.radius += 12;

        //Shockwave visible ring
        noFill();
        stroke(255, 150, 80, 130);
        strokeWeight(12);
        ellipse(v1Boss.x, v1Boss.y, v1Shockwave.radius, v1Shockwave.radius);

        //Precise ring detection
        let distToPlayer = dist(v1Boss.x, v1Boss.y, v1Player.x, v1Player.y);
        let ringEdge = v1Shockwave.radius / 2;
        let hit = abs(distToPlayer - ringEdge) < 12;

        if (!inZone && hit) {
            resetStats();
            state = "lose";
            return;
        }

        if (v1Shockwave.radius > v1Shockwave.maxRadius) {
            v1Shockwave.active = false;
            v1Shockwave.radius = 0;
        }

        strokeWeight(1);
    }


    //UI
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Click to shoot\nWASD to move\nNeutral zone = safe", 10, 50);
}

function v1MousePressed() {
    let inZone = v1Player.x > v1Zone.x && v1Player.x < v1Zone.x + v1Zone.w;

    if (mouseButton === LEFT && v1Missile.x === null && !inZone) {
        v1Missile.x = v1Player.x;
        v1Missile.y = v1Player.y;
    }
}

/**
 * Variation #2 — Yars Revenge PvP
 */

//Player 1 (Yar)
let v2Player1 = {
    x: 20,
    y: 250,
    speed: 3,
    size: 26,
};

//Boss Player 2
let v2Boss = {
    x: 380,
    y: 250,
    size: 45,
    speed: 3,
    health: 5
};

//Player 1 missile
let v2Missile = {
    x: null,
    y: null,
    speed: 8,
    w: 8,
    h: 3
};

//Boss straight shot
let v2StraightShot = {
    x: null,
    y: null,
    speed: 5,
    size: 16
};

//Boss shockwave
let v2Shockwave = {
    active: false,
    radius: 0,
    maxRadius: 1200
};

//Neutral zone
let v2Zone = {
    x: 75,
    w: 55,
    h: 0
};

function v2Setup() {
    resetV2();
}

function resetV2() {
    v2Player1.x = 20;
    v2Player1.y = height / 2;

    v2Boss.x = 380;
    v2Boss.y = height / 2;
    v2Boss.health = 5;

    v2Missile.x = null;
    v2StraightShot.x = null;

    v2Shockwave.active = false;
    v2Shockwave.radius = 0;

    v2Zone.h = height;
}

function v2Draw() {
    background(50, 70, 130);

    //Neutral zone brighter
    rectMode(CORNER);
    noStroke();
    fill(190, 170, 255, 110);
    rect(v2Zone.x, 0, v2Zone.w, v2Zone.h);

    //Player 1 WASD
    if (keyIsDown(87)) v2Player1.y -= v2Player1.speed;
    if (keyIsDown(83)) v2Player1.y += v2Player1.speed;
    if (keyIsDown(65)) v2Player1.x -= v2Player1.speed;
    if (keyIsDown(68)) v2Player1.x += v2Player1.speed;

    v2Player1.x = constrain(v2Player1.x, 0, width);
    v2Player1.y = constrain(v2Player1.y, 0, height);

    let inZone = v2Player1.x > v2Zone.x && v2Player1.x < v2Zone.x + v2Zone.w;

    //Player 1 sprite
    push();
    translate(v2Player1.x, v2Player1.y);
    noStroke();
    fill(255, 190, 50);
    ellipse(0, 0, v2Player1.size, v2Player1.size * 0.6);
    fill(0);
    ellipse(8, -5, 6, 6);
    ellipse(8, 5, 6, 6);
    pop();

    //Boss movement up and down
    if (keyIsDown(UP_ARROW)) v2Boss.y -= v2Boss.speed;
    if (keyIsDown(DOWN_ARROW)) v2Boss.y += v2Boss.speed;

    //Locked in place
    v2Boss.x = 380;
    v2Boss.y = constrain(v2Boss.y, 40, height - 40);

    //Boss sprite
    fill(255, 60, 100);
    ellipse(v2Boss.x, v2Boss.y, v2Boss.size);

    //Boss health bar
    rectMode(CORNER);
    fill(255);
    rect(20, 20, 200, 12);
    fill(255, 80, 120);
    rect(20, 20, (v2Boss.health / 5) * 200, 12);

    //Player missile
    if (v2Missile.x !== null) {
        v2Missile.x += v2Missile.speed;

        fill(255, 240, 50);
        rectMode(CENTER);
        rect(v2Missile.x, v2Missile.y, v2Missile.w, v2Missile.h);

        if (v2Missile.x > width + 40) v2Missile.x = null;

        if (dist(v2Missile.x, v2Missile.y, v2Boss.x, v2Boss.y) < v2Boss.size / 2) {
            v2Missile.x = null;
            v2Boss.health--;

            if (v2Boss.health <= 0) {
                resetV2();
                state = "win";
                return;
            }
        }
    }

    //Boss straight shot
    if (v2StraightShot.x !== null) {
        v2StraightShot.x -= v2StraightShot.speed;

        fill(80, 255, 200);
        ellipse(v2StraightShot.x, v2StraightShot.y, v2StraightShot.size);

        if (!inZone && dist(v2StraightShot.x, v2StraightShot.y, v2Player1.x, v2Player1.y) < v2Player1.size / 2) {
            resetV2();
            state = "lose";
            return;
        }

        if (v2StraightShot.x < -50) v2StraightShot.x = null;
    }

    //Boss shockwave
    if (v2Shockwave.active) {
        v2Shockwave.radius += 14;

        noFill();
        stroke(255, 150, 80, 140);
        strokeWeight(12);
        ellipse(v2Boss.x, v2Boss.y, v2Shockwave.radius);

        let distToPlayer = dist(v2Boss.x, v2Boss.y, v2Player1.x, v2Player1.y);
        let ringEdge = v2Shockwave.radius / 2;
        let hit = abs(distToPlayer - ringEdge) < 12;

        if (!inZone && hit) {
            resetV2();
            state = "lose";
            return;
        }

        if (v2Shockwave.radius > v2Shockwave.maxRadius) {
            v2Shockwave.active = false;
            v2Shockwave.radius = 0;
        }
        strokeWeight(1);
    }

    //UI
    fill(255);
    textAlign(LEFT, TOP);
    textSize(15);
    text("P1: WASD + Click\nP2: Up/Down, ← = Shoot, → = Shockwave", 10, 55);
}

//Player 1 fire
function v2MousePressed() {
    let inZone = v2Player1.x > v2Zone.x && v2Player1.x < v2Zone.x + v2Zone.w;

    if (mouseButton === LEFT && v2Missile.x === null && !inZone) {
        v2Missile.x = v2Player1.x;
        v2Missile.y = v2Player1.y;
    }
}

//Boss fire inputs
function v2KeyPressed(event) {
    //Left arrow = straight shot
    if (event.keyCode === LEFT_ARROW) {
        if (v2StraightShot.x === null) {
            v2StraightShot.x = v2Boss.x - 20;
            v2StraightShot.y = v2Boss.y;
        }
    }

    //Right arrow = shockwave
    if (event.keyCode === RIGHT_ARROW) {
        if (!v2Shockwave.active) {
            v2Shockwave.active = true;
            v2Shockwave.radius = 0;
        }
    }
}
