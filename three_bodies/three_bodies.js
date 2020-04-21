const gravitationalConstant = 6.674 * (10 ** -11)
let showPaths = false
let showPredictions = false
let pause = true
let Tau = Math.PI * 2
let cv, ctx, width, height, planets, showVectors, selectedPlanet, anchoredPlanet
let $radius, $xPos, $yPos, $direction, $speed, $density, $hue
let scaleFactor = 1
const FTPi = Math.PI * (4 / 3)

class Planet {
    constructor(i, x, y, r, density, color, initialDX, initialDY) {
        this.index = i
        this.x = x
        this.y = y
        this.r = r
        this.density = density
        this.color = color
        this.dx = initialDX
        this.dy = initialDY
        this.path = []
        this.pdx = initialDX
        this.pdy = initialDY
        this.px = x
        this.py = y
        this.predictions = []
    }

    get mass() {
        return FTPi * (this.r ** 3) * this.density
    }

    get magnitude() {
        return Math.sqrt(this.dx ** 2 + this.dy ** 2)
    }

    get direction() {
        if (this.dx === 0) {
            if (this.dy >= 0) {
                return Tau / 4
            } else {
                return 3 * Tau / 4
            }
        }
        return Math.atan(this.dy / this.dx) + (this.dx < 0 ? Math.PI : 0)
    }

    updateVelocity() {
        _.forEach(planets, planet => {
            if (planet !== this) {
                let x = planet.x - this.x
                let y = planet.y - this.y
                let sqrMag = x ** 2 + y ** 2
                let distance = Math.sqrt(sqrMag)
                let xDir = x / distance
                let yDir = y / distance
                let force = gravitationalConstant * this.mass * planet.mass * sqrMag
                let acceleration = force / this.mass
                this.dx += xDir * acceleration * 0.001
                this.dy += yDir * acceleration * 0.001
            }
        })
    }

    updatePosition() {
        this.x += this.dx - (anchoredPlanet ? anchoredPlanet.dx : 0)
        this.y += this.dy - (anchoredPlanet ? anchoredPlanet.dy : 0)
        this.path.push([this.x, this.y])
    }

    updatePVelocity() {
        _.forEach(planets, planet => {
            if (planet !== this) {
                let x = planet.px - this.px
                let y = planet.py - this.py
                let sqrMag = x ** 2 + y ** 2
                let distance = Math.sqrt(sqrMag)
                let xDir = x / distance
                let yDir = y / distance
                let force = gravitationalConstant * this.mass * planet.mass * sqrMag
                let acceleration = force / this.mass
                this.pdx += xDir * acceleration * 0.001
                this.pdy += yDir * acceleration * 0.001
            }
        })
    }

    updatePPosition() {
        this.px += this.pdx - (anchoredPlanet ? anchoredPlanet.pdx : 0)
        this.py += this.pdy - (anchoredPlanet ? anchoredPlanet.pdy : 0)

        this.predictions.push([this.px, this.py])
    }

