import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
LEVELS = []
def L(**k): LEVELS.append(k)

# 81 ─────────────────────────────────────────────
m = room()
box(m, 8, 11, 30, 13); box(m, 15, 8, 30, 10); box(m, 22, 5, 30, 7)
put(m, 5, 9, 'o'); put(m, 12, 6, 'o'); put(m, 24, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 4, 'E')
L(name='Vine Terraces', idea='Three tall vineyard terraces. Braco climbs on Seka at each one — but at the top Seka has to come back down to help him after opening the gate.',
  mech=['Braco stands on Seka', 'heavy plate', 'lever', 'coming back to help'],
  hint='At each terrace {S} waits by the wall so {B} can climb on her. On the middle terrace {B} holds the heavy plate while {S} opens the top gate with the lever — then {S} comes back down to give {B} one more boost.',
  map=rows(m),
  obj=[plate(18, 7, 'a', heavy=True), gate(26, 1, 'a', h=4), lever(28, 4, 'a'), sign(3, 13, 'Baranja vineyards')],
  sol=['S go 5', 'S jump N', 'S go 6.8', 'B go 5', 'B jump R 6.8', 'B jump R 9.5', 'B go 11', 'S jump R 10', 'S go 12', 'S jump N',
       'S go 13.9', 'B go 12', 'B jump R 13.9', 'B jump R 16.5', 'B go 18', 'S jump R 16', 'S go 20.8', 'S jump R 23', 'S go 28', 'S use',
       'S go 23', 'S jump L 21.2', 'S go 20.9', 'B go 19.3', 'B jump R 20.9', 'B jump R 23', 'B go 26', 'S jump R 23.5', 'S go 24', 'S jump N',
       'B go 28.8', 'S go 29.6'])

# 82 ─────────────────────────────────────────────
m = room()
box(m, 4, 10, 26, 10); put(m, 8, 13, 'C'); put(m, 11, 13, 'C')
put(m, 14, 12, 'o'); put(m, 13, 6, 'o'); put(m, 28, 9, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Wine Cellar', idea='Two barrels, two heavy press plates and one gate that needs both. Braco sorts the barrels in the low cellar while Seka walks the roof to the exit lever.',
  mech=['Seka stands on Braco', 'two crates on two heavy plates', 'gate needing two switches', 'lever on the roof'],
  hint='Boost {S} onto the cellar roof first. {B}: hop over the first barrel and push the far one onto the far plate, then come back for the other. {S} pulls the lever on the roof for the exit gate.',
  map=rows(m),
  obj=[plate(16, 13, 'a', heavy=True), plate(19, 13, 'b', heavy=True), gate(22, 11, ['a', 'b'], h=3), lever(24, 9, 'c'), gate(27, 1, 'c', h=13)],
  sol=['B go 2.9', 'S go 1.2', 'S jump R 2.9', 'S jump R 5', 'S go 13', 'S jump N', 'S go 24', 'S use',
       'B go 6.5', 'B jump R 9.5', 'B go 17.7', 'B jump L 14.5', 'B jump L 9.5', 'B jump L 6.5', 'B go 15.5', 'B jump R 17.7', 'B jump R 20.5',
       'B go 28.8', 'S go 26', 'S jump R 28', 'S jump N', 'S go 29.6'])

# 83 ─────────────────────────────────────────────
m = room()
put(m, 4, 13, 'C'); box(m, 6, 14, 24, 14, '^')
put(m, 3, 9, 'o'); put(m, 14, 12, 'o'); put(m, 26, 9, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Harvest Wagon', idea='The harvest wagon runs along its track while a lever is on. Send Braco and the barrel to the far end, bring the wagon back for Seka, and let Braco call it over again.',
  mech=['lever-driven wagon', 'two levers on one channel', 'crate rides the wagon', 'crate on a heavy plate', 'spikes'],
  hint='{B} pushes the barrel onto the wagon and climbs aboard; {S} switches the lever ON. Push the barrel onto the heavy plate. {S} switches OFF to bring the wagon back, hops on, and {B} pulls the far lever.',
  map=rows(m),
  obj=[lever(2, 13, 'a'), lift(6, 14, (22, 14), w=3, ch='a', skin='wagon', speed=130), lever(25, 13, 'a'),
       plate(27, 13, 'b', heavy=True), gate(28, 1, 'b', h=13)],
  sol=['S go 3', 'S jump N', 'B go 6.2', 'S go 2', 'S use', 'at 0 1', 'B go 25.2', 'B go 25.9', 'S use', 'at 0 0', 'S go 7.5',
       'B go 25.3', 'B use', 'at 0 1', 'S go 24.5', 'S go 26', 'S jump N', 'B jump R 28.6', 'B go 28.8', 'S jump R 29.6', 'S go 29.6'])

