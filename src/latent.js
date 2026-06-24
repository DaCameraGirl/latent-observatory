/* Latent Space Observatory — synthetic latent field generator
 *
 * Models a model's embedding space as a Gaussian mixture of "concept" clusters.
 * A `checkpoint` parameter (0 = start of training, 1 = converged) morphs the
 * field from a collapsed, overlapping blob into well-separated, sharpened
 * representations — the thing you actually watch happen during training.
 *
 * Fully deterministic (seeded) so the scene is stable frame-to-frame and the
 * checkpoint slider produces a smooth, reproducible morph.
 */
window.OBS = window.OBS || {};
(function (OBS) {
  'use strict';

  // Small, fast, seedable PRNG (mulberry32).
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Standard normal via Box-Muller.
  function gauss(rng) {
    var u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // Even point distribution on a sphere (Fibonacci lattice).
  function fibSphere(i, n) {
    var phi = Math.acos(1 - 2 * (i + 0.5) / n);
    var theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return [
      Math.cos(theta) * Math.sin(phi),
      Math.sin(theta) * Math.sin(phi),
      Math.cos(phi)
    ];
  }

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  /**
   * generate({ concepts, points, radius, seed, checkpoint }) -> field
   * field = { positions:Float32Array(N*3), concept:Int32Array(N),
   *           count, K, min:[x,y,z], max:[x,y,z], R }
   */
  function generate(opts) {
    var K = opts.concepts, N = opts.points, R = opts.radius || 10;
    var seed = opts.seed || 1337;
    var t = smoothstep(opts.checkpoint == null ? 1 : opts.checkpoint);
    var rng = mulberry32(seed);

    // Final converged centers spread on a sphere; initial centers collapsed
    // near the origin (representations start undifferentiated).
    var finals = [], inits = [];
    for (var k = 0; k < K; k++) {
      var s = fibSphere(k, K);
      finals.push([s[0] * R, s[1] * R, s[2] * R]);
      inits.push([
        (rng() * 2 - 1) * R * 0.18,
        (rng() * 2 - 1) * R * 0.18,
        (rng() * 2 - 1) * R * 0.18
      ]);
    }
    var centers = [];
    for (k = 0; k < K; k++) {
      centers.push([
        inits[k][0] + (finals[k][0] - inits[k][0]) * t,
        inits[k][1] + (finals[k][1] - inits[k][1]) * t,
        inits[k][2] + (finals[k][2] - inits[k][2]) * t
      ]);
    }

    // Intra-cluster spread shrinks as training sharpens representations.
    var spread = (0.9 - 0.72 * t) * R * 0.25;

    var pos = new Float32Array(N * 3);
    var concept = new Int32Array(N);
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    var per = Math.floor(N / K), idx = 0;

    for (k = 0; k < K; k++) {
      var count = (k === K - 1) ? (N - idx) : per;
      var c = centers[k];
      for (var j = 0; j < count; j++) {
        var x = c[0] + gauss(rng) * spread;
        var y = c[1] + gauss(rng) * spread;
        var z = c[2] + gauss(rng) * spread;
        pos[idx * 3] = x; pos[idx * 3 + 1] = y; pos[idx * 3 + 2] = z;
        concept[idx] = k;
        if (x < mn[0]) mn[0] = x; if (y < mn[1]) mn[1] = y; if (z < mn[2]) mn[2] = z;
        if (x > mx[0]) mx[0] = x; if (y > mx[1]) mx[1] = y; if (z > mx[2]) mx[2] = z;
        idx++;
      }
    }

    return { positions: pos, concept: concept, count: N, K: K, min: mn, max: mx, R: R };
  }

  OBS.latent = { generate: generate };
})(window.OBS);
