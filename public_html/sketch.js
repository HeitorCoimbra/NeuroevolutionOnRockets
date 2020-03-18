Rockets = []
matingPool = []
graveyard = []
let popSize = 500
let startX = 50
let startY = 580
let endX = 550
let endY = 100
let raySize = 120

class Wall {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }
}

class Ray {
  constructor(rocket, v) {
    this.x1 = rocket.position[0]
    this.y1 = rocket.position[1]
    this.ov = v
    this.v = v
    this.intercepts = []
  }
}

walls = [
new Wall(107, 601, 110, 117),
new Wall(428, 120, 521, 119), 
new Wall(521, 119, 520, 159), 
new Wall(520, 159, 329, 150), 
new Wall(329, 150, 331, 289), 
new Wall(331, 289, 510, 288), 
new Wall(510, 288, 507, 338), 
new Wall(507, 338, 328, 338), 
new Wall(328, 338, 328, 469), 
new Wall(328, 469, 434, 469), 
new Wall(434, 469, 458, 441), 
new Wall(458, 441, 490, 470), 
new Wall(490, 470, 491, 507), 
new Wall(491, 507, 325, 502), 
new Wall(325, 502, 325, 602), 
new Wall(325, 602, 600, 602), 
new Wall(600, 602, 601, 414), 
new Wall(601, 414, 411, 398),
new Wall(411, 398, 599, 412), 
new Wall(599, 412, 601, 216), 
new Wall(601, 216, 422, 216), 
new Wall(422, 219, 599, 216), 
new Wall(599, 216, 599, 31), 
new Wall(598, 30, 460, 30), 
new Wall(0, 0, 0, 600),
new Wall(600, 0, 600, 600),
new Wall(0, 600, 600, 600),
new Wall(0, 0, 209, 85), 
new Wall(209, 85, 298, 28), 
new Wall(298, 28, 388, 83), 
new Wall(388, 83, 465, 27), 
new Wall(471, 90, 387, 151), 
new Wall(387, 151, 299, 100), 
new Wall(299, 100, 206, 151),
new Wall(206, 151, 110, 117) ]

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER)
  for (let i = 0; i < popSize; i++)
    Rockets.push(new Rocket())
}

function draw() {
  background(215)
  circle(endX, endY, 10)
  calculateMovement()
  collisionCheck()
  updatePositions()
  updateRays()
  updateFitness()
  updateSensors()
  show()
  if (Rockets.length < 15)
    updateGen()
  if (mouseIsPressed)
    walls.push(new Wall(pmouseX, pmouseY, mouseX, mouseY))
}

function keyTyped() {
  if (keyCode == 13)
    updateGen()
}

function calculateMovement() {
  noStroke()
  for (let rocket of Rockets) {
    let output = rocket.brain.predict(rocket.sensors)
    if (output[0] == 1) {
      rocket.velocity = rotation(rocket.velocity, 10)
    }
    if (output[1] == 1)
      rocket.velocity = rotation(rocket.velocity, -10)
  }
}

function collisionCheck() {
  for (let rocket of Rockets) {
    if (wallCollision(rocket)) {
      rocket.die()
    }
  }
}

function wallCollision(rocket) {
  let vertices = [
    [rocket.position[0] - (rocket.size / 2), rocket.position[1] - (rocket.size / 2)],
    [rocket.position[0] + (rocket.size / 2), rocket.position[1] - (rocket.size / 2)],
    [rocket.position[0] + (rocket.size / 2), rocket.position[1] + (rocket.size / 2)],
    [rocket.position[0] - (rocket.size / 2), rocket.position[1] + (rocket.size / 2)]
  ]
  for (let w of walls) {
    for (let i = 0; i < 4; i++) {
      let j = (i + 1) % 4
      if (lineLine(vertices[i][0], vertices[i][1], vertices[j][0], vertices[j][1], w.x1, w.y1, w.x2, w.y2)) return true
    }
  }
  return false
}

function updatePositions() {
  for (let rocket of Rockets) {
    rocket.position = vectorSum(rocket.position, vectorScalar(rocket.velocity, 4))
  }
}

function updateRays() {
  for (let rocket of Rockets) {
    rocket.rays = []
    let v = rotation(vectorScalar(rocket.velocity, raySize), 270)
    for (let i = 0; i < 180; i = i + 7.5) {
      v = rotation(v, 7.5)
      let ray = new Ray(rocket, v)
      rocket.rays.push(ray)
    }
  }
}

function updateSensors() {
  for (let rocket of Rockets) {
    rocket.sensors = []
    for (let r of rocket.rays) {
      r.intercepts = []
      let collides = false
      for (let w of walls) {
        let intersection = lineLineIntersection(r.x1, r.y1, r.x1 + r.ov[0], r.y1 + r.ov[1], w.x1, w.y1, w.x2, w.y2)
        if (intersection != false)
          r.intercepts.push(vectorNorm(vectorDiff(intersection, rocket.position)))
      }
      if (r.intercepts.length > 0) {
        let u = Math.min.apply(null, (r.intercepts))
        for (let i of r.intercepts) {
          r.v = vectorScalar(r.v, u / vectorNorm(r.v))
        }
      } else {
        r.v = r.ov
      }
      rocket.sensors.push(vectorNorm(r.v))
    }
  }
}
function updateGen() {
  matingPool = Rockets.sort(compareFitness).slice(0, 15)
  matingPool = generateWeighedList(matingPool)
  Rockets = []
  for (let i = 0; i < popSize; i++) {
    let rocket = new Rocket(random(matingPool), random(matingPool))
    Rockets.push(rocket)
  }
}

function updateFitness() {
  for (let rocket of Rockets) {
    rocket.fitness = rocket.getFitness()
    if(rocket.fitness>600){
      endY = 300;
    }
  }
}

function compareFitness(a, b) {
  if (a.fitness > b.fitness) {
    return 1;
  }
  if (a.fitness < b.fitness)
    return -1;
  return 0;
}

function generateWeighedList(list) {
  var weighed_list = [];

  // Loop over weights
  for (var i = 0; i < list.length; i++) {
    var multiples = list[i].fitness;

    // Loop over the list of items
    for (var j = 0; j < multiples; j++) {
      weighed_list.push(list[i]);
    }
  }
  return weighed_list;
}

function show() {
  if (Rockets.length < 100) drawRays()
  drawWalls()
  drawRocket()
  drawInfo()
}

function drawRocket() {
  stroke(90)
  strokeWeight(2)
  fill(110)
  for (let rocket of Rockets) {
    if (rocket.fitness > 200)
      fill(0, 255, 0)
    else if (rocket.fitness < 50)
      fill(255, 0, 0)
    else
      fill(110)
    rect(rocket.position[0], rocket.position[1], rocket.size, rocket.size)

  }
}

function drawWalls() {
  for (let w of walls) {
    fill(110)
    stroke(60)
    strokeWeight(3)
    line(w.x1, w.y1, w.x2, w.y2)
  }
}

function drawRays() {
  strokeWeight(0.2)
  for (let rocket of Rockets) {
    for (let r of rocket.rays) {
      stroke(0, 125, 0)
      if (vectorNorm(r.v) < raySize)
        stroke(255, 50, 0)
      line(r.x1, r.y1, r.x1 + r.v[0], r.y1 + r.v[1])
    }
  }
}

function drawInfo() {
  fill(255, 0, 0)
  textSize(32)
  text(Rockets.length, 500, 60)
  textSize(12)
  strokeWeight(3)
  fill(255)
  for (let rocket of Rockets)
    text(Math.round(rocket.fitness), rocket.position[0] + 50, rocket.position[1] - 50)
}