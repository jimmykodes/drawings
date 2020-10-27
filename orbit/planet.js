function polToCart(theta, radius, xOffset, yOffset) {
    return {
        x: radius * Math.cos(theta) + xOffset,
        y: radius * Math.sin(theta) + yOffset
    }
}

function OrbitPlanet(ctx, theta, speed, orbit) {
    this.ctx = ctx
    this.speed = speed * .01
    this.theta = theta
    this.orbit = orbit
    this.coords = polToCart(theta, orbit.radius, orbit.x, orbit.y)
}

OrbitPlanet.prototype.draw = function () {
    this.orbit.draw()
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(this.coords.x, this.coords.y, 5, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.restore()
}

OrbitPlanet.prototype.move = function () {
    this.theta += this.speed
    this.coords = polToCart(this.theta, this.orbit.radius, this.orbit.x, this.orbit.y)
}