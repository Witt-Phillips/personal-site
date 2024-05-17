/* 
FoodList
    * constructor(size, tick) - Initializes a new `FoodList` instance with a specified number of food items and a respawn rate. Arguments: `size` (number): The number of food items to generate in the list. `tick` (number): The food respawn rate. Returns: A new instance of `FoodList`.
    * run() - Updates each food item, handling its collapse, expansion, drawing, and removal if consumed. Arguments: None. Returns: void.
    * add() - Adds a new food item to the list. Arguments: None. Returns: void.
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