const flock = [];

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < 50; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(50);

  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.show();
  }

}
