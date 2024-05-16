/*
FoodList
    * constructor(size, tick) - Initializes a new `FoodList` instance with a specified number of food items and a respawn rate. Arguments: `size` (number): The number of food items to generate in the list. `tick` (number): The food respawn rate. Returns: A new instance of `FoodList`.
    * run() - Updates each food item, handling its collapse, expansion, drawing, and removal if consumed. Arguments: None. Returns: void.
    * add() - Adds a new food item to the list. Arguments: None. Returns: void.

Food
    * constructor() - Initializes a new `Food` instance with random position and default properties. Arguments: None. Returns: A new instance of `Food`.
    * draw() - Draws the food item on the canvas with current size and transparency. Arguments: None. Returns: void.
*/

class FoodList {
    constructor(size, tick) {
        this.list = [];
        this.tick = tick; // food respawn rate

        for (let i = 0; i < size; i++) {
            this.list.push(new Food());
        }
    }

    run() {
        for (let food of this.list) {
            // collapse out
            if (food.consumed == true) {
                food.currSize--;
            }
            // expand in
            else {
                food.currSize = min(food.currSize + 1, food.size);
            }

            food.draw();

            // remove if eaten
            if (food.currSize < food.minSize) {
                let idx = this.list.indexOf(food);
                    if (idx != -1) {
                    this.list.splice(idx, 1);
                }
            }
        }
    }

    add() {
        this.list.push(new Food());
    }
}

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