import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
LEVELS = []
def L(**k): LEVELS.append(k)

# 91 ─────────────────────────────────────────────
m = room()
box(m, 22, 11, 30, 13)
put(m, 7, 12, 'o'); put(m, 22, 9, 'o'); put(m, 25, 7, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Harvest Road', idea='The last journey across the plain. One lever swaps two barn doors: when the front one opens, the back one shuts.',
  mech=['lever', 'inverted gate', 'gates on one channel', 'Braco stands on Seka'],
  hint='Both of you walk through the first door while the lever is OFF. Between the doors, pull the lever: the second door opens but the first one closes. At the wall, {S} gives {B} a boost.',
  map=rows(m),
  obj=[gate(10, 1, 'a', h=13, inv=True), lever(14, 13, 'a'), gate(18, 1, 'a', h=13), sign(3, 13, 'Pannonian plain')],
  sol=['S go 16', 'B go 14', 'B use', 'S go 21.2', 'B go 19.8', 'B jump R 21.2', 'B jump R 23.5', 'B go 28.8',
       'S jump R 23.5', 'S go 25', 'S jump N', 'S go 29.6'])

# 92 ─────────────────────────────────────────────
m = room()
put(m, 5, 13, 'C'); put(m, 14, 13, 'C'); box(m, 23, 10, 26, 10)
put(m, 10, 11, 'o'); put(m, 19, 11, 'o'); put(m, 25, 6, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Crate Relay', idea='Two crates, two heavy scales and two doors in a row. Braco rolls each crate home; at the end he lifts Seka to the loft lever.',
  mech=['crates on heavy plates', 'two gates in a row', 'Seka stands on Braco', 'lever in a loft'],
  hint='{B} pushes the first crate onto the first scale, hops over it, then does the same with the second. {S} follows. Under the loft, {S} climbs on {B} to reach the lever for the last door.',
  map=rows(m),
  obj=[plate(9, 13, 'a', heavy=True), gate(12, 1, 'a', h=13), plate(18, 13, 'b', heavy=True), gate(21, 1, 'b', h=13),
       lever(25, 9, 'c'), gate(28, 1, 'c', h=13)],
  sol=['B go 3.8', 'B go 8.6', 'B jump R 10.8', 'B go 12.8', 'B go 17.6', 'B jump R 20.3', 'B go 21.8', 'S go 7.6', 'S jump R 10.8',
       'S go 16.6', 'S jump R 19.5', 'S go 20.6', 'S jump R 21.8', 'S jump R 24', 'S go 25', 'S use', 'S jump N', 'B go 28.8', 'S go 26',
       'S jump R 29.6', 'S go 29.6'])

