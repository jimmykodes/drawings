import math

import cairo


def main():
    width = 1500
    height = 500
    iterations = 150
    cy = height / 2
    visited = [False] * width
    location = 0
    line_step = 3

    with cairo.SVGSurface('racaman.svg', width, height) as surface:
        ctx = cairo.Context(surface)
        ctx.set_line_width(1)
        r1 = cairo.LinearGradient(0, 0, width, height)
        r1.add_color_stop_rgb(0, 0, 0, 1)
        r1.add_color_stop_rgb(.5, 0, 1, 0)
        r1.add_color_stop_rgb(1, 1, 0, 0)
        ctx.set_source(r1)
        ctx.new_path()
        last = 'back'
        funcs = {
            True: ctx.arc,
            False: ctx.arc_negative
        }
        clockwise = True
        for i in range(iterations):
            back = location - i
            if back > 0 and not visited[back]:
                destination = back
                current = 'back'
                angles = [0, math.pi]
            else:
                destination = location + i
                current = 'forward'
                angles = [math.pi, 0]
            visited[destination] = True
            if last == current:
                clockwise = not clockwise
            last = current
            x = ((destination + location) / 2) * line_step
            radius = (i / 2) * line_step
            funcs[clockwise](x, cy, radius, *angles)
            location = destination
        ctx.stroke()


if __name__ == '__main__':
    main()
