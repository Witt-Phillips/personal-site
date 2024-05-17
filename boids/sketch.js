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
  flock.run(foodList);
  foodList.run();
}


// click to generate boid. hold shift to generate predator.
function mousePressed() {
  if (keyIsDown(SHIFT)) {
    flock.genBoid(mouseX, mouseY, BoidType.PREDATOR);
  } 
  else if (keyIsDown(32)) {
    console.log("tried to make player");
    flock.genBoid(mouseX, mouseY, BoidType.PLAYER_PREDATOR);
  }
  else {
    flock.genBoid(mouseX, mouseY);
  }
}