# 93 ─────────────────────────────────────────────
m = room()
box(m, 6, 14, 19, 14, '^'); box(m, 24, 9, 30, 13)
put(m, 12, 12, 'o'); put(m, 23, 10, 'o'); put(m, 26, 5, 'o'); put(m, 1, 13, '12'); put(m, 29, 8, 'E')
L(name='Sunflower Wagons', idea='The hay wagon shuttles over a spiky ditch on its own and waits only a moment at each end. Then the grain lift — up, down and up again.',
  mech=['looping wagon', 'jumping on together', 'lever-driven lift', 'two levers on one channel'],
  hint='Wait at the edge and jump onto the wagon together while it pauses. On the far side {B} rides the grain lift while {S} works the lever below; then {B} brings it back down for her with the lever up top.',
  map=rows(m),
  obj=[lift(6, 14, (17, 14), w=3, loop=True, skin='wagon', speed=110, pause=0.9), lever(20, 13, 'a'),
       lift(22, 13, (22, 9), w=2, ch='a', speed=110), lever(27, 8, 'a')],
  sol=['S go 5', 'B go 4', 'at 0 0', 'S jump R 7.8 | B jump R 6.8', 'at 0 1', 'B go 21.5 | S go 20.5', 'B jump R 22.6', 'S use', 'at 1 1',
       'B go 27.2', 'S use', 'at 1 0', 'S go 22.6', 'S jump N', 'B use', 'at 1 1', 'S go 26', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 94 ─────────────────────────────────────────────
m = room()
put(m, 6, 13, 'C'); box(m, 8, 11, 11, 11); box(m, 12, 8, 15, 8); box(m, 18, 5, 21, 5); box(m, 24, 5, 30, 5)
put(m, 10, 9, 'o'); put(m, 23, 9, 'o'); put(m, 26, 3, 'o'); put(m, 1, 13, '12'); put(m, 29, 4, 'E')
L(name='Windmill Climb', idea='Seka climbs the windmill’s inner floors; Braco can’t, so he rolls a sack onto the scale to open her trapdoor and waits on the grain lift.',
  mech=['crate on a heavy plate', 'climbing floating platforms', 'gate in the air', 'lever-driven lift'],
  hint='{B} pushes the sack onto the scale (walk under the low floors), which opens the gate near the top. {S} climbs floor by floor and pulls the lever to lift {B} up.',
  map=rows(m),
  obj=[plate(14, 13, 'a', heavy=True), gate(17, 1, 'a', h=7), lift(22, 13, (22, 5), w=2, ch='b', speed=120), lever(20, 4, 'b')],
  sol=['B go 4.8', 'B go 13.6', 'B jump R 16.5', 'B go 21.5', 'B jump R 22.6', 'S go 7', 'S jump R 9.5', 'S go 11', 'S jump R 13.5',
       'S go 15.2', 'S jump R 18.8', 'S go 20', 'S use', 'at 0 1', 'B go 28.8', 'S go 29.6'])

# 95 ─────────────────────────────────────────────
m = room()
put(m, 4, 13, 'C'); box(m, 13, 10, 17, 10)
put(m, 10, 11, 'o'); put(m, 15, 6, 'o'); put(m, 24, 12, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Three Bells', idea='The festival gate needs three things at once: the sack on the scale, the lever in the loft — and the bell, which only rings for a moment.',
  mech=['gate needing three switches', 'crate on a heavy plate', 'Seka stands on Braco', 'timer'],
  hint='{B} pushes the sack onto the scale. {S} climbs on {B} to reach the loft lever. Then {S} waits by the gate while {B} rings the bell — and both of you run!',
  map=rows(m),
  obj=[plate(8, 13, 'a', heavy=True), lever(15, 9, 'b'), timer(22, 13, 'c', 4), gate(26, 1, ['a', 'b', 'c'], h=13)],
  sol=['B go 7.6', 'B jump R 10.5', 'B go 11.4', 'S go 6.6', 'S jump R 10', 'S go 10.4', 'S jump R 11.6', 'S jump R 15',
       'S go 15', 'S use', 'S jump N', 'S jump R 19', 'S go 24.5', 'B go 22', 'S go 29.6', 'B go 28.8'])

# 96 ─────────────────────────────────────────────
m = room()
box(m, 6, 10, 22, 10); box(m, 25, 11, 30, 13)
put(m, 10, 9, 'o'); put(m, 17, 12, 'o'); put(m, 27, 7, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Plum Orchard', idea='Two paths through the orchard: Seka along the high walkway, Braco along the ground. Each one opens the door on the other’s path.',
  mech=['Seka stands on Braco', 'split paths', 'lever for the partner', 'plate for the partner'],
  hint='{B} boosts {S} onto the walkway. {S} pulls the lever to open {B}’s door; {B} stands on the plate to open {S}’s. At the end {S} helps {B} up the wall.',
  map=rows(m),
  obj=[lever(14, 9, 'a'), gate(16, 11, 'a', h=3), plate(18, 13, 'b'), gate(19, 1, 'b', h=9)],
  sol=['B go 4.8', 'S go 3.8', 'S jump R 4.8', 'S jump R 7', 'S go 14', 'S use', 'B go 18', 'S go 24.2', 'B go 23',
       'B jump R 24.2', 'B jump R 26.5', 'B go 28.8', 'S jump R 26.5', 'S go 27', 'S jump N', 'S go 29.6'])

# 97 ─────────────────────────────────────────────
m = room()
box(m, 8, 14, 13, 15, '.'); box(m, 8, 16, 13, 16, '^'); box(m, 21, 11, 30, 13)
put(m, 11, 13, 'o'); put(m, 17, 13, 'o'); put(m, 25, 8, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Storm Bridge', idea='The bridge over the flooded ditch is a drawbridge that only stays down while it has power: first from a short timer, then from a plate on the far side.',
  mech=['bridge gate (solid only while powered)', 'timer', 'plate and timer on one channel', 'Braco stands on Seka'],
  hint='{B} steps on the timer; {S} runs over the bridge and stands on the plate so it stays down for {B}. At the wall {S} boosts {B}.',
  map=rows(m),
  obj=[timer(4, 13, 'a', 3), gate(8, 14, 'a', w=6, inv=True), plate(16, 13, 'a')],
  sol=['B go 4.4', 'S go 6', 'S go 16.4', 'B go 15', 'S go 20.2', 'B go 18.8', 'B jump R 20.2', 'B jump R 22.5', 'B go 28.8',
       'S jump R 22.5', 'S go 25', 'S jump N', 'S go 29.6'])

# 98 ─────────────────────────────────────────────
m = room()
put(m, 14, 13, 'C'); box(m, 18, 10, 22, 10)
put(m, 12, 12, 'o'); put(m, 20, 7, 'o'); put(m, 25, 12, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Twin Timers', idea='The gate to the last field needs two bells ringing together, one on the ground and one on a hayloft. Ring them at the same moment and race!',
  mech=['crate as a step', 'two timers on one AND gate', 'acting at the same time'],
  hint='{B} pushes the crate up to the hayloft so {S} can climb it. {S} waits on the loft bell while {B} goes back to the ground bell — then run for the gate together.',
  map=rows(m),
  obj=[timer(9, 13, 'a', 7), timer(20, 9, 'b', 7), gate(27, 1, ['a', 'b'], h=13)],
  sol=['B go 15.6', 'B go 9.4', 'S go 15.4', 'S jump R 16.9', 'S jump R 19', 'S go 20', 'S jump N', 'B go 15.4', 'B jump R 19', 'B go 28.8 | S go 29.6'])

# 99 ─────────────────────────────────────────────
m = room()
put(m, 4, 13, 'b'); box(m, 6, 14, 24, 14, '^'); box(m, 14, 8, 18, 8); box(m, 26, 11, 30, 13)
put(m, 9, 4, 'o'); put(m, 15, 12, 'o'); put(m, 22, 5, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Starry Glide', idea='A last flight under the stars: Seka bounces and glides to the windmill loft and starts the wagon, which ferries Braco across a long spiky ditch.',
  mech=['spring', 'long glide', 'lever-powered looping wagon', 'jumping on a moving wagon', 'Braco stands on Seka'],
  hint='{S}: bounce off the bale, glide up to the loft and pull the lever. {B} hops on the wagon when it stops by him. {S} glides down to the wall and gives {B} a boost straight off the wagon.',
  map=rows(m),
  obj=[lever(16, 7, 'a'), lift(6, 14, (22, 14), w=3, ch='a', loop=True, skin='wagon', speed=120, pause=0.9)],
  sol=['S go 2.8', 'S jump R 4 bounce', 'S air R 16 glide', 'S go 16', 'S use', 'S jump R 25 glide', 'S go 25.2',
       'B go 2.8', 'B jump R 5.4', 'at 0 0', 'B jump R 7', 'at 0 1', 'B jump R 25.2', 'B jump R 27.5', 'B go 28.8', 'S jump R 27.5', 'S go 29.6'])

# 100 ────────────────────────────────────────────
m = room()
put(m, 6, 13, 'C'); put(m, 16, 13, 'b'); box(m, 18, 8, 21, 8); box(m, 25, 9, 30, 13); box(m, 27, 6, 30, 8)
put(m, 12, 11, 'o'); put(m, 19, 6, 'o'); put(m, 28, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 5, 'E')
L(name='Pannonian Finale', idea='The very last level: the sack opens the barn, the bale throws Seka up to the bell, the bell lifts Braco — and one last boost brings them both home to the festival.',
  mech=['crate on a heavy plate', 'spring', 'timer-driven lift', 'long glide', 'Braco stands on Seka'],
  hint='Same tricks as always, all at once! {B} rolls the sack onto the scale and waits on the lift. {S} bounces up to the bell. {B} steps off at the top, {S} glides over, and {S} boosts {B} onto the last ledge.',
  map=rows(m),
  obj=[plate(10, 13, 'a', heavy=True), gate(13, 1, 'a', h=13), timer(20, 7, 'b', 5), lift(23, 13, (23, 9), w=2, ch='b', speed=110),
       sign(3, 13, 'Home stretch!')],
  sol=['B go 4.8', 'B go 9.6', 'B jump R 12', 'B go 15.2', 'B jump R 18', 'B go 21.5', 'B jump R 23.6', 'S go 8.8', 'S jump R 12',
       'S go 14.8', 'S jump R 16 bounce', 'S air R 20', 'at 0 1', 'B go 25.4', 'S jump R 26.2 glide', 'S go 26.2',
       'B jump R 26.2', 'B jump R 28', 'B go 28.8', 'S jump R 28', 'S jump N', 'S go 29.6'])
