let flock;
let foodList;

function setup() {
  createCanvas(1500, 900);
  
  // init & respawn food
  foodList = new FoodList(10, 1000);
  setInterval(() => {
    foodList.add();
  }, foodList.tick);

  // init flock
  flock = new Flock(50);
}

function draw() {
  background(50);
  flock.run(foodList);
  foodList.run();
}