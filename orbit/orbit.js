function Orbit(ctx, x, y, radius) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.radius = radius
    this.rotation = 0
}

Orbit.prototype.draw = function () {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.ellipse(this.x, this.y, this.radius, this.radius, this.rotation, 0, 2 * Math.PI)
    this.ctx.stroke()
    this.ctx.restore()
}