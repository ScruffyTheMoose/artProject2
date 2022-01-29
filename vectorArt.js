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
            locs.push(new Circle(res * j, res * i, width / res));
        }
    }
}

function draw() {

    // setting background color
    background(200);


}


class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.outerCircle = circle(x, y, radius);
        this.innerCircle = circle(x, y, radius / 2);
    }

    /**
     * Change the x-axis value for the location of the outer circle and inner circle
     * @param {x-value} x 
     */
    changeX(x) {
        this.outerCircle.x = x;
        this.innerCircle.x = x;
    }

    /**
     * Change the y-axis value for the location of the outer and inner circle
     * @param {y-value} y 
     */
    changeY(y) {
        this.outerCircle.y = y;
        this.innerCircle.y = y;
    }

    /**
     * Change the radius of the outer circle
     * @param {radius} radius 
     */
    changeOuterRadius(radius) {
        this.outerCircle.radius = radius;
    }

    /**
     * Change the radius of the inner circle
     * @param {radius} radius 
     */
    changeInnerRadius(radius) {
        this.innerCircle.radius = radius;
    }
}