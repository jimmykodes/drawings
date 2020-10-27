function main() {
    width = window.innerWidth
    height = window.innerHeight
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    let dpr = window.devicePixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)
    let cx = Math.round(width / 2)
    let cy = Math.round(height / 2)
    let innerOrbit = new Orbit(ctx, cx, cy, Math.round(Math.min(height, width) / 2 * .3))
    let outerOrbit = new Orbit(ctx, cx, cy, Math.round(Math.min(height, width) / 2 * .8))
    let innerPlanet = new OrbitPlanet(ctx, 0, 9, innerOrbit)
    let outerPlanet = new OrbitPlanet(ctx, 0, 2, outerOrbit)
    let lines = new Lines(ctx)

    function frame() {
        ctx.clearRect(0, 0, width, height)
        innerPlanet.draw()
        outerPlanet.draw()
        lines.draw()
        innerPlanet.move()
        outerPlanet.move()
        lines.append(innerPlanet.coords, outerPlanet.coords)
        window.requestAnimationFrame(frame)
    }
    window.requestAnimationFrame(frame)
}

$(document).ready(() => {
    main()
})
