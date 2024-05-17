let flock;
let foodList;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // init & respawn food
  foodList = new FoodList(10, 750);
  setInterval(() => {
    foodList.add();
  }, foodList.tick);

  // init flock
  flock = new Flock(0, 0);
}

function draw() {
  background(50);
  
  if (flock.list.length === 0) {
    fill(255);
    textSize(24); // Adjusting text size for better readability
    textAlign(CENTER, CENTER);
    textFont('monospace');
    text("------------- angrier boids ------------", width / 2, height / 2 - 90);
    text("| * click -> boid                      |", width / 2, height / 2 - 60);
    text("| * shift + click -> predator          |", width / 2, height / 2 - 30);
    text("| * space + click -> playable predator |", width / 2, height / 2);
    text("|   -> arrow key controls!             |", width / 2, height / 2 + 30);
    text("| ~ shoutout to the boid day 1 julia ~ |", width / 2, height / 2 + 60);
    text("----------------------------------------", width / 2, height / 2 + 90);

  }

  flock.run(foodList);
  foodList.run();
}


// click to generate boid. hold shift to generate predator. space to generate player.
function mousePressed() {
  if (keyIsDown(SHIFT)) {
    flock.genBoid(mouseX, mouseY, BoidType.PREDATOR);
  } 
  else if (keyIsDown(32)) {
    flock.genBoid(mouseX, mouseY, BoidType.PLAYER_PREDATOR);
  }
  else {
    flock.genBoid(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}