class Rocket {
  constructor(father, mother) {
    this.position = [startX, startY]
    this.velocity = [0, -1]
    this.size = 30
    this.rays = []
    this.lifespan = 0
    let v = vectorScalar(this.velocity, 150)
    for (let i = 0; i < 360; i = i + 15) {
      this.v = rotation(v, 15)
      let ray = new Ray(this, v)
      this.rays.push(ray)
    }
    this.fitness = 0
    this.sensors = []
    if (father === undefined || mother === undefined)
      this.brain = new NeuralNetwork(24, 8, 2)
    else {
      this.brain = new NeuralNetwork(24, 8, 2, father.brain, mother.brain)
    }
  }

  getFitness() {
    return Math.max(vectorNorm(vectorDiff(this.position, [startX, startY])) - vectorNorm(vectorDiff(this.position, [endX, endY])), this.fitness) 
  }
  die() {
    Rockets.splice(Rockets.indexOf(this), 1)
  }
}
