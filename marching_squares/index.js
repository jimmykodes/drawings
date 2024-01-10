const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = window.innerWidth
const height = window.innerHeight
const dpr = window.devicePixelRatio

let hue = 180
let numPoints = 70
let timeScale = 5000

canvas.width = width * dpr
canvas.height = height * dpr
canvas.style.height = `${height}px`
canvas.style.width = `${width}px`
ctx.scale(dpr, dpr)
ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`

let delta = Math.round(Math.min(width, height) / numPoints)
let squareSide = delta * .25
let numRows = Math.round(height / delta)
let numCols = Math.round(width / delta)

let points = new Array(numRows)
for (let row = 0; row < numRows; row++) {
  points[row] = new Array(numCols)
}

// noise.seed(new Date().getTime())
noise.seed(1)

function on(threshold) {
  return (v) => {
    return v > threshold ? 1 : 0
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height)
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      // points[row][col] = noise.simplex3(row / 15, col / 15, new Date().getTime() / timeScale)
      points[row][col] = noise.simplex3(row / 15, col / 15, 100)
    }
  }
  // for (let row = 0; row < numRows; row++) {
  //   for (let col = 0; col < numCols; col++) {
  //     ctx.save()
  //     ctx.fillStyle = `hsla(${hue},100%,50%,.25)`
  //     ctx.translate(delta * col, delta * row)
  //     ctx.fillRect(0, 0, squareSide, squareSide)
  //     ctx.restore()
  //   }
  // }
  // const levels = [-.75, -.5, -.25, 0, .25, .5, .75]
  // const levels = [-.66, -.33, 0, .33, .66]
  const levels = [-.5, 0, .5]
  for (const thresh of levels) {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const onFunc = on(thresh)
        // if (onFunc(points[row][col])) {
        //   ctx.save()
        //   ctx.fillStyle = `hsla(${hue},100%,50%,.2)`
        //   ctx.translate(delta * col, delta * row)
        //   ctx.fillRect(0, 0, squareSide, squareSide)
        //   ctx.restore()
        // }
        let pv = pointValue(row, col, onFunc)
        let box = key[pv]
        box.draw(ctx, delta * col + (delta / 7), delta * row + (delta / 7), delta)
      }
    }
  }
  // window.requestAnimationFrame(draw)
}

function pointValue(row, col, onFunc) {
  if (row === numRows - 1 || col === numCols - 1) {
    // in the last row/column just bail
    return 0
  }
  return onFunc(points[row][col]) << 3 | onFunc(points[row][col + 1]) << 2 | onFunc(points[row + 1][col + 1]) << 1 | onFunc(points[row + 1][col])
}

function getTime() {
  return timeScale
}

function getDensity() {
  return numPoints
}
function getHue() {
  return hue
}

function changeTime(newVal) {
  if (newVal === timeScale) {
    return
  }
  timeScale = 7000 - newVal
}

function changeDensity(newVal) {
  numPoints = newVal
  delta = Math.round(Math.min(width, height) / numPoints)
  squareSide = delta * .25
  numRows = Math.round(height / delta)
  numCols = Math.round(width / delta)
  for (let row = 0; row < numRows; row++) {
    points[row] = new Array(numCols)
  }
}
function changeHue(newVal) {
  console.log(newVal)
  hue = newVal
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
}

