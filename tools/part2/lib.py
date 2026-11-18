"""Tiny helpers for writing level maps by coordinates (x = column 0–31, y = row 0–17)."""
def room(floor=14):
    m = [['#'] * 32] + [['#'] + ['.'] * 30 + ['#'] for _ in range(1, floor)] + [['#'] * 32 for _ in range(floor, 18)]
    return m
def put(m, x, y, s):
    for i, ch in enumerate(s): m[y][x + i] = ch
def box(m, x1, y1, x2, y2, ch='#'):
    for y in range(y1, y2 + 1):
        for x in range(x1, x2 + 1): m[y][x] = ch
def rows(m): return [''.join(r) for r in m]
def plate(x, y, ch, heavy=False):
    o = {'t': 'plate', 'x': x, 'y': y, 'ch': ch}
    if heavy: o['heavy'] = True
    return o
def lever(x, y, ch): return {'t': 'lever', 'x': x, 'y': y, 'ch': ch}
def timer(x, y, ch, dur): return {'t': 'timer', 'x': x, 'y': y, 'ch': ch, 'dur': dur}
def gate(x, y, ch, w=1, h=1, inv=False):
    o = {'t': 'gate', 'x': x, 'y': y}
    if w != 1: o['w'] = w
    if h != 1: o['h'] = h
    o['ch'] = ch
    if inv: o['inv'] = True
    return o
def lift(x, y, to, w=2, ch=None, loop=False, skin=None, speed=None, pause=None):
    o = {'t': 'lift', 'x': x, 'y': y, 'w': w, 'to': list(to)}
    if ch is not None: o['ch'] = ch
    if loop: o['loop'] = True
    if skin: o['skin'] = skin
    if speed: o['speed'] = speed
    if pause is not None: o['pause'] = pause
    return o
def sign(x, y, text): return {'t': 'sign', 'x': x, 'y': y, 'text': text}
