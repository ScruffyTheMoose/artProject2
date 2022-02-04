// array for storing vectors
locs = [];

/**
 * Setting up the P5 sketch.
 * Canvas dimensions are set, test size is set, and a matrix of vectors is set up for drawing the vector field with random deviance from the x,y grid.
 * Sliders for adjusting curl and the ring-fade are also instantiated.
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
    // x and y are randomly deviated from the grid [0, 10] pixels
    for (let i = 0; i <= yCount; i++) {
        for (let j = 0; j <= xCount; j++) {
            locs.push(new p5.Vector(res * j + Math.random() * 50, res * i + Math.random() * 50));
        }
    }
}

// Initial (x, y) pos of circle
circleX = 400;
circleY = 400;

speedX = 0;
speedY = 0;

/**
 * Rendering components to the canvas.
 * Variables for curl and ring-fade are initiated.
 * Noise for movement along the xy-plane is developed.
 * 
 * A matrix of position vectors for the track of the moving object is built and drawn.
 * A circle is drawn to be tracked around the canvas.
 * 
 * Vectors are drawn across the grid with color, width, and magnitude varying based on distance from the tracked object.
 * Vector curl and draw-distance is adjusted live with the sliders.
 */
function draw() {

    if (mouseIsPressed) {

        // Determining x, y movement speed of object based on relative distance from mouse
        speedX = -45 * (circleX - mouseX) / maxDist();
        speedY = -45 * (circleY - mouseY) / maxDist();

        // Changing x-axis direction and speed based on mouse distance
        circleX += speedX;
        circleY += speedY;

    } else {

        if (circleX > windowWidth || circleX < 0) {
            speedX = -speedX;
        }

        if (circleY > windowHeight || circleY < 0) {
            speedY = -speedY;
        }

        circleX += speedX;
        circleY += speedY;

    }

    // setting background color to turquiose ish
    background(50);

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

        // color of the line is dependent on distance from circle
        // given as a ratio of max distance to current distance
        let rat = 0.1 + (dist(locs[k].x, locs[k].y, circleX, circleY)) / (maxDist());
        let from = color(240);
        let to = color(50);
        let magnitude = lerpColor(from, to, rat);
        stroke(magnitude);
        strokeWeight(6 - (6 * (rat)));

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
        line(0, 0, 15, 5 * (1 - rat));

        // exit the instance
        pop();

    }

    // building object to track
    // deep blue (0, 105, 148)
    fill(0, 105, 148);
    noStroke();
    circle(circleX, circleY, 20);

    // gradually slowing down the object as it drifts
    // currently tends to x-axis
    slowX = 0.004;
    slowY = (windowHeight / windowWidth) * slowX;

    if (speedX > 0) {
        speedX -= slowX;
    } else {
        speedX += slowX;
    }

    if (speedY > 0) {
        speedY -= slowY;
    } else {
        speedY += slowY;
    }

}

/**
 * Function that returns the max diagonal distance of the frame
 */
function maxDist() {

    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);

}