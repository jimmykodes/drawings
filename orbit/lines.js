function Line(startCoords, endCoords) {
    this.startCoords = startCoords
    this.endCoords = endCoords
}

function Lines(ctx) {
    this.ctx = ctx
    this.lines = []
}

Lines.prototype.draw = function () {
    let ctx = this.ctx
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,.7)'
    ctx.beginPath()
    this.lines.forEach(line => {
        ctx.moveTo(line.startCoords.x, line.startCoords.y)
        ctx.lineTo(line.endCoords.x, line.endCoords.y)
    })
    ctx.stroke()
    ctx.restore()
}

Lines.prototype.append = function (startCoords, endCoords) {
    this.lines.push(new Line(startCoords, endCoords))
}