// array for storing position vectors
locs = [];

function setup() {

    // drawing the canvas
    createCanvas(windowWidth, windowHeight);

    // resolution of polygons on the canvas
    res = 50;
    countX = ceil(width / res);
    countY = ceil(height / res);

    // creating new vector objects and appending to locs array by row
    // outer loop iterates through y-axis (rows)
    // inner loop builds new vector every <res> pixels across x-axis
    for (let i = 0; i <= countY; i++) {
        for (let j = 0; j <= countX; j++) {
            locs.push(new p5.Vector(res * j, res * i));
        }
    }
}

baseNoiseX = 0;
baseNoiseY = 250;

function draw() {

    // setting background color
    background(200);

    // setting noise values
    noiseX = noise(baseNoiseX) * windowWidth;
    noiseY = noise(baseNoiseY) * windowHeight;

    // iterating through the list of position vectors and using the coordinates to build outer/inner circle pairs
    for (k = 0; k < locs.length; k++) {

        // fill color of outer circle is scaled based on distance from the mouse
        // rat = [dist from mouse to center of circle] / [maximum possible distance on canvas]
        let rat = 0.2 + (dist(locs[k].x, locs[k].y, noiseX, noiseY)) / maxDist();

        // the closer the ratio is to 1, the more white the shading will be
        let from = color(200, 62, 119);
        let to = color(53, 176, 201);
        let magnitude = lerpColor(from, to, rat);
        fill(magnitude);
        circle(locs[k].x, locs[k].y, res * (dist(locs[k].x, locs[k].y, noiseX, noiseY)) / maxDist());
    }

    baseNoiseX += 0.01;
    baseNoiseY += 0.01;
}

/**
 * returns the max diagonal distance of the frame
 */
function maxDist() {
    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);
}