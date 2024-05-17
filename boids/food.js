/*
Food
    * constructor() - Initializes a new `Food` instance with random position and default properties. Arguments: None. Returns: A new instance of `Food`.
    * draw() - Draws the food item on the canvas with current size and transparency. Arguments: None. Returns: void.
*/

class Food {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.size = 15;
        this.minSize = 2;
        this.currSize = this.minSize;
        this.color = createVector(150, 100, 255);
        this.consumed = false;
    }

    draw() {
        strokeWeight(this.currSize / 12);
        stroke(this.color.x, this.color.y, this.color.z, this.transparency);
        fill(this.color.x, this.color.y, this.color.z, min(this.transparency, 100));
        //point(this.position.x, this.position.y);
        circle(this.position.x, this.position.y, this.currSize);
    }
}