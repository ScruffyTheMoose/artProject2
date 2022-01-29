locs = [];

function setup() {

    // drawing the canvas
    createCanvas(windowWidth, windowHeight);

    // resolution of polygons on the canvas
    res = 50;
    countX = ceil(width / res);
    countY = ceil(height / res);

    // building new responsive circles iteratively and storing the objects in locs
    // Circle objs given (x, y) coords normally and have radius set based on ratio of circles to window width
    for (let i = 0; i <= countY; i++) {
        for (let j = 0; j <= countX; j++) {
            locs.push(new p5.Vector(res * j, res * i));
        }
    }
}

function draw() {

    // setting background color
    background(200);
    
    for ( k = 0; k < locs.length; k++ ) {
        let rat = 0.2 + (dist(locs[k].x, locs[k].y, mouseX, mouseY)) / maxDist();
        let from = color(20, 0, 220);
        let to = color(255, 0, 0);
        let magnitude = lerpColor(from, to, rat);
        fill(magnitude);
        circle(locs[k].x, locs[k].y, 50);

        fill(100);
        circle(locs[k].x, locs[k].y, 50 * (dist(locs[k].x, locs[k].y, mouseX, mouseY))/ maxDist());
    }

}

/**
 * returns the max diagonal distance of the frame
 */
 function maxDist() {
    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);
}