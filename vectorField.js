// array for storing vectors
locs = [];

// array for storing vectors to the trail of random trajectory
track = [];

/**
 * Setting up the P5 sketch.
 * Canvas dimensions are set, test size is set, and a matrix of vectors is set up for drawing the vector field with random deviance from the x,y grid.
 * Sliders for adjusting curl and the ring-fade are also instantiated.
 */
function setup() {

    // drawing canvas to dimensions that match the size of the window
    createCanvas(windowWidth, windowHeight);

    // setting text size for slider labels
    textSize(13);

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

    curlSlider = createSlider(-15, 15, 0, 1);
    curlSlider.position(30, 30);
    curlSlider.style('width', '200px');

    ringSlider = createSlider(0, 1, 0.5, 0.01);
    ringSlider.position(30, 70);
    ringSlider.style('width', '200px');
}

// vars for tracking the base integer value of the noise
baseNoiseX = 0;
baseNoiseY = 250;

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

    curl = curlSlider.value();
    fadeRing = ringSlider.value();

    // color values based on random movement across xy-plane
    let xColor = noise(baseNoiseX) * 255;
    let yColor = noise(baseNoiseY) * 255;

    // building random point from noise for vectors to track
    noiseX = noise(baseNoiseX) * windowWidth;
    noiseY = noise(baseNoiseY) * windowHeight;

    // setting background color to turquiose ish
    background(200);

    // add current (x, y) to track array
    track.push(new p5.Vector(noiseX, noiseY));

    // set max length of trail here
    // truncate excess point from track array
    if (track.length > 200) {
        track.shift();
    }

    // drawing trail using vertices at each point visited by the object
    beginShape();
    noFill();
    stroke(0, 0, 50);
    for (let p = 0; p < track.length; p++) {
        // color fades as points gets further from object
        // NEEDS WORK
        vertex(track[p].x, track[p].y);
    }
    endShape();

    // building object to track
    fill(yColor, 0, xColor);
    noStroke();
    circle(noiseX, noiseY, 20);

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
        let h = new p5.Vector(-locs[k].x + noiseX, -locs[k].y + noiseY);


        // creates an instance specific to the new vector h
        push();

        // translate the next object to the head of the pos vector in locs
        translate(locs[k].x, locs[k].y);

        // rotates the next object in this instance to the heading of vector h
        rotate(h.heading());

        // color of the line is dependent on distance from circle
        // given as a ratio of max distance to current distance
        let rat = 0.1 + (dist(locs[k].x, locs[k].y, noiseX, noiseY)) / (maxDist() * fadeRing);
        let from = color(xColor, 0, yColor);
        let to = color(200);
        let magnitude = lerpColor(from, to, rat);
        stroke(magnitude);
        strokeWeight(6 - (6 * (rat)));

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
        if (curl >= 0) {
            line(0, 0, (res * rat), curl);
        } else if (curl < 0) {
            line(0, 0, (res * rat), curl);
        }


        // exit the instance
        pop();

        // incrementing noise values at pace that causes human-like movement
        baseNoiseX += 0.00001;
        baseNoiseY += 0.00001;
    }

    fill(0);
    text('Curl', curlSlider.x + 80, 20);
    text('Fade', ringSlider.x + 80, 60);
}

/**
 * Function that returns the max diagonal distance of the frame
 */
function maxDist() {
    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);
}