"""Golden-hour still life of 3D geometric shapes, ray-marched in numpy.
Plaster sphere, gold torus, charcoal cube, a tall column and a small gold sphere on a warm floor,
lit by a low sun from the back left. Writes a 3:4 image at the given width."""
import sys
import numpy as np
from PIL import Image, ImageFilter

W = int(sys.argv[2]) if len(sys.argv) > 2 else 900
H = W * 4 // 3
out = sys.argv[1]

def norm(v): return v / np.linalg.norm(v, axis=-1, keepdims=True)
def length(v): return np.linalg.norm(v, axis=-1)

def rot_y(p, a):
    c, s = np.cos(a), np.sin(a)
    x, y, z = p[..., 0], p[..., 1], p[..., 2]
    return np.stack([c * x + s * z, y, -s * x + c * z], -1)
def rot_x(p, a):
    c, s = np.cos(a), np.sin(a)
    x, y, z = p[..., 0], p[..., 1], p[..., 2]
    return np.stack([x, c * y - s * z, s * y + c * z], -1)

def sd_box(p, b, r=0.04):
    q = np.abs(p) - (b - r)
    return length(np.maximum(q, 0)) + np.minimum(np.max(q, -1), 0) - r
def sd_torus(p, R, r):
    q = np.stack([length(p[..., [0, 1]]) - R, p[..., 2]], -1)  # torus standing upright in the xy plane
    return length(q) - r
def sd_cyl(p, r, h):
    d = np.stack([length(p[..., [0, 2]]) - r, np.abs(p[..., 1]) - h], -1)
    return np.minimum(np.max(d, -1), 0) + length(np.maximum(d, 0)) - 0.02
def sd_cone(p, r, h):  # cone with tip up, base on y=0
    q = np.stack([length(p[..., [0, 2]]), p[..., 1]], -1)
    k = np.array([r, -h]); a = q - np.array([0, h])
    t = np.clip((a * k).sum(-1) / (k * k).sum(), 0, 1)[..., None]
    b1 = a - k * t
    b2 = a - np.stack([np.clip(a[..., 0], 0, r), np.full(a.shape[:-1], -h)], -1)
    s = np.where((q[..., 1] < 0) | ((k[1] * a[..., 0] - k[0] * a[..., 1]) < 0), -1.0, 1.0)
    s = np.where(q[..., 1] < 0, 1.0, np.where((k[1] * a[..., 0] - k[0] * a[..., 1]) < 0, -1.0, 1.0))
    d = np.minimum((b1 * b1).sum(-1), (b2 * b2).sum(-1))
    inside = (q[..., 1] > 0) & (q[..., 1] < h) & (q[..., 0] < r * (1 - q[..., 1] / h))
    return np.sqrt(d) * np.where(inside, -1, 1)

# objects: (sdf, material id)
def scene(p):
    floor = p[..., 1]
    sph = length(p - np.array([-0.62, 0.95, 0.35])) - 0.95
    tor = sd_torus(rot_y(p - np.array([0.95, 0.78, -0.55]), -0.55), 0.58, 0.2)
    box = sd_box(rot_y(p - np.array([0.62, 0.42, 0.95]), 0.6), np.array([0.42, 0.42, 0.42]))
    col = sd_cyl(p - np.array([-1.55, 1.45, -1.35]), 0.34, 1.45)
    cone = sd_cone(p - np.array([1.65, 0.0, 0.35]), 0.42, 1.05)
    gold = length(p - np.array([-0.05, 0.24, 1.45])) - 0.24
    ds = np.stack([floor, sph, tor, box, col, cone, gold], -1)
    return ds.min(-1), ds.argmin(-1)

def dist(p): return scene(p)[0]

# camera
ro = np.array([0.35, 1.75, 4.3]); ta = np.array([0.1, 0.95, 0.0])
fw = norm(ta - ro); rt = norm(np.cross(fw, [0, 1, 0])); up = np.cross(rt, fw)
ys, xs = np.mgrid[0:H, 0:W].astype(float)
u = (xs + .5 - W / 2) / H * 2; v = -(ys + .5 - H / 2) / H * 2
fov = 1.15
rd = norm(u[..., None] * rt + v[..., None] * up + fov * fw)
rd = rd.reshape(-1, 3)

t = np.zeros(len(rd)); hit = np.zeros(len(rd), bool); alive = np.ones(len(rd), bool)
for _ in range(140):
    idx = np.where(alive)[0]
    if not len(idx): break
    p = ro + rd[idx] * t[idx, None]
    d = dist(p)
    t[idx] += d * 0.9
    done = d < 1e-3
    hit[idx[done]] = True
    gone = t[idx] > 30
    alive[idx[done | gone]] = False

