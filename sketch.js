let flock;
let foodList;
let sliders = [];
let foodSpawnInterval;
let previousTick; // tick of foodRate at previous draw() loop

function setup() {
  createCanvas(windowWidth, windowHeight);

  // sliders
  sliders.push(new Slider(sliders, "alignment", "-> travel in same direction as nearby boids"));
  sliders.push(new Slider(sliders, "cohesion", "-> gravitate towards nearby boids"));
  sliders.push(new Slider(sliders, "separation", "-> don't collide with other boids"));
  sliders.push(new Slider(sliders, "flee", "-> avoid predators (if prey)", 0, 6, 3));
  sliders.push(new Slider(sliders, "hunt", "-> find prey (if predator)")); 
  sliders.push(new Slider(sliders, "eat", "-> seek food (if prey)", 0, 4, 2)); 
  sliders.push(new Slider(sliders, "foodRate", "-> control how quickly food spawns", 100, 1100, 600)); // TODO: make not inverted (now more is slower)

    // init & respawn food
    foodList = new FoodList(10, sliders[6].slider.value());
    setFoodSpawnInterval(foodList.tick);
    previousTick = foodList.tick;
  
    // init flock
    flock = new Flock(0, 0);
}

function draw() {
  //setup
  background(50);

  //update food spawn tick if changed
  let currentTick = sliders[6].slider.value();
  if (currentTick !== previousTick) {
    foodList.tick = currentTick;
    setFoodSpawnInterval(foodList.tick);
    previousTick = currentTick;
  }

  // run simulation
  flock.run(foodList,
            sliders[0].slider.value(),
            sliders[1].slider.value(),
            sliders[2].slider.value(),
            sliders[3].slider.value(),
            sliders[4].slider.value(),
            sliders[5].slider.value()
          );
  //update food
  foodList.run();

  // title slide & slider descriptions
  fill(255);
  textSize(16);
  textFont('monospace');
  if (flock.list.length === 0) {
    titleSlide();
    sliderTitle();
    sliders.forEach(slider => slider.displayDescription());
  }

  //slider titles
  sliders.forEach(slider => slider.displayLabel());
}

// control the rate at which food spawns
function setFoodSpawnInterval(tick) {
  if (foodSpawnInterval) {
    clearInterval(foodSpawnInterval);
  }
  foodSpawnInterval = setInterval(() => {
    foodList.add();
  }, tick);
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
  
  // update slider positions
  sliders.forEach((slider, idx) => slider.updatePosition(idx));
}

function titleSlide() {
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
    text("~ shoutout julia ~", width - 20, height - 30);
}

function sliderTitle() {
  let x = 50 + 40;
  let y;
  if (sliders.length == 0) {
    console.error("sliderTitle: found no sliders");
    return;
  } else {
    y = sliders[sliders.length - 1].pos.y - 20;
  }
  // slider explanation
  textAlign(LEFT, CENTER);
  text("------ weight boids' behaviors", x, y - 20);
  text("|", x, y - 10);
  text("v", x, y);
}