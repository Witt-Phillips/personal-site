
class FoodList {
    constructor(size, tick) {
        this.list = [];
        this.tick = tick; // food respawn rate
        for (let i = 0; i < size; i++) {
            this.list.push(new Food());
        }
    }

    run() {
        //draw
        for (let food of this.list) {
            food.draw();
        }
    }

    add() {
        this.list.push(new Food());
    }
}

class Food {
    constructor() {
        this.position = createVector(random(width - (width / 20)), random(height - (width / 20)));
        this.consumed = false;
        this.size = 15;
        this.color = createVector(150, 100, 255);
    }

    draw() {
        strokeWeight(this.size / 12);
        stroke(this.color.x, this.color.y, this.color.z)
        fill(this.color.x, this.color.y, this.color.z, 100)
        //point(this.position.x, this.position.y);
        circle(this.position.x, this.position.y, this.size);
    }
}