P = ro + rd * t[:, None]
_, mat = scene(P)
e = 1e-3
N = norm(np.stack([dist(P + [e, 0, 0]) - dist(P - [e, 0, 0]), dist(P + [0, e, 0]) - dist(P - [0, e, 0]), dist(P + [0, 0, e]) - dist(P - [0, 0, e])], -1))

sun = norm(np.array([-0.8, 0.42, -0.5]))
sun_col = np.array([1.0, 0.74, 0.44]) * 2.4
sky_col = np.array([0.62, 0.55, 0.47])

# soft shadows
res = np.ones(len(P)); st = np.full(len(P), 0.02); live = hit.copy()
for _ in range(64):
    idx = np.where(live)[0]
    if not len(idx): break
    h = dist(P[idx] + N[idx] * 2e-3 + sun * st[idx, None])
    res[idx] = np.minimum(res[idx], 9 * h / st[idx])
    st[idx] += np.clip(h, 0.02, 0.25)
    live[idx[(h < 1e-4) | (st[idx] > 8)]] = False
shadow = np.clip(res, 0, 1); shadow = shadow * shadow * (3 - 2 * shadow)

# ambient occlusion
ao = np.zeros(len(P))
for i in range(1, 6):
    hh = 0.06 * i
    ao += (hh - dist(P + N * hh)) / (2 ** i)
ao = np.clip(1 - 3.2 * ao, 0, 1)

albedo = np.array([
    [0.80, 0.70, 0.58],   # floor, warm plaster
    [0.90, 0.84, 0.75],   # sphere, bone plaster
    [0.86, 0.62, 0.28],   # torus, gold
    [0.16, 0.14, 0.13],   # cube, charcoal
    [0.78, 0.69, 0.57],   # column, sand
    [0.72, 0.52, 0.36],   # cone, terracotta-sand
    [0.88, 0.64, 0.30],   # small sphere, gold
])[mat]
metal = np.isin(mat, [2, 6])

dif = np.clip((N * sun).sum(-1), 0, 1) * shadow
skyl = np.clip(0.5 + 0.5 * N[:, 1], 0, 1) * ao
bounce = np.clip(0.5 - 0.5 * N[:, 1], 0, 1) * ao * 0.35
H_ = norm(sun - rd)
spec = np.clip((N * H_).sum(-1), 0, 1) ** np.where(metal, 60, 18) * shadow * np.where(metal, 1.6, 0.12)
col = albedo * (dif[:, None] * sun_col + skyl[:, None] * sky_col + bounce[:, None] * np.array([0.6, 0.45, 0.3]))
# metals: tinted reflection of the warm sky
refl = rd - 2 * (rd * N).sum(-1, keepdims=True) * N
env = np.array([0.98, 0.78, 0.5]) * (0.55 + 0.6 * np.clip(refl[:, 1], 0, 1))[:, None] + np.array([1.0, 0.8, 0.5]) * np.clip((refl * sun).sum(-1), 0, 1)[:, None] ** 12 * 2
col = np.where(metal[:, None], col * 0.45 + albedo * env * 0.75 * ao[:, None], col)
col += spec[:, None] * np.where(metal[:, None], np.array([1.0, 0.85, 0.6]), np.array([1, 0.9, 0.8]))

# background: a warm, hazy golden sky behind the set
sky = np.array([0.95, 0.84, 0.7]) * (1 - 0.25 * np.clip(rd[:, 1], 0, 1))[:, None] + np.array([1.0, 0.72, 0.38]) * np.clip((rd * sun).sum(-1), 0, 1)[:, None] ** 6 * 0.6
fog = 1 - np.exp(-0.035 * t * t * 0.15)
col = np.where(hit[:, None], col * (1 - fog[:, None]) + sky * fog[:, None], sky)

img = col.reshape(H, W, 3)
# grade: filmic tone map, warm lift, vignette, grain
img = img / (1 + img * 0.55)
img = np.clip(img, 0, 1) ** (1 / 1.9)
img = img * np.array([1.03, 0.99, 0.9]) + np.array([0.03, 0.02, 0.0])
yy, xx = np.mgrid[0:H, 0:W]
vig = ((xx / W - .5) ** 2 + (yy / H - .45) ** 2)
img *= (1 - 0.32 * vig / vig.max())[..., None]
img += np.random.default_rng(3).normal(0, 0.012, img.shape)
im = Image.fromarray((np.clip(img, 0, 1) * 255).astype('uint8'))
im = im.filter(ImageFilter.GaussianBlur(0.35))
im.save(out, 'PNG')
print(out, im.size, 'hit', hit.mean().round(3))
