/* Latent Space Observatory — application / vtk.js scene
 *
 * Renders an embedding field as a glowing point cloud (the hero), with an
 * optional marching-cubes "nebula" isosurface over a splatted density volume.
 * Coloring is either categorical (supplied with the data) or continuous
 * (distance to a movable query probe), fed to vtk.js as direct uchar scalars.
 *
 * Launches with live MiniLM concept atlas (real.js). Uploads arrive via
 * loadExternal(). Everything is client-side: no server, no build step.
 */
(function (OBS) {
  'use strict';

  var vtk = window.vtk;
  var errBox = document.getElementById('error');
  function fail(msg) {
    if (errBox) { errBox.textContent = msg; errBox.style.display = 'block'; }
    console.error(msg);
  }
  if (!vtk) {
    fail('vtk.js failed to load from the CDN. Check your connection and hard-refresh (Ctrl+Shift+R).');
    return;
  }

  var state = {
    source: 'real',          // 'real' | 'upload'
    pointSize: 3,
    opacity: 1.0,
    colorMode: 'concept',    // 'concept' (supplied colors) | 'query' (distance)
    colormap: 'viridis',
    query: [0, 0, 0],
    iso: false,
    isoLevel: 0.18,
    spin: true
  };

  // ---- renderer -----------------------------------------------------------
  var container = document.getElementById('view');
  var fsrw = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
    rootContainer: container,
    containerStyle: { position: 'absolute', width: '100%', height: '100%' },
    background: [0.02, 0.02, 0.06]
  });
  var renderer = fsrw.getRenderer();
  var renderWindow = fsrw.getRenderWindow();
  renderer.setBackground(0.01, 0.015, 0.045);

  try {
    var key = vtk.Rendering.Core.vtkLight.newInstance();
    key.setPosition(14, 20, 12);
    key.setFocalPoint(0, 0, 0);
    key.setIntensity(1.15);
    renderer.addLight(key);
    var fill = vtk.Rendering.Core.vtkLight.newInstance();
    fill.setPosition(-16, -8, -10);
    fill.setIntensity(0.35);
    renderer.addLight(fill);
  } catch (e) {}

  // ---- point-cloud actor --------------------------------------------------
  var polydata = vtk.Common.DataModel.vtkPolyData.newInstance();
  var mapper = vtk.Rendering.Core.vtkMapper.newInstance();
  mapper.setInputData(polydata);
  mapper.setScalarVisibility(true);
  try { if (mapper.setColorModeToDirectScalars) mapper.setColorModeToDirectScalars(); } catch (e) {}
  var actor = vtk.Rendering.Core.vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setPointSize(state.pointSize);
  actor.getProperty().setOpacity(state.opacity);
  try { actor.getProperty().setLighting(false); } catch (e) {}
  renderer.addActor(actor);

  // ---- isosurface ("nebula") actor ---------------------------------------
  var isoMapper = vtk.Rendering.Core.vtkMapper.newInstance();
  isoMapper.setScalarVisibility(false);
  var isoActor = vtk.Rendering.Core.vtkActor.newInstance();
  isoActor.setMapper(isoMapper);
  isoActor.getProperty().setColor(0.25, 0.9, 0.95);
  isoActor.getProperty().setOpacity(0.14);
  isoActor.getProperty().setColor(0.35, 0.75, 1.0);
  var isoInScene = false;

  var field = null;
  var lastFrame = performance.now();

  // ---- coloring -----------------------------------------------------------
  function computeColors() {
    if (!field) return new Uint8Array(0);
    var n = field.count, col = new Uint8Array(n * 3), i;
    if (state.colorMode === 'concept') {
      if (field.colors) return field.colors;
      if (field.concept) {
        var cc = OBS.palette.conceptColors;
        for (i = 0; i < n; i++) {
          var c = cc[field.concept[i] % cc.length];
          col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
        }
        return col;
      }
      for (i = 0; i < n * 3; i++) col[i] = 180;
      return col;
    }
    var q = state.query, p = field.positions, maxd = 0;
    var d = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var dx = p[i * 3] - q[0], dy = p[i * 3 + 1] - q[1], dz = p[i * 3 + 2] - q[2];
      var dd = Math.sqrt(dx * dx + dy * dy + dz * dz);
      d[i] = dd; if (dd > maxd) maxd = dd;
    }
    var ramp = OBS.palette.maps[state.colormap];
    for (i = 0; i < n; i++) {
      var rgb = ramp(1 - d[i] / (maxd || 1));
      col[i * 3] = rgb[0]; col[i * 3 + 1] = rgb[1]; col[i * 3 + 2] = rgb[2];
    }
    return col;
  }

  function updateColors() {
    if (!field) return;
    var arr = vtk.Common.Core.vtkDataArray.newInstance({
      name: 'Colors', numberOfComponents: 3, values: computeColors()
    });
    polydata.getPointData().setScalars(arr);
    polydata.modified();
  }

  function rebuildIso() {
    if (!field) return;
    try {
      var dims = 40;
      var mn = field.min, mx = field.max;
      var sx = (mx[0] - mn[0]) / (dims - 1) || 1;
      var sy = (mx[1] - mn[1]) / (dims - 1) || 1;
      var sz = (mx[2] - mn[2]) / (dims - 1) || 1;

      var img = vtk.Common.DataModel.vtkImageData.newInstance();
      img.setDimensions(dims, dims, dims);
      img.setSpacing(sx, sy, sz);
      img.setOrigin(mn[0], mn[1], mn[2]);

      var vals = new Float32Array(dims * dims * dims);
      var p = field.positions, n = field.count, rad = 2;
      for (var i = 0; i < n; i++) {
        var ix = Math.round((p[i * 3] - mn[0]) / sx);
        var iy = Math.round((p[i * 3 + 1] - mn[1]) / sy);
        var iz = Math.round((p[i * 3 + 2] - mn[2]) / sz);
        for (var a = -rad; a <= rad; a++)
          for (var b = -rad; b <= rad; b++)
            for (var cc = -rad; cc <= rad; cc++) {
              var x = ix + a, y = iy + b, z = iz + cc;
              if (x < 0 || y < 0 || z < 0 || x >= dims || y >= dims || z >= dims) continue;
              vals[x + dims * (y + dims * z)] += Math.exp(-(a * a + b * b + cc * cc) / 2.0);
            }
      }
      var maxv = 0;
      for (i = 0; i < vals.length; i++) if (vals[i] > maxv) maxv = vals[i];
      if (maxv > 0) for (i = 0; i < vals.length; i++) vals[i] /= maxv;

      var sc = vtk.Common.Core.vtkDataArray.newInstance({
        name: 'density', numberOfComponents: 1, values: vals
      });
      img.getPointData().setScalars(sc);

      var mc = vtk.Filters.General.vtkImageMarchingCubes.newInstance({
        contourValue: state.isoLevel
      });
      mc.setInputData(img);
      isoMapper.setInputData(mc.getOutputData());
    } catch (e) {
      console.warn('isosurface build failed', e);
    }
  }

  function setIso(on) {
    state.iso = on;
    if (on) {
      rebuildIso();
      if (!isoInScene) { renderer.addActor(isoActor); isoInScene = true; }
    } else if (isoInScene) {
      renderer.removeActor(isoActor); isoInScene = false;
    }
    render();
  }

  // ---- render / camera ----------------------------------------------------
  function render() { renderWindow.render(); }

  var fps = 0, frames = 0, lastT = performance.now();
  function animLoop() {
    var now = performance.now();
    lastFrame = now;
    if (state.spin) {
      renderer.getActiveCamera().azimuth(0.28);
      renderer.resetCameraClippingRange();
      frames++;
      if (now - lastT >= 500) {
        fps = Math.round((frames * 1000) / (now - lastT));
        frames = 0; lastT = now;
        var el = document.getElementById('stat-fps');
        if (el) el.textContent = fps;
      }
    }
    render();
    requestAnimationFrame(animLoop);
  }

  function updateStats() {
    if (!field) {
      set('stat-n', '—'); set('stat-k', '—'); set('stat-extra', 'loading…');
      return;
    }
    set('stat-n', field.count.toLocaleString());
    set('stat-k', field.K);
    set('stat-extra', field.model || 'MiniLM-L6-v2');
  }
  function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  // ---- UI wiring ----------------------------------------------------------
  function bind(id, evt, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
    return el;
  }

  bind('psize', 'input', function (e) {
    state.pointSize = +e.target.value;
    actor.getProperty().setPointSize(state.pointSize); render();
  });
  bind('opacity', 'input', function (e) {
    state.opacity = (+e.target.value) / 100;
    actor.getProperty().setOpacity(state.opacity); render();
  });
  bind('colorMode', 'change', function (e) {
    state.colorMode = e.target.value;
    document.getElementById('queryGroup').style.display =
      state.colorMode === 'query' ? 'block' : 'none';
    updateColors(); render();
  });
  bind('colormap', 'change', function (e) {
    state.colormap = e.target.value;
    if (state.colorMode === 'query') { updateColors(); render(); }
  });
  ['qx', 'qy', 'qz'].forEach(function (id, axis) {
    bind(id, 'input', function (e) {
      state.query[axis] = +e.target.value;
      if (state.colorMode === 'query') { updateColors(); render(); }
    });
  });
  bind('iso', 'change', function (e) { setIso(e.target.checked); });
  bind('isoLevel', 'input', function (e) {
    state.isoLevel = (+e.target.value) / 100;
    if (state.iso) { rebuildIso(); render(); }
  });
  bind('spin', 'change', function (e) {
    state.spin = e.target.checked;
    if (state.spin) { lastT = performance.now(); frames = 0; }
  });
  bind('reset', 'click', function () { renderer.resetCamera(); render(); });

  bind('aboutBtn', 'click', function () { document.getElementById('about').style.display = 'flex'; });
  bind('aboutClose', 'click', function () { document.getElementById('about').style.display = 'none'; });

  function setLegend(names, cols) {
    var box = document.getElementById('legend');
    if (!box) return;
    box.innerHTML = '';
    for (var i = 0; i < names.length; i++) {
      var row = document.createElement('div');
      row.className = 'legend-item';
      var sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = 'rgb(' + cols[i].join(',') + ')';
      var label = document.createElement('span');
      label.textContent = names[i];
      row.appendChild(sw); row.appendChild(label);
      box.appendChild(row);
    }
  }
  setLegend(OBS.palette.conceptNames, OBS.palette.conceptColors);

  // ---- data entry points --------------------------------------------------
  function applyPositions(positions) {
    var pts = vtk.Common.Core.vtkPoints.newInstance();
    pts.setData(positions, 3);
    polydata.setPoints(pts);
    var n = positions.length / 3;
    var verts = new Uint32Array(n + 1);
    verts[0] = n;
    for (var i = 0; i < n; i++) verts[i + 1] = i;
    polydata.getVerts().setData(verts);
  }
  function boundsOf(positions) {
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (var i = 0; i < positions.length; i += 3) {
      for (var a = 0; a < 3; a++) {
        var v = positions[i + a];
        if (v < mn[a]) mn[a] = v;
        if (v > mx[a]) mx[a] = v;
      }
    }
    return { min: mn, max: mx };
  }

  function loadExternal(positions, colors, meta) {
    meta = meta || {};
    var b = boundsOf(positions);
    field = {
      positions: positions, count: positions.length / 3, K: meta.K || 0,
      colors: colors, min: b.min, max: b.max, concept: null,
      model: meta.model || 'MiniLM-L6-v2'
    };
    state.source = meta.source || 'real';
    applyPositions(positions);
    updateColors();
    polydata.modified();
    if (state.iso) rebuildIso();
    updateStats();
    renderer.resetCamera();
    render();
  }

  // ---- boot ---------------------------------------------------------------
  setIso(state.iso);
  updateStats();
  render();

  var spinEl = document.getElementById('spin');
  if (spinEl) spinEl.checked = true;
  lastT = performance.now();
  lastFrame = performance.now();
  animLoop();

  window.OBS.app = {
    state: state, render: render,
    loadExternal: loadExternal, setLegend: setLegend
  };
})(window.OBS);