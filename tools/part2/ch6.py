import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
LEVELS = []
def L(**k): LEVELS.append(k)

# 51 ─────────────────────────────────────────────
m = room()
box(m, 5, 14, 6, 14, '^'); box(m, 9, 12, 10, 13); put(m, 10, 9, 'o'); put(m, 17, 8, 'o')
box(m, 22, 14, 24, 14, 'w'); put(m, 23, 10, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Lantern Walk', idea='A night-time warm-up along the fortress: spikes, a plate-and-lever relay and a bell bridge over the moat that only stays for four seconds.',
  mech=['spikes', 'plate-and-lever relay', 'shoulder ride', 'timed bridge'],
  hint='{B} holds the plate so {S} can reach the lever. Over the moat, {S} rings the bell and {B} has four seconds to cross the bridge.',
  map=rows(m),
  obj=[plate(12, 13, 'a'), gate(14, 1, 'a', h=13), lever(19, 13, 'a'), timer(27, 13, 'b', 4), gate(22, 14, 'b', w=3, inv=True),
       sign(3, 13, 'Part 2: things get trickier!')],
  sol=['B go 3.6', 'B rj R 4.1 7.5', 'B jump R 9.5', 'S go 3.6', 'S rj R 4.1 7.5', 'S jump R 9.5', 'S go 10', 'S jump N',
       'S go 13', 'B go 12', 'S go 19', 'S use', 'B go 17', 'S go 15.6', 'S jump R 17', 'S jump N', 'S go 21',
       'S rj R 21 25.5', 'B go 21', 'S go 27', 'B go 26', 'B go 28.8', 'S go 29.6'])

# 52 ─────────────────────────────────────────────
m = room()
box(m, 7, 14, 10, 14, 'w'); box(m, 17, 14, 20, 14, 'w'); box(m, 13, 10, 15, 11); box(m, 26, 12, 30, 13)
put(m, 9, 11, 'o'); put(m, 17, 6, 'o'); put(m, 28, 8, 'o'); put(m, 1, 13, '12'); put(m, 29, 11, 'E')
L(name='Moat Bridges', idea='Two moats, two bridges, and each bridge is switched from the wrong side. A heavy plate, a bell and a shoulder ride get both of you over.',
  mech=['bridges that appear while powered', 'heavy plate', 'timer bell', 'shoulder ride'],
  hint='{B} holds the heavy plate so the first bridge appears. {S} crosses and rings the bell so {B} can follow. Then boost {S} onto the floating rampart to pull the lever for the second bridge.',
  map=rows(m),
  obj=[plate(4, 13, 'a', heavy=True), gate(7, 14, 'a', w=4, inv=True), timer(12, 13, 'a', 3), lever(14, 9, 'b'), gate(17, 14, 'b', w=4, inv=True)],
  sol=['B go 4', 'S go 9', 'S jump N', 'S go 12', 'B go 11', 'S jump L 11', 'S jump R 14', 'B go 12', 'S go 14', 'S use',
       'S go 15.3', 'S jump R 17.2', 'S go 21', 'B go 22', 'B go 25.3', 'B jump R 27', 'S go 25.3', 'S jump R 28', 'S jump N',
       'B go 28.8', 'S go 29.6'])

