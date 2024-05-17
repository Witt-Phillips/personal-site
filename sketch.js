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
  
  if (flock.list.length === 0) {
    fill(255);
    textSize(16);
    textFont('monospace');
    textAlign(CENTER, CENTER);

    // ASCII Art Title
    text(" _____   __ _ _   _   _        ___       _     _     ", width / 2, height / 2 - 220);
    text("|___ /  / /(_) |_| |_| | ___  / __\\ ___ (_) __| |___ ", width / 2, height / 2 - 200);
    text("  |_ \\ / / | | __| __| |/ _ \\/__\\/// _ \\| |/ _` / __|", width / 2, height / 2 - 180);
    text(" ___) / /__| | |_| |_| |  __/ \\/  \\ (_) | | (_| \\__ \\", width / 2, height / 2 - 160);
    text("|____/\\____/_|\\__|\\__|_|\\___\\_____/\\___/|_|\\__,_|___/", width / 2, height / 2 - 140);

    // Instructions
    textSize(24);
    text("----------------------------------------", width / 2, height / 2 - 90);
    text("| * click -> boid                      |", width / 2, height / 2 - 60);
    text("| * shift + click -> predator          |", width / 2, height / 2 - 30);
    text("| * space + click -> playable boid     |", width / 2, height / 2);
    text("| | arrow key controls!                |", width / 2, height / 2 + 30);
    text("| ~ shoutout to the boid day 1 julia ~ |", width / 2, height / 2 + 60);
    text("----------------------------------------", width / 2, height / 2 + 90);

  }
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