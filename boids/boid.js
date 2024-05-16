
// comment testing
class Boid {
    /* Utils */
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D().setMag(random(.5, 1));
        this.acceleration = createVector();
        this.color = createVector(random(255), random(255), random(255));
        this.size = 15;
        this.maxForce = .05;
        this.maxSpeed = 4;
        this.perceptionRadius = 50;
        this.alignmentBias = 1;
        this.cohesionBias = 1;
        this.seperationBias = 1.5;
    }

    update() {
        this.position.add(this.velocity);
        this.wrap();
        this.velocity.add(this.acceleration).limit(this.maxSpeed);
        this.acceleration.mult(0);
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

    show() {
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
        this.color.add(steer);
    }
}