# 84 ─────────────────────────────────────────────
m = room()
put(m, 6, 13, 'b'); box(m, 8, 6, 11, 6); put(m, 20, 13, 'b'); box(m, 22, 6, 24, 6)
put(m, 7, 6, 'o'); put(m, 13, 10, 'o'); put(m, 23, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Grape Stomp', idea='The heavy grape press sits on a high shelf. Braco bounces up to stomp it, which opens the gate for Seka; later Seka bounces up to the lever that opens the last gate.',
  mech=['springs', 'heavy plate on a high shelf', 'lever', 'lever on a high shelf'],
  hint='{B} bounces off the bale onto the shelf and stands on the heavy press so {S} can get through and pull the lever. Later {S} bounces up to the high lever. Jump over bales you don’t want to use!',
  map=rows(m),
  obj=[plate(9, 5, 'a', heavy=True), gate(15, 1, 'a', h=13), lever(17, 13, 'a'), lever(23, 5, 'b'), gate(27, 1, 'b', h=13)],
  sol=['B go 4.8', 'B jump R 6 bounce', 'B air R 9', 'B go 9.3', 'S go 4.8', 'S jump R 8.5', 'S go 14', 'S jump N', 'S go 17', 'S use',
       'B go 11.5', 'B go 13', 'B go 18.5', 'S go 18.8', 'S jump R 20 bounce', 'S air R 23', 'S go 23', 'S use', 'S jump N',
       'B jump R 22', 'B go 28.8', 'S jump R 26', 'S go 29.6'])

# 85 ─────────────────────────────────────────────
m = room()
put(m, 5, 13, 'C'); box(m, 11, 8, 30, 13)
put(m, 2, 9, 'o'); put(m, 9, 10, 'o'); put(m, 16, 4, 'o'); put(m, 1, 13, '12'); put(m, 29, 7, 'E')
L(name='Oak Barrels', idea='The heavy plate is up on the cellar roof. The barrel lift goes up while any of its two levers is on — use that to send Braco and the barrel up first, then Seka.',
  mech=['lever-driven lift', 'two levers on one channel', 'crate rides the lift', 'crate on a heavy plate'],
  hint='{B} pushes the barrel onto the lift and {S} switches it ON. Push the barrel to the heavy plate. {S} switches OFF to call the lift, steps on, and {B} pulls the lever up top.',
  map=rows(m),
  obj=[lever(3, 13, 'a'), lift(9, 14, (9, 8), w=2, ch='a', speed=110), lever(12, 7, 'a'), plate(20, 7, 'b', heavy=True), gate(24, 1, 'b', h=7)],
  sol=['S go 2', 'S jump N', 'B go 8.6', 'S go 3', 'S use', 'at 0 1', 'B go 18.5', 'B go 19.1', 'S use', 'at 0 0', 'S go 9.6',
       'B go 12.2', 'B use', 'at 0 1', 'S go 16', 'S jump N', 'B go 18.8', 'B jump R 22.5', 'B go 28.8', 'S go 18.8', 'S jump R 22.5', 'S go 29.6'])

# 86 ─────────────────────────────────────────────
m = room()
box(m, 8, 14, 10, 14, '^'); box(m, 17, 11, 30, 13); box(m, 25, 9, 30, 10)
put(m, 9, 10, 'o'); put(m, 15, 12, 'o'); put(m, 27, 5, 'o'); put(m, 1, 13, '12'); put(m, 29, 8, 'E')
L(name='Press House', idea='A short timer opens the press-house door. Seka hops the spike trough in time, then holds the door open for Braco from the inside with a plate.',
  mech=['timer', 'plate and timer on one channel', 'spikes', 'Braco stands on Seka'],
  hint='{B} steps on the timer and {S} runs and jumps the spikes before the door shuts. Inside, {S} waits on the plate so the door stays open for {B}. Then {S} gives {B} a boost up the tall step.',
  map=rows(m),
  obj=[timer(4, 13, 'a', 3), gate(13, 1, 'a', h=13), plate(15, 13, 'a'), sign(2, 13, 'Press house')],
  sol=['B go 4.4', 'S go 6', 'S rj R 7.3 12', 'S go 15.4', 'B go 6', 'B rj R 7.2 11.6', 'B go 14', 'S go 16.2', 'B go 15',
       'B jump R 16.2', 'B jump R 18.5', 'B go 23.6', 'B jump R 26', 'B go 28.8', 'S jump R 18.5', 'S go 23', 'S jump R 26.5',
       'S go 27', 'S jump N', 'S go 29.6'])

