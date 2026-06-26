/* Latent Space Observatory — solar-system presentation layer
 *
 * Renders a cinematic sun + orbiting planets at cluster centroids, orbit rings,
 * and a distant starfield. Embedding points remain as the particle field.
 */
window.OBS = window.OBS || {};
(function (OBS) {
  'use strict';

  var TAU = Math.PI * 2;

  function rgbNorm(c) {
    return [c[0] / 255, c[1] / 255, c[2] / 255];
  }

  function fibSphere(i, n) {
    var phi = Math.acos(1 - 2 * (i + 0.5) / n);
    var theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)];
  }

  function makeSphere(vtk, radius, res) {
    return vtk.Filters.Sources.vtkSphereSource.newInstance({
      radius: radius,
      thetaResolution: res || 40,
      phiResolution: res || 40
    });
  }

  function makeActor(vtk, source, opts) {
    var mapper = vtk.Rendering.Core.vtkMapper.newInstance();
    mapper.setInputConnection(source.getOutputPort());
    var actor = vtk.Rendering.Core.vtkActor.newInstance();
    actor.setMapper(mapper);
    var p = actor.getProperty();
    p.setColor(opts.color[0], opts.color[1], opts.color[2]);
    if (opts.opacity != null) p.setOpacity(opts.opacity);
    if (opts.ambient != null) p.setAmbient(opts.ambient);
    if (opts.diffuse != null) p.setDiffuse(opts.diffuse);
    if (opts.specular != null) p.setSpecular(opts.specular);
    if (opts.specularPower != null) p.setSpecularPower(opts.specularPower);
    if (opts.lighting === false) p.setLighting(false);
    return actor;
  }

  function makeOrbitRing(vtk, radius, tilt, hue) {
    var n = 96;
    var pts = new Float32Array(n * 3);
    var lines = new Uint32Array(n + 2);
    lines[0] = n;
    var i, a;
    for (i = 0; i < n; i++) {
      a = (i / n) * TAU;
      var x = radius * Math.cos(a);
      var y = radius * Math.sin(a) * Math.cos(tilt);
      var z = radius * Math.sin(a) * Math.sin(tilt);
      pts[i * 3] = x; pts[i * 3 + 1] = y; pts[i * 3 + 2] = z;
      lines[i + 1] = i;
    }
    var poly = vtk.Common.DataModel.vtkPolyData.newInstance();
    poly.getPoints().setData(pts, 3);
    poly.getLines().setData(lines);
    var mapper = vtk.Rendering.Core.vtkMapper.newInstance();
    mapper.setInputData(poly);
    var actor = vtk.Rendering.Core.vtkActor.newInstance();
    actor.setMapper(mapper);
    var col = rgbNorm(hue || [120, 160, 255]);
    actor.getProperty().setColor(col[0], col[1], col[2]);
    actor.getProperty().setOpacity(0.22);
    actor.getProperty().setLighting(false);
    actor.getProperty().setLineWidth(1.2);
    return actor;
  }

  function init(renderer, vtk) {
    var scene = {
      renderer: renderer,
      vtk: vtk,
      enabled: true,
      bodies: [],
      rings: [],
      stars: null,
      sun: null,
      sunCorona: null,
      time: 0,
      fieldKey: ''
    };

    scene.stars = buildStarfield(vtk, renderer, 1400, 72);
    scene.sunCorona = makeActor(vtk, makeSphere(vtk, 2.8, 32), {
      color: [1.0, 0.72, 0.35], opacity: 0.12, lighting: false
    });
    scene.sun = makeActor(vtk, makeSphere(vtk, 1.35, 56), {
      color: [1.0, 0.88, 0.45], ambient: 0.35, diffuse: 0.9, specular: 1.0, specularPower: 120
    });
    renderer.addActor(scene.sunCorona);
    renderer.addActor(scene.sun);

    var cam = renderer.getActiveCamera();
    if (cam.setViewUp) cam.setViewUp(0, 1, 0);

    return scene;
  }

  function buildStarfield(vtk, renderer, count, radius) {
    var pts = new Float32Array(count * 3);
    var i, u, v, r, theta, phi;
    for (i = 0; i < count; i++) {
      u = Math.random(); v = Math.random();
      theta = TAU * u;
      phi = Math.acos(2 * v - 1);
      r = radius * (0.85 + Math.random() * 0.15);
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    var poly = vtk.Common.DataModel.vtkPolyData.newInstance();
    poly.getPoints().setData(pts, 3);
    var verts = new Uint32Array(count + 1);
    verts[0] = count;
    for (i = 0; i < count; i++) verts[i + 1] = i;
    poly.getVerts().setData(verts);
    var mapper = vtk.Rendering.Core.vtkMapper.newInstance();
    mapper.setInputData(poly);
    var actor = vtk.Rendering.Core.vtkActor.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setColor(1, 1, 1);
    actor.getProperty().setOpacity(0.55);
    actor.getProperty().setPointSize(1.2);
    actor.getProperty().setLighting(false);
    renderer.addActor(actor);
    return actor;
  }

  function clearBodies(scene) {
    var i;
    for (i = 0; i < scene.bodies.length; i++) {
      scene.renderer.removeActor(scene.bodies[i].core);
      scene.renderer.removeActor(scene.bodies[i].halo);
    }
    for (i = 0; i < scene.rings.length; i++) scene.renderer.removeActor(scene.rings[i]);
    scene.bodies = [];
    scene.rings = [];
  }

  function clusterCentroids(field) {
    var n = field.count, K = field.K || 12;
    var pal = OBS.palette.conceptColors;
    var groups = [], k, i, cidx;

    if (field.concept) {
      for (k = 0; k < K; k++) {
        groups.push({ k: k, sx: 0, sy: 0, sz: 0, n: 0, color: pal[k % pal.length] });
      }
      for (i = 0; i < n; i++) {
        cidx = field.concept[i] % K;
        groups[cidx].sx += field.positions[i * 3];
        groups[cidx].sy += field.positions[i * 3 + 1];
        groups[cidx].sz += field.positions[i * 3 + 2];
        groups[cidx].n++;
      }
    } else if (field.colors && K > 0) {
      for (k = 0; k < K; k++) {
        groups.push({ k: k, sx: 0, sy: 0, sz: 0, n: 0, color: pal[k % pal.length] });
      }
      for (i = 0; i < n; i++) {
        cidx = Math.min(K - 1, Math.floor((i / n) * K));
        groups[cidx].sx += field.positions[i * 3];
        groups[cidx].sy += field.positions[i * 3 + 1];
        groups[cidx].sz += field.positions[i * 3 + 2];
        groups[cidx].n++;
      }
    } else {
      K = Math.min(8, Math.max(3, Math.round(Math.sqrt(n / 80))));
      for (k = 0; k < K; k++) {
        groups.push({ k: k, sx: 0, sy: 0, sz: 0, n: 0, color: pal[k % pal.length] });
      }
      for (i = 0; i < n; i++) {
        cidx = i % K;
        groups[cidx].sx += field.positions[i * 3];
        groups[cidx].sy += field.positions[i * 3 + 1];
        groups[cidx].sz += field.positions[i * 3 + 2];
        groups[cidx].n++;
      }
    }

    var out = [];
    for (k = 0; k < groups.length; k++) {
      if (groups[k].n < 1) continue;
      var g = groups[k];
      out.push({
        k: g.k,
        cx: g.sx / g.n, cy: g.sy / g.n, cz: g.sz / g.n,
        count: g.n,
        color: g.color
      });
    }
    return out;
  }

  function rebuildFromField(scene, field) {
    if (!scene || !field || !scene.enabled) return;
    var vtk = scene.vtk;
    clearBodies(scene);

    var centroids = clusterCentroids(field);
    var nPlanets = centroids.length;
    var maxCount = 1, i;
    for (i = 0; i < nPlanets; i++) if (centroids[i].count > maxCount) maxCount = centroids[i].count;

    for (i = 0; i < nPlanets; i++) {
      var c = centroids[i];
      var dir = fibSphere(i, nPlanets);
      var orbitR = 5.5 + (i / Math.max(1, nPlanets - 1)) * 7.5;
      var tilt = (i % 5) * 0.28 - 0.55;
      var size = 0.32 + 0.55 * Math.sqrt(c.count / maxCount);
      var col = rgbNorm(c.color);
      var warm = [
        Math.min(1, col[0] * 1.1 + 0.08),
        Math.min(1, col[1] * 1.05 + 0.04),
        Math.min(1, col[2] * 1.15 + 0.1)
      ];

      var core = makeActor(vtk, makeSphere(vtk, size, 44), {
        color: warm, ambient: 0.22, diffuse: 0.88, specular: 0.95, specularPower: 90
      });
      var halo = makeActor(vtk, makeSphere(vtk, size * 1.65, 28), {
        color: warm, opacity: 0.14, lighting: false
      });
      var ring = makeOrbitRing(vtk, orbitR, tilt, c.color);

      scene.renderer.addActor(ring);
      scene.renderer.addActor(halo);
      scene.renderer.addActor(core);

      scene.bodies.push({
        core: core, halo: halo,
        orbitR: orbitR, tilt: tilt,
        speed: 0.12 + (i % 7) * 0.035,
        phase: i * (TAU / nPlanets),
        spin: 0.4 + (i % 5) * 0.15,
        anchor: [c.cx, c.cy, c.cz],
        size: size
      });
      scene.rings.push(ring);
    }
    scene.fieldKey = String(field.count) + ':' + nPlanets;
  }

  function setEnabled(scene, on) {
    if (!scene) return;
    scene.enabled = on;
    var show = function (a, v) { if (a) a.setVisibility(v); };
    show(scene.sun, on);
    show(scene.sunCorona, on);
    show(scene.stars, on);
    var i;
    for (i = 0; i < scene.bodies.length; i++) {
      show(scene.bodies[i].core, on);
      show(scene.bodies[i].halo, on);
    }
    for (i = 0; i < scene.rings.length; i++) show(scene.rings[i], on);
  }

  function tick(scene, dt) {
    if (!scene || !scene.enabled) return;
    scene.time += dt;
    var t = scene.time;
    var i, b, ang, x, y, z;

    if (scene.sun) scene.sun.rotateY(dt * 8);

    for (i = 0; i < scene.bodies.length; i++) {
      b = scene.bodies[i];
      ang = b.phase + t * b.speed;
      x = b.orbitR * Math.cos(ang);
      y = b.orbitR * Math.sin(ang) * Math.cos(b.tilt);
      z = b.orbitR * Math.sin(ang) * Math.sin(b.tilt);
      b.core.setPosition(x, y, z);
      b.halo.setPosition(x, y, z);
      b.core.rotateY(dt * b.spin * 60);
    }

    var pulse = 0.1 + 0.04 * Math.sin(t * 1.6);
    if (scene.sunCorona) scene.sunCorona.setScale(1 + pulse, 1 + pulse, 1 + pulse);
  }

  OBS.cosmos = { init: init, rebuildFromField: rebuildFromField, setEnabled: setEnabled, tick: tick };
})(window.OBS);