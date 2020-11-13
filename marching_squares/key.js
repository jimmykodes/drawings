class Coord {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Line {
    constructor(start, end) {
        this.start = start
        this.end = end
    }
}

class Box {
    constructor(...lines) {
        this.lines = lines
    }

    draw(ctx, cx, cy, scale) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.beginPath()
        this.lines.forEach(line => {
            ctx.moveTo(line.start.x * scale, line.start.y * scale)
            ctx.lineTo(line.end.x * scale, line.end.y * scale)
        })
        ctx.stroke()
        ctx.restore()
    }
}

const tc = new Coord(.5, 0)
const bc = new Coord(.5, 1)
const rm = new Coord(1, .5)
const lm = new Coord(0, .5)

const key = {
    0: new Box(),
    1: new Box(new Line(lm, bc)),
    2: new Box(new Line(rm, bc)),
    3: new Box(new Line(lm, rm)),
    4: new Box(new Line(tc, rm)),
    5: new Box(new Line(tc, lm), new Line(bc, rm)),
    6: new Box(new Line(tc, bc)),
    7: new Box(new Line(tc, lm)),
    8: new Box(new Line(tc, lm)),
    9: new Box(new Line(tc, bc)),
    10: new Box(new Line(tc, rm), new Line(bc, lm)),
    11: new Box(new Line(tc, rm)),
    12: new Box(new Line(lm, rm)),
    13: new Box(new Line(bc, rm)),
    14: new Box(new Line(bc, lm)),
    15: new Box()
}