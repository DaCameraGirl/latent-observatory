/* Latent Space Observatory — ingestion Web Worker
 *
 * Heavy lifting off the UI thread: parse an uploaded CSV/TSV, figure out what
 * kind of data it is, reduce to 3D, and cluster. Three shapes are recognized:
 *   - x,y,z columns        -> use directly as 3D coordinates
 *   - many numeric columns -> treat each row as a vector, PCA to 3D
 *   - a text column        -> hand the text back so the main thread can embed it
 *                             with the model, then send vectors back for PCA
 *
 * An optional label/category column drives categorical coloring; otherwise the
 * points are colored by k-means clusters discovered in the projection.
 */
importScripts('reduce.js');

var R = 10;
var ROW_CAP = 20000;   // hard cap on points rendered
var TEXT_CAP = 1000;   // cap on rows embedded live (model runs on main thread)

function num(v) { var n = Number((v == null ? '' : v).toString().trim()); return isNaN(n) ? 0 : n; }

// Minimal RFC-4180-ish CSV/TSV parser (handles quotes and escaped quotes).
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // strip BOM
  var firstNL = text.indexOf('\n');
  var firstLine = firstNL < 0 ? text : text.slice(0, firstNL);
  var delim = (firstLine.split('\t').length > firstLine.split(',').length) ? '\t' : ',';

  var rows = [], row = [], field = '', inQ = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === delim) { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function finish(positions, N, labels) {
  if (labels) {
    self.postMessage(
      { kind: 'coords', n: N, positions: positions.buffer, groups: { type: 'labels', labels: labels } },
      [positions.buffer]
    );
  } else {
    var k = Math.min(8, N);
    var km = self.OBS.reduce.kmeans(positions, N, k, 25);
    self.postMessage(
      { kind: 'coords', n: N, positions: positions.buffer, groups: { type: 'clusters', k: km.k, assign: Array.prototype.slice.call(km.assign) } },
      [positions.buffer]
    );
  }
}

function handleCsv(text) {
  var rows = parseCSV(text);
  if (rows.length < 2) throw new Error('CSV needs a header row and at least one data row.');

  var header = rows[0].map(function (h) { return (h || '').trim(); });
  var lower = header.map(function (h) { return h.toLowerCase(); });

  var data = [];
  for (var r = 1; r < rows.length; r++) {
    if (rows[r].length === 1 && (rows[r][0] || '').trim() === '') continue;
    data.push(rows[r]);
  }
  var truncated = false;
  if (data.length > ROW_CAP) { data = data.slice(0, ROW_CAP); truncated = true; }
  var N = data.length;
  if (N < 2) throw new Error('Need at least 2 data rows.');

  function colIndex(names) {
    for (var k = 0; k < names.length; k++) { var idx = lower.indexOf(names[k]); if (idx >= 0) return idx; }
    return -1;
  }
  var xi = colIndex(['x']), yi = colIndex(['y']), zi = colIndex(['z']);
  var labelI = colIndex(['label', 'category', 'class', 'group', 'cluster', 'name', 'color']);
  var textI = colIndex(['text', 'sentence', 'word', 'phrase', 'title', 'description']);

  // numeric columns = parseable as numbers across a sample
  var numeric = [];
  for (var c = 0; c < header.length; c++) {
    var ok = true, seen = 0;
    for (var s = 0; s < Math.min(N, 25); s++) {
      var val = (data[s][c] == null ? '' : data[s][c]).toString().trim();
      if (val === '') continue;
      seen++;
      if (isNaN(Number(val))) { ok = false; break; }
    }
    if (ok && seen > 0) numeric.push(c);
  }

  var labels = null;
  if (labelI >= 0) {
    labels = [];
    for (var li = 0; li < N; li++) labels.push(((data[li][labelI] || '').toString().trim()) || '?');
  }

  var note = truncated ? (' (showing first ' + ROW_CAP.toLocaleString() + ' rows)') : '';

  // 1) explicit coordinates
  if (xi >= 0 && yi >= 0) {
    var pos = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      pos[i * 3] = num(data[i][xi]); pos[i * 3 + 1] = num(data[i][yi]); pos[i * 3 + 2] = zi >= 0 ? num(data[i][zi]) : 0;
    }
    self.OBS.reduce.scaleCoords(pos, R);
    self.postMessage({ kind: 'meta', detail: 'x,y,z coordinates' + note });
    return finish(pos, N, labels);
  }

  // 2) numeric vector columns -> PCA
  var vecCols = numeric.filter(function (col) { return col !== labelI; });
  if (vecCols.length >= 2) {
    var D = vecCols.length, mat = new Float32Array(N * D);
    for (i = 0; i < N; i++) for (var d = 0; d < D; d++) mat[i * D + d] = num(data[i][vecCols[d]]);
    var coords = self.OBS.reduce.pca3(mat, N, D);
    self.OBS.reduce.scaleCoords(coords, R);
    self.postMessage({ kind: 'meta', detail: D + '-dim vectors → PCA' + note });
    return finish(coords, N, labels);
  }

  // 3) text column -> embed on the main thread
  if (textI >= 0) {
    var texts = [], tlabels = labels ? [] : null;
    for (i = 0; i < N && texts.length < TEXT_CAP; i++) {
      var t = (data[i][textI] || '').toString().trim();
      if (!t) continue;
      texts.push(t);
      if (tlabels) tlabels.push(labels[i]);
    }
    if (texts.length < 2) throw new Error('Text column had fewer than 2 non-empty rows.');
    self.postMessage({ kind: 'texts', texts: texts, labels: tlabels });
    return;
  }

  throw new Error('No x,y,z columns, numeric vector columns, or text column found.');
}

function handleVectors(buf, N, D, labels) {
  var data = new Float32Array(buf);
  var coords = self.OBS.reduce.pca3(data, N, D);
  self.OBS.reduce.scaleCoords(coords, R);
  self.postMessage({ kind: 'meta', detail: D + '-dim embeddings → PCA' });
  finish(coords, N, labels);
}

self.onmessage = function (e) {
  var msg = e.data;
  try {
    if (msg.cmd === 'csv') handleCsv(msg.text);
    else if (msg.cmd === 'reduceVectors') handleVectors(msg.data, msg.N, msg.D, msg.labels || null);
  } catch (err) {
    self.postMessage({ kind: 'error', message: (err && err.message) ? err.message : String(err) });
  }
};