# 53 ─────────────────────────────────────────────
m = room()
put(m, 1, 11, '-----'); put(m, 4, 8, '-----'); put(m, 1, 5, '--------')
box(m, 12, 5, 30, 6); box(m, 18, 7, 18, 13, 'X'); box(m, 25, 7, 30, 13)
put(m, 20, 13, 'C'); put(m, 3, 3, 'o'); put(m, 22, 12, 'o'); put(m, 26, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 4, 'E')
L(name='Watchtower', idea='Seka climbs the watchtower ledges while Braco works the cellar below: smash the wall, park the crate on the heavy plate, then ride the tower lift when Seka pulls the lever.',
  mech=['one-way ledges', 'cracked wall', 'crate on a heavy plate', 'lever-driven lift'],
  hint='{B}: walk into the cellar, smash the cracked wall and push the crate onto the heavy plate — that opens the gate up top for good. Then wait on the lift. {S}: climb the ledges, leap to the top and pull the lever.',
  map=rows(m),
  obj=[plate(24, 13, 'a', heavy=True), gate(20, 1, 'a', h=4), lever(13, 4, 'b'), lift(9, 14, (9, 5), w=3, ch='b', speed=120)],
  sol=['B go 12', 'B go 19', 'B go 23.2', 'B go 10',
       'S go 3', 'S jump N', 'S go 4.5', 'S jump N', 'S jump N', 'S go 3', 'S jump N', 'S go 7.5', 'S rj R 8.3 13', 'S use', 'at 0 1',
       'B go 14', 'S go 26', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 54 ─────────────────────────────────────────────
m = room()
box(m, 6, 14, 8, 14, '^'); box(m, 18, 11, 30, 13); put(m, 3, 13, 'C'); put(m, 10, 13, 'C')
put(m, 7, 11, 'o'); put(m, 17, 8, 'o'); put(m, 24, 6, 'o'); put(m, 1, 13, '12'); put(m, 29, 10, 'E')
L(name='Two Crates', idea='One crate has to fill the spike pit and the other has to hold a heavy plate — and later become a step. Push them in the right order.',
  mech=['crate fills a pit', 'crate on a heavy plate', 'lever', 'crate as a step'],
  hint='Push the first crate into the spike pit. Push the second onto the heavy plate so {S} can slip through and pull the lever, then shove it on to the wall as a step.',
  map=rows(m),
  obj=[plate(12, 13, 'a', heavy=True), gate(14, 1, 'a', h=13), lever(16, 13, 'a')],
  sol=['B go 5.2', 'B go 5', 'B rj R 6.7 10', 'B go 11.2', 'S go 5', 'S rj R 6.7 9.6', 'S go 12.5', 'S jump R 16', 'S use', 'S jump R 19.5',
       'B jump L 9.3', 'B go 16', 'B jump R 17', 'B jump R 19.5', 'B go 26',
       'S go 18.4', 'S jump L 17', 'S jump N', 'S jump R 20', 'S go 24', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 55 ─────────────────────────────────────────────
m = room()
box(m, 23, 12, 24, 13); put(m, 5, 13, 'C'); put(m, 12, 8, 'o'); put(m, 24, 9, 'o'); put(m, 26, 11, 'o')
put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Gatehouse', idea='The gatehouse only opens when two plates are pressed at once — but there are only two of you and both need to get through. A crate, a lever and a quick bell dash solve it.',
  mech=['gate needing two switches', 'crate on a plate', 'heavy plate', 'lever', 'timer bell'],
  hint='Put the crate on one plate and {B} on the heavy one. {S} slips through and pulls the lever, which replaces {B}’s plate. Further on, {S} rings the bell while {B} dashes for the last gate.',
  map=rows(m),
  obj=[plate(9, 13, 'a'), plate(12, 13, 'b', heavy=True), gate(15, 1, ['a', 'b'], h=13), lever(18, 13, 'b'),
       timer(20, 13, 'c', 3), gate(27, 1, 'c', h=13)],
  sol=['B go 7.6', 'B jump R 10.5', 'B go 12', 'S go 6.5', 'S jump R 10.6', 'S jump R 12', 'S jump N', 'S jump R 16', 'S go 18', 'S use',
       'B go 21.5', 'S go 20', 'B go 22.2', 'B jump R 24', 'B jump R 26', 'B go 28.8', 'S go 22.2', 'S jump R 24', 'S jump N',
       'S jump R 26.5', 'S go 29.6'])

# 56 ─────────────────────────────────────────────
m = room()
box(m, 1, 12, 3, 13); box(m, 4, 14, 27, 14, '^'); box(m, 19, 7, 21, 13); box(m, 28, 9, 30, 13)
put(m, 8, 9, 'o'); put(m, 17, 3, 'o'); put(m, 23, 5, 'o'); put(m, 1, 11, '12'); put(m, 29, 8, 'E')
L(name='Night Patrol', idea='A long spike-lined ditch crossed only by patrolling platforms. Board together, change lifts at the right moment and grab the treats on the way.',
  mech=['self-moving lifts', 'timing jumps', 'spikes'],
  hint='Step onto each platform as it arrives and stay close together. The lifts never stop — wait for the next one rather than jumping early.',
  map=rows(m),
  obj=[lift(4, 12, (12, 12), w=3, speed=100, pause=0.8), lift(16, 12, (16, 7), w=3, speed=90, pause=0.8),
       lift(22, 9, (25, 9), w=3, speed=80, pause=0.8)],
  sol=['B go 3', 'S go 2', 'at 0 1', 'at 0 0', 'B go 5.2 | S go 4.2', 'at 0 0.5', 'S jump R 10.3', 'at 1 0', 'at 0 1', 'B jump R 17.5', 'S jump R 16.6', 'at 1 1', 'S jump N',
       'S go 18.5 | B go 19.5', 'S go 20.5 | B go 21', 'at 2 0', 'B jump R 22.6', 'S jump R 24.2', 'at 2 1',
       'B jump R 28.8', 'S jump R 29.6', 'S go 29.6'])

# 57 ─────────────────────────────────────────────
m = room()
put(m, 2, 11, '---'); box(m, 5, 9, 26, 9); put(m, 10, 9, '==='); put(m, 18, 9, '===')
box(m, 8, 10, 8, 13, 'X'); box(m, 16, 10, 16, 13, 'X')
put(m, 14, 12, 'o'); put(m, 21, 5, 'o'); put(m, 27, 6, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Cracked Bastion', idea='Two paths through the bastion: Braco smashes along the vaults below while Seka balances on the ribbons above. Each opens the way for the other.',
  mech=['split paths', 'cracked walls', 'ribbons', 'levers from above', 'plate opens the upper gate'],
  hint='{S} climbs onto the rampart and pulls the levers on the ribbons to open {B}’s vault gates. {B} smashes the cracked walls and stands on the plate that opens {S}’s gate.',
  map=rows(m),
  obj=[lever(11, 8, 'a'), gate(13, 10, 'a', h=4), lever(19, 8, 'b'), gate(22, 10, 'b', h=4), plate(20, 13, 'c'), gate(24, 1, 'c', h=8)],
  sol=['B go 7', 'B go 9.5', 'S go 3', 'S jump N', 'S jump R 6', 'S go 11', 'S use', 'S go 19', 'S use', 'S go 21', 'S jump N',
       'B go 15', 'B go 20', 'S go 26', 'S jump R 27.5', 'B go 28.8', 'S go 29.6'])

# 58 ─────────────────────────────────────────────
m = room()
box(m, 6, 14, 12, 14, '^'); box(m, 18, 5, 30, 13)
put(m, 9, 11, 'o'); put(m, 17, 9, 'o'); put(m, 25, 2, 'o'); put(m, 1, 13, '12'); put(m, 29, 4, 'E')
L(name='Moonlit Toggle', idea='One lever does two jobs: it raises the spike bridge and sends the lift up. Switching it off and on at the right moments is the whole puzzle.',
  mech=['lever toggles a bridge and a lift together', 'lever-driven lifts', 'spikes'],
  hint='Lever ON = bridge solid and lift up. Cross together, then {S} switches it OFF to bring the lift down for {B} and ON again to send him up. Up top, {B} pulls the second lever for {S}’s lift.',
  map=rows(m),
  obj=[lever(3, 13, 'a'), gate(6, 14, 'a', w=7, inv=True), lift(16, 14, (16, 5), w=2, ch='a', speed=130),
       lift(14, 14, (14, 5), w=2, ch='b', speed=130), lever(19, 4, 'b')],
  sol=['S go 3', 'S use', 'B go 13.4', 'S use', 'at 0 0', 'B go 16.6', 'S use', 'at 0 1', 'B go 19.3', 'S go 9', 'S jump N',
       'S go 14.6', 'B use', 'at 1 1', 'S go 25', 'S jump N', 'B go 28.8', 'S go 29.6'])

# 59 ─────────────────────────────────────────────
m = room()
put(m, 9, 11, '---'); box(m, 18, 10, 20, 11); box(m, 25, 14, 26, 14, '^')
put(m, 10, 7, 'o'); put(m, 19, 6, 'o'); put(m, 25, 11, 'o'); put(m, 1, 13, '12'); put(m, 29, 13, 'E')
L(name='Bell Tower', idea='Every gate in the bell tower is opened from the wrong side, so you leapfrog: a heavy plate, a bell on a ledge, a plate and a bell, then a shoulder ride to the top lever.',
  mech=['heavy plate', 'timer bells', 'plate-and-bell relay', 'shoulder ride', 'spikes'],
  hint='{B} holds the heavy plate; {S} jumps onto the ledge bell so the gate stays open while {B} runs through. Next, {B} holds the plate and {S} rings the bell beyond. Finally boost {S} onto the beam to pull the lever.',
  map=rows(m),
  obj=[plate(4, 13, 'a', heavy=True), gate(7, 1, 'a', h=13), timer(10, 10, 'a', 2.5), plate(12, 13, 'b'), gate(14, 1, 'b', h=13),
       timer(16, 13, 'b', 2), lever(19, 9, 'c'), gate(23, 1, 'c', h=13)],
  sol=['B go 4', 'S go 8', 'S jump R 10', 'S jump N', 'B go 12', 'S jump R 15.2', 'S go 16', 'B go 15', 'S jump L 15', 'S jump R 19',
       'S use', 'S go 19', 'S jump N', 'S go 21.6', 'B go 22', 'B go 24', 'B rj R 24.2 27.6', 'S go 23.4', 'S rj R 24.2 28', 'B go 28.8', 'S go 29.6'])

# 60 ─────────────────────────────────────────────
m = room()
put(m, 4, 13, 'C'); box(m, 7, 14, 9, 14, '^'); box(m, 12, 1, 12, 13, 'X'); put(m, 15, 10, '--'); box(m, 25, 6, 30, 13)
put(m, 8, 11, 'o'); put(m, 15, 6, 'o'); put(m, 27, 3, 'o'); put(m, 1, 13, '12'); put(m, 29, 5, 'E')
L(name='Fortress Gate', idea='Chapter finale: fill the pit, smash the postern, power the double gate with a plate and a lever, ring the bell for Braco and ride the looping lift up the keep.',
  mech=['crate fills a pit', 'cracked wall', 'gate needing two switches', 'shoulder ride', 'timer bell', 'looping lift'],
  hint='Crate into the pit, then {B} smashes the wall and holds the plate. {S} climbs onto {B} and the ledge to pull the lever. Past the double gate {S} rings the bell so {B} can follow, then pull the last lever to start the lift.',
  map=rows(m),
  obj=[plate(14, 13, 'a'), lever(16, 9, 'b'), gate(18, 1, ['a', 'b'], h=13), timer(20, 13, 'a', 3),
       lever(22, 13, 'c'), lift(23, 14, (23, 6), w=2, ch='c', loop=True, speed=110, pause=0.8)],
  sol=['B go 6.2', 'B go 6', 'B rj R 7.6 10.5', 'B go 13', 'B go 14', 'S go 6', 'S rj R 7.6 10.5', 'S go 12.8', 'S jump R 14.5',
       'S jump R 15.5', 'S jump N', 'S go 16.3', 'S use', 'S go 20', 'B go 19', 'S go 22', 'S use', 'at 0 0', 'S go 23.3 | B go 24.2',
       'at 0 1', 'B go 26.5 | S go 25.6', 'S go 27', 'S jump N', 'B go 28.8', 'S go 29.6'])
