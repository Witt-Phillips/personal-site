/*
Boid
    * constructor(x, y, type) - Initializes a new `Boid` instance at the specified coordinates with a given type. Arguments: `x` (number): The x-coordinate for the new boid. `y` (number): The y-coordinate for the new boid. `type` (string): The type of the new boid. Returns: A new instance of `Boid`.
    * remove(flock) - Removes the boid from the flock. Arguments: `flock` (object): The flock object containing all boids. Returns: boolean (true if the boid was removed, false otherwise).
    * update(flock) - Updates the boid's position, handles wrapping around the screen, and checks for shrinking and dividing. Arguments: `flock` (object): The flock object containing all boids. Returns: boolean (true if the boid is still active, false if it should be removed).
    * wrap() - Wraps the boid around the screen edges if it goes out of bounds and changes its color. Arguments: None. Returns: void.
    * draw() - Draws the boid on the canvas. Arguments: None. Returns: void.
    * flock(flock, type) - Applies flocking behavior to the boid by calculating alignment, cohesion, and separation forces. Arguments: `flock` (object): The flock object containing all boids. `type` (string): The type of boids to consider for flocking behavior. Returns: void.
    * align(flock, type) - Calculates the alignment force for the boid. Arguments: `flock` (object): The flock object containing all boids. `type` (string): The type of boids to consider for alignment behavior. Returns: p5.Vector (alignment force).
    * cohere(flock, type) - Calculates the cohesion force for the boid. Arguments: `flock` (object): The flock object containing all boids. `type` (string): The type of boids to consider for cohesion behavior. Returns: p5.Vector (cohesion force).
    * separate(flock, type) - Calculates the separation force for the boid. Arguments: `flock` (object): The flock object containing all boids. `type` (string): The type of boids to consider for separation behavior. Returns: p5.Vector (separation force).
    * colorify(flock) - Adjusts the color of the boid based on the average color of nearby boids. Arguments: `flock` (object): The flock object containing all boids. Returns: void.
    * eat(foodList) - Consumes food if it is within range and grows the boid. Arguments: `foodList` (array): The list of food items. Returns: void.
    * forage(foodList) - Seeks the nearest food within the perception radius and steers towards it. Arguments: `foodList` (array): The list of food items. Returns: void.
    * hunt(flock) - Seeks the nearest prey within the perception radius and steers towards it. If the prey is within consuming range, the predator grows and the prey is removed from the flock. Arguments: `flock` (object): The flock object containing all boids. Returns: void.
    * flee(flock) - Calculates the fleeing force to avoid predators. Arguments: `flock` (object): The flock object containing all boids. Returns: void.
    * handleInput() - Handles user input to control the player boid's movement based on arrow key inputs. Arguments: None. Returns: void.
    * munchBoid(flock) - Consumes the nearest boid within consuming range and grows the boid. Arguments: `flock` (object): The flock object containing all boids. Returns: void.
*/

const BoidType = {
    PREY: 'prey',
    PREDATOR: 'predator',
    PLAYER_PREDATOR: 'player_predator',
};

class Boid {
    /* Utils */
    constructor(x, y, type) {
        // physics
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D().setMag(random(.5, 1));
        this.acceleration = createVector();
        
        // attributes
        this.type = type;
        this.color = createVector(random(255), random(255), random(255));
        if (this.type == BoidType.PREDATOR) {
            this.color = createVector(230, 0, 0);
        }
        this.size = 15; // proxy for mass
        if (this.type == BoidType.PREDATOR) {
            this.size = 40;
        }
        this.maxForce = .05;
        this.maxSpeed = 4;
        if (this.type == BoidType.PREDATOR) {
            this.maxSpeed = 3.8;
        }

        this.perceptionRadius = 80;
        if (this.type == BoidType.PREDATOR) {
            this.perceptionRadius = 120;
        }
        
        // shrink functionality. Set shrinkRate = 0 for no decay.
        /* the amount that a boid shrinks each time step. If a boid shrinks smaller than minSize, it dies. */
        this.shrinkRate = random(0.005, 0.01);
        if (this.type == BoidType.PREDATOR) {
            this.shrinkRate = random(0.03, 0.05);
        }
        this.minSize = 8;

        // division. Upon exceeding maxSize, the boid divides into two boids of size 2/3 the original
        this.maxSize = 20;
        if (this.type == BoidType.PREDATOR) {
            this.maxSize = 80;
        }
        if (this.type == BoidType.PLAYER_PREDATOR) {
            this.maxSize = 30;
        }

        // biases
        this.alignmentBias = 1;
        this.cohesionBias = 1;
        this.seperationBias = 1;
        this.forageBias = 1;
        this.huntBias = 1;
        this.fleeBias = 2;
    }

