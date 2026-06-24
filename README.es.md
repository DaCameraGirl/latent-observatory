<p align="center">
  <img src="docs/assets/readme-hero.svg" alt="Latent Space Observatory — recorre el espacio de embeddings en 3D" width="100%"/>
</p>

# Observatorio del Espacio Latente

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

<p align="center">
  <a href="https://dacameragirl.github.io/latent-observatory/"><img src="https://img.shields.io/badge/🌐_App_en_vivo-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="App en vivo"/></a>
  <a href="https://dacameragirl.github.io/links/"><img src="https://img.shields.io/badge/🔗_Hub_del_proyecto-131a26?style=for-the-badge&labelColor=0f131a" alt="Hub del proyecto"/></a>
  <img src="https://img.shields.io/badge/vtk.js-36.2-131a26?style=for-the-badge&labelColor=0f131a" alt="vtk.js"/>
  <img src="https://img.shields.io/badge/Transformers.js-2.17-131a26?style=for-the-badge&labelColor=0f131a" alt="Transformers.js"/>
  <img src="https://img.shields.io/badge/all--MiniLM--L6--v2-live-0f131a?style=for-the-badge&labelColor=05060d" alt="all-MiniLM-L6-v2"/>
  <img src="https://img.shields.io/badge/Sin_paso_de_compilación-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="Sin paso de compilación"/>
</p>

<p align="center">
  <img src="docs/assets/embedding-orbit.svg" alt="Espacio latente animado — clústeres de conceptos, sonda de consulta, órbita automática" width="560"/>
</p>

**Explora espacios de embeddings reales en 3D — sube tus propios vectores o incrusta texto en vivo con un modelo que se ejecuta en tu navegador.**

La investigación en IA genera enormes volúmenes de datos de alta dimensión — embeddings, activaciones, mapas de atención — y casi todo el mundo los mira a través de gráficos planos en 2D. Esta herramienta renderiza un espacio de embeddings como un mundo 3D navegable, construido con el mismo conjunto de herramientas que impulsa ParaView. Arranca directamente con embeddings **en vivo** de `all-MiniLM-L6-v2`; no hay demo sintética.

<p align="center">
  <img src="docs/assets/readme-status.svg" alt="Embeddings MiniLM en vivo en tu navegador" width="100%"/>
</p>

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Repositorio vs. app en vivo

