const TAU = Math.PI * 2

function Point(x, y) {
    this.x = x
    this.y = y
}

function Clock(depth, canvas, ctx, cx, cy, r, offset) {
    this.depth = depth
    this.canvas = canvas
    this.ctx = ctx
    this.cx = cx
    this.cy = cy
    this.r = r
    this.offset = offset
    this.h = undefined
    this.m = undefined
    this.s = undefined
    this.ms = undefined
    this.mRad = undefined
    this.sRad = undefined
    this.mDeg = undefined
    this.sDeg = undefined
    this.mChild = undefined
    this.sChild = undefined
    this.maxDepth = 10
}

Clock.prototype.updateTime = function (now, cx, cy, offset) {
    now = now || new Date()
    this.cx = cx || this.cx
    this.cy = cy || this.cy
    this.offset = offset || this.offset
    this.ms = now.getMilliseconds()
    this.s = (now.getSeconds() + (this.ms / 1000))
    this.m = (now.getMinutes() + (this.s / 60))
    this.mRad = (this.m * TAU / 60) + (this.offset || (Math.PI / 2) * -1)
    this.sRad = (this.s * TAU / 60) + (this.offset || (Math.PI / 2) * -1)
    this.mDeg = this.radToDeg(this.mRad)
    this.sDeg = this.radToDeg(this.sRad)
    if (this.depth > this.maxDepth) {
        return
    }
    if (!this.mChild) {
        this.mChild = new Clock(this.depth + 1, this.canvas, this.ctx, this.mDeg.x, this.mDeg.y, this.r * .7, this.mRad)
    }
    if (!this.sChild) {
        this.sChild = new Clock(this.depth + 1, this.canvas, this.ctx, this.sDeg.x, this.sDeg.y, this.r * .7, this.sRad)
    }
    this.mChild.updateTime(now, this.mDeg.x, this.mDeg.y, this.mRad)
    this.sChild.updateTime(now, this.sDeg.x, this.sDeg.y, this.sRad)
}

Clock.prototype.radToDeg = function (theta) {
    return new Point((Math.cos(theta) * this.r) + this.cx, (Math.sin(theta) * this.r) + this.cy)
}

Clock.prototype.draw = function () {
    this.updateTime()
    let ctx = this.ctx
    if (this.depth === 0) {
        ctx.save()
        ctx.beginPath()
    }
    [this.mDeg, this.sDeg].forEach(point => {
        ctx.moveTo(this.cx, this.cy)
        ctx.lineTo(point.x, point.y)
    })
    if (this.depth > this.maxDepth) {
        return
    }
    [this.mChild, this.sChild].forEach(c => c.draw())

    if (this.depth === 0) {
        ctx.stroke()
        ctx.restore()
    }
}
