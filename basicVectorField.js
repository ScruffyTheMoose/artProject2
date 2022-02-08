// array for storing vectors
locs = [];

/**
 * Setting up the P5 sketch.
 * Canvas dimensions are set, test size is set, and a matrix of vectors is set up for drawing the vector field with random deviance from the x,y grid.
 */
function setup() {

    // drawing canvas to dimensions that match the size of the window
    createCanvas(windowWidth, windowHeight);

    // resolution of vector field, one vector for every 50 pixels
    res = 50;
    xCount = ceil(width / res);
    yCount = ceil(height / res);

    // creating new vector objects and appending to locs array by row
    // outer loop iterates through y-axis (rows)
    // inner loop builds new vector every <res> pixels across x-axis
    for (let i = 0; i <= yCount; i++) {
        for (let j = 0; j <= xCount; j++) {
            locs.push(new p5.Vector(res * j, res * i));
        }
    }
}

/**
 * Rendering components to the canvas.
 * A matrix of position vectors for the track of the moving object is built and drawn.
 */
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
         * <H> = <a - x, b - y>
         * 
         * This is necessary because the origin is in the top left of the screen
         * so we must create a new position vector that points towards to true
         * location of the mouse.
         */
        let h = new p5.Vector(mouseX - locs[k].x, mouseY - locs[k].y);

        // creates an instance specific to the new vector h
        push();

        // translate the next object to the head of the pos vector in locs
        translate(locs[k].x, locs[k].y);

        // rotates the next object in this instance to the heading of vector h
        rotate(h.heading());

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
}