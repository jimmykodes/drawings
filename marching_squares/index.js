const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = window.innerWidth
const height = window.innerHeight
const dpr = window.devicePixelRatio

const numPoints = 100

canvas.width = width * dpr
canvas.height = height * dpr
canvas.style.height = `${height}px`
canvas.style.width = `${width}px`
ctx.scale(dpr, dpr)
ctx.strokeStyle = 'rgb(0,161,255)'

let delta = Math.round(Math.min(width, height) / numPoints)
const squareSide = delta * .25
const numRows = Math.round(height / delta)
const numCols = Math.round(width / delta)

let points = new Array(numRows)
for (let row = 0; row < numRows; row++) {
    points[row] = new Array(numCols)
}

let timeScale = 1500

function changeTime(newVal) {
    if (newVal === timeScale) {
        return
    }
    timeScale = 7000 - newVal
}

noise.seed(Math.random())

function draw() {
    ctx.clearRect(0, 0, width, height)
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            points[row][col] = noise.simplex3(row / 15, col / 15, new Date().getTime() / timeScale) > 0 ? 1 : 0
        }
    }

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            ctx.save()
            if (points[row][col]) {
                ctx.fillStyle = 'rgb(0,161,255)'
            } else {
                ctx.fillStyle = 'rgba(0,167,255,0.25)'
            }
            ctx.translate(delta * col, delta * row)
            ctx.fillRect(0, 0, squareSide, squareSide)
            ctx.restore()
            let pv = pointValue(row, col)
            let box = key[pv]
            box.draw(ctx, delta * col, delta * row, delta)
        }
    }
    window.requestAnimationFrame(draw)
}

draw()

function pointValue(row, col) {
    if (row === numRows - 1 || col === numCols - 1) {
        // in the last row/column just bail
        return 0
    }
    return points[row][col] << 3 | points[row][col + 1] << 2 | points[row + 1][col + 1] << 1 | points[row + 1][col]
}