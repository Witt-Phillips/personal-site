/* 
Flock
    * constructor(preyNum, predatorNum) - Initializes a new `Flock` instance with a specified number of prey and predator boids. Arguments: `preyNum` (number): The number of prey boids to generate in the flock. `predatorNum` (number): The number of predator boids to generate in the flock. Returns: A new instance of `Flock`.
    * genBoid(x, y, type) - Generates a new boid at the specified coordinates and adds it to the flock. Arguments: `x` (number): The x-coordinate for the new boid. `y` (number): The y-coordinate for the new boid. `type` (string): The type of the new boid. Returns: void.
    * run(foodList) - Runs the simulation for the flock, making each boid perform its actions and rendering them. Arguments: `foodList` (object): The list of food items available for the boids. Returns: void.
*/

class Flock {
    constructor(preyNum = 10, predatorNum = 0) {
        this.list = [];
        for (let i = 0; i < preyNum; i++) {
            this.genBoid(random(width), random(height));
        }
        for (let i = 0; i < predatorNum; i++) {
            this.genBoid(random(width), random(height), BoidType.PREDATOR);
        }
    }

    genBoid(x, y, type = BoidType.PREY) {
        this.list.push(new Boid(x, y, type));
    }

    run(foodList, aliSli, cohSli, sepSli, fleeSli, huntSli, eatSli) {
        for (let boid of this.list) {
            boid.alignmentBias = aliSli;
            boid.cohesionBias = cohSli;
            boid.separationBias = sepSli;
            boid.fleeBias = fleeSli;
            boid.huntBias = huntSli;
            boid.forageBias = eatSli;
            
            switch (boid.type) {
                case BoidType.PREY:
                    boid.eat(foodList.list);
                    boid.forage(foodList.list);
                    boid.flock(this.list);
                    boid.flee(this.list);
                    boid.colorify(this.list);
                    break;
                case BoidType.PREDATOR:
                    boid.hunt(this.list);
                    break;
                case BoidType.PLAYER_PREDATOR:
                    boid.flock(this.list, BoidType.PLAYER_PREDATOR);
                    boid.handleInput();
                    boid.munchBoid(this.list);
                    boid.colorify(this.list);
                    break;
                default:
                    console.error("invalid type reached in boid.run()");
                    break;
            }
            
            if (boid.update(this)) {
                boid.draw();
            }
          }
    }
}