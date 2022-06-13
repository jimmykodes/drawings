const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const dpr = window.devicePixelRatio
width = window.innerWidth
height = window.innerHeight
square = 150
cols = width / square
rows = height / square

canvas.width = width * dpr
canvas.height = height * dpr
canvas.style.width = `${width}px`
canvas.style.height = `${height}px`
ctx.scale(dpr, dpr)

const bgColor = "#282c34"
const colors = [
  "#98c379", // green
  "#61afef", // blue
  "#c678dd", // purple
  "#56b6c2", // cyan
  // "#e06c75", // red
  "#e5c07b", // yellow
  // "#abb2bf", // grey
]
const rotations = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]
const shapes = [circle, hollowArc, dots]

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

ctx.fillStyle = bgColor
ctx.fillRect(0, 0, width, height)

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const color = randomChoice(colors)
    const shape = randomChoice(shapes)
    const rot = randomChoice(rotations)
    shape(ctx, square * j, square * i, square, rot, color, bgColor)
  }
}
