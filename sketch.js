// array for storing vectors
var locs = [];

function setup() {

    // drawing canvas to dimensions that match the size of the window
    createCanvas(windowWidth, windowHeight);

    // resolution of vector field, one vector for every 20 pixels
    var res = 20;
    var xCount = ceil(width / res) + 1;
    var yCount = ceil(height / res) + 1;

    // creating new vector objects and appending to locs array by row
    // outer loop iterates through y-axis (rows)
    // inner loop builds new vector every 20 pixels across x-axis
    for (var i = 0; i < yCount; i++) {
        for (var j = 0; j < xCount; j++) {
            locs.push(new p5.Vector(res * j, res * i));
        }
    }

    // removing fill and setting line stroke
    noFill();
    stroke(250, 80, 130);
}

function draw() {

    // setting background color to turquiose ish
    background(0, 100, 100);

    // iterating through each vector in locs
    for (var k = 0; k < locs.length; k++) {

        // needs additional commenting
        var h = calcVec(locs[k].x - mouseX, locs[k].y - mouseY);
        push();
        translate(locs[k].x, locs[k].y);
        rotate(h.heading());
        line(0, 0, 0, -15);
        pop();
    }
}

function calcVec(x, y) {
    return new p5.Vector(y - x, -x - y);
}