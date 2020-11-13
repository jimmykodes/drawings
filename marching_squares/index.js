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

let delta = Math.round(Math.min(width, height) / numPoints)

const squareSide = delta * .25

let points = new Array(numPoints)
for (let row = 0; row < numPoints; row++) {
    points[row] = new Array(numPoints)
}


noise.seed(Math.random())

function draw() {
    ctx.clearRect(0, 0, width, height)
    for (let row = 0; row < numPoints; row++) {
        for (let col = 0; col < numPoints; col++) {
            points[row][col] = noise.perlin3(row / 15, col / 15, new Date().getTime()/2000) > 0 ? 1 : 0
            // points[row][col] = (Math.random() > 0.5 ? 1 : 0)
        }
    }

    for (let row = 0; row < numPoints; row++) {
        for (let col = 0; col < numPoints; col++) {
            ctx.save()
            if (points[row][col]) {
                ctx.fillStyle = 'rgba(0,0,0,1)'
            } else {
                ctx.fillStyle = 'rgba(0,0,0,.15)'
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
    if (row === numPoints - 1 || col === numPoints - 1) {
        // in the last row just bail
        return 0
    }
    const bits = {
        8: points[row][col],
        4: points[row][col + 1],
        2: points[row + 1][col + 1],
        1: points[row + 1][col],
    }
    let sum = 0
    for (const bitsKey in bits) {
        sum += bits[bitsKey] * bitsKey
    }
    return sum
}