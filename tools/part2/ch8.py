import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
LEVELS = []
def L(**k): LEVELS.append(k)

# 71 ─────────────────────────────────────────────
m = room()
box(m, 3, 14, 26, 14, 'w'); put(m, 3, 12, '------'); put(m, 11, 12, '-----'); put(m, 20, 12, '-----'); box(m, 27, 13, 30, 13)
put(m, 9, 10, 'o'); put(m, 17, 8, 'o'); put(m, 26, 10, 'o'); put(m, 1, 13, '12'); put(m, 29, 12, 'E')
L(name='Boardwalk', idea='Welcome to the marshes of Kopački rit. The boardwalk has a gap too wide to jump — Seka glides over and starts the reed raft for Braco.',
  mech=['one-way boardwalk', 'long glide', 'lever-powered looping raft', 'marsh water'],
  hint='Hop along the boardwalk. At the wide gap, {S} glides across and pulls the lever so the raft starts ferrying {B} over.',
  map=rows(m),
  obj=[lift(16, 12, (18, 12), w=2, ch='a', loop=True, skin='raft', speed=60, pause=0.8), lever(21, 11, 'a'),
       sign(1, 13, 'Kopački rit nature park')],
  sol=['B jump R 4', 'B go 7.5', 'S jump R 4.5', 'S go 6.5', 'B go 8.3', 'B rj R 8.5 12', 'S go 8.2', 'S rj R 8.5 12.8',
       'S go 15.3', 'S jump R 21 glide', 'S go 21.3', 'S use', 'S go 23.5', 'B go 15.2', 'at 0 0', 'B go 16.8', 'at 0 1', 'B go 21.5',
       'B go 24.3', 'B rj R 24.5 28', 'S go 24.2', 'S rj R 24.5 28.8', 'B go 28.8', 'S go 29.6'])

