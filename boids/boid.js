/*
Flock
    * constructor(size) - Initializes a new `Flock` instance with a specified number of boids. Arguments: `size` (number): The number of boids to generate in the flock. Returns: A new instance of `Flock`.
    * genBoid(x, y) - Generates a new boid at the specified coordinates and adds it to the flock. Arguments: `x` (number): The x-coordinate for the new boid. `y` (number): The y-coordinate for the new boid. Returns: void.
    * run(foodList) - Runs the simulation for the flock, making each boid perform its actions and rendering them. Arguments: `foodList` (object): The list of food items available for the boids. Returns: void.

Boid
    * constructor(x, y) - Initializes a new `Boid` instance at the specified coordinates. Arguments: `x` (number): The x-coordinate for the new boid. `y` (number): The y-coordinate for the new boid. Returns: A new instance of `Boid`.
    * update(flock) - Updates the boid's position, handles wrapping around the screen, and checks for shrinking and dividing. Arguments: `flock` (object): The flock object containing all boids. Returns: boolean (true if the boid is still active, false if it should be removed).
    * wrap() - Wraps the boid around the screen edges if it goes out of bounds and changes its color. Arguments: None. Returns: void.
    * draw() - Draws the boid on the canvas. Arguments: None. Returns: void.
    * flock(flock) - Applies flocking behavior to the boid by calculating alignment, cohesion, and separation forces. Arguments: `flock` (object): The flock object containing all boids. Returns: void.
    * align(flock) - Calculates the alignment force for the boid. Arguments: `flock` (object): The flock object containing all boids. Returns: p5.Vector (alignment force).
    * cohere(flock) - Calculates the cohesion force for the boid. Arguments: `flock` (object): The flock object containing all boids. Returns: p5.Vector (cohesion force).
    * separate(flock) - Calculates the separation force for the boid. Arguments: `flock` (object): The flock object containing all boids. Returns: p5.Vector (separation force).
    * colorify(flock) - Adjusts the color of the boid based on the average color of nearby boids. Arguments: `flock` (object): The flock object containing all boids. Returns: void.
    * avoidObjects(objects) - Calculates the avoidance force to keep the boid away from objects. Arguments: `objects` (array): Array of objects to avoid. Returns: p5.Vector (avoidance force).
    * eat(foodList) - Consumes food if it is within range and grows the boid. Arguments: `foodList` (array): The list of food items. Returns: void.
    * forage(foodList) - Seeks the nearest food within the perception radius and steers towards it. Arguments: `foodList` (array): The list of food items. Returns: void.
*/

class Flock {
    constructor(size) {
        this.list = [];
        for (let i = 0; i < size; i++) {
            this.genBoid(random(width), random(height));
        }
    }

    genBoid(x, y) {
        this.list.push(new Boid(x, y));
    }

    run(foodList) {
        for (let boid of this.list) {
            boid.eat(foodList.list);
            boid.forage(foodList.list);
            boid.flock(this.list);
            if (boid.update(this)) {
                boid.draw();
            }
          }
    }
}

class Boid {
    /* Utils */
    constructor(x, y) {
        // physics
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D().setMag(random(.5, 1));
        this.acceleration = createVector();
        
        // attributes
        this.color = createVector(random(255), random(255), random(255));
        this.size = 15; // proxy for mass
        this.maxForce = .05;
        this.maxSpeed = 4;
        this.perceptionRadius = 80;
        
        // shrink functionality. Set shrinkRate = 0 for no decay.
        /* the amount that a boid shrinks each time step. If a boid shrinks smaller than minSize, it dies. */
        this.shrinkRate = random(0.005, 0.01);
        this.minSize = 5;

        // division. Upon exceeding maxSize, the boid divides into two boids of size 2/3 the original
        this.maxSize = 20;

        // biases
        this.alignmentBias = 1;
        this.cohesionBias = 1;
        this.seperationBias = 1;
        this.forageBias = 1;
    }

    update(flock) {
        this.position.add(this.velocity);
        this.wrap();
        this.velocity.add(this.acceleration).limit(this.maxSpeed);
        this.acceleration.mult(0);

        // shrink & remove if necessary
        this.size -= this.shrinkRate;
        if (this.size < this.minSize) {
            let idx = flock.list.indexOf(this);
            if (idx != -1) {
                flock.list.splice(idx, 1);
                return false;
            }
        }
        
        // divide if necessary
        if (this.size > this.maxSize) {
            this.size = this.size * 2/3;
            flock.genBoid(this.position.x, this.position.y); //TODO: give generate boid same coords
        }


        return true;
    }

