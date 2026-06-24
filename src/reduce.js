/* Latent Space Observatory — dimensionality reduction (shared)
 *
 * Universal module: attaches to `self` so it works both on the main thread
 * (window.OBS.reduce) and inside a Web Worker (self.OBS.reduce via importScripts).
 *
 *   pca3(data, N, D)      -> Float32Array(N*3)  top-3 principal components
 *   scaleCoords(coords,R) -> coords scaled to fit radius R (in place)
 *   kmeans(coords,N,k,it) -> { assign:Int32Array, k }
 */
(function (root) {
  'use strict';
  root.OBS = root.OBS || {};

  function norm(v) { var s = 0; for (var i = 0; i < v.length; i++) s += v[i] * v[i]; return Math.sqrt(s); }
  function matVec(C, v, D, out) {
    for (var a = 0; a < D; a++) {
      var s = 0, row = a * D;
      for (var b = 0; b < D; b++) s += C[row + b] * v[b];
      out[a] = s;
    }
  }

  // Top-3 PCA via power iteration with deflation. Handles D < 3 (pads with 0).
  function pca3(data, N, D) {
    var K = Math.min(3, D), i, j, a, b;
    var mean = new Float64Array(D);
    for (i = 0; i < N; i++) for (j = 0; j < D; j++) mean[j] += data[i * D + j];
    for (j = 0; j < D; j++) mean[j] /= N;

    var X = new Float64Array(N * D);
    for (i = 0; i < N; i++) for (j = 0; j < D; j++) X[i * D + j] = data[i * D + j] - mean[j];

    var C = new Float64Array(D * D);
    for (i = 0; i < N; i++) {
      var off = i * D;
      for (a = 0; a < D; a++) {
        var xa = X[off + a];
        if (xa === 0) continue;
        var row = a * D;
        for (b = a; b < D; b++) C[row + b] += xa * X[off + b];
      }
    }
    var denom = (N - 1) || 1;
    for (a = 0; a < D; a++) for (b = a; b < D; b++) {
      var val = C[a * D + b] / denom; C[a * D + b] = val; C[b * D + a] = val;
    }

    var comps = [], tmp = new Float64Array(D);
    for (var comp = 0; comp < K; comp++) {
      var v = new Float64Array(D);
      for (j = 0; j < D; j++) v[j] = Math.sin(j * 0.13 + comp + 1); // deterministic seed
      var n0 = norm(v); for (j = 0; j < D; j++) v[j] /= n0;
      for (var it = 0; it < 120; it++) {
        matVec(C, v, D, tmp);
        var nn = norm(tmp); if (nn === 0) break;
        for (j = 0; j < D; j++) v[j] = tmp[j] / nn;
      }
      matVec(C, v, D, tmp);
      var lambda = 0; for (j = 0; j < D; j++) lambda += v[j] * tmp[j];
      comps.push(v.slice());
      for (a = 0; a < D; a++) { var va = lambda * v[a], r2 = a * D; for (b = 0; b < D; b++) C[r2 + b] -= va * v[b]; }
    }

    var coords = new Float32Array(N * 3);
    for (i = 0; i < N; i++) {
      var o = i * D;
      for (var c = 0; c < 3; c++) {
        if (c >= K) { coords[i * 3 + c] = 0; continue; }
        var vv = comps[c], s = 0;
        for (j = 0; j < D; j++) s += X[o + j] * vv[j];
        coords[i * 3 + c] = s;
      }
    }
    return coords;
  }

  function scaleCoords(coords, R) {
    R = R || 10;
    var maxabs = 1e-9;
    for (var i = 0; i < coords.length; i++) { var a = Math.abs(coords[i]); if (a > maxabs) maxabs = a; }
    var s = (R * 0.95) / maxabs;
    for (i = 0; i < coords.length; i++) coords[i] *= s;
    return coords;
  }

  function kmeans(coords, N, k, iters) {
    k = Math.min(k, N);
    var centers = new Float32Array(k * 3), assign = new Int32Array(N), c, i;
    for (c = 0; c < k; c++) {
      var idx = Math.floor(c * N / k);
      centers[c * 3] = coords[idx * 3]; centers[c * 3 + 1] = coords[idx * 3 + 1]; centers[c * 3 + 2] = coords[idx * 3 + 2];
    }
    for (var t = 0; t < iters; t++) {
      for (i = 0; i < N; i++) {
        var best = 0, bd = Infinity;
        for (c = 0; c < k; c++) {
          var dx = coords[i * 3] - centers[c * 3], dy = coords[i * 3 + 1] - centers[c * 3 + 1], dz = coords[i * 3 + 2] - centers[c * 3 + 2];
          var d = dx * dx + dy * dy + dz * dz;
          if (d < bd) { bd = d; best = c; }
        }
        assign[i] = best;
      }
      var sum = new Float32Array(k * 3), cnt = new Int32Array(k);
      for (i = 0; i < N; i++) { c = assign[i]; sum[c * 3] += coords[i * 3]; sum[c * 3 + 1] += coords[i * 3 + 1]; sum[c * 3 + 2] += coords[i * 3 + 2]; cnt[c]++; }
      for (c = 0; c < k; c++) if (cnt[c] > 0) { centers[c * 3] = sum[c * 3] / cnt[c]; centers[c * 3 + 1] = sum[c * 3 + 1] / cnt[c]; centers[c * 3 + 2] = sum[c * 3 + 2] / cnt[c]; }
    }
    return { assign: assign, k: k };
  }

  root.OBS.reduce = { pca3: pca3, scaleCoords: scaleCoords, kmeans: kmeans };
})(typeof self !== 'undefined' ? self : this);
