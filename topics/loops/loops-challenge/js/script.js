/**
 * Lines
 * Pippin Barr
 * 
 * A series of lines across the canvas
 */

"use strict";

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(500, 500);
}

/**
 * Draws lines across the canvas with increasing thickness and
 * gradually lightening colour
 */
function draw() {
    background("pink");  
    let x = 0;
    while (x < 500) {
        stroke(x * random());
        line(x, 0, x, height);
        x = x + 50;
    }
    
    let y = 0
    while (y < 500) {
        stroke(y * random());
        line(0, y, width, y);
        y = y + 50;
    }

    for (let y = 0; y < height; y++) {
        let c = map(y, 0, height, 100, 255);
        stroke(c, 150, 200);
        line(0, y, width, y);
    }
}   