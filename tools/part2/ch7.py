import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
LEVELS = []
def L(**k): LEVELS.append(k)

# 61 ─────────────────────────────────────────────
m = room()
box(m, 6, 14, 20, 14, 'w'); box(m, 27, 12, 30, 13)
put(m, 12, 10, 'o'); put(m, 24, 9, 'o'); put(m, 28, 8, 'o'); put(m, 1, 13, '12'); put(m, 29, 11, 'E')
L(name='First Snow', idea='The winter tram only runs while someone presses a switch. The plate is at the start and the bell is at the far stop, so you take turns riding.',
  mech=['looping tram', 'plate and bell share a channel', 'icy river'],
  hint='{B} stands on the plate so the tram runs and {S} rides across. At the far stop {S} stands on the bell to keep the tram running for {B}.',
  map=rows(m),
  obj=[plate(3, 13, 'a'), lift(6, 14, (18, 14), w=3, ch='a', loop=True, skin='tram', speed=120, pause=0.6), timer(24, 13, 'a', 5),
       sign(4, 13, 'Tram stop: Advent market')],
  sol=['B go 3', 'S go 5.3', 'at 0 0', 'S go 7', 'at 0 0.35', 'S jump R 13.5', 'at 0 1', 'S go 24',
       'B go 5.3', 'at 0 0', 'B go 7.2', 'at 0 1', 'B go 22', 'S jump N', 'B go 25.3', 'B jump R 27.5',
       'S go 25.3', 'S jump R 28', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 62 ─────────────────────────────────────────────
m = room()
box(m, 8, 11, 30, 13); box(m, 16, 7, 30, 10)
put(m, 3, 9, 'o'); put(m, 11, 6, 'o'); put(m, 24, 3, 'o'); put(m, 1, 13, '12'); put(m, 29, 6, 'E')
L(name='Gingerbread Steps', idea='Giant gingerbread steps: the first is too tall for Braco, so he climbs on Seka. The second is too tall for anyone, so Seka climbs on Braco and sends a lift down for him.',
  mech=['Braco stands on Seka', 'Seka stands on Braco', 'lever-driven lift'],
  hint='{S} waits by the first step and {B} jumps on her head to climb it. At the tall step, {B} waits on the lift and {S} uses his head to get up, then pulls the lever.',
  map=rows(m),
  obj=[lift(13, 11, (13, 7), w=3, ch='a', speed=110), lever(18, 6, 'a')],
  sol=['S go 3', 'S jump N', 'S go 6.8', 'B go 5.3', 'B jump R 6.8', 'B jump R 9.5', 'B go 12', 'S jump R 10', 'S go 11', 'S jump N',
       'B go 14.4', 'S go 12.4', 'S jump R 14.4', 'S jump R 17', 'S go 18', 'S use', 'at 0 1', 'B go 17', 'S go 24', 'S jump N',
       'B go 28.8', 'S go 29.6'])

# 63 ─────────────────────────────────────────────
m = room()
box(m, 4, 14, 27, 14, 'w'); box(m, 14, 12, 16, 14); box(m, 28, 12, 30, 13)
put(m, 9, 10, 'o'); put(m, 15, 8, 'o'); put(m, 22, 10, 'o'); put(m, 1, 13, '12'); put(m, 29, 11, 'E')
L(name='Tram Depot', idea='Hop off the first tram at the depot island, then switch on the second line and catch it to the far platform.',
  mech=['self-moving tram', 'lever-powered looping tram', 'timing jumps', 'icy river'],
  hint='Board the first tram together. At the island, pull the lever to start the second tram and step on when it pulls in.',
  map=rows(m),
  obj=[lift(4, 14, (11, 14), w=3, skin='tram', speed=110, pause=0.9), lever(15, 11, 'b'),
       lift(17, 14, (25, 14), w=3, ch='b', loop=True, skin='tram', speed=110, pause=0.9)],
  sol=['B go 3', 'S go 2', 'at 0 1', 'at 0 0', 'B go 5.2 | S go 4.2', 'at 0 0.45', 'S jump R 10.6', 'at 0 1', 'B jump R 14.4', 'S jump R 15.5',
       'S jump N', 'S use', 'at 1 0', 'B go 17.4 | S go 18.8', 'at 1 0.3', 'S jump R 22.8', 'at 1 1', 'B jump R 28.8', 'S jump R 29.6', 'S go 29.6'])

# 64 ─────────────────────────────────────────────
m = room()
put(m, 3, 11, '---'); put(m, 6, 9, '==================='); box(m, 13, 10, 13, 13, 'X')
put(m, 14, 12, 'o'); put(m, 20, 5, 'o'); put(m, 24, 12, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Advent Lights', idea='Seka walks the strings of Advent lights while Braco works below. The last gate needs both bells ringing at once, one up in the lights and one on the ground.',
  mech=['ribbon walkway', 'plate opens the upper gate', 'lever from above', 'cracked wall', 'gate needing two bells'],
  hint='{B} stands on the plate so {S} can pass the gate on the lights, then {S} pulls the lever for {B}. Ring both bells together — one on the lights, one below — and run for the door.',
  map=rows(m),
  obj=[plate(10, 13, 'c'), gate(15, 1, 'c', h=8), lever(17, 8, 'd'), gate(18, 10, 'd', h=4),
       timer(22, 8, 'a', 3), timer(22, 13, 'b', 3), gate(27, 1, ['a', 'b'], h=13)],
  sol=['S go 4', 'S jump N', 'S jump R 7', 'B go 10', 'S go 17', 'S use', 'S go 20', 'S jump N', 'S go 22',
       'B go 14', 'B go 22', 'S go 25.6', 'B go 28.8', 'S go 29.6'])

# 65 ─────────────────────────────────────────────
m = room()
put(m, 5, 13, 'b'); put(m, 8, 6, '#####'); put(m, 19, 13, 'b'); put(m, 21, 6, '#####')
put(m, 7, 5, 'o'); put(m, 14, 9, 'o'); put(m, 23, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Snow Trampolines', idea='Snow-packed hay bales fling you up to the market roofs. One roof has the lever, the other has a bell — and Braco has to dash through before it stops ringing.',
  mech=['springs', 'lever on a roof', 'timer bell dash'],
  hint='{S} bounces up to the first roof and pulls the lever. Then {S} bounces onto the second roof to ring the bell — {B}, run for the last gate (jump over the bale!).',
  map=rows(m),
  obj=[lever(10, 5, 'a'), gate(16, 1, 'a', h=13), timer(23, 5, 'b', 4), gate(28, 1, 'b', h=13)],
  sol=['S go 3.8', 'S jump R 5 bounce', 'S air R 10', 'S go 10', 'S use', 'S go 12.4', 'S jump R 14.2', 'B go 4', 'B jump R 7', 'B go 17', 'S go 17.6',
       'S jump R 19 bounce', 'S air R 23', 'S go 23', 'S jump N', 'B go 17.9', 'B jump R 21', 'B go 28.8', 'S go 25.7', 'S go 29.6'])

# 66 ─────────────────────────────────────────────
m = room()
put(m, 4, 13, 'C'); box(m, 8, 14, 12, 14, 'w'); box(m, 22, 10, 24, 11); box(m, 26, 1, 26, 13, 'X')
put(m, 10, 11, 'o'); put(m, 23, 7, 'o'); put(m, 28, 10, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Frozen Fountain', idea='The ice bridge melts away the moment the heavy plate is pressed — but the plate is also the only way through the gate. Ferry the crate across first.',
  mech=['bridge that vanishes while powered', 'crate on a heavy plate', 'shoulder ride', 'cracked wall'],
  hint='Cross the ice bridge together while it is still there, and bring the crate with you. Push it onto the heavy plate to open the gate for good.',
  map=rows(m),
  obj=[gate(8, 14, 'a', w=5), plate(16, 13, 'a', heavy=True), gate(19, 1, 'a', h=13)],
  sol=['S go 3', 'S jump R 6', 'S go 9.5', 'S jump N', 'S go 18', 'B go 15.2', 'B jump R 18.5', 'S go 21', 'B go 21.3', 'S go 20', 'S jump R 21.3', 'S jump R 23', 'S jump N',
       'S jump R 25', 'B go 27.5', 'S go 28', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 67 ─────────────────────────────────────────────
m = room()
put(m, 6, 11, '-----'); put(m, 2, 8, '-----'); put(m, 6, 5, '------'); box(m, 14, 4, 30, 4)
put(m, 3, 6, 'o'); put(m, 13, 9, 'o'); put(m, 26, 1, 'o'); put(m, 1, 13, '12'); put(m, 29, 3, 'E')
L(name='Clock Tower', idea='Climb the clock tower ledges while Braco holds the heavy plate, open the top gate for good, then ring the bell that runs his lift.',
  mech=['one-way ledges', 'heavy plate', 'lever', 'bell-powered looping lift'],
  hint='{B} stands on the heavy plate while {S} climbs and pulls the lever behind the gate. Then {B} waits on the lift and {S} rings the bell at the top.',
  map=rows(m),
  obj=[plate(4, 13, 'b', heavy=True), gate(20, 1, 'b', h=3), lever(22, 3, 'b'), timer(16, 3, 'a', 6),
       lift(12, 14, (12, 4), w=2, ch='a', loop=True, speed=140, pause=0.6)],
  sol=['B go 4', 'S go 8', 'S jump N', 'S go 5.5', 'S jump N', 'S go 3', 'S jump N', 'S go 6.5', 'S jump N', 'S go 10.6',
       'S rj R 11.2 15', 'S go 22', 'S use', 'B go 12.9', 'S go 16', 'at 0 1', 'B go 18', 'S go 26', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 68 ─────────────────────────────────────────────
m = room()
box(m, 21, 1, 21, 13, 'X'); put(m, 23, 13, 'C')
put(m, 13, 10, 'o'); put(m, 18, 9, 'o'); put(m, 24, 11, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Cathedral Square', idea='The cathedral gates are linked: when one opens, the other shuts. Step on and off the plate in the right order, then use a bell to let Braco through while the far gate is shut.',
  mech=['linked gates (one opens, one closes)', 'plate and bell share a channel', 'cracked wall', 'crate on a heavy plate'],
  hint='Plate ON: first gate open, second gate shut. {S} goes between the gates, {B} steps off, {S} goes on and rings the bell so {B} can reach the middle. Wait for the bell to stop and the second gate opens.',
  map=rows(m),
  obj=[plate(8, 13, 'a'), gate(11, 1, 'a', h=13), gate(15, 1, 'a', h=13, inv=True), timer(18, 13, 'a', 3),
       plate(26, 13, 'b', heavy=True), gate(28, 1, 'b', h=13)],
  sol=['B go 8', 'S go 12.4', 'S jump N', 'B go 6', 'S go 17', 'S go 18', 'S jump N', 'S go 19.6', 'B go 13', 'wait 3.2', 'B go 20',
       'B go 24.2', 'S go 22.7', 'S jump N', 'S jump R 25', 'B go 28.8', 'S go 29.6'])

# 69 ─────────────────────────────────────────────
m = room()
box(m, 3, 14, 28, 14, 'w'); box(m, 12, 12, 14, 14); box(m, 27, 12, 30, 14)
put(m, 7, 10, 'o'); put(m, 13, 8, 'o'); put(m, 28, 8, 'o'); put(m, 1, 13, '12'); put(m, 29, 11, 'E')
L(name='Skating Line', idea='A shuttle tram to the island, then a second tram that only runs while someone presses a switch: the heavy plate on the island or the bell at the far end.',
  mech=['self-moving tram', 'heavy plate and bell share a channel', 'looping tram', 'icy river'],
  hint='Ride the shuttle to the island. {B} stands on the heavy plate while {S} rides the second tram and stands on the bell at the end. Then {B} catches the tram.',
  map=rows(m),
  obj=[lift(3, 14, (9, 14), w=3, skin='tram', speed=100, pause=0.9), plate(13, 11, 'b', heavy=True),
       lift(15, 14, (24, 14), w=3, ch='b', loop=True, skin='tram', speed=110, pause=0.8), timer(27, 11, 'b', 6)],
  sol=['B go 2', 'S go 1', 'at 0 1', 'at 0 0', 'B go 4.6 | S go 3.4', 'at 0 0.4', 'S jump R 8.4', 'at 0 1', 'B jump R 13', 'S jump R 12.3',
       'S jump N', 'at 1 0', 'S jump R 15.8', 'at 1 1', 'S jump R 27.2', 'S go 28', 'S jump N', 'S go 27',
       'B go 14.3', 'at 1 0', 'B jump R 16.2', 'at 1 1', 'B jump R 29', 'B go 28.8', 'S go 29.6'])

# 70 ─────────────────────────────────────────────
m = room()
put(m, 5, 13, 'C'); box(m, 8, 14, 10, 14, 'w'); box(m, 13, 11, 30, 13); box(m, 17, 11, 20, 13, '.')
put(m, 16, 8, '======'); put(m, 25, 8, '--')
put(m, 9, 11, 'o'); put(m, 19, 5, 'o'); put(m, 26, 4, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Advent Finale', idea='Chapter finale in the Advent market: fill the icy pit, give Braco a lift up the step, cross the string lights to lower his bridge, then ring the bell on the ledge so he can dash through.',
  mech=['crate fills a pit', 'Braco stands on Seka', 'ribbon walkway', 'bridge lever', 'timer bell on a ledge'],
  hint='Crate into the pit. {S} waits by the tall step so {B} can climb on her. {S} crosses the lights and pulls the lever for {B}’s bridge, then rings the bell on the ledge for the last gate.',
  map=rows(m),
  obj=[lever(22, 10, 'a'), gate(17, 11, 'a', w=4, inv=True), timer(26, 7, 'c', 3), gate(27, 1, 'c', h=10)],
  sol=['B go 7.2', 'B go 7', 'B rj R 8.6 11.5', 'S go 7', 'S rj R 8.6 11', 'S go 12.2', 'B go 10.4', 'B jump R 12.2', 'B jump R 14',
       'B go 15.5', 'S jump R 14.2', 'S go 15.3', 'S jump R 17', 'S go 19', 'S jump N', 'S go 21.5', 'S jump R 22.3', 'S use',
       'B go 24', 'S go 24.2', 'S jump R 26', 'S jump N', 'B go 28.8', 'S go 29.6'])
