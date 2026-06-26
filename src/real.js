/* Latent Space Observatory — REAL embeddings module
 *
 * Loads a real sentence-embedding model (all-MiniLM-L6-v2) in the browser via
 * Transformers.js, computes genuine 384-d vectors, reduces them to 3D with PCA
 * (OBS.reduce), and hands the result to the vtk.js scene. Two built-in paths:
 *   - "concept atlas": a curated vocabulary across the 12 categories, so you can
 *     see how a real model actually organizes meaning (loads on launch).
 *   - "your own words": paste lines, auto-clustered (k-means) by where the model
 *     places them.
 *
 * `embed()` is exported as OBS.real.embed so the upload pipeline can reuse the
 * same model for CSVs that carry a text column.
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

  // Curated vocabulary per concept (matches the atlas legend categories).
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

  // Returns { data: Float32Array(N*D), N, D }.
  function embed(words) {
    return getExtractor().then(function (ext) {
      setStatus('Embedding ' + words.length + ' items with all-MiniLM-L6-v2…');
      return ext(words, { pooling: 'mean', normalize: true });
    }).then(function (out) {
      return { data: out.data, N: out.dims[0], D: out.dims[1] };
    });
  }

  // ---- flows --------------------------------------------------------------
  function loadAtlas() {
    var names = OBS.palette.conceptNames, words = [], cats = [], ci, w;
    for (ci = 0; ci < names.length; ci++) {
      var list = ATLAS[names[ci]] || [];
      for (w = 0; w < list.length; w++) { words.push(list[w]); cats.push(ci); }
    }
    embed(words).then(function (emb) {
      var coords = OBS.reduce.pca3(emb.data, emb.N, emb.D);
      OBS.reduce.scaleCoords(coords, R);
      var cc = OBS.palette.conceptColors, colors = new Uint8Array(emb.N * 3);
      for (var i = 0; i < emb.N; i++) {
        var col = cc[cats[i] % cc.length];
        colors[i * 3] = col[0]; colors[i * 3 + 1] = col[1]; colors[i * 3 + 2] = col[2];
      }
      OBS.app.setLegend(names, OBS.palette.conceptColors);
      OBS.app.loadExternal(coords, colors, { K: names.length, model: 'MiniLM-L6-v2' });
      setStatus(emb.N + ' embeddings · ' + names.length + ' concepts · all-MiniLM-L6-v2');
    }).catch(function (e) { setStatus('Error: ' + (e && e.message ? e.message : e)); console.error(e); });
  }

  function loadCustom() {
    var raw = (document.getElementById('realText').value || '').split('\n');
    var words = [];
    for (var i = 0; i < raw.length; i++) { var t = raw[i].trim(); if (t) words.push(t); }
    if (words.length < 4) { setStatus('Enter at least 4 lines of words/phrases.'); return; }
    if (words.length > 400) words = words.slice(0, 400);
    embed(words).then(function (emb) {
      var coords = OBS.reduce.pca3(emb.data, emb.N, emb.D);
      OBS.reduce.scaleCoords(coords, R);
      var k = Math.min(8, emb.N);
      var km = OBS.reduce.kmeans(coords, emb.N, k, 25);
      var pal = OBS.palette.conceptColors, colors = new Uint8Array(emb.N * 3);
      for (var j = 0; j < emb.N; j++) {
        var col = pal[km.assign[j] % pal.length];
        colors[j * 3] = col[0]; colors[j * 3 + 1] = col[1]; colors[j * 3 + 2] = col[2];
      }
      var lnames = [], lcols = [];
      for (var g = 0; g < km.k; g++) { lnames.push('Cluster ' + (g + 1)); lcols.push(pal[g % pal.length]); }
      OBS.app.setLegend(lnames, lcols);
      OBS.app.loadExternal(coords, colors, { K: km.k, model: 'your words' });
      setStatus(emb.N + ' of your words · ' + km.k + ' clusters · all-MiniLM-L6-v2');
    }).catch(function (e) { setStatus('Error: ' + (e && e.message ? e.message : e)); console.error(e); });
  }

  // ---- wiring -------------------------------------------------------------
  function init() {
    var a = document.getElementById('embedAtlas'); if (a) a.addEventListener('click', loadAtlas);
    var c = document.getElementById('embedCustom'); if (c) c.addEventListener('click', loadCustom);
    if (OBS.app && OBS.app.loadExternal) loadAtlas();
    else setTimeout(init, 50);
  }

  OBS.real = { embed: embed, loadAtlas: loadAtlas };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.OBS);