| Qué | URL |
|---|---|
| **App en vivo** | [dacameragirl.github.io/latent-observatory](https://dacameragirl.github.io/latent-observatory/) |
| **Repositorio GitHub** | [github.com/DaCameraGirl/latent-observatory](https://github.com/DaCameraGirl/latent-observatory) |
| **Hub del proyecto** | [dacameragirl.github.io/links](https://dacameragirl.github.io/links/) (herramientas de IA) |

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Tres rutas de datos reales

| Ruta | Tú haces | La app hace |
|---|---|---|
| **Atlas de conceptos** | Abrir la app | Carga MiniLM, incrusta un vocabulario curado, PCA → 3D, coloreado por categoría |
| **Tus palabras** | Pegar líneas | Incrusta en vivo, agrupa por significado (k-means) en la proyección PCA |
| **Tu archivo** | Subir CSV/TSV | Analiza, reduce y agrupa **en un worker en segundo plano**, luego renderiza |

La ruta de archivo es lo que la convierte en herramienta, no en juguete.

### Formatos de carga

Arrastra un archivo a la ventana o usa **Elegir CSV / TSV**. El worker detecta automáticamente:

- **Columnas `x,y,z`** → se usan directamente como coordenadas 3D.
- **Muchas columnas numéricas** → cada fila es un vector, reducido a 3D con **PCA**.
- **Una columna `text`** → se incrusta en vivo con el modelo y luego se reduce.

Una columna opcional **`label`/`category`** colorea los puntos por categoría; de lo contrario, los puntos se colorean según los clústeres descubiertos en la proyección. Un archivo de ejemplo está en [`examples/sample_embeddings.csv`](examples/sample_embeddings.csv). Hasta 20.000 filas se renderizan (1.000 para incrustación de texto en vivo); el HUD muestra el nombre del archivo, el recuento de puntos y lo detectado.

## Funciones destacadas

| Función | Qué hace |
|---|---|
| **Tu archivo** | Sube CSV/TSV de coordenadas, vectores o texto; reducido en un worker en segundo plano |
| **Atlas de conceptos** | 12 categorías curadas — observa cómo MiniLM agrupa el significado en 3D |
| **Tus palabras** | Pega líneas, incrusta en vivo, agrupa automáticamente con k-means en la proyección PCA |
| **Sonda de consulta** | Recorre un punto por el espacio; colorea por distancia con viridis / inferno / plasma |
| **Isosuperficie nebulosa** | Carcasa opcional de marching-cubes sobre el campo de densidad splat |
| **100% en el cliente** | HTML/CSS/JS estático, vtk.js desde un CDN fijado, importación dinámica de Transformers.js |

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Por qué vtk.js (la conexión con ParaView)

ParaView está construido sobre **VTK** (Visualization Toolkit, de Kitware). **vtk.js** es el puerto WebGL de Kitware del mismo conjunto de herramientas — es lo que usa ParaView Glance para renderizar en el navegador. Así se conserva el ADN real de ParaView (campos científicos, isosuperficies, coloreado escalar) sin necesidad de instalación de escritorio.

## Arquitectura

```text
index.html             Shell de UI + panel de control; carga vtk.js (fijado) y luego los módulos de la app
styles/observatory.css cromado glassmorphism de espacio profundo
src/palette.js         colores categóricos + mapas de color viridis/inferno/plasma
src/reduce.js          PCA + k-means, compartido por la página y el worker (se adjunta a self)
src/real.js            embeddings en vivo del modelo (Transformers.js): atlas + palabras personalizadas
src/upload.js          controlador de ingesta de archivos (selector + arrastrar y soltar)
src/worker.js          análisis CSV/TSV + reducción de dimensionalidad fuera del hilo de UI
src/app.js             escena vtk.js; todos los datos entran vía OBS.app.loadExternal(pos, colors, meta)
docs/assets/           héroe del README, órbita animada, arte de secciones oscuras
.github/workflows/     CI (comprobación de sintaxis) + despliegue en GitHub Pages
```

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Controles

| Control | Qué hace |
|---|---|
| **Tus datos → Elegir CSV/TSV** | Sube y explora tus propios embeddings o texto |
| **Recargar atlas de conceptos** | Reincrusta el vocabulario curado 12×12 |
| **Tus palabras → Incrustar** | Pega líneas y agrúpalas en 3D |
| **Coloreado → por grupo** | Coloreado categórico suministrado con los datos |
| **Coloreado → distancia de consulta** | Colorea por distancia a una sonda móvil; elige un mapa de color |
| **Sonda X/Y/Z** | Mueve el punto de consulta por el espacio |
| **Tamaño de punto / Opacidad** | Ajusta el brillo |
| **Isosuperficie nebulosa** | Carcasa de densidad marching-cubes (+ nivel iso) |
| **Órbita automática** | Rotación cinematográfica; muestra FPS en vivo |

Ratón: arrastrar para rotar, rueda para zoom, clic derecho + arrastrar para desplazar (trackball de vtk.js).

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Desarrollo local

No se requiere compilación — consulta [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
npm start          # sirve en http://localhost:3000
npm run check      # node --check en cada src/*.js (sin navegador)
```

## Hoja de ruta

- Opción UMAP junto a PCA para estructura no lineal.
- Ingesta Parquet y una UI de mapeo de columnas para esquemas arbitrarios.
- Exportación glTF de una escena capturada; URL compartible con cámara/sonda embebidas.
- Secuencias de embeddings por checkpoint como línea de tiempo real de reproducción de entrenamiento.

## Colaboradores

- **Angela Hudson** ([DaCameraGirl](https://github.com/DaCameraGirl)) — dirección de producto, pruebas, ubicación en el hub
- **Claude** — app principal, escena vtk.js, modo de embeddings reales, pipeline de carga, flujo de trabajo en GitHub

## Licencia

© 2026 Angela Hudson (DaCameraGirl). Todos los derechos reservados. Consulta [LICENSE](LICENSE).