# 72 ─────────────────────────────────────────────
m = room()
put(m, 5, 13, 'C'); box(m, 7, 14, 22, 14, 'w')
put(m, 3, 9, 'o'); put(m, 23, 9, 'o'); put(m, 28, 9, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Raft Ferry', idea='The far gate needs a heavy weight on its plate, but nobody can stay behind. Load the crate onto the ferry raft and bring it across.',
  mech=['self-moving raft', 'crate rides the raft', 'crate on a heavy plate', 'marsh water'],
  hint='{B} pushes the crate onto the raft and rides with it. On the far bank, push it onto the heavy plate. {S} catches the next raft.',
  map=rows(m),
  obj=[lift(7, 14, (20, 14), w=3, skin='raft', speed=80, pause=1.5), plate(25, 13, 'a', heavy=True), gate(27, 1, 'a', h=13)],
  sol=['S go 3', 'S jump N', 'S go 1', 'at 0 1', 'at 0 0', 'B go 7.3', 'at 0 1', 'B go 23.2', 'B go 24.1', 'S go 6', 'at 0 0', 'S go 8.3',
       'at 0 1', 'S go 23', 'S jump N', 'B go 23.5', 'B jump R 27', 'S jump R 27.5', 'S go 28', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 73 ─────────────────────────────────────────────
m = room()
box(m, 3, 14, 22, 14, 'w'); box(m, 23, 9, 30, 13)
put(m, 5, 6, 'o'); put(m, 12, 5, 'o'); put(m, 27, 6, 'o'); put(m, 1, 13, '21'); put(m, 29, 8, 'E')
L(name='Lily Pads', idea='Giant lily-pad rafts bob up and down in turns. Seka hops across first to open the gate on the far bank while Braco keeps the plate pressed.',
  mech=['bobbing rafts in opposite phases', 'timing jumps', 'plate-and-lever relay', 'marsh water'],
  hint='Neighbouring pads move in opposite directions — jump when they are level. {B} holds the plate at the start until {S} pulls the lever on the far bank.',
  map=rows(m),
  obj=[plate(1, 13, 'a'), gate(26, 1, 'a', h=8), lever(28, 8, 'a'),
       lift(3, 12, (3, 8), w=2, skin='raft', speed=70, pause=0.6), lift(7, 8, (7, 12), w=2, skin='raft', speed=70, pause=0.6),
       lift(11, 12, (11, 8), w=2, skin='raft', speed=70, pause=0.6), lift(15, 8, (15, 12), w=2, skin='raft', speed=70, pause=0.6),
       lift(19, 12, (19, 8), w=2, skin='raft', speed=70, pause=0.6)],
  sol=['S go 2', 'at 0 0', 'S jump R 3.8', 'at 0 0.5', 'S jump R 7.8', 'at 2 0.5', 'S jump R 11.8', 'at 2 1', 'S jump N',
       'at 3 0.5', 'S jump R 15.8', 'at 4 0.5', 'S jump R 19.8', 'at 4 1', 'S jump R 24', 'S go 28', 'S use',
       'B go 2', 'at 0 0', 'B jump R 3.8', 'at 0 0.5', 'B jump R 7.8', 'at 2 0.5', 'B jump R 11.8', 'at 3 0.5', 'B jump R 15.8',
       'at 4 0.5', 'B jump R 19.8', 'at 4 1', 'B jump R 24', 'B go 28.8', 'S go 27', 'S jump N', 'S go 29.6'])

# 74 ─────────────────────────────────────────────
m = room()
box(m, 4, 14, 27, 14, 'w'); box(m, 1, 12, 3, 13); box(m, 10, 12, 12, 13); box(m, 19, 12, 21, 13)
put(m, 7, 9, 'o'); put(m, 16, 8, 'o'); put(m, 24, 8, 'o'); put(m, 1, 11, '12'); put(m, 29, 13, 'E')
L(name='Fishing Huts', idea='Three rafts link the fishing huts. Two of them share one switch, so turning it on to ferry Braco also sends the last raft away — switch it off again in time.',
  mech=['lever-driven rafts', 'two rafts on one switch', 'long glides', 'marsh water'],
  hint='Levers move a raft over while ON and bring it back when OFF. The first and last rafts share a switch: after ferrying {B}, switch the start lever OFF so the last raft comes back. Glide between the huts.',
  map=rows(m),
  obj=[lever(2, 11, 'a'), lift(4, 14, (7, 14), w=3, ch='a', skin='raft', speed=110), lever(11, 11, 'b'),
       lift(13, 14, (16, 14), w=3, ch='b', skin='raft', speed=110), lever(20, 11, 'a'), lift(22, 14, (25, 14), w=3, ch='a', skin='raft', speed=110)],
  sol=['B go 5.5', 'S go 2.3', 'S use', 'at 0 1', 'B jump R 11.3', 'S use', 'at 2 0', 'S go 3.3', 'S jump R 10.5 glide', 'B go 14.2', 'S go 11.2', 'S use',
       'at 1 1', 'B jump R 20.3', 'S go 12.5', 'S jump R 19.3 glide', 'B go 23.2', 'S go 20.3', 'S use', 'at 2 1', 'B go 28.8',
       'S go 21.4', 'S jump R 28 glide', 'S go 29.6'])

# 75 ─────────────────────────────────────────────
m = room()
put(m, 2, 11, '---'); box(m, 5, 9, 26, 9); box(m, 9, 10, 9, 13, 'X'); put(m, 17, 13, 'C')
put(m, 11, 12, 'o'); put(m, 20, 5, 'o'); put(m, 28, 6, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Reed Labyrinth', idea='The reed beds split into an upper and a lower path, and every gate is controlled from the other one — with a crate to keep the third gate open for good.',
  mech=['split paths', 'cracked reed wall', 'plate opens the upper gate', 'levers from above', 'crate on a heavy plate'],
  hint='{B} smashes the reeds and stands on the plate so {S} can pass upstairs. {S} pulls levers for {B}’s gates. {B} pushes the crate onto the heavy plate to open {S}’s last gate.',
  map=rows(m),
  obj=[plate(12, 13, 'a'), gate(14, 1, 'a', h=8), lever(17, 8, 'b'), gate(15, 10, 'b', h=4),
       plate(22, 13, 'c', heavy=True), gate(24, 1, 'c', h=8), lever(25, 8, 'd'), gate(25, 10, 'd', h=4)],
  sol=['B go 8', 'B go 12', 'S go 3', 'S jump N', 'S jump R 6', 'S go 17', 'S use', 'S go 20', 'S jump N', 'S go 22.5',
       'B go 15.7', 'B go 21.1', 'S go 25', 'S use', 'S go 26', 'S jump R 28', 'B jump R 23.6', 'B go 28.8', 'S go 29.6'])

# 76 ─────────────────────────────────────────────
m = room()
box(m, 6, 10, 30, 13); box(m, 14, 6, 30, 9); box(m, 22, 3, 30, 5)
put(m, 4, 9, 'o'); put(m, 12, 5, 'o'); put(m, 26, 1, 'o'); put(m, 1, 13, '12'); put(m, 29, 2, 'E')
L(name='Heron Watch', idea='The bird-watching tower has three tall steps. Twice Seka climbs on Braco and sends a lift down for him; at the last step it is Braco’s turn to stand on Seka.',
  mech=['Seka stands on Braco', 'Braco stands on Seka', 'lever-driven lifts'],
  hint='{B} waits on the lift by the step and {S} jumps from his head to the top, then pulls the lever. Repeat at the second step. At the last one, {S} waits by the wall and {B} climbs on her.',
  map=rows(m),
  obj=[lift(4, 14, (4, 10), w=2, ch='a', speed=100), lever(8, 9, 'a'), lift(12, 10, (12, 6), w=2, ch='b', speed=100), lever(16, 5, 'b')],
  sol=['B go 5.2', 'S go 3.3', 'S jump R 5.2', 'S jump R 7', 'S go 8.3', 'S use', 'at 0 1', 'B go 13.2', 'S go 11.3', 'S jump R 13.2',
       'S jump R 15', 'S go 16.3', 'S use', 'at 1 1', 'S go 21.2', 'B go 19.4', 'B jump R 21.2', 'B jump R 23', 'B go 25', 'S jump R 23.5',
       'S go 26', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 77 ─────────────────────────────────────────────
m = room()
put(m, 3, 11, '---'); box(m, 6, 9, 20, 9); box(m, 20, 10, 20, 13, 'X'); box(m, 8, 10, 8, 13, 'X'); box(m, 15, 10, 15, 13, 'X'); put(m, 17, 13, 'C')
put(m, 13, 12, 'o'); put(m, 18, 6, 'o'); put(m, 25, 10, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Beaver Lodge', idea='The heavy plate is deep inside the beaver lodge and the only crate is jammed at the back. Braco smashes in, hops over the crate and shoves it back to the plate while Seka works the lever on the roof.',
  mech=['cracked walls', 'lever from the roof', 'pushing a crate backwards', 'crate on a heavy plate'],
  hint='{S} climbs onto the lodge roof and pulls the lever to open the inner gate. {B} smashes both reed walls, jumps over the crate and pushes it left onto the heavy plate — that opens the far gate for good.',
  map=rows(m),
  obj=[lever(13, 8, 'b'), gate(12, 10, 'b', h=4), plate(10, 13, 'a', heavy=True), gate(23, 1, 'a', h=13)],
  sol=['S go 4', 'S jump N', 'S jump R 7', 'S go 13.3', 'S use', 'S go 18', 'S jump N', 'B go 7', 'B go 9.5', 'B go 14', 'B go 16',
       'B jump R 18.8', 'B go 11.3', 'S go 19.6', 'S jump R 22', 'B go 18.5', 'B go 21.5', 'B go 26', 'S go 25', 'S jump N',
       'B go 28.8', 'S go 29.6'])

# 78 ─────────────────────────────────────────────
m = room()
box(m, 3, 14, 26, 14, 'w'); put(m, 5, 14, '#'); put(m, 5, 13, 'b'); put(m, 11, 14, '#'); put(m, 11, 13, 'b'); put(m, 17, 14, '#'); put(m, 17, 13, 'b')
put(m, 20, 6, '###')
put(m, 8, 4, 'o'); put(m, 14, 4, 'o'); put(m, 21, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Spring Marsh', idea='Springy tussocks are the only way over the marsh. Both bounce up to the high roost — the bell there only holds the far gate for three seconds, so leap for the bank together.',
  mech=['spring chains', 'steering in mid-air', 'timer bell on a high roost', 'marsh water'],
  hint='Bounce from tussock to tussock, steering in the air. {B} goes first and waits on the roost; {S} lands on the bell, then you both jump for the gate at once.',
  map=rows(m),
  obj=[timer(21, 5, 'a', 3), gate(28, 1, 'a', h=13)],
  sol=['B go 2', 'B jump R 5 bounce', 'B air R 11', 'B air R 17', 'B air R 21', 'B go 22.3',
       'S go 2', 'S jump R 5 bounce', 'S air R 11', 'S air R 17', 'S air R 20.6', 'S go 20.8', 'S jump N',
       'S jump R 29 glide | B jump R 28', 'B go 28.8', 'S go 29.6'])

# 79 ─────────────────────────────────────────────
m = room()
box(m, 15, 6, 23, 6); put(m, 22, 5, 'C')
put(m, 14, 9, 'o'); put(m, 20, 3, 'o'); put(m, 26, 9, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Bird Hide', idea='The heavy plate is on the ground but the only crate is up in the bird hide. Seka rings the lift bell, dashes to hold the hide’s gate open, and Braco drops the crate onto the plate below.',
  mech=['bell-powered looping lift', 'plate opens a gate up high', 'dropping a crate onto a heavy plate'],
  hint='{B} waits on the lift. {S} rings the bell, then runs to the plate so the gate in the hide opens. {B} pushes the crate off the edge — it lands right on the heavy plate.',
  map=rows(m),
  obj=[timer(16, 13, 'b', 5), lift(13, 13, (13, 6), w=2, ch='b', loop=True, speed=120, pause=0.6), plate(18, 13, 'c'),
       gate(19, 1, 'c', h=5), plate(24, 13, 'a', heavy=True), gate(27, 1, 'a', h=13)],
  sol=['B go 12.3', 'B jump R 13.9', 'S go 16', 'S go 18', 'at 0 1', 'B go 20', 'B jump N', 'B go 23.2', 'B go 22', 'S go 22.8', 'S jump R 26.5', 'S jump N', 'B go 24.6', 'B jump R 27.5',
       'B go 28.8', 'S go 29.6'])

# 80 ─────────────────────────────────────────────
m = room()
put(m, 4, 13, 'C'); box(m, 6, 14, 14, 14, 'w'); put(m, 21, 13, 'b'); put(m, 23, 6, '#####'); put(m, 25, 14, '^^')
put(m, 16, 10, 'o'); put(m, 22, 6, 'o'); put(m, 25, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Rit Finale', idea='Marsh finale: start the raft, ferry the crate to the island’s heavy plate, then bounce up to the heron roost for the last lever.',
  mech=['lever-powered looping raft', 'crate rides the raft', 'crate on a heavy plate', 'spring', 'lever on a high roost'],
  hint='{S} pulls the lever so the raft runs. {B} pushes the crate onto the raft and then onto the heavy plate on the island. {S} bounces off the spring onto the roost and pulls the last lever.',
  map=rows(m),
  obj=[lever(3, 13, 'a'), lift(6, 14, (12, 14), w=3, ch='a', loop=True, skin='raft', speed=100, pause=1.0),
       plate(17, 13, 'b', heavy=True), gate(19, 1, 'b', h=13), lever(25, 5, 'c'), gate(28, 1, 'c', h=13)],
  sol=['S go 3', 'S use', 'at 0 1', 'at 0 0', 'B go 6.2', 'at 0 1', 'B go 15.8', 'B jump R 19.5', 'B jump R 23.5',
       'at 0 0', 'S go 7.2', 'at 0 1', 'S go 16', 'S jump N', 'S jump R 18.6', 'S go 19.8', 'S jump R 21 bounce', 'S air R 25',
       'S go 25', 'S use', 'S jump N', 'S jump R 29', 'B rj R 23.9 28', 'B go 28.8', 'S go 29.6'])
