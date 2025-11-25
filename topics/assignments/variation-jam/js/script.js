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
 * Variation #1 of Yars Revenge
 * x
 */

function v1Setup() {}

function v1Draw() {
    background(255, 150, 150);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Variation 1", width / 2, height / 2);
}

function v1KeyPressed(event) {
    if (event.keyCode === 27) state = "menu"; 
}

function v1MousePressed() {}

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
