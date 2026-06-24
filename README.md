<p align="center">
  <img src="docs/assets/readme-hero.svg" alt="Latent Space Observatory — fly through embedding space in 3D" width="100%"/>
</p>

# Latent Space Observatory

<p align="center">
  <a href="https://dacameragirl.github.io/latent-observatory/"><img src="https://img.shields.io/badge/🌐_Live_Demo-4fd6e0?style=for-the-badge" alt="Live demo"/></a>
  <a href="https://dacameragirl.github.io/links/"><img src="https://img.shields.io/badge/🔗_Project_Hub-131a26?style=for-the-badge" alt="Project hub"/></a>
  <img src="https://img.shields.io/badge/vtk.js-36.2-131a26?style=for-the-badge" alt="vtk.js"/>
  <img src="https://img.shields.io/badge/Transformers.js-2.17-131a26?style=for-the-badge" alt="Transformers.js"/>
  <img src="https://img.shields.io/badge/all--MiniLM--L6--v2-live-0f131a?style=for-the-badge" alt="all-MiniLM-L6-v2"/>
  <img src="https://img.shields.io/badge/No_build_step-4fd6e0?style=for-the-badge" alt="No build step"/>
</p>

**Walk through the internal geometry of a neural network's embedding space — as a place you can fly through.**

AI research generates enormous high-dimensional data — embeddings, activations, training
trajectories — and almost everyone looks at it through flat 2D matplotlib plots. This tool
does the opposite: it renders an embedding space as a navigable 3D world built on the same
toolkit ParaView is made of.

> **Status:** launches straight into **live** `all-MiniLM-L6-v2` embeddings in your browser.
> No API key, no server, no install. First model load is ~25 MB and caches after that.

## Repo vs live

| What | URL |
|---|---|
| **GitHub repo** | [github.com/DaCameraGirl/latent-observatory](https://github.com/DaCameraGirl/latent-observatory) |
| **Live demo** | [dacameragirl.github.io/latent-observatory](https://dacameragirl.github.io/latent-observatory/) |
| **Project hub** | [dacameragirl.github.io/links](https://dacameragirl.github.io/links/) (AI tools) |

## Highlights

| Feature | What it does |
|---|---|
| **Concept atlas** | 12 curated categories × 12 words each — see how MiniLM actually clusters meaning in 3D |
| **Your words** | Paste lines, embed live, auto-cluster with k-means in the PCA projection |
| **Query probe** | Sweep a point through space; color by distance with viridis / inferno / plasma |
| **Nebula isosurface** | Optional marching-cubes shell over the splatted density field |
| **Auto-orbit** | Cinematic rotation with live FPS in the HUD |
| **100% client-side** | Static HTML/CSS/JS, vtk.js from a pinned CDN, Transformers.js dynamic import |

## Why vtk.js (the ParaView connection)

ParaView is built on **VTK** (the Visualization Toolkit, by Kitware). **vtk.js** is Kitware's
WebGL port of that same toolkit — it's what ParaView Glance uses to render in the browser.
So this keeps real ParaView DNA (scientific fields, isosurfaces, scalar coloring) while
shedding the desktop install entirely.

## Architecture

```text
index.html            UI shell + control panel; loads vtk.js (pinned) then the app
styles/observatory.css deep-space glassmorphism chrome
src/palette.js        categorical concept colors + viridis/inferno/plasma colormaps
src/latent.js         density-field helper (legacy synthetic generator; scene is real-first)
src/real.js           Transformers.js embeddings, PCA-to-3D, atlas + custom-word paths
src/app.js            vtk.js scene: point cloud, density splat, marching-cubes isosurface,
                      direct-RGB coloring, query probe, UI wiring, auto-orbit
docs/assets/          README hero SVG and other repo assets
.github/workflows/    GitHub Pages deploy
```

### Real embeddings

On launch, the app lazy-loads
[Transformers.js](https://github.com/xenova/transformers.js) and the
`Xenova/all-MiniLM-L6-v2` sentence-embedding model (~25 MB, cached after first load),
computes genuine 384-d vectors entirely client-side, and reduces them to 3D with a
power-iteration **PCA**. The curated concept atlas keeps the 12-category coloring so you can
judge how a real model clusters meaning; pasted custom words are colored by **k-means**
clusters discovered in the projection.

## Controls

| Control | What it does |
|---|---|
| **Reload concept atlas** | Re-embed the curated 12×12 vocabulary |
| **Your words → Embed** | Paste lines (one per line) and cluster in 3D |
| **Coloring → concept** | Categorical atlas coloring |
| **Coloring → query distance** | Color by distance to a movable probe; pick a colormap |
| **Probe X/Y/Z** | Move the query point through the space |
| **Point size / Opacity** | Tune the glow |
| **Nebula isosurface** | Marching-cubes density shell (+ iso level) |
| **Auto-orbit** | Cinematic rotation; shows live FPS |

Mouse: drag to rotate, scroll to zoom, right-drag to pan (vtk.js trackball).

## Develop locally

No build required. Any static server works:

```bash
npm start
# or
npx serve .
# or
python -m http.server
```

Open http://localhost:3000 (or whatever port your server prints).

Syntax check (no browser needed):

```bash
npm run check
```

## Roadmap

- Embedding ingestion module (CSV/Parquet/HF datasets → 3D via PCA/UMAP, in a worker).
- Real per-checkpoint sequences loaded as a time series (true training playback).
- glTF export of a captured scene as a shareable digital asset.
- Attention-as-flow and loss-landscape scenes (sibling visualizations).

## Contributors

- **Angela Hudson** ([DaCameraGirl](https://github.com/DaCameraGirl)) — product direction, testing, hub placement
- **Claude** — core app, vtk.js scene, real-embeddings mode, GitHub workflow

## License

© 2026 Angela Hudson (DaCameraGirl). All rights reserved. See [LICENSE](LICENSE).