# 87 ─────────────────────────────────────────────
m = room()
put(m, 12, 13, 'C'); box(m, 20, 11, 30, 13); box(m, 25, 7, 30, 10)
put(m, 19, 11, 'o'); put(m, 23, 8, 'o'); put(m, 28, 3, 'o'); put(m, 1, 13, '12'); put(m, 29, 6, 'E')
L(name='Barrel Stairs', idea='One barrel makes a step up to the press terrace; on top, Braco boosts Seka to the upper lever and she sends the lift up for him.',
  mech=['crate as a step', 'Seka stands on Braco', 'lever-driven lift'],
  hint='{B} pushes the barrel against the terrace so you can both climb it. The top terrace is too tall even with a boost for {B}: {B} waits on the lift while {S} climbs on him to reach the lever.',
  map=rows(m),
  obj=[lift(23, 10, (23, 7), w=2, ch='a', speed=100), lever(26, 6, 'a')],
  sol=['B go 18.3', 'B jump R 19.5', 'B jump R 22', 'S go 18.2', 'S jump R 19.5', 'S jump R 21', 'B go 24.3', 'S go 23.3',
       'S jump R 24.3', 'S jump R 27', 'S go 26.2', 'B go 23.9', 'B jump N', 'S use', 'at 0 1', 'S go 28', 'S jump N',
       'S go 29.6', 'B go 28.8'])

# 88 ─────────────────────────────────────────────
m = room()
put(m, 5, 13, 'b'); box(m, 7, 14, 22, 14, '^'); box(m, 25, 11, 30, 13)
put(m, 9, 5, 'o'); put(m, 16, 13, 'o'); put(m, 27, 7, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Cork Springs', idea='A long spiky ditch between the rows of vines. Seka bounces off the hay bale and glides all the way across; the wagon only crosses back while she keeps off its plate.',
  mech=['spring', 'long glide', 'plate-driven wagon', 'Braco stands on Seka'],
  hint='{S}: bounce off the bale and glide over the ditch, then stand on the plate to send the wagon to {B}. When {B} is aboard, step off so it rolls back — and wait by the wall to give {B} a boost.',
  map=rows(m),
  obj=[lift(20, 14, (7, 14), w=3, ch='a', skin='wagon', speed=120), plate(27, 10, 'a')],
  sol=['S go 3.8', 'S jump R 5 bounce', 'S air R 24 glide', 'S jump R 27.5', 'S go 27.5', 'S jump N', 'at 0 1', 'B go 3.8', 'B jump R 7.8', 'B go 8',
       'S go 29', 'S go 25.6', 'S jump L 23.6', 'S go 23.8', 'at 0 0', 'B go 21.6', 'B jump R 23.8', 'B jump R 26.5',
       'B go 28.8', 'S jump R 26.5', 'S go 29.6'])

# 89 ─────────────────────────────────────────────
m = room()
put(m, 6, 13, 'C'); put(m, 16, 13, 'b'); box(m, 19, 8, 22, 8)
put(m, 13, 11, 'o'); put(m, 19, 6, 'o'); put(m, 25, 12, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Tasting Room', idea='The tasting-room door needs the heavy barrel on the scale AND a bell rung on the high shelf — and the bell only rings for a few seconds.',
  mech=['crate on a heavy plate', 'spring', 'timer on a high shelf', 'gate needing two switches'],
  hint='{B} rolls the barrel onto the heavy scale. Then {S} bounces up to the timer on the shelf and both of you run for the door before it rings out.',
  map=rows(m),
  obj=[plate(12, 13, 'a', heavy=True), timer(21, 7, 'b', 6), gate(27, 1, ['a', 'b'], h=13)],
  sol=['B go 4.8', 'B go 11.6', 'B jump R 14', 'B go 15.2', 'B jump R 18', 'B go 20', 'S go 10.8', 'S jump R 14', 'S go 14.8', 'S jump R 16 bounce', 'S air R 21', 'S go 21.5',
       'S jump R 24', 'B go 28.8', 'S go 29.6'])

# 90 ─────────────────────────────────────────────
m = room()
put(m, 6, 13, 'C'); put(m, 16, 13, 'b'); box(m, 18, 8, 21, 8); box(m, 25, 9, 30, 13)
put(m, 12, 11, 'o'); put(m, 19, 6, 'o'); put(m, 23, 10, 'o'); put(m, 1, 13, '12'); put(m, 29, 8, 'E')
L(name='Vineyard Finale', idea='Everything from the vineyards at once: the barrel opens the cellar door, Seka bounces up to ring the bell, and the bell sends Braco’s lift up — but only for a few seconds.',
  mech=['crate on a heavy plate', 'spring', 'timer-driven lift', 'long glide'],
  hint='{B} rolls the barrel onto the scale, then hops over the bale and waits on the lift. {S} bounces up to the bell on the shelf — {B} must step off the lift at the top before it sinks again. {S} glides over to the terrace.',
  map=rows(m),
  obj=[plate(10, 13, 'a', heavy=True), gate(13, 1, 'a', h=13), timer(20, 7, 'b', 5), lift(23, 13, (23, 9), w=2, ch='b', speed=110)],
  sol=['B go 4.8', 'B go 9.6', 'B jump R 12', 'B go 15.2', 'B jump R 18', 'B go 21.5', 'B jump R 23.6', 'S go 8.8', 'S jump R 12',
       'S go 14.8', 'S jump R 16 bounce', 'S air R 20', 'at 0 1', 'B go 28.8', 'S jump R 27 glide', 'S go 29.6'])
