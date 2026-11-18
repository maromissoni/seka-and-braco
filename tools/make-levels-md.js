// Regenerates LEVELS.md from the level data:  node tools/make-levels-md.js
var path = require('path'), fs = require('fs');
var LV = require(path.join(__dirname, '..', 'js', 'levels.js'));
for (var c = 1; c <= 10; c++) require(path.join(__dirname, '..', 'js', 'levels-ch' + c + '.js'));

var out = ['# Level list', '',
  'All 100 levels, generated from the level files by `node tools/make-levels-md.js`.',
  'Every level is checked by `node tools/verify.js`, which plays it with a scripted solution',
  'using the real game physics and requires both players at the exit and all 3 treats collected.', '',
  'Jump limits used when designing: Seka climbs 3 blocks (about 3.4), Braco 2 (about 2.4);',
  'Seka standing on Braco reaches 4, Braco on Seka reaches 3. A hay bale launches about 7.5 blocks.', ''];
LV.CHAPTERS.forEach(function (ch, ci) {
  out.push('## Chapter ' + (ci + 1) + ': ' + ch.name, '', '_' + ch.blurb + ' Treat: ' + ch.foodName.toLowerCase() + '._', '');
  out.push('| # | Level | Idea | Mechanics |', '|---|---|---|---|');
  LV.LEVELS.slice(ci * 10, ci * 10 + 10).forEach(function (l) {
    var idea = l.idea.replace(/\|/g, '/');
    out.push('| ' + l.id + ' | ' + l.name + ' | ' + idea + ' | ' + l.mech.join(', ') + ' |');
  });
  out.push('');
});
fs.writeFileSync(path.join(__dirname, '..', 'LEVELS.md'), out.join('\n'));
console.log('LEVELS.md written (' + LV.LEVELS.length + ' levels)');
