/* Latent Space Observatory — upload controller (main thread)
 *
 * Wires the file picker + drag-and-drop to the ingestion worker, runs live
 * embedding for text columns through the model, builds colors/legend, and hands
 * the result to the vtk.js scene. Keeps the UI responsive: parsing, PCA, and
 * clustering all happen in src/worker.js.
 */
(function (OBS) {
  'use strict';

  var worker = null;
  var currentFile = '';
  var detail = '';

  function ui(id) { return document.getElementById(id); }
  function status(m) { var e = ui('uploadStatus'); if (e) e.textContent = m; }
  function info(m) { var e = ui('uploadInfo'); if (e) e.textContent = m; }

  function getWorker() {
    if (worker) return worker;
    try {
      worker = new Worker('src/worker.js');
    } catch (e) {
      status('Could not start the ingestion worker: ' + (e && e.message ? e.message : e));
      return null;
    }
    worker.onmessage = onMessage;
    worker.onerror = function (e) { status('Worker error: ' + (e.message || 'failed') + ' (line ' + e.lineno + ')'); };
    return worker;
  }

  function onMessage(e) {
    var m = e.data;
    if (m.kind === 'error') { status('Could not read ' + (currentFile || 'file') + ': ' + m.message); return; }
    if (m.kind === 'meta') { detail = m.detail; return; }

    if (m.kind === 'texts') {
      if (!OBS.real || !OBS.real.embed) { status('The embedding model is not available yet — try again in a moment.'); return; }
      status('Embedding ' + m.texts.length + ' rows with all-MiniLM-L6-v2…');
      OBS.real.embed(m.texts).then(function (emb) {
        var f32 = (emb.data instanceof Float32Array) ? emb.data : new Float32Array(emb.data);
        var w = getWorker(); if (!w) return;
        w.postMessage({ cmd: 'reduceVectors', data: f32.buffer, N: emb.N, D: emb.D, labels: m.labels || null }, [f32.buffer]);
      }).catch(function (err) { status('Embedding failed: ' + (err && err.message ? err.message : err)); });
      return;
    }

    if (m.kind === 'coords') render(m);
  }

  function render(m) {
    var positions = new Float32Array(m.positions);
    var N = m.n;
    var pal = OBS.palette.conceptColors;
    var colors = new Uint8Array(N * 3);
    var legendNames = [], legendCols = [], i, c;

    if (m.groups.type === 'labels') {
      var labels = m.groups.labels, map = {}, names = [];
      for (i = 0; i < N; i++) { var L = labels[i]; if (!(L in map)) { map[L] = names.length; names.push(L); } }
      for (i = 0; i < N; i++) { c = pal[map[labels[i]] % pal.length]; colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2]; }
      for (var g = 0; g < names.length && g < 24; g++) { legendNames.push(names[g]); legendCols.push(pal[g % pal.length]); }
      OBS.app.setLegend(legendNames, legendCols);
      finishRender(positions, colors, names.length);
    } else {
      var assign = m.groups.assign, k = m.groups.k;
      for (i = 0; i < N; i++) { c = pal[assign[i] % pal.length]; colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2]; }
      for (g = 0; g < k; g++) { legendNames.push('Cluster ' + (g + 1)); legendCols.push(pal[g % pal.length]); }
      OBS.app.setLegend(legendNames, legendCols);
      finishRender(positions, colors, k);
    }
  }

  function finishRender(positions, colors, K) {
    var n = positions.length / 3;
    OBS.app.loadExternal(positions, colors, { K: K, model: currentFile, source: 'upload' });
    status('Loaded ' + n.toLocaleString() + ' points from ' + currentFile);
    info(currentFile + ' · ' + n.toLocaleString() + ' points · ' + (detail || 'data'));
  }

  function onFile(file) {
    if (!file) return;
    currentFile = file.name;
    detail = '';
    status('Reading ' + file.name + '…');
    var reader = new FileReader();
    reader.onload = function () {
      var w = getWorker(); if (!w) return;
      status('Parsing & reducing ' + file.name + '…');
      w.postMessage({ cmd: 'csv', text: String(reader.result) });
    };
    reader.onerror = function () { status('Could not read the file.'); };
    reader.readAsText(file);
  }

  function init() {
    var inp = ui('fileInput');
    if (inp) inp.addEventListener('change', function (e) { onFile(e.target.files && e.target.files[0]); });

    // Drag-and-drop anywhere over the scene.
    var prevent = function (e) { e.preventDefault(); e.stopPropagation(); };
    ['dragover', 'dragenter'].forEach(function (ev) { window.addEventListener(ev, prevent); });
    window.addEventListener('drop', function (e) {
      prevent(e);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.OBS);
