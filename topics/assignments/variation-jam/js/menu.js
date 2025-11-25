/**
 * Variation Menu
 * Custom clickable menu with a Yar cursor
 */

"use strict";

let state = "menu";

//Menu buttons
let buttons = [
    { label: "Variation 1", x: 150, y: 150, w: 200, h: 60, target: "v1" },
    { label: "Variation 2", x: 150, y: 250, w: 200, h: 60, target: "v2" },
    { label: "Variation 3", x: 150, y: 350, w: 200, h: 60, target: "v3" }
];

//Draw menu
function menuDraw() {
    background(0);

    for (let b of buttons) {
        drawMenuButton(b);
    }

    drawYarCursor(mouseX, mouseY);
}

//Draw a single button
function drawMenuButton(btn) {
    let hover =
        mouseX > btn.x &&
        mouseX < btn.x + btn.w &&
        mouseY > btn.y &&
        mouseY < btn.y + btn.h;

    push();
    rectMode(CORNER);
    stroke(255);
    strokeWeight(2);
    fill(hover ? 70 : 40);
    rect(btn.x, btn.y, btn.w, btn.h, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    pop();
}

//Mouse click detection
function menuMousePressed() {
    for (let b of buttons) {
        if (
            mouseX > b.x &&
            mouseX < b.x + b.w &&
            mouseY > b.y &&
            mouseY < b.y + b.h
        ) {
            state = b.target;

            if (b.target === "v1") v1Setup();
            if (b.target === "v2") v2Setup();
            if (b.target === "v3") v3Setup();
        }
    }
}

//Keyboard for menu
function menuKeyPressed(event) {
    if (event.keyCode === 86) { state = "v1"; v1Setup(); } // V
    if (event.keyCode === 87) { state = "v2"; v2Setup(); } // W
    if (event.keyCode === 88) { state = "v3"; v3Setup(); } // X
}

//Draw Yar cursor
function drawYarCursor(x, y) {
    push();
    translate(x, y);
    noStroke();

    fill(255, 180, 0);
    ellipse(0, 0, 18, 26);

    triangle(-12, -5, -3, 0, -12, 5);
    triangle(12, -5, 3, 0, 12, 5);

    fill(255, 50, 50);
    ellipse(0, -14, 10, 10);

    pop();
}
