"""Draws img/footer-village.svg: a pen-and-ink row of flat-roofed village houses
with water tanks on the roofs, signed SKP. Seeded, so the same drawing comes out
every time; change SEED for a different street.

Each house is one <g> holding a fill (so it hides what stands behind it), its
outlines (class "o") and its shading (class "s"). The footer script shows the
outlines as a light sketch and inks in the shading under the pointer.

Run from the skp-portfolio folder:  python3 tools/draw-footer-village.py
"""
import math
import random
from pathlib import Path

SEED = 2026
W, H, G = 1440, 400, 372          # canvas and ground line
INK, PAPER = '#1f1d1b', '#eae5dc'  # --fg and --bg in styles.css
R = random.Random(SEED)


def n(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s


def keep(x):
    """The street thins out to the right, the way an ink sketch trails off."""
    if x < 640:
        return True
    return R.random() < max(0.0, 1 - (x - 640) / 430) ** 1.3


class Pen:
    def __init__(self):
        self.parts = []

    def line(self, x1, y1, x2, y2, j=.45, over=1.2):
        L = math.hypot(x2 - x1, y2 - y1) or 1
        ux, uy = (x2 - x1) / L, (y2 - y1) / L
        a, b = R.uniform(-.4, over), R.uniform(-.4, over)
        x1, y1 = x1 - ux * a + R.uniform(-j, j), y1 - uy * a + R.uniform(-j, j)
        x2, y2 = x2 + ux * b + R.uniform(-j, j), y2 + uy * b + R.uniform(-j, j)
        if not keep((x1 + x2) / 2):
            return
        if L > 26:
            mx, my = (x1 + x2) / 2 - uy * R.uniform(-j, j) * 1.6, (y1 + y2) / 2 + ux * R.uniform(-j, j) * 1.6
            self.parts.append(f'M{n(x1)} {n(y1)}Q{n(mx)} {n(my)} {n(x2)} {n(y2)}')
        else:
            self.parts.append(f'M{n(x1)} {n(y1)}L{n(x2)} {n(y2)}')

    def tick(self, x, y, dx, dy):
        if keep(x):
            self.parts.append(f'M{n(x)} {n(y)}l{n(dx)} {n(dy)}')

    def dot(self, x, y):
        if keep(x):
            self.parts.append(f'M{n(x)} {n(y)}h.2')

    def raw(self, d, x):
        if keep(x):
            self.parts.append(d)

    def d(self):
        return ''.join(self.parts)


def free(x0, x1, y, holes):
    """Pieces of the span x0..x1 at height y that miss every opening."""
    spans = [(x0, x1)]
    for hx0, hx1, hy0, hy1 in holes:
        if not hy0 <= y <= hy1:
            continue
        nxt = []
        for a, b in spans:
            if hx1 <= a or hx0 >= b:
                nxt.append((a, b))
                continue
            if hx0 > a:
                nxt.append((a, hx0))
            if hx1 < b:
                nxt.append((hx1, b))
        spans = nxt
    return [(a, b) for a, b in spans if b - a > 2]


def hatch(pen, x0, y0, x1, y1, step, angle=1.0, dense=False):
    """Diagonal hatching inside a box; a second pass the other way when dense."""
    for sign in ((1, -1) if dense else (1,)):
        k = -(y1 - y0)
        while k < x1 - x0:
            ax, ay = x0 + k, y1 if sign == 1 else y0
            bx, by = ax + (y1 - y0) * angle, y0 if sign == 1 else y1
            # clip the segment to the box
            pts = []
            for t in (0, 1):
                pts.append((ax + (bx - ax) * t, ay + (by - ay) * t))
            (p0x, p0y), (p1x, p1y) = pts
            if p0x < x0:
                p0y += (p1y - p0y) * (x0 - p0x) / (p1x - p0x); p0x = x0
            if p1x > x1:
                p1y -= (p1y - p0y) * (p1x - x1) / (p1x - p0x); p1x = x1
            if p1x - p0x > 1:
                pen.line(p0x, p0y, p1x, p1y, j=.25, over=.6)
            k += step * R.uniform(.8, 1.2)


def bricks(pen, span, y_top, y_bot, holes, row_h=5.4, brick=13):
    """Brick courses between y_top and y_bot; span(y) gives each course's extent."""
    y, row = y_bot, 0
    while y > y_top:
        x0, x1 = span(y)
        for a, b in free(x0, x1, y, holes):
            pen.line(a, y, b, y, j=.3, over=.3)
            off = (row % 2) * brick / 2
            jx = a + off + R.uniform(0, 2)
            while jx < b - 2:
                if R.random() < .85:
                    pen.tick(jx + R.uniform(-.5, .5), y, R.uniform(-.3, .3), -row_h + .6)
                jx += brick * R.uniform(.9, 1.1)
        y -= row_h
        row += 1


def box(pen, x0, y0, x1, y1, j=.45):
    pen.line(x0, y0, x1, y0, j); pen.line(x1, y0, x1, y1, j)
    pen.line(x1, y1, x0, y1, j); pen.line(x0, y1, x0, y0, j)


def tank(o, s, cx, base):
    """A black plastic rooftop tank on a short iron stand."""
    tw, th, sh = R.uniform(24, 32), R.uniform(24, 30), R.uniform(6, 12)
    x0, x1 = cx - tw / 2, cx + tw / 2
    yb, yt = base - sh, base - sh - th
    for lx in (x0 + 3, x1 - 3):
        o.line(lx, base, lx, yb, j=.2)
    o.line(x0 + 3, base - 1, x1 - 3, yb + 1, j=.2)
    o.line(x0 + 1, yb, x1 - 1, yb, j=.2)
    rx = tw / 2
    o.raw(f'M{n(x0)} {n(yt)}A{n(rx)} 3 0 1 0 {n(x1)} {n(yt)}A{n(rx)} 3 0 1 0 {n(x0)} {n(yt)}', cx)
    o.raw(f'M{n(cx - 5)} {n(yt - .5)}A5 1.6 0 1 0 {n(cx + 5)} {n(yt - .5)}', cx)
    o.line(x0, yt, x0 + .6, yb - 2, j=.2); o.line(x1, yt, x1 - .6, yb - 2, j=.2)
    o.raw(f'M{n(x0 + .6)} {n(yb - 2)}A{n(rx)} 3 0 0 0 {n(x1 - .6)} {n(yb - 2)}', cx)
    for k in range(1, 4):
        y = yt + th * k / 4
        s.raw(f'M{n(x0)} {n(y)}A{n(rx)} 2.6 0 0 0 {n(x1)} {n(y)}', cx)
    # dark plastic: dense vertical strokes, a lit strip on the left
    x = x0 + tw * R.uniform(.22, .32)
    while x < x1 - .6:
        s.line(x, yt + 2.5, x, yb - 1, j=.2, over=.3)
        x += R.uniform(1.1, 1.7)
    hatch(s, x0 + tw * .62, yt + 3, x1 - .6, yb - 2, 2.2)
    return (x0, yt - 3, tw, base - yt + 3)


def house(x, w, h, back=False):
    o, s, fills = Pen(), Pen(), []
    top = G - h
    ph = R.uniform(9, 14)
    slab = top + ph
    x1 = x + w
    fills.append((x - 2, top - 1, w + 4, h + 1))

    # walls, parapet with its coping, slab edge, plinth
    o.line(x, G, x, top); o.line(x1, G, x1, top)
    o.line(x - 2, top, x1 + 2, top); o.line(x - 2, top + 2.6, x1 + 2, top + 2.6, j=.3)
    o.line(x - 2, top, x - 2, top + 2.6, j=.1, over=0); o.line(x1 + 2, top, x1 + 2, top + 2.6, j=.1, over=0)
    o.line(x - 3, slab, x1 + 3, slab); o.line(x - 3, slab + 3.5, x1 + 3, slab + 3.5, j=.3)
    o.line(x, G - 9, x1, G - 9, j=.6)
    hatch(s, x, slab + 3.5, x1, slab + 10, 3.2)                      # shadow under the slab
    for k in range(int(w / 3)):                                       # shadow along the plinth
        s.tick(x + 1 + k * 3 + R.uniform(-.6, .6), G - 1, R.uniform(-.4, .4), -R.uniform(4, 8))

    # parapet: plain, or a row of jaali openings
    if not back and w > 70 and x1 < 700 and R.random() < .45:
        jx = x + 6
        while jx < x1 - 10:
            box(o, jx, top + 4.5, jx + 4.5, top + ph - 2.5, j=.15)
            for t in (1.2, 2.3, 3.4):
                s.line(jx + t, top + 5, jx + t, top + ph - 3, j=.08, over=0)
            jx += 9

    holes = []
    if not back:
        # a wooden double door, one leaf open onto a dark room
        dw = R.uniform(30, 42)
        dh = R.uniform(.5, .6) * min(h, 150)
        dx = x + R.uniform(.12, .6) * (w - dw)
        dt = G - dh
        arched = R.random() < .35
        if arched:
            o.raw(f'M{n(dx)} {n(G)}L{n(dx)} {n(dt + dw / 2)}A{n(dw / 2)} {n(dw / 2)} 0 0 1 {n(dx + dw)} {n(dt + dw / 2)}L{n(dx + dw)} {n(G)}', dx)
            o.raw(f'M{n(dx - 4)} {n(dt + dw / 2)}A{n(dw / 2 + 4)} {n(dw / 2 + 4)} 0 0 1 {n(dx + dw + 4)} {n(dt + dw / 2)}', dx)
            leaf_top = dt + dw / 2
        else:
            box(o, dx, dt, dx + dw, G)
            o.line(dx - 5, dt - 4, dx + dw + 5, dt - 4); o.line(dx - 5, dt - 1, dx + dw + 5, dt - 1, j=.2)
            hatch(s, dx - 5, dt - 4, dx + dw + 5, dt - 1, 1.6)
            leaf_top = dt
        mid = dx + dw / 2
        o.line(mid, leaf_top, mid, G, j=.25)
        px = dx + 2.5
        while px < mid - 1:
            s.line(px, leaf_top + 1.5, px, G - 1, j=.2, over=.2)
            px += 3.3
        hatch(s, mid + .5, leaf_top + (2 if not arched else -dw / 2 + 4), dx + dw - .5, G - .5, 1.5, dense=True)
        holes.append((dx - 6, dx + dw + 6, dt - (dw / 2 + 6 if arched else 6), G))

        # small barred windows
        for _ in range(R.choice([0, 1, 1, 2]) if w > 60 else 0):
            ww, wh = R.uniform(17, 23), R.uniform(22, 28)
            wy = slab + R.uniform(18, 30)
            spots = [p for p in (x + 8, x1 - ww - 8, x + (w - ww) / 2) if all(p + ww + 6 < hx0 or p - 6 > hx1 for hx0, hx1, *_ in holes)]
            if not spots or wy + wh > G - 24:
                continue
            wx = R.choice(spots)
            box(o, wx, wy, wx + ww, wy + wh)
            o.line(wx - 3, wy - 3.5, wx + ww + 3, wy - 3.5, j=.2)
            hatch(s, wx, wy, wx + ww, wy + wh, 1.5, dense=True)
            for b in range(1, 4):
                bx = wx + ww * b / 4
                o.line(bx, wy + 1, bx, wy + wh - 1, j=.12, over=0)
            holes.append((wx - 4, wx + ww + 4, wy - 5, wy + wh + 2))

    # brick: the whole wall left unplastered, or patches where plaster has fallen
    bot, high = G - 10, slab + 11
    if back:
        if x1 < 760 and R.random() < .5:
            bricks(s, lambda y: (x + 1, x1 - 1), high + 10, top + h * .55, holes)
    elif R.random() < .4:
        bricks(s, lambda y: (x + 1, x1 - 1), high, bot, holes)
    elif x1 < 700:
        for _ in range(R.choice([1, 2, 2])):
            rx, ry = R.uniform(14, 30), R.uniform(9, 17)
            cx = R.uniform(x + rx + 6, max(x + rx + 7, x1 - rx - 6))
            cy = R.uniform(high + ry + 4, bot - ry - 2)
            if any(cx + rx > hx0 and cx - rx < hx1 and cy + ry > hy0 and cy - ry < hy1 for hx0, hx1, hy0, hy1 in holes):
                continue
            # a ragged edge where the plaster has broken away, bricks showing inside
            pts = []
            for k in range(16):
                t = k / 16 * math.tau
                r = R.uniform(.78, 1.08)
                pts.append((cx + rx * r * math.cos(t), cy + ry * r * math.sin(t)))
            for (ax, ay), (bx, by) in zip(pts, pts[1:] + pts[:1]):
                if R.random() < .85:
                    o.line(ax, ay, bx, by, j=.35, over=.2)
            def span(y, cx=cx, cy=cy, rx=rx, ry=ry):
                half = rx * .82 * math.sqrt(max(0.0, 1 - ((y - cy) / (ry * .9)) ** 2))
                return cx - half, cx + half
            bricks(s, span, cy - ry * .8, cy + ry * .8, holes)
        for _ in range(int(w * h / 1100)):                         # plaster grain
            s.dot(R.uniform(x + 2, x1 - 2), R.uniform(high, bot))

    # on the roof: a stair room, a tank, sometimes both
    roof_spots = []
    if not back and w > 76 and R.random() < .38:
        mw, mh = R.uniform(36, 48), R.uniform(28, 36)
        mx = x + 6 if R.random() < .5 else x1 - mw - 6
        my = top - mh
        fills.append((mx - 2, my - 1, mw + 4, mh + 2))
        o.line(mx, top, mx, my); o.line(mx + mw, top, mx + mw, my)
        o.line(mx - 2, my, mx + mw + 2, my); o.line(mx - 2, my + 2.4, mx + mw + 2, my + 2.4, j=.25)
        ddx = mx + R.uniform(.2, .5) * (mw - 14)
        box(o, ddx, my + 9, ddx + 14, top - .5)
        hatch(s, ddx, my + 9, ddx + 14, top - .5, 1.4, dense=True)
        hatch(s, mx + mw - 7, my + 3, mx + mw, top, 2.4)
        roof_spots.append((mx + mw / 2, my))
    if R.random() < (.35 if back else .6):
        cx = R.uniform(x + 20, x1 - 20) if w > 44 else x + w / 2
        if roof_spots and R.random() < .5:
            cx, base = roof_spots[0]
        else:
            base = top
            if roof_spots and abs(cx - roof_spots[0][0]) < 34:
                cx = x + 18 if roof_spots[0][0] > x + w / 2 else x1 - 18
        fills.append(tank(o, s, cx, base))
    return fills, o.d(), s.d()


def glyphs(x, y, size):
    """SKP as three pen strokes, slanted like a signature."""
    S = 'M.9 .15C.6 -.05 .05 .05 .15 .35C.25 .6 .85 .45 .85 .75C.85 1.05 .3 1.05 .05 .85'
    K = 'M0 0L0 1M.75 0L.05 .55M.25 .38L.8 1'
    P = 'M0 1L0 0L.45 0C.9 0 .9 .55 .45 .55L0 .55'
    out, cx = [], x
    for path, adv in ((S, .78), (K, .78), (P, .7)):
        toks = path.replace('M', ' M ').replace('L', ' L ').replace('C', ' C ').split()
        res, nums = [], []
        def flush():
            for i in range(0, len(nums), 2):
                gx, gy = nums[i], nums[i + 1]
                res.append(f'{n(cx + gx * size + (1 - gy) * size * .25)} {n(y - size + gy * size)}')
            nums.clear()
        for t in toks:
            if t in 'MLC':
                flush(); res.append(t)
            else:
                nums.append(float(t))
        flush()
        out.append(''.join(r if r in 'MLC' else r + ' ' for r in res).replace(' M', 'M').replace(' L', 'L').replace(' C', 'C').strip())
        cx += adv * size + size * .22
    end = cx
    out.append(f'M{n(x - 2)} {n(y + 4)}Q{n((x + end) / 2)} {n(y + 6.5)} {n(end + 6)} {n(y + 2.5)}')
    return ''.join(out)


def main():
    groups = []

    def emit(fills, od, sd, cls):
        fd = ''.join(f'M{n(a)} {n(b)}h{n(c)}v{n(d)}h{n(-c)}Z' for a, b, c, d in fills)
        groups.append(f'<g class="{cls}"><path fill="{PAPER}" stroke="none" d="{fd}"/>'
                      f'<path class="o" d="{od}"/><path class="s" d="{sd}"/></g>')

    # the row behind: taller, two storeys, fainter
    x = -30
    while x < 900:
        w = R.uniform(64, 112)
        emit(*house(x, w, R.uniform(196, 236), back=True), 'h b')
        x += w + R.uniform(-8, 26)

    # the street
    x = -12
    while x < 1060:
        w = R.uniform(72, 148)
        emit(*house(x, w, R.uniform(120, 172)), 'h')
        x += w + (R.uniform(6, 24) if R.random() < .3 else 0)

    ground_o, ground_s = Pen(), Pen()
    gx = -6
    while gx < 1140:
        step = R.uniform(30, 70)
        ground_o.line(gx, G + R.uniform(-.4, .4), gx + step, G + R.uniform(-.4, .4), j=.5)
        gx += step + R.uniform(-2, 3)
    for _ in range(900):
        px = R.triangular(-5, 1150, 200)
        ground_s.dot(px, G + 2 + R.random() ** 1.7 * 22)
    for _ in range(26):
        tx = R.uniform(0, 1000)
        for k in range(3):
            ground_s.tick(tx + k * 1.6, G, R.uniform(-1.6, 1.6), -R.uniform(3, 7))
    flecks = Pen()
    for _ in range(80):
        fx, fy = R.uniform(880, 1180), R.uniform(140, G)
        if R.random() < max(0, 1 - (fx - 880) / 320):
            a = R.uniform(0, math.pi)
            L = R.uniform(2, 7)
            flecks.parts.append(f'M{n(fx)} {n(fy)}l{n(math.cos(a) * L)} {n(math.sin(a) * L)}')

    groups.append(f'<g class="ground"><path class="o" d="{ground_o.d()}"/><path class="s" d="{ground_s.d()}{flecks.d()}"/></g>')

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
           f'preserveAspectRatio="xMinYMax slice" fill="none" stroke="{INK}" stroke-linecap="round" stroke-linejoin="round">'
           f'<style>.o{{stroke-width:1.2}}.s{{stroke-width:.6}}.b{{stroke-opacity:.55}}</style>'
           f'<g id="fv-street">{"".join(groups)}</g>'
           f'<path id="fv-sign" stroke-width="1.2" d="{glyphs(1012, 388, 13)}"/></svg>\n')
    out = Path(__file__).resolve().parent.parent / 'img' / 'footer-village.svg'
    out.write_text(svg)
    print(out, f'{len(svg) / 1024:.0f} KB')


if __name__ == '__main__':
    main()
