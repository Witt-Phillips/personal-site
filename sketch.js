let flock;
let foodList;
let aliSliPos;
let cohSliPos;
let sepSliPos;


function setup() {
  createCanvas(windowWidth, windowHeight);

  // init & respawn food
  foodList = new FoodList(10, 750);
  setInterval(() => {
    foodList.add();
  }, foodList.tick);

  // init flock
  flock = new Flock(0, 0);

  // sliders
  aliSliPos = createVector(50, height - 110)
  cohSliPos = createVector(50, height - 80);
  sepSliPos = createVector(50, height - 50);

  alignmentSlider = createSlider(0, 2, 1, 0.05)
                    .addClass('mySliders')
                    .position(aliSliPos.x, aliSliPos.y)
                    .size(80);
  cohesionSlider = createSlider(0, 2, 1, 0.05)
                    .addClass('mySliders')
                    .position(cohSliPos.x, cohSliPos.y)
                    .size(80);
  separationSlider = createSlider(0, 2, 1, 0.05)
                    .addClass('mySliders')
                    .position(sepSliPos.x, sepSliPos.y)
                    .size(80);
}

function draw() {
  background(50);
  // update slider positions
  aliSliPos = createVector(50, height - 110)
  cohSliPos = createVector(50, height - 80);
  sepSliPos = createVector(50, height - 50);
  alignmentSlider.position(aliSliPos.x, aliSliPos.y);
  cohesionSlider.position(cohSliPos.x, cohSliPos.y);
  separationSlider.position(sepSliPos.x, sepSliPos.y);

  flock.run(foodList,
            alignmentSlider.value(),
            cohesionSlider.value(),
            separationSlider.value());
  foodList.run();

  fill(255);
  textSize(16);
  textFont('monospace');

  if (flock.list.length === 0) {
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
    text("| | arrow key controls                 |", width / 2, height / 2 + 30);
    text("| | monch other boids, grow your flock |", width / 2, height / 2 + 60);
    text("----------------------------------------", width / 2, height / 2 + 90);

    textSize(14);

    // shoutout && credit
    textAlign(RIGHT, CENTER);
    text("~ shoutout to the boid day 1 julia ~", width - 20, height - 30);

    // slider explanation
    textAlign(LEFT, CENTER);
    text("-------------------- weight (prey) boids' behaviors", 90, height - 150);
    text("|", 87, height - 140);
    text("v", 87, height - 130);

    //slider labels
    text("-> travel in same direction as nearby boids", aliSliPos.x + 190, aliSliPos.y + 5);
    text("-> gravitate towards nearby boids", cohSliPos.x + 190, cohSliPos.y + 5);
    text("-> don't collide with other boids", sepSliPos.x + 190, sepSliPos.y + 5);



  }
  //slider titles
  textSize(14);
  textAlign(CENTER, CENTER);
  text("alignment ", aliSliPos.x + 140, aliSliPos.y + 5);
  text("cohesion  ", cohSliPos.x + 140, cohSliPos.y + 5);
  text("separation", sepSliPos.x + 140, sepSliPos.y + 5);
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