    wrap() {
        let wrap = false;

        if (this.position.x > width) {
            this.position.x = 0;
            wrap = true;
        }
        else if (this.position.x < 0) {
            this.position.x = width;
            wrap = true;
        }

        if (this.position.y > height) {
            this.position.y = 0;
            wrap = true;
        }
        else if (this.position.y < 0) {
            this.position.y = height;
            wrap = true;
        }

        if (wrap) {
            this.color = createVector(random(255), random(255), random(255));
        }
    }

    draw() {
        strokeWeight(this.size / 12);
        stroke(this.color.x, this.color.y, this.color.z);
        fill(this.color.x, this.color.y, this.color.z, 100)
        let angle = this.velocity.heading() + radians(90);

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        triangle(-this.size / 3, this.size / 2, // left
                 this.size / 3, this.size / 2,  // right
                 0, -this.size / 2)             // front
        pop();
    }
  
    flock(flock) {
        this.acceleration.add(this.align(flock).mult(this.alignmentBias));
        this.acceleration.add(this.cohere(flock).mult(this.cohesionBias));
        this.acceleration.add(this.separate(flock).mult(this.seperationBias));
        this.colorify(flock);
    }

    /* Behaviors */
    align(flock) {
        // get average velocity of boids in perception radius
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            if ((this.position.dist(other.position) < this.perceptionRadius) && (other != this)) {
                steer.add(other.velocity);
                i++;
            }
        }

        if (i != 0) {
            steer.div(i);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    cohere(flock) {
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            if ((this.position.dist(other.position) < this.perceptionRadius) && (other != this)) {
                steer.add(other.position);
                i++;
            }
        }
        if (i != 0) {
            steer.div(i);
            steer.sub(this.position);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    separate(flock) {
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            let dist = this.position.dist(other.position);
            if ((dist < this.perceptionRadius) && (other != this)) {
                let diff = p5.Vector.sub(this.position, other.position);
                // catch just divided case
                if (dist != 0) {
                    diff.div(dist);
                    steer.add(diff);
                }
                i++;
            }
        }
        
        if (i != 0 && steer.mag != 0) {
            steer.div(i);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    colorify(flock) {
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            let dist = this.position.dist(other.position);
            if ((dist < this.perceptionRadius) && (other != this)) {
                steer.add(other.color);
                i++;
            }
        }
        
        if (i != 0) {
            steer.div(i);
            steer.sub(this.color);
            steer.limit(this.maxForce * 25);
        }
        this.color.add(steer.mult(this.forageBias));
    }

    avoidObjects(objects) {
        let steer = createVector();
        let i = 0;

        for (let object of objects) {
            let dist = this.position.dist(object.position);
            if ((dist < this.perceptionRadius) && (object != this)) {
                let diff = p5.Vector.sub(this.position, object.position);
                diff.div(dist);
                steer.add(diff);
                i++;
            }
        }
        
        if (i != 0) {
            steer.div(i);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

/*     // deprecated: update for consume animation.
    eat(foodList) {
        for (let food of foodList) {
            let dist = this.position.dist(food.position);
            
            // food consumed
            if (food.consumed == false && dist < food.size) {
                //remove food from list
                let idx = foodList.indexOf(food);
                if (idx != -1) {
                foodList.splice(idx, 1);
                
                // grow boid
                this.size += food.size / 2;
                console.log("boid ate, now size: ", this.size);
                }
            }
        }
    } */

    // deprecated: update for consume animation.
    eat(foodList) {
        for (let food of foodList) {
            let dist = this.position.dist(food.position);
            
            // food consumed
            if (food.consumed == false && dist < food.size) {
                //remove food from list
                food.consumed = true;
                
                // grow boid
                this.size += food.size / 2;
                //console.log("boid ate, now size: ", this.size);
            }
        }
    }

    forage(foodList) {
        let nearestFood = null;
        let nearestDist = Infinity;
        
        for (let food of foodList) {
            let dist = this.position.dist(food.position);
            
            // seek food: determine the nearest food and steer towards it
            if (dist < this.perceptionRadius && dist < nearestDist) {
                nearestDist = dist;
                nearestFood = food.position.copy();
            }
        }
        
        if (nearestFood != null) {
            let desired = p5.Vector.sub(nearestFood, this.position);
            desired.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            this.acceleration.add(steer);
        }
    }
}