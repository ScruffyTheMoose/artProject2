/**
 * The setup() method will set the dimensions for the canvas and initialize all dimension variables for rendering.
 */
function setup() {

    /**
     * Setting window width and height to match to have universally square canvas.
     * The form of the drawn cubes is dependent on the dimensions of the canvas so this is necessary.
     */
    WIDTH = windowWidth;
    HEIGHT = windowHeight;
    createCanvas(WIDTH, HEIGHT);

    // used to shift second cube down and left
    // larger than true quarter so that there is a gap between objects
    x_quart = WIDTH / 3.5;
    y_quart = HEIGHT / 3.5;

    // one-eight the canvas dimension which is used to plot corners of cubes
    x_oct = WIDTH / 8;
    y_oct = HEIGHT / 8;
}

/**
 * The draw() method will build the canvas and render all objects given within the code block.
 */
function draw() {

    // setting background color
    background(0, 100, 100);



}