    draw() {
        ctx.save()
        ctx.fillStyle = `hsl(${this.color},100%,50%)`
        ctx.strokeStyle = `hsl(${this.color},100%,50%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        if (showPaths && this.path.length > 0) {
            ctx.beginPath()
            ctx.moveTo(...this.path[0])
            _.forEach(this.path, point => ctx.lineTo(...point))
            ctx.stroke()
        }
        if (showPredictions && this.predictions.length > 0) {
            ctx.strokeStyle = `hsl(${this.color},100%,50%)`
            ctx.beginPath()
            ctx.moveTo(...this.predictions[0])
            _.forEach(this.predictions, point => ctx.lineTo(...point))
            ctx.stroke()
        }
        if (showVectors) {
            ctx.strokeStyle = '#ffffff'
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + this.dx, this.y + this.dy)
            ctx.stroke()
        }
        ctx.restore()
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height)
    if (!pause) {
        _.forEach(planets, planet => planet.updateVelocity())
        _.forEach(planets, planet => planet.updatePosition())
    }
    _.forEach(planets, planet => planet.draw())
    window.requestAnimationFrame(draw.bind(this, ctx, width, height, planets))
}

function polToCart(theta, radius) {
    return {
        x: radius * Math.cos(theta),
        y: radius * Math.sin(theta)
    }
}

function addPlanet() {
    let planet = new Planet(
        planets.length + 1,
        width / 2,
        height / 2,
        20,
        1,
        Math.random() * 360,
        0,
        0
    )
    planets.push(planet)
    selectPlanet(undefined, planet)
}

function clearPaths() {
    _.forEach(planets, p => p.path = [])
}

function togglePaths() {
    showPaths = !showPaths
    $('#show-paths').text(showPaths ? "Hide Paths" : "Show Paths")
}

function togglePause() {
    pause = !pause
    $('#pause').text(pause ? "Play" : "Pause")
}

function toggleVectors() {
    showVectors = !showVectors
    $('#show-vector').text(showVectors ? "Hide Vectors" : "Show Vectors")
}

function clearPlanets() {
    planets = []
    if (!pause) {
        togglePause()
    }
}

function selectPlanet(e, planet) {
    selectedPlanet = null
    if (planet) {
        selectedPlanet = planet
    } else {
        _.forEach(planets, p => {
            if (e.pageX < p.x + p.r && e.pageX > p.x - p.r) {
                if (e.pageY < p.y + p.r && e.pageY > p.y - p.r) {
                    selectedPlanet = p
                }
            }
        })
    }

    if (selectedPlanet) {
        $('#planet-form').show()
        $radius.val(selectedPlanet.r)
        $yPos.val(selectedPlanet.y)
        $xPos.val(selectedPlanet.x)
        $direction.val(selectedPlanet.direction * 100)
        $speed.val(selectedPlanet.magnitude * 10)
        $density.val(selectedPlanet.density)
        $hue.val(selectedPlanet.color)
        $('#anchor-planet').text(selectedPlanet === anchoredPlanet ? "Remove Planet Anchor" : "Anchor Planet")
    } else {
        $('#planet-form').hide()
    }
}

function updatePredictions() {
    if (!showPredictions) {
        return
    }
    _.forEach(planets, p => {
        p.px = p.x
        p.py = p.y
        p.pdx = p.dx
        p.pdy = p.dy
        p.predictions = []
    })
    _.forEach(_.range(3000), () => {
        _.forEach(planets, p => {
            p.updatePVelocity()
            p.updatePPosition()
        })
    })
}

function togglePredictions() {
    showPredictions = !showPredictions
    if (!pause) {
        togglePause()
    }
    if (showPredictions) {
        updatePredictions()
    }
    $('#show-predictions').text(showPredictions ? "Hide Predictions" : "Show Predictions")
}

$(document).ready(() => {
    cv = document.getElementById("canvas")
    ctx = cv.getContext('2d')
    width = window.innerWidth
    height = window.innerHeight
    let dpr = window.devicePixelRatio

    cv.width = width * dpr
    cv.height = height * dpr
    cv.style.height = `${height}px`
    cv.style.width = `${width}px`
    ctx.scale(dpr * scaleFactor, dpr * scaleFactor)

    planets = []

    $radius = $('#radius')
    $yPos = $('#yPos')
    $xPos = $('#xPos')
    $direction = $('#direction')
    $speed = $('#speed')
    $density = $('#density')
    $hue = $('#hue')

    // cause can't set w/ jquery??
    document.getElementById('xPos').max = width
    document.getElementById('yPos').max = height


    $radius.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.r = _.toNumber(this.value)
            updatePredictions()
        }
    })
    $yPos.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.y = _.toNumber(this.value)
            updatePredictions()
        }
    })
    $xPos.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.x = _.toNumber(this.value)
            updatePredictions()
        }
    })
    $direction.on('input', function () {
        if (selectedPlanet) {
            let direction = _.toNumber(this.value) / 100
            let updates = polToCart(direction, selectedPlanet.magnitude)
            selectedPlanet.dx = updates.x
            selectedPlanet.dy = updates.y
            updatePredictions()
        }
    })
    $speed.on('input', function () {
        if (selectedPlanet) {
            let theta = selectedPlanet.direction
            let updates = polToCart(theta, _.toNumber(this.value) / 10)
            selectedPlanet.dx = updates.x
            selectedPlanet.dy = updates.y
            updatePredictions()
        }
    })
    $density.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.density = _.toNumber(this.value)
            updatePredictions()
        }
    })
    $hue.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.color = this.value
            updatePredictions()
        }
    })

    $('#add-planet').on('click', addPlanet)
    $('#clear-paths').on('click', clearPaths)
    $('#show-paths').on('click', togglePaths)
    $('#show-predictions').on('click', togglePredictions)
    $('#show-vector').on('click', toggleVectors)
    $('#pause').on('click', togglePause)
    $('#clear-planets').on('click', clearPlanets)
    $('#canvas').on('click', selectPlanet)
    $('#anchor-planet').on('click', () => {
        if (anchoredPlanet === selectedPlanet) {
            anchoredPlanet = null
        } else {
            anchoredPlanet = selectedPlanet
        }
        updatePredictions()
        $('#anchor-planet').text(selectedPlanet === anchoredPlanet ? "Remove Planet Anchor" : "Anchor Planet")

    })
    window.addEventListener('scroll', function() {
        console.log('wtf')
    })
    window.requestAnimationFrame(draw)
})