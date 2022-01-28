class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.outerCircle = circle(this.x, this.y, this.radius);
        this.innerCircle = circle(this.x, thisy, this.radius / 2);
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