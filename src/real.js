/* Latent Space Observatory — REAL embeddings module
 *
 * Loads a real sentence-embedding model (all-MiniLM-L6-v2) in the browser via
 * Transformers.js, computes genuine 384-d vectors, reduces them to 3D with PCA,
 * and hands the result to the vtk.js scene. Two paths:
 *   - "concept atlas": a curated vocabulary across the 12 categories, so you can
 *     see how a real model actually organizes meaning.
 *   - "your own words": paste lines, auto-clustered (k-means) by where the model
 *     places them.
 *
 * Classic script (no top-level import) so CI's `node --check` parses it and the
 * browser needs no module MIME type; the model is pulled with dynamic import().
 */
(function (OBS) {
  'use strict';

  var R = 10;
  var TF_URL = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
  var MODEL = 'Xenova/all-MiniLM-L6-v2';
  var extractor = null;

  // Curated vocabulary per concept (same 12 categories as the demo legend).
  var ATLAS = {
    'Animals': ['cat', 'dog', 'elephant', 'tiger', 'dolphin', 'eagle', 'rabbit', 'horse', 'shark', 'wolf', 'frog', 'whale'],
    'Vehicles': ['car', 'truck', 'airplane', 'bicycle', 'train', 'motorcycle', 'boat', 'helicopter', 'bus', 'submarine', 'tractor', 'van'],
    'Emotions': ['happy', 'sad', 'angry', 'afraid', 'joyful', 'anxious', 'proud', 'lonely', 'excited', 'calm', 'jealous', 'grateful'],
    'Colors': ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'brown', 'turquoise', 'crimson'],
    'Music': ['guitar', 'piano', 'violin', 'drums', 'melody', 'rhythm', 'symphony', 'jazz', 'singer', 'concert', 'trumpet', 'flute'],
    'Food': ['pizza', 'bread', 'apple', 'cheese', 'rice', 'soup', 'chocolate', 'salad', 'coffee', 'pasta', 'banana', 'steak'],
    'Geography': ['mountain', 'river', 'ocean', 'desert', 'island', 'valley', 'forest', 'canyon', 'volcano', 'glacier', 'prairie', 'coast'],
    'Mathematics': ['algebra', 'equation', 'integer', 'geometry', 'calculus', 'fraction', 'theorem', 'matrix', 'probability', 'angle', 'prime', 'derivative'],
    'Weather': ['rain', 'snow', 'storm', 'sunshine', 'cloud', 'thunder', 'hurricane', 'fog', 'breeze', 'drought', 'frost', 'humidity'],
    'Sports': ['soccer', 'basketball', 'tennis', 'baseball', 'swimming', 'running', 'boxing', 'golf', 'hockey', 'cycling', 'skiing', 'surfing'],
    'Medicine': ['doctor', 'surgery', 'vaccine', 'antibiotic', 'patient', 'diagnosis', 'hospital', 'nurse', 'therapy', 'disease', 'prescription', 'anatomy'],
    'Law': ['court', 'judge', 'lawyer', 'verdict', 'statute', 'contract', 'justice', 'trial', 'evidence', 'appeal', 'jury', 'legislation']
  };

  function setStatus(m) {
    var e = document.getElementById('realStatus');
    if (e) e.textContent = m;
  }

  // ---- model + embedding --------------------------------------------------
  function getExtractor() {
    if (extractor) return Promise.resolve(extractor);
    setStatus('Downloading model (~25 MB, first time only)…');
    return import(TF_URL).then(function (tf) {
      tf.env.allowLocalModels = false;
      return tf.pipeline('feature-extraction', MODEL);
    }).then(function (ext) {
      extractor = ext;
      return ext;
    });
  }

  function embed(words) {
    return getExtractor().then(function (ext) {
      setStatus('Embedding ' + words.length + ' items with all-MiniLM-L6-v2…');
      return ext(words, { pooling: 'mean', normalize: true });
    }).then(function (out) {
      return { data: out.data, N: out.dims[0], D: out.dims[1] };
    });
  }

  // ---- PCA (top-3 principal components via power iteration) ----------------
  function norm(v) { var s = 0; for (var i = 0; i < v.length; i++) s += v[i] * v[i]; return Math.sqrt(s); }
  function matVec(C, v, D, out) {
    for (var a = 0; a < D; a++) {
      var s = 0, row = a * D;
      for (var b = 0; b < D; b++) s += C[row + b] * v[b];
      out[a] = s;
    }
  }

  function pca3(data, N, D) {
    var mean = new Float64Array(D), i, j;
    for (i = 0; i < N; i++) for (j = 0; j < D; j++) mean[j] += data[i * D + j];
    for (j = 0; j < D; j++) mean[j] /= N;

    var X = new Float64Array(N * D);
    for (i = 0; i < N; i++) for (j = 0; j < D; j++) X[i * D + j] = data[i * D + j] - mean[j];

    // covariance (upper triangle, then mirror)
    var C = new Float64Array(D * D);
    for (i = 0; i < N; i++) {
      var off = i * D;
      for (var a = 0; a < D; a++) {
        var xa = X[off + a];
        if (xa === 0) continue;
        var row = a * D;
        for (var b = a; b < D; b++) C[row + b] += xa * X[off + b];
      }
    }
    var denom = (N - 1) || 1;
    for (a = 0; a < D; a++) for (b = a; b < D; b++) {
      var val = C[a * D + b] / denom; C[a * D + b] = val; C[b * D + a] = val;
    }

    var comps = [], tmp = new Float64Array(D);
    for (var comp = 0; comp < 3; comp++) {
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
      // deflate: C -= lambda * v v^T
      for (a = 0; a < D; a++) {
        var va = lambda * v[a], r2 = a * D;
        for (b = 0; b < D; b++) C[r2 + b] -= va * v[b];
      }
    }

    var coords = new Float32Array(N * 3);
    for (i = 0; i < N; i++) {
      var o = i * D;
      for (var c = 0; c < 3; c++) {
        var vv = comps[c], s = 0;
        for (j = 0; j < D; j++) s += X[o + j] * vv[j];
        coords[i * 3 + c] = s;
      }
    }
    return coords;
  }

  function scaleCoords(coords) {
    var maxabs = 1e-9;
    for (var i = 0; i < coords.length; i++) { var a = Math.abs(coords[i]); if (a > maxabs) maxabs = a; }
    var s = (R * 0.95) / maxabs;
    for (i = 0; i < coords.length; i++) coords[i] *= s;
  }

  // ---- k-means (color discovered clusters for custom input) ----------------
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

  // ---- flows --------------------------------------------------------------
  function loadAtlas() {
    var names = OBS.palette.conceptNames, words = [], cats = [], ci, w;
    for (ci = 0; ci < names.length; ci++) {
      var list = ATLAS[names[ci]] || [];
      for (w = 0; w < list.length; w++) { words.push(list[w]); cats.push(ci); }
    }
    embed(words).then(function (emb) {
      var coords = pca3(emb.data, emb.N, emb.D);
      scaleCoords(coords);
      var cc = OBS.palette.conceptColors, colors = new Uint8Array(emb.N * 3);
      for (var i = 0; i < emb.N; i++) {
        var col = cc[cats[i] % cc.length];
        colors[i * 3] = col[0]; colors[i * 3 + 1] = col[1]; colors[i * 3 + 2] = col[2];
      }
      OBS.app.setLegend(names, OBS.palette.conceptColors);
      OBS.app.loadExternal(coords, colors, { K: names.length });
      setStatus(emb.N + ' real embeddings · ' + names.length + ' concepts · all-MiniLM-L6-v2');
    }).catch(function (e) { setStatus('Error: ' + (e && e.message ? e.message : e)); console.error(e); });
  }

  function loadCustom() {
    var raw = (document.getElementById('realText').value || '').split('\n');
    var words = [];
    for (var i = 0; i < raw.length; i++) { var t = raw[i].trim(); if (t) words.push(t); }
    if (words.length < 4) { setStatus('Enter at least 4 lines of words/phrases.'); return; }
    if (words.length > 400) words = words.slice(0, 400);
    embed(words).then(function (emb) {
      var coords = pca3(emb.data, emb.N, emb.D);
      scaleCoords(coords);
      var k = Math.min(8, emb.N);
      var km = kmeans(coords, emb.N, k, 25);
      var pal = OBS.palette.conceptColors, colors = new Uint8Array(emb.N * 3);
      for (var j = 0; j < emb.N; j++) {
        var col = pal[km.assign[j] % pal.length];
        colors[j * 3] = col[0]; colors[j * 3 + 1] = col[1]; colors[j * 3 + 2] = col[2];
      }
      var lnames = [], lcols = [];
      for (var g = 0; g < km.k; g++) { lnames.push('Cluster ' + (g + 1)); lcols.push(pal[g % pal.length]); }
      OBS.app.setLegend(lnames, lcols);
      OBS.app.loadExternal(coords, colors, { K: km.k });
      setStatus(emb.N + ' of your words · ' + km.k + ' clusters · all-MiniLM-L6-v2');
    }).catch(function (e) { setStatus('Error: ' + (e && e.message ? e.message : e)); console.error(e); });
  }

  // ---- wiring -------------------------------------------------------------
  function show(id, on) { var e = document.getElementById(id); if (e) e.style.display = on ? '' : 'none'; }

  function init() {
    var sel = document.getElementById('source');
    if (sel) sel.addEventListener('change', function (e) {
      if (e.target.value === 'real') {
        show('trainingPanel', false); show('realPanel', true);
        setStatus('Loading the live model… first run downloads ~25 MB.');
        loadAtlas();
      } else {
        show('realPanel', false); show('trainingPanel', true);
        OBS.app.rebuildDemo();
      }
    });
    var a = document.getElementById('embedAtlas'); if (a) a.addEventListener('click', loadAtlas);
    var c = document.getElementById('embedCustom'); if (c) c.addEventListener('click', loadCustom);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.OBS);
