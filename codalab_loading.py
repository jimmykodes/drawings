"""

    function get_xy(_theta, radius) {
        return [(radius * Math.cos(_theta)) + cx, (radius * Math.sin(_theta)) + cy]
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    }

    function hexagon(hex_radius, number_of_circles, gap) {
        let p1 = get_xy(0 - TAU / 4, hex_radius)
        let p2 = get_xy(TAU / 6 - TAU / 4, hex_radius)
        let D = distance(...p1, ...p2)
        let circle_radius = (D / (2 * (number_of_circles - 1))) - (gap / 2)
        _.forEach(_.range(6), i => {
            let start = get_xy((i * TAU / 6) - (TAU / 4), hex_radius)
            let end = get_xy(((i + 1) * TAU / 6) - (TAU / 4), hex_radius)
            let dx = end[0] - start[0]
            let dy = end[1] - start[1]
            let d = distance(...start, ...end)
            _.forEach(_.range(number_of_circles - 1), _i => {
                let r = (((2 * circle_radius) + gap) * _i) / d
                let _dx = dx * r
                let _dy = dy * r
                ctx.beginPath()
                ctx.circle(start[0] + _dx, start[1] + _dy, circle_radius)
                ctx.fill()
            })

        })
    }

    function get_rgba(i) {
        let offset = TAU / 7
        let alpha = Math.sin(time - (offset * i))
        alpha = scale(alpha, -1, 1, -3, -.6)
        alpha = Math.exp(alpha)
        return `rgba(0, 0, 0, ${alpha})`
    }

    function draw() {
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = 'rgb(0,0,0)'
        ctx.font = "20px Arial"
        ctx.fillText('LOADING', cx - 45, cy + 9)
        ctx.fillStyle = get_rgba(0)
        hexagon(30, 3, 3)
        ctx.fillStyle = get_rgba(1)
        hexagon(45, 4, 5)
        ctx.fillStyle = get_rgba(2)
        hexagon(55, 5, 8)
        ctx.fillStyle = get_rgba(3)
        hexagon(63, 6, 9)
        time += .05
        window.requestAnimationFrame(draw)

    }
"""
import math
from functools import partial

import cairo


def get_xy(theta, radius, cx=0, cy=0):
    return radius * math.cos(theta) + cx, radius * math.sin(theta) + cy


def distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def _hexagon(ctx, cx, cy, hex_radius, number_of_circles, gap):
    side_length = distance(*get_xy(0, hex_radius), *get_xy(math.tau / 6, hex_radius))
    circle_radius = side_length / (2 * (number_of_circles - 1)) - gap / 2
    ratio = (2 * circle_radius + gap) / side_length
    for i in range(6):
        x1, y1 = get_xy(i * math.tau / 6 - math.tau / 4, hex_radius, cx, cy)
        x2, y2 = get_xy((i + 1) * math.tau / 6 - math.tau / 4, hex_radius, cx, cy)
        dx = x2 - x1
        dy = y2 - y1
        for _i in range(number_of_circles - 1):
            _dx = dx * ratio * _i
            _dy = dy * ratio * _i
            ctx.new_path()
            ctx.arc(x1 + _dx, y1 + _dy, circle_radius, 0, math.tau)
            ctx.fill()


def main():
    width = 130
    height = 130
    cx = width / 2
    cy = height / 2
    with cairo.SVGSurface('logo.svg', width, height) as surface:
        ctx = cairo.Context(surface)
        hexagon = partial(_hexagon, ctx, cx, cy)
        hexagon(30, 3, 3)
        hexagon(45, 4, 5)
        hexagon(55, 5, 8)
        hexagon(63, 6, 9)
        ctx.select_font_face("Helvetica", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(20)
        extents = ctx.text_extents("LOADING")
        ctx.move_to(cx - extents.width / 2, cy + extents.height / 2)
        ctx.show_text("LOADING")


if __name__ == '__main__':
    main()
