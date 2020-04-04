let canvas, ctx, width, height, l, lineSpacing, mouseX, mouseY

let lines = []

function resizeCanvas(_w, _h) {
    let dpr = window.devicePixelRatio
    canvas.height = _h * dpr
    canvas.width = _w * dpr
    canvas.style.height = `${_h}px`
    canvas.style.width = `${_w}px`
    ctx.scale(dpr, dpr)
}

function windowResized() {
    width = window.innerWidth
    height = window.innerHeight
    resizeCanvas(width, height)
}

function mMoved(event) {
    mouseX = event.pageX
    mouseY = event.pageY
}

function draw() {
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    let grad = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight)
    grad.addColorStop(0, 'rgb(105,20,199)')
    grad.addColorStop(1, 'rgb(40,8,76)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
    lines.forEach(line => {
        line._update()
        line.draw()
    })
    window.requestAnimationFrame(draw)
}

function setupLines() {
    let nWide = width / lineSpacing
    let nHigh = height / lineSpacing
    for (let cx = 0; cx < nWide; cx++) {
        for (let cy = 0; cy < nHigh; cy++) {
            lines.push(new Line(cx * lineSpacing, cy * lineSpacing))
        }
    }
}

function Line(cx, cy) {
    this.cx = cx
    this.cy = cy
    this.a = 0
}

Line.prototype._update = function () {
    let x = mouseX - this.cx
    let y = mouseY - this.cy
    this.a = 3 * Math.atan2(y, x)
    // this.a = (Math.sin(x) - Math.sin(y)) + (Math.sin(x) + Math.sin(y))
}

Line.prototype.draw = function () {
    ctx.strokeStyle = '#fff'
    ctx.translate(this.cx, this.cy)
    ctx.rotate(this.a)
    ctx.beginPath()
    ctx.moveTo(-l, 0)
    ctx.lineTo(l, 0)
    ctx.stroke()
    ctx.rotate(-this.a)
    ctx.translate(-this.cx, -this.cy)
}

function setup() {
    l = 10
    lineSpacing = 40
    mouseX = window.innerWidth / 2
    mouseY = window.innerHeight / 2
    window.addEventListener('resize', windowResized)
    canvas = document.getElementById('vector')
    canvas.addEventListener('mousemove', mMoved)
    ctx = canvas.getContext('2d')

    windowResized()
    setupLines()
}

$(function () {
    setup()
    window.requestAnimationFrame(draw)
})