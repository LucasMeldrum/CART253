/**
 * Instructions Challenge
 * Lucas Meldrum
 * 
 * This project encompasses a beautiful night landscape with weird flashing stars and a scary face
 */

"use strict";

// Create the canvas and fill the background
function setup() {
    createCanvas(720, 480);
}

// Add a background and draw the night landscape including the moon, stars, trees, and scary face?
function draw() {
    drawNightSkye();
    drawStars();
    drawTallTrees();
    drawMoon();
    drawScaryFace();
}

// Draw the night skye
function drawNightSkye() {
    background(50);
}

// Draw stars all over the screen randomly
function drawStars() {
    push();
    noStroke();
    fill('yellow');

    for (let x = 0; x < 5; x++) {
        ellipse(Math.random() * width, Math.random() * height, 25, 25);
    }
    
    pop();
}

// Draw trees at the bottom of the screen
function drawTallTrees() {
    push();
    noStroke();
    fill(0, 100, 0);

    for (let x = 0; x < width; x += 60) {
        triangle(x + 20, height - 125, x, height, x + 60, height);
    }

    pop();
}

// Draw a big moon
function drawMoon() {
    push();
    noStroke();
    fill(255, 255, 190);
    ellipse(600, 100, 100, 100);
    fill(50);
    ellipse(590, 100, 85, 100);
    pop();
}

// Draw scary red eyes
function drawScaryFace() {
    drawEyesOutside();
    drawPupils();
    drawSmile();
}

// Draw red pupils
function drawPupils() {
    push();
    noStroke();
    fill(100, 0, 0);
    ellipse(330,240,25,25);
    fill(100, 0, 0);
    ellipse(420,240,25,25);
    pop();
}

// Draw the outside of the eyes
function drawEyesOutside() {
    push();
    noStroke();
    fill(25);
    ellipse(330,240,40,40);
    fill(25);
    ellipse(420,240,40,40);
    pop();
}

function drawSmile() {
    push();
    noStroke();
    fill(25);
    ellipse(375, 280, 65, 65);
    fill(50);
    ellipse(375, 260, 60, 60);
}
