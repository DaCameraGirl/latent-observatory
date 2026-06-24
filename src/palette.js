/* Latent Space Observatory — color palettes
 * Categorical colors for concept regions + scientific colormaps for scalar fields.
 * Colors are plain [r,g,b] 0-255 so we can feed them straight to vtk.js as
 * direct (uchar) point scalars — no lookup-table API in the hot path.
 */
window.OBS = window.OBS || {};
(function (OBS) {
  'use strict';

  // 12 distinct, legible hues (Material-ish) for the semantic "continents".
  var CONCEPT_NAMES = [
    'Animals', 'Vehicles', 'Emotions', 'Colors', 'Music', 'Food',
    'Geography', 'Mathematics', 'Weather', 'Sports', 'Medicine', 'Law'
  ];
  var CONCEPT_COLORS = [
    [239, 83, 80], [171, 71, 188], [92, 107, 192], [41, 182, 246],
    [38, 198, 218], [102, 187, 106], [212, 225, 87], [255, 213, 79],
    [255, 138, 101], [161, 136, 127], [120, 144, 156], [240, 98, 146]
  ];

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  // Build a sampler from sorted [t, r, g, b] control points (t in 0..1).
  function ramp(stops) {
    return function (t) {
      t = clamp01(t);
      for (var i = 1; i < stops.length; i++) {
        if (t <= stops[i][0]) {
          var a = stops[i - 1], b = stops[i];
          var f = (t - a[0]) / ((b[0] - a[0]) || 1);
          return [
            Math.round(a[1] + (b[1] - a[1]) * f),
            Math.round(a[2] + (b[2] - a[2]) * f),
            Math.round(a[3] + (b[3] - a[3]) * f)
          ];
        }
      }
      var last = stops[stops.length - 1];
      return [last[1], last[2], last[3]];
    };
  }

  var maps = {
    viridis: ramp([
      [0.0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140],
      [0.75, 94, 201, 98], [1.0, 253, 231, 37]
    ]),
    inferno: ramp([
      [0.0, 0, 0, 4], [0.25, 87, 16, 110], [0.5, 188, 55, 84],
      [0.75, 249, 142, 9], [1.0, 252, 255, 164]
    ]),
    plasma: ramp([
      [0.0, 13, 8, 135], [0.25, 126, 3, 168], [0.5, 204, 71, 120],
      [0.75, 248, 149, 64], [1.0, 240, 249, 33]
    ])
  };

  OBS.palette = {
    conceptNames: CONCEPT_NAMES,
    conceptColors: CONCEPT_COLORS,
    maps: maps
  };
})(window.OBS);
