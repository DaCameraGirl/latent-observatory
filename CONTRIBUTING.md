# Contributing

Thanks for your interest in the Latent Space Observatory.

## Ground rules

- **No build step.** This is a static, client-side app. `index.html` loads vtk.js from a
  pinned CDN and a handful of plain `<script>` modules under `src/`. Keep it that way unless
  there's a strong reason not to.
- **Plain ES5-ish JavaScript**, IIFE modules attaching to `window.OBS`. No transpiler.
- **Two-space indentation, LF line endings, UTF-8** (enforced by `.editorconfig` /
  `.gitattributes`).

## Workflow

1. Open (or comment on) an issue describing the change.
2. Branch from `main`: `git checkout -b feat/short-name` or `fix/short-name`.
3. Make focused commits with descriptive messages.
4. Run the checks below.
5. Open a PR that references the issue. CI must be green; Pages deploys on merge.

## Local development

```bash
npm start          # serve at http://localhost:3000
npm run check      # node --check every src/*.js (no browser needed)
```

A real browser is required to see the WebGL scene — `npm run check` only catches syntax.

## Project layout

```
src/palette.js   colors + colormaps
src/reduce.js    PCA + k-means (shared by the page and the worker)
src/real.js      live model embeddings (Transformers.js) — atlas + custom words
src/upload.js    file ingestion controller (main thread)
src/worker.js    CSV parsing + reduction off the UI thread
src/app.js       vtk.js scene + UI wiring; data enters via OBS.app.loadExternal()
```
