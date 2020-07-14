function Canvas() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    let dpr = window.devicePixelRatio
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.scale(dpr, dpr)
    this.clock = new Clock(
        0,
        this.canvas,
        this.ctx,
        this.width / 2,
        this.height / 2,
        Math.min(this.width, this.height) * .2,
        0
    )
}

Canvas.prototype.animate = function () {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.clock.draw()
    window.requestAnimationFrame(this.animate.bind(this))
}

$(document).ready(() => {
    let c = new Canvas()
    window.requestAnimationFrame(c.animate.bind(c))
})
