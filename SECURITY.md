# Security Policy

## Scope

This is a fully client-side static web app. It has **no backend, no database, and no API
keys**. Uploaded files are parsed and embedded entirely in your browser and are never sent to
any server. The only third-party network calls are:

- **vtk.js** from `unpkg.com` (pinned version) — rendering library.
- **Transformers.js + the model weights** from `cdn.jsdelivr.net` / the Hugging Face Hub —
  fetched on demand to run embeddings locally.

## Reporting a vulnerability

If you find a security issue (for example an XSS vector in how uploaded data is handled),
please open a GitHub issue marked **[security]**, or contact the maintainer privately. Please
do not include sensitive data in public issues.
