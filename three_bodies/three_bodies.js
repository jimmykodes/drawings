const gravitationalConstant = 6.674 * (10 ** -11)
let showPaths = false
let pause = true
let cv, ctx, width, height, planets, showVectors, selectedPlanet
let $radius, $xPos, $yPos, $dx, $dy, $density, $hue
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
    }

    get mass() {
        return FTPi * (this.r ** 3) * this.density
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
                this.dx += xDir * acceleration
                this.dy += yDir * acceleration
            }
        })
    }

    updatePosition() {
        this.x += this.dx
        this.y += this.dy
        this.path.push([this.x, this.y])
    }

    draw() {
        ctx.save()
        ctx.fillStyle = `hsl(${this.color},100%,50%)`
        ctx.strokeStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        if (showPaths && this.path.length > 0) {
            ctx.beginPath()
            ctx.moveTo(...this.path[0])
            _.forEach(this.path, point => ctx.lineTo(...point))
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
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, width, height)
    if (!pause) {
        _.forEach(planets, planet => planet.updateVelocity())
        _.forEach(planets, planet => planet.updatePosition())
    }
    _.forEach(planets, planet => planet.draw())
    window.requestAnimationFrame(draw.bind(this, ctx, width, height, planets))
}

function randLocation() {
    return {
        x: Math.random() * window.innerWidth / 2,
        y: Math.random() * window.innerHeight,
    }
}

function randDirection() {
    return Math.random() * (Math.random() < .5 ? -1 : 1) * 10
}

function addPlanet() {
    let location = randLocation()
    planets.push(new Planet(
        planets.length + 1,
        location.x,
        location.y,
        20,
        1,
        Math.random() * 360,
        randDirection(),
        randDirection()
    ))
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
}

function selectPlanet(e) {
    selectedPlanet = null
    _.forEach(planets, p => {
        if (e.pageX < p.x + p.r && e.pageX > p.x - p.r) {
            if (e.pageY < p.y + p.r && e.pageY > p.y - p.r) {
                selectedPlanet = p
            }
        }
    })
    if (selectedPlanet) {
        $('#planet-form').show()
        $radius.val(selectedPlanet.r)
        $yPos.val(selectedPlanet.y)
        $xPos.val(selectedPlanet.x)
        $dx.val(selectedPlanet.dx)
        $dy.val(selectedPlanet.dy)
        $density.val(selectedPlanet.density)
        $hue.val(selectedPlanet.color)
    } else {
        $('#planet-form').hide()
    }
}

$(document).ready(() => {
    cv = document.getElementById("canvas")
    ctx = cv.getContext('2d')
    width = window.innerWidth
    height = window.innerHeight
    cv.width = width
    cv.height = height
    planets = []

    $radius = $('#radius')
    $yPos = $('#yPos')
    $xPos = $('#xPos')
    $dx = $('#dx')
    $dy = $('#dy')
    $density = $('#density')
    $hue = $('#hue')

    // cause can't set w/ jquery??
    document.getElementById('xPos').max = width
    document.getElementById('yPos').max = height


    $radius.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.r = _.toNumber(this.value)
        }
    })
    $yPos.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.y = _.toNumber(this.value)
        }
    })
    $xPos.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.x = _.toNumber(this.value)
        }
    })
    $dx.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.dx = _.toNumber(this.value)
        }
    })
    $dy.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.dy = _.toNumber(this.value)
        }
    })
    $density.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.density = _.toNumber(this.value)
        }
    })
    $hue.on('input', function () {
        if (selectedPlanet) {
            selectedPlanet.color = this.value
        }
    })

    $('#add-planet').on('click', addPlanet)
    $('#clear-paths').on('click', clearPaths)
    $('#show-paths').on('click', togglePaths)
    $('#show-vector').on('click', toggleVectors)
    $('#pause').on('click', togglePause)
    $('#clear-planets').on('click', clearPlanets)
    $('#canvas').on('click', selectPlanet)

    document.addEventListener('keydown', e => {
        if (!selectedPlanet) {
            return
        }
        switch (e.key) {
            case "ArrowLeft":
                selectedPlanet.x -= 10
                break
            case "ArrowRight":
                selectedPlanet.x += 10
                break
            case "ArrowUp":
                selectedPlanet.y -= 10
                break
            case "ArrowDown":
                selectedPlanet.y += 10
                break
        }
    })

    window.requestAnimationFrame(draw)
})