class NeuralNetwork {
  constructor(i, h, o, fathernn, mothernn) {
    this.i = i
    this.h = h
    this.o = o
    let size = i * h + h + h * o + o
    if (fathernn === undefined)
      this.dna = randomizeDna(size)
    else{
      this.dna = mergeDna(fathernn.dna, mothernn.dna)}
    this.hiddenLayer = getHiddenLayer(this)
    this.outputLayer = getOutputLayer(this)
  }
  predict(input) {
    let X = input
    X.push(1)
    let a = multiply(this.hiddenLayer, X).map(reLU)
    a.push(1)
    let output = multiply(this.outputLayer, a).map(sigmoid)
    return output.map(Math.round)
  }
}

function randomizeDna(size) {
  let arr = []
  for (let i = 0; i < size; i++)
    arr.push((Math.random() * 2) - 1)
  return arr
}

function mergeDna(f, m) {
  let arr = []
  for (let i = 0; i < f.length; i++) {
    arr[i] = [f, m][Math.round(Math.random())][i]
    if(Math.random()<0.01)
      arr[i] = (Math.random()*2)-1
  }
  return arr
}

function mutate(dna) {
  let output = dna
  for (let i = 0; i < output.length; i++) {
    if (Math.random() < 0.11)
      output[i] = (Math.random() * 2) - 1
  }
  return output
}

function getHiddenLayer(NN) {
  output = []
  for (let i = 0; i < NN.h; i++) {
    let row = []
    for (let j = 0; j < NN.i + 1; j++)
      row.push(NN.dna[(NN.i + 1) * i + j])
    output.push(row)
  }
  return output
}

function getOutputLayer(NN) {
  output = []
  for (let i = 0; i < NN.o; i++) {
    let row = []
    for (let j = 0; j < NN.h + 1; j++)
      row.push(NN.dna[((NN.i + 1) * NN.h) + ((NN.h + 1) * i + j)])
    output.push(row)
  }
  return output
}

function multiply(m, v) {
  let output = []
  for (let i = 0; i < m.length; i++) {
    let scalar = 0
    for (let j = 0; j < m[0].length; j++)
      scalar += m[i][j] * v[j]
    output.push(scalar)
  }
  return output
}

function reLU(x) {
  return Math.max(0, x)
}

function sigmoid(t) {
  return 1 / (1 + Math.pow(Math.E, -t));
}