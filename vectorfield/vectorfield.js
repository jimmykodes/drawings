let cell, l, a, x, y, count, canvas, colorBack;
let mods = [];

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    renderLines();
}

function renderLines(){
    let highCount = height/40;
    let wideCount = width/40;
    count = int(highCount * wideCount);

    let i = 0;
    for (let xc = 0; xc < wideCount; xc++) {
        for (let yc = 0; yc < highCount; yc++) {
            mods[i++] = new Module(int(xc)*cell,int(yc)*cell);
        }
    }
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '1');

    frameRate(30);
    cell = 100;
    l = 10;
    colorBack = "#FFDC4E";
    renderLines();
}


function mouseMoved() {
    background(colorBack);

    strokeWeight(7);
    for (let i = 0; i <= count; i++) {
        mods[i].update();
        mods[i].draw2();
    }
}


function draw() {

    stroke(255);
    strokeWeight(7);
    for (let i = 0; i <= count; i++) {
        mods[i].update();
        mods[i].draw2();
    }
    noLoop();
}

function Module(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.a = 0;
}

Module.prototype.update = function() {
        this.a = 3 * (atan2(mouseY-this.y, mouseX-this.x));
}

Module.prototype.draw2 = function() {
    push();
    translate(this.x, this.y);
    rotate(this.a);
    line(-l,0,l,0);
    pop();
}


