function vectorSum(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

function vectorDiff(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]]
}

function vectorScalar(v, n) {
  return [v[0] * n, v[1] * n]
}

function vectorNorm(v) {
  return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]))
}
function limitNorm(v, limit) {
  let vNorm = vectorNorm(v)
  if (vNorm > limit) {
    v = vectorScalar(v, limit / vNorm)
  }
  return v
}

function rotation(vector, angle){
  return[vector[0]*Math.cos(angle*PI/180) - vector[1]*Math.sin(angle*PI/180), vector[0]*Math.sin(angle*PI/180) + vector[1]*Math.cos(angle*PI/180)]
}

function lineLine(x1,  y1,  x2,  y2,  x3,  y3,  x4,  y4) {

  // calculate the distance to intersection point
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
    return true;
  return false;
}
function lineLineIntersection(x1,  y1,  x2,  y2,  x3,  y3,  x4,  y4) {

  // calculate the distance to intersection point
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1){
    let intersectionX = x1 + (uA * (x2-x1));
    let intersectionY = y1 + (uA * (y2-y1));
    return [intersectionX, intersectionY];
  }
  else return false;
}