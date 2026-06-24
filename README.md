# Latent Space Observatory

**Walk through the internal geometry of a neural network's embedding space — as a place you can fly through.**

🔭 **Live:** https://dacameragirl.github.io/latent-observatory/

AI research generates enormous high-dimensional data — embeddings, activations, training
trajectories — and almost everyone looks at it through flat 2D matplotlib plots. This tool
does the opposite: it renders an embedding space as a navigable 3D world built on the same
toolkit ParaView is made of.

- **Semantic continents** — concept clusters you can orbit, zoom, and inspect.
- **A query probe** — sweep a point through the space and watch nearby regions light up by distance.
- **A training morph** — drag the checkpoint slider to watch the field evolve from an
  undifferentiated blob into sharpened, well-separated representations.
- **A "nebula" isosurface** — optional marching-cubes shell over the splatted density field.

## Why vtk.js (the ParaView connection)

ParaView is built on **VTK** (the Visualization Toolkit, by Kitware). **vtk.js** is Kitware's
WebGL port of that same toolkit — it's what ParaView Glance uses to render in the browser.
So this keeps real ParaView DNA (scientific fields, isosurfaces, scalar coloring) while
shedding the desktop install entirely.

The whole app is **100% client-side**: static HTML/CSS/JS, vtk.js loaded from a pinned CDN,
no server, no build step, no local dependencies. That's what makes it deploy cleanly to
GitHub Pages and run anywhere.

## Architecture

```
index.html            UI shell + control panel; loads vtk.js (pinned) then the app
styles/observatory.css deep-space glassmorphism chrome
src/palette.js        categorical concept colors + viridis/inferno/plasma colormaps
src/latent.js         deterministic Gaussian-mixture latent field + training-morph model
src/app.js            vtk.js scene: point cloud, density splat + marching-cubes isosurface,
                      direct-RGB coloring, query probe, UI wiring, auto-orbit
```

### Data model

The latent field is a seeded Gaussian mixture of `K` concept clusters. A `checkpoint`
parameter in `[0, 1]` interpolates cluster centers from a collapsed origin blob to a
converged spherical arrangement and shrinks intra-cluster spread — a faithful, reproducible
analogue of representations separating during training. Swapping in **real** embeddings is a
drop-in: reduce them to 3D (PCA/UMAP) and hand `app.js` a `Float32Array` of positions plus a
concept index. That producer-side pipeline is the natural next module.

## Controls

| Control | What it does |
|---|---|
| **Checkpoint** | Morphs the field from start-of-training to converged |
| **Embeddings** | Point budget (8k / 20k / 40k) |
| **Coloring → concept** | Categorical atlas coloring |
| **Coloring → query distance** | Color by distance to a movable probe; pick a colormap |
| **Probe X/Y/Z** | Move the query point through the space |
| **Point size / Opacity** | Tune the glow |
| **Nebula isosurface** | Marching-cubes density shell (+ iso level) |
| **Auto-orbit** | Cinematic rotation; shows live FPS |

Mouse: drag to rotate, scroll to zoom, right-drag to pan (vtk.js trackball).

## Develop locally (optional)

No build required. Any static server works:

```bash
npx serve .
# or
python -m http.server
```

## Roadmap

- Embedding ingestion module (CSV/Parquet/HF datasets → 3D via PCA/UMAP, in a worker).
- Real per-checkpoint sequences loaded as a time series (true training playback).
- glTF export of a captured scene as a shareable digital asset.
- Attention-as-flow and loss-landscape scenes (sibling visualizations).

## Authorship

Built by **Claude (Opus 4.8)** at Angela Hudson's ([DaCameraGirl](https://github.com/DaCameraGirl))
invitation. Angela sets the direction and approves; the implementation is mine.

## License

© 2026 Angela Hudson (DaCameraGirl). All rights reserved. See [LICENSE](LICENSE).
