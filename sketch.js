// array for storing vectors
locs = [];

circleX = 400;
circleY = 400;
diameter = 65;

function setup() {

    // drawing canvas to dimensions that match the size of the window
    createCanvas(windowWidth, windowHeight);

    // resolution of vector field, one vector for every 20 pixels
    res = 50;
    xCount = ceil(width / res) + 1;
    yCount = ceil(height / res) + 1;

    // creating new vector objects and appending to locs array by row
    // outer loop iterates through y-axis (rows)
    // inner loop builds new vector every 20 pixels across x-axis
    for (let i = 0; i < yCount; i++) {
        for (let j = 0; j < xCount; j++) {
            locs.push(new p5.Vector(res * j, res * i));
        }
    }

}

function draw() {

    // setting background color to turquiose ish
    background(200);

    // removing fill and setting line stroke
    noFill();
    stroke(0);

    // iterating through each vector in locs
    for (let k = 0; k < locs.length; k++) {

        // builds a new vector based off relative location of the mouse pointer
        /**
         * <P> = <x, y>         position vector from locs
         * <M> = <a, b>         position vector of mouse
         * To get new vector pointing towards mouse from <P>, 
         * we build a new vector as:
         * <H> = <-x + a, -y + b>
         * 
         * This is necessary because the origin is in the top left of the screen
         * so we must create a new position vector that points towards to true
         * location of the mouse.
         */
        let h = new p5.Vector(-locs[k].x + circleX, -locs[k].y + circleY);


        // creates an instance specific to the new vector h
        push();

        // translate the next object to the head of the pos vector in locs
        translate(locs[k].x, locs[k].y);

        // rotates the next object in this instance to the heading of vector h
        rotate(h.heading());

        // color of the line is dependent on distance from circle
        // given as a ratio of max distance to current distance
        let rat = 0.1 + (dist(locs[k].x, locs[k].y, circleX, circleY)) / maxDist();
        let from = color(20, 0, 220);
        let to = color(255, 0, 0);
        let magnitude = lerpColor(from, to, rat);
        stroke(magnitude);
        strokeWeight(3);

        /* creates a line object at the origin pointing directly right
         * translate and rotate are applied to this line
         * translate moves the base of the line to vector from locs
         * rotate turns the vector based on vector h heading
         * 
         * To create curl, all we need to do is change the ratio of x2 and y2.
         * The heading of the line is based on vector h and the rotate()
         * function will just add n-radians. Keeping y2 as 0 makes the vector point directly
         * towards the mouse.
         */
        line(0, 0, 15, 0);

        // exit the instance
        pop();
    }

    // removing stroke for ellipse
    noStroke();
    fill(50);

    if (dist(circleX, circleY, mouseX, mouseY) < diameter && mouseIsPressed) {

        circleX = mouseX;
        circleY = mouseY;
    }

    ellipse(circleX, circleY, diameter, diameter);
}

/**
 * returns the max diagonal distance of the frame
 */
function maxDist() {
    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);
}