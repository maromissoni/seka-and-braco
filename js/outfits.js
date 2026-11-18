/*
 * Wardrobe: 10 outfits for each character. Pure data — js/render.js draws them.
 * Outfits only change clothes and hats; faces, hair and silhouettes stay the same,
 * so the two characters are always easy to tell apart.
 *
 * Seka fields:  legs, shoes, top (torso), sleeve, inner (neckline, null = none),
 *               lapel (jacket edge lines), skirt {c, len, w, band}, neck, hat, pattern {kind, c}, apron
 * Braco fields: pants, shoes, shirt, sleeve, vest (side panels, null = none), lapel,
 *               neck, hat, pattern {kind, c}, shorts, sash, apron, buttons
 */
(function (root) {
  'use strict';
  var S = [
    { id: 'classic', name: 'Classic Black', legs: '#1f1d24', shoes: '#3b2a20', top: '#2c2b33', sleeve: '#2c2b33', inner: '#1f1d24', lapel: '#47454f', neck: 'necklace' },
    { id: 'reddress', name: 'Red Dress', legs: '#f2c8a8', shoes: '#9c1f24', top: '#c8282e', sleeve: '#f2c8a8', inner: null, skirt: { c: '#c8282e', len: -7, w: 15 }, neck: 'pearls' },
    { id: 'folk', name: 'Šokačka Folk', legs: '#fbf7ee', shoes: '#2b1d16', top: '#b8262a', sleeve: '#fbf7ee', inner: '#fbf7ee', skirt: { c: '#fbf7ee', len: -3, w: 15, band: '#c8282e' }, pattern: { kind: 'embroid', c: '#f2c14e' }, hat: 'flowers' },
    { id: 'gown', name: 'Ball Gown', legs: '#8e5bc8', shoes: '#5a3590', top: '#8e5bc8', sleeve: '#f2c8a8', inner: null, skirt: { c: '#8e5bc8', len: 1, w: 19, band: '#b38be0' }, neck: 'pearls', hat: 'tiara' },
    { id: 'tux', name: 'Tuxedo', legs: '#1c1b21', shoes: '#111014', top: '#1c1b21', sleeve: '#1c1b21', inner: '#fbf7ee', lapel: '#4a4852', neck: 'bow' },
    { id: 'sundress', name: 'Sunflower Sundress', legs: '#f2c8a8', shoes: '#c98a3a', top: '#f6c22b', sleeve: '#f2c8a8', inner: null, skirt: { c: '#f6c22b', len: -6, w: 16 }, pattern: { kind: 'flowers', c: '#fffaf0' }, hat: 'sunhat' },
    { id: 'winter', name: 'Winter Coat', legs: '#2c2b33', shoes: '#5a3a24', top: '#2f6b4f', sleeve: '#2f6b4f', inner: null, lapel: '#24533d', skirt: { c: '#2f6b4f', len: -11, w: 12 }, neck: 'scarf', hat: 'beanie', buttons: '#f2c94c' },
    { id: 'track', name: 'Tracksuit', legs: '#1f8f84', shoes: '#fbf7ee', top: '#1f8f84', sleeve: '#1f8f84', inner: '#fbf7ee', stripe: '#fbf7ee' },
    { id: 'chef', name: 'Festival Chef', legs: '#2c2b33', shoes: '#2b1d16', top: '#fbf7ee', sleeve: '#fbf7ee', inner: null, apron: '#de2f24', hat: 'chef', buttons: '#2c2b33' },
    { id: 'denim', name: 'Denim Day', legs: '#3d6aa8', shoes: '#fbf7ee', top: '#f2a516', sleeve: '#f2a516', inner: null, pattern: { kind: 'stripes', c: '#fffaf0' } }
  ];
  var B = [
    { id: 'classic', name: 'Classic Vest', pants: '#34466b', shoes: '#4a2f20', shirt: '#f3efe6', sleeve: '#f3efe6', vest: '#1f8f84', buttons: '#f2c94c' },
    { id: 'tux', name: 'Tuxedo', pants: '#1c1b21', shoes: '#111014', shirt: '#fbf7ee', sleeve: '#1c1b21', vest: '#1c1b21', lapel: '#4a4852', neck: 'bow' },
    { id: 'folk', name: 'Slavonian Folk', pants: '#fbf7ee', shoes: '#2b1d16', shirt: '#fbf7ee', sleeve: '#fbf7ee', vest: '#1f1d24', pattern: { kind: 'embroid', c: '#c8282e' }, sash: '#c8282e', hat: 'folkhat' },
    { id: 'suit', name: 'Navy Suit', pants: '#24345a', shoes: '#2b1d16', shirt: '#cfe0f2', sleeve: '#24345a', vest: '#24345a', lapel: '#3a4d7a', neck: 'tie' },
    { id: 'holiday', name: 'Holiday Shirt', pants: '#d8c29a', shoes: '#8a5a33', shirt: '#f07a3a', sleeve: '#f07a3a', vest: null, pattern: { kind: 'flowers', c: '#fff3c4' }, shorts: true },
    { id: 'chef', name: 'Festival Chef', pants: '#2c2b33', shoes: '#2b1d16', shirt: '#fbf7ee', sleeve: '#fbf7ee', vest: null, apron: '#1f8f84', hat: 'chef', buttons: '#2c2b33' },
    { id: 'flannel', name: 'Lumberjack', pants: '#3d6aa8', shoes: '#5a3a24', shirt: '#b8262a', sleeve: '#b8262a', vest: null, pattern: { kind: 'plaid', c: '#1f1d24' }, hat: 'beanie' },
    { id: 'fisher', name: 'Drava Fisherman', pants: '#2f5d3a', shoes: '#24442b', shirt: '#f2c14e', sleeve: '#f2c14e', vest: null, hat: 'souwester', buttons: '#2b1d16' },
    { id: 'hoodie', name: 'Cosy Hoodie', pants: '#2c2b33', shoes: '#fbf7ee', shirt: '#8a8f99', sleeve: '#8a8f99', vest: null, pocket: '#767b85', neck: 'cords' },
    { id: 'kit', name: 'Football Kit', pants: '#fbf7ee', shoes: '#1f1d24', shirt: '#3b82e0', sleeve: '#3b82e0', vest: null, pattern: { kind: 'stripes', c: '#fbf7ee' }, shorts: true, number: '10' }
  ];
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }
  root.SB_OUTFITS = {
    S: S, B: B,
    get: function (kind, id) { return find(kind === 'S' ? S : B, id); },
    ids: function (kind) { return (kind === 'S' ? S : B).map(function (o) { return o.id; }); }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SB_OUTFITS;
})(typeof window !== 'undefined' ? window : globalThis);