    remove(flock) {
        let idx = flock.list.indexOf(this);
            if (idx != -1) {
                flock.list.splice(idx, 1);
                return true;
            }
        return false;
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
            flock.genBoid(this.position.x + random(-10, 10), this.position.y + random(-10, 10), this.type); //TODO: give generate boid same coords
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

        if (wrap && this.type != BoidType.PREDATOR && this.type != BoidType.PLAYER_PREDATOR) {
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
  
    flock(flock, type = BoidType.PREY) {
        this.acceleration.add(this.align(flock, type).mult(this.alignmentBias));
        this.acceleration.add(this.cohere(flock, type).mult(this.cohesionBias));
        this.acceleration.add(this.separate(flock, type).mult(this.seperationBias));
    }

    /* Behaviors */
    align(flock, type = BoidType.PREY) {
        // get average velocity of boids in perception radius
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            if (other.type != type) {
                continue;
            }

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

    cohere(flock, type = BoidType.PREY) {
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            if (other.type != type) {
                continue;
            }

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

    separate(flock, type) {
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            if (other.type != type) {
                continue;
            }
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
    
    hunt(flock) {
        let nearestBoid = null;
        let nearestDist = Infinity;
        
        for (let boid of flock) {
            if (boid.type == BoidType.PREDATOR || boid.type == BoidType.PLAYER_PREDATOR || this == boid) {
                continue;
            }
            let dist = this.position.dist(boid.position);
            
            // consume boid & return
            if (dist < this.size / 2) {
                this.size += boid.size;
                //boid.remove(flock);
                let idx = flock.indexOf(boid);
                if (idx != -1) {
                    flock.splice(idx, 1);
                }
                return;
            }
            
            // seek food: determine the nearest food and steer towards it
            if (boid != this && dist < this.perceptionRadius && dist < nearestDist) {
                nearestDist = dist;
                nearestBoid = boid.position.copy();
            }
        }
        
        let desired;
        if (nearestBoid != null) {
            desired = p5.Vector.sub(nearestBoid, this.position);
        } else {
            desired = createVector(random(1), random(1));
        }

        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.acceleration.add(steer);
    }

    flee(flock) {
        let steer = createVector();
        let i = 0;

        for (let other of flock) {
            if (other.type == BoidType.PREY) {
                continue;
            }
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
        this.acceleration.add(steer.mult(this.fleeBias));
    }

    handleInput() {
        let steer = createVector();

        if (keyIsDown(LEFT_ARROW)) {
            steer.add(createVector(-1, 0));
        }
        if (keyIsDown(RIGHT_ARROW)) {
            steer.add(createVector(1, 0));
        }
        if (keyIsDown(UP_ARROW)) {
            steer.add(createVector(0, -1));
        }
        if (keyIsDown(DOWN_ARROW)) {
            steer.add(createVector(0, 1));
        }

        if (steer.mag > 0) {
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        this.acceleration.add(steer);
    }

    munchBoid(flock) {
        for (let boid of flock) {
            if (boid.type == BoidType.PREDATOR || boid.type == BoidType.PLAYER_PREDATOR || this == boid) {
                continue;
            }
            let dist = this.position.dist(boid.position);
            
            // consume boid & return
            if (dist < this.size / 2) {
                this.size += boid.size;
                //boid.remove(flock);
                let idx = flock.indexOf(boid);
                if (idx != -1) {
                    flock.splice(idx, 1);
                }
                return;
            }
        }
    }
}