import cairo
import math
import colorsys


LAPTOP = (5120, 2280, 350)
IPHONE = (640, 1136, 160)
IPAD = (768, 1028, 200)
MOVIE = (1920, 1080, 100)
SQUARE = (200, 200, -20)

width, height, radius_addition = (1280, 384, 200)
cx = width // 2
cy = height // 2
radius = max([width, height]) // 2
radius += radius_addition
hue_start = .6
hue_range = 1 / 3
n_lines = 850
# n_lines = 48
step = 0.0005
# multiplier = 172  # Trillium
multiplier = 120
angle_step = math.tau / n_lines


# mults = [35, 52, 54, 66, 72, 78, 95, 107, 120, 122, 123, 143, 171.6, 188, 255.6, 255.7, 255.8, 256.2, 256.3, 256.4, 256.5, 285, 320.5]


def scale(old_value, old_min, old_max, new_min, new_max):
    return (((old_value - old_min) * (new_max - new_min)) / (old_max - old_min)) + new_min


class Line:
    def __init__(self, place, start_theta, end_theta):
        self.place = place
        self.start_theta = start_theta
        self.end_theta = end_theta
        self.hue_value = scale(place, 0, n_lines, hue_start, hue_start + hue_range)

    @property
    def start(self):
        return (radius * math.cos(self.start_theta)) + cx, (radius * math.sin(self.start_theta)) + cy

    @property
    def end(self):
        return (radius * math.cos(self.end_theta)) + cx, (radius * math.sin(self.end_theta)) + cy


# mults = arange(2, n_lines // 2, .002)
# for n in mults:
#     hue_start += .001
n = multiplier
lines = [Line(i, angle_step * i - math.pi, angle_step * ((i * n) % n_lines) - math.pi) for i in range(n_lines)]

# with cairo.SVGSurface('logo.svg', width, height) as surface:
with cairo.ImageSurface(cairo.FORMAT_ARGB32, width, height) as surface:
    ctx = cairo.Context(surface)
    # ctx.set_line_width(1)
    # ctx.set_font_size(8)
    r1 = cairo.RadialGradient(cx, cy, 50, cx, cy, radius)
    r1.add_color_stop_rgb(1, .1, .1, .1)
    r1.add_color_stop_rgb(0, .05, .05, .05)
    ctx.set_source(r1)
    ctx.rectangle(0, 0, width, height)
    ctx.fill()
    for line in lines:
        # ctx.set_source_rgba(0, 0, 0, 1)
        # radius += 8
        # ctx.move_to(*line.start)
        # ctx.show_text(str(line.place or n_lines))
        # radius -= 8
        ctx.new_path()
        ctx.set_source_rgba(*colorsys.hls_to_rgb(line.hue_value, .5, 1), .4)
        ctx.move_to(*line.start)
        ctx.line_to(*line.end)
        ctx.stroke()
    surface.write_to_png(f'images/{n:.3f}.png')
