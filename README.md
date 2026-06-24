# Latent Space Observatory

**Explore real embedding spaces in 3D — upload your own vectors, or embed text live with a model running in your browser.**

AI research generates enormous high-dimensional data — embeddings, activations, attention
maps — and almost everyone looks at it through flat 2D plots. This tool renders an embedding
space as a navigable 3D world, built on the same toolkit ParaView is made of. It launches
straight into **live** `all-MiniLM-L6-v2` embeddings; there is no synthetic demo.

## Repo vs live

| What | URL |
|---|---|
| **Live app** | https://dacameragirl.github.io/latent-observatory/ |
| **GitHub repo** | https://github.com/DaCameraGirl/latent-observatory |
| **Project hub** | https://dacameragirl.github.io/links/ |

> First load fetches the model (~25 MB) and caches it. No API key, no server, no install.

## Three real data paths

| Path | You do | The app does |
|---|---|---|
| **Concept atlas** | Open the app | Loads MiniLM, embeds a curated vocabulary, PCA → 3D, colored by category |
| **Your words** | Paste lines | Embeds live, clusters by meaning (k-means) in the PCA projection |
| **Your file** | Upload CSV/TSV | Parses, reduces, and clusters **in a background worker**, then renders |

The file path is what makes it a tool, not a toy.

### Upload formats

Drop a file on the window or use **Choose CSV / TSV**. The worker auto-detects:

- **`x,y,z` columns** → used directly as 3D coordinates.
- **Many numeric columns** → each row is a vector, reduced to 3D with **PCA**.
- **A `text` column** → embedded live with the model, then reduced.

An optional **`label`/`category`** column colors points categorically; otherwise points are
colored by clusters discovered in the projection. A sample file lives in
[`examples/sample_embeddings.csv`](examples/sample_embeddings.csv). Up to 20,000 rows render
(1,000 for live text embedding); the HUD shows the file name, point count, and what was
detected.

## Why vtk.js (the ParaView connection)

ParaView is built on **VTK** (the Visualization Toolkit, by Kitware). **vtk.js** is Kitware's
WebGL port of that same toolkit — it's what ParaView Glance uses to render in the browser. So
this keeps real ParaView DNA (scientific fields, isosurfaces, scalar coloring) while shedding
the desktop install entirely. The whole app is **100% client-side**: static HTML/CSS/JS,
vtk.js from a pinned CDN, Transformers.js via dynamic import.

## Architecture

```text
index.html             UI shell + control panel; loads vtk.js (pinned) then the app modules
styles/observatory.css deep-space glassmorphism chrome
src/palette.js         categorical colors + viridis/inferno/plasma colormaps
src/reduce.js          PCA + k-means, shared by the page and the worker (attaches to self)
src/real.js            live model embeddings (Transformers.js): atlas + custom words
src/upload.js          file ingestion controller (file picker + drag-and-drop)
src/worker.js          CSV/TSV parsing + dimensionality reduction off the UI thread
src/app.js             vtk.js scene; all data enters via OBS.app.loadExternal(pos, colors, meta)
```

## Controls

| Control | What it does |
|---|---|
| **Your data → Choose CSV/TSV** | Upload and explore your own embeddings or text |
| **Reload concept atlas** | Re-embed the curated 12×12 vocabulary |
| **Your words → Embed** | Paste lines and cluster them in 3D |
| **Coloring → by group** | Categorical coloring supplied with the data |
| **Coloring → query distance** | Color by distance to a movable probe; pick a colormap |
| **Probe X/Y/Z** | Move the query point through the space |
| **Point size / Opacity** | Tune the glow |
| **Nebula isosurface** | Marching-cubes density shell (+ iso level) |
| **Auto-orbit** | Cinematic rotation; shows live FPS |

Mouse: drag to rotate, scroll to zoom, right-drag to pan (vtk.js trackball).

## Develop locally

No build required — see [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
npm start          # serve at http://localhost:3000
npm run check      # node --check every src/*.js (no browser needed)
```

## Roadmap

- UMAP option alongside PCA for non-linear structure.
- Parquet ingestion and column mapping UI for arbitrary schemas.
- glTF export of a captured scene; shareable URL with embedded camera/probe state.
- Per-checkpoint embedding sequences as a real training-playback timeline.

## Contributors

- **Angela Hudson** ([DaCameraGirl](https://github.com/DaCameraGirl)) — product direction, testing, hub placement
- **Claude** — core app, vtk.js scene, real-embeddings mode, upload pipeline, GitHub workflow

## License

© 2026 Angela Hudson (DaCameraGirl). All rights reserved. See [LICENSE](LICENSE).
