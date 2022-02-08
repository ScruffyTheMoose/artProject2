// array for storing vectors
locs = [];


/**
 * Setting up the P5 sketch.
 * Canvas dimensions are set and a matrix of vectors is set up for drawing the vector field with random deviance across the xy-plane.
 */
function setup() {

    // drawing canvas to dimensions that match the size of the window
    createCanvas(windowWidth, windowHeight);

    // resolution of vector field, one vector for every 50 sq. pixels
    res = 50;
    xCount = ceil(width / res);
    yCount = ceil(height / res);

    // creating new vector objects and appending to locs array by row
    // outer loop iterates through y-axis (rows)
    // inner loop builds new vector every <res> pixels across x-axis
    // x and y are randomly deviated from the grid [0, 50] pixels
    for (let i = 0; i <= yCount; i++) {
        for (let j = 0; j <= xCount; j++) {
            locs.push(new p5.Vector(res * j + Math.random() * 50, res * i + Math.random() * 50));
        }
    }

    // popup for when the page is loaded
    window.alert("\
        Click anywhere in the window to attract the object. Click-and-Hold to guide the object around. Speed depends on distance between the object and your mouse. When you release, the ball will maintain its trajectory and gradually come to a stop\n\
        \n\
        Information is displayed in the low-right. Use 'A' and 'D' to cycle options and 'W' and 'S' to change values.")

} // end setup


// Initial (x, y) pos of circle
circleX = 400;
circleY = 400;

speedX = 0;
speedY = 0;

// control key val
control = 1;
speed = 50;
resist = 0.005;
fade = 0.5;


/**
 * Rendering components to the canvas.
 * Variables for curl and ring-fade are initiated.
 * Noise for movement along the xy-plane is developed.
 * 
 * A matrix of position vectors for the track of the moving object is built and drawn.
 * A circle is drawn to be tracked around the canvas.
 * 
 * Vectors are drawn across the grid with color, width, and magnitude varying based on distance from the tracked object.
 */
function draw() {

    // controlling object movement based on mouse pos
    if (mouseIsPressed) {

        // Determining x, y movement speed of object based on relative distance from mouse
        speedX = -speed * (circleX - mouseX) / maxDist();
        speedY = -speed * (circleY - mouseY) / maxDist();

        // Changing x-axis direction and speed based on mouse distance
        circleX += speedX;
        circleY += speedY;

        // bouncing object off borders
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

    // gradually slowing down the object as it drifts
    // slightly tends to x-axis
    slowX = resist;
    slowY = (windowHeight / windowWidth) * resist;

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
         * <H> = <a - x, b - y>
         * 
         * This is necessary because the origin is in the top left of the screen
         * so we must create a new position vector that points towards to true
         * location of the mouse.
         */
        let h = new p5.Vector(circleX - locs[k].x, circleY - locs[k].y);

        // creates an instance specific to the new vector h
        push();

        // color of the line is dependent on distance from circle
        // given as a ratio of max distance to current distance
        let rat = 0.1 + (dist(locs[k].x, locs[k].y, circleX, circleY)) / (maxDist() * fade);
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

    // rendering object to track
    fill(0, 105, 148);
    noStroke();
    circle(circleX, circleY, 20);

    // rendering display box
    fill(200);
    displayX = width - 250;
    displayY = height - 100;
    rect(displayX, displayY, 250, 100);

    // rendering display information
    fill(20);
    textSize(15);
    switch (control) {
        case 0:
            textStyle(BOLD);
            text("Controlling Speed", displayX + 15, displayY + 15);
            textStyle(NORMAL);
            text("Speed = " + speed, displayX + 15, displayY + 35)
            break;

        case 1:
            textStyle(BOLD);
            text("Controlling Resistance", displayX + 15, displayY + 15);
            textStyle(NORMAL);
            text("Resistance = " + resist.toFixed(2), displayX + 15, displayY + 35)
            break;

        case 2:
            textStyle(BOLD);
            text("Controlling Fade", displayX + 15, displayY + 15);
            textStyle(NORMAL);
            text("Fade = " + fade.toFixed(2), displayX + 15, displayY + 35)
            break;
    }

} // end draw


/**
 * Function that returns the max diagonal distance of the frame
 */
function maxDist() {

    widthSq = width * width;
    heightSq = height * height;
    return Math.sqrt(widthSq + heightSq);

} // end maxDist


/**
 * Function for reading key inputs
 * The key inputs will correspond with different control values for speed, resistance, and fade of/around the object.
 * A and D for selecting the element being controlled
 * W and S for incrementing or decrementing the element's value
 */
function keyPressed() {

    if (keyCode === 65) {

        // decrementing control to min 0
        if (control > 0) {
            control--;
            console.log(control);
        }

    } else if (keyCode === 68) {

        // incrementing control to max 2
        if (control < 2) {
            control++;
            console.log(control);
        }

    } else if (keyCode === 87) {

        switch (control) {
            case 0:
                speed += 5; // negative because of speed value formula
                console.log(speed);
                break;

            case 1:
                if (resist < 1) {
                    resist += 0.01;
                    console.log(resist);
                }
                break;

            case 2:
                if (fade < 1) {
                    fade += 0.1;
                    console.log(fade);
                }
                break;
        }

    } else if (keyCode === 83) {

        switch (control) {
            case 0:
                speed -= 5;
                console.log(speed);
                break;

            case 1:
                if (resist > 0) {
                    resist -= 0.01;
                    console.log(resist);
                }

                if (resist < 0) {
                    resist = 0;
                }
                break;

            case 2:
                if (fade > 0.1) {
                    fade -= 0.1;
                    console.log(fade);
                }
                break;
        }

    }

} // end keyPressed