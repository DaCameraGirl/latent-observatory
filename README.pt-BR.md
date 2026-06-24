<p align="center">
  <img src="docs/assets/readme-hero.svg" alt="Latent Space Observatory — percorra o espaço de embeddings em 3D" width="100%"/>
</p>

# Observatório do Espaço Latente

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

<p align="center">
  <a href="https://dacameragirl.github.io/latent-observatory/"><img src="https://img.shields.io/badge/🌐_App_ao_vivo-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="App ao vivo"/></a>
  <a href="https://dacameragirl.github.io/links/"><img src="https://img.shields.io/badge/🔗_Hub_do_projeto-131a26?style=for-the-badge&labelColor=0f131a" alt="Hub do projeto"/></a>
  <img src="https://img.shields.io/badge/vtk.js-36.2-131a26?style=for-the-badge&labelColor=0f131a" alt="vtk.js"/>
  <img src="https://img.shields.io/badge/Transformers.js-2.17-131a26?style=for-the-badge&labelColor=0f131a" alt="Transformers.js"/>
  <img src="https://img.shields.io/badge/all--MiniLM--L6--v2-live-0f131a?style=for-the-badge&labelColor=05060d" alt="all-MiniLM-L6-v2"/>
  <img src="https://img.shields.io/badge/Sem_etapa_de_build-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="Sem etapa de build"/>
</p>

<p align="center">
  <img src="docs/assets/embedding-orbit.svg" alt="Espaço latente animado — clusters de conceitos, sonda de consulta, órbita automática" width="560"/>
</p>

**Explore espaços de embeddings reais em 3D — envie seus próprios vetores ou incorpore texto ao vivo com um modelo rodando no navegador.**

A pesquisa em IA gera enormes volumes de dados de alta dimensão — embeddings, ativações, mapas de atenção — e quase todo mundo os visualiza em gráficos planos 2D. Esta ferramenta renderiza um espaço de embeddings como um mundo 3D navegável, construído com o mesmo kit de ferramentas do ParaView. Ela inicia diretamente com embeddings **ao vivo** de `all-MiniLM-L6-v2`; não há demo sintética.

<p align="center">
  <img src="docs/assets/readme-status.svg" alt="Embeddings MiniLM ao vivo no seu navegador" width="100%"/>
</p>

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Repositório vs. app ao vivo

| O quê | URL |
|---|---|
| **App ao vivo** | [dacameragirl.github.io/latent-observatory](https://dacameragirl.github.io/latent-observatory/) |
| **Repositório GitHub** | [github.com/DaCameraGirl/latent-observatory](https://github.com/DaCameraGirl/latent-observatory) |
| **Hub do projeto** | [dacameragirl.github.io/links](https://dacameragirl.github.io/links/) (ferramentas de IA) |

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Três caminhos de dados reais

| Caminho | Você faz | O app faz |
|---|---|---|
| **Atlas de conceitos** | Abrir o app | Carrega MiniLM, incorpora vocabulário curado, PCA → 3D, colorido por categoria |
| **Suas palavras** | Colar linhas | Incorpora ao vivo, agrupa por significado (k-means) na projeção PCA |
| **Seu arquivo** | Enviar CSV/TSV | Analisa, reduz e agrupa **em um worker em segundo plano**, depois renderiza |

O caminho de arquivo é o que a torna uma ferramenta, não um brinquedo.

### Formatos de upload

Solte um arquivo na janela ou use **Escolher CSV / TSV**. O worker detecta automaticamente:

- **Colunas `x,y,z`** → usadas diretamente como coordenadas 3D.
- **Muitas colunas numéricas** → cada linha é um vetor, reduzido a 3D com **PCA**.
- **Uma coluna `text`** → incorporada ao vivo com o modelo e depois reduzida.

Uma coluna opcional **`label`/`category`** colore os pontos por categoria; caso contrário, os pontos são coloridos pelos clusters descobertos na projeção. Um arquivo de exemplo está em [`examples/sample_embeddings.csv`](examples/sample_embeddings.csv). Até 20.000 linhas são renderizadas (1.000 para incorporação de texto ao vivo); o HUD mostra o nome do arquivo, a contagem de pontos e o que foi detectado.

## Destaques

| Recurso | O que faz |
|---|---|
| **Seu arquivo** | Envie CSV/TSV de coordenadas, vetores ou texto; reduzido em worker em segundo plano |
| **Atlas de conceitos** | 12 categorias curadas — veja como o MiniLM agrupa significado em 3D |
| **Suas palavras** | Cole linhas, incorpore ao vivo, agrupe automaticamente com k-means na projeção PCA |
| **Sonda de consulta** | Percorra um ponto pelo espaço; cor por distância com viridis / inferno / plasma |
| **Isosuperfície nebulosa** | Casca opcional de marching-cubes sobre o campo de densidade splat |
| **100% no cliente** | HTML/CSS/JS estático, vtk.js de CDN fixo, importação dinâmica do Transformers.js |

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Por que vtk.js (a conexão com o ParaView)

O ParaView é construído sobre **VTK** (Visualization Toolkit, da Kitware). **vtk.js** é a porta WebGL da Kitware desse mesmo kit — é o que o ParaView Glance usa para renderizar no navegador. Assim, mantém o DNA real do ParaView (campos científicos, isosuperfícies, coloração escalar) sem instalação desktop.

## Arquitetura

```text
index.html             Shell da UI + painel de controle; carrega vtk.js (fixo) e depois os módulos do app
styles/observatory.css chrome glassmorphism de espaço profundo
src/palette.js         cores categóricas + mapas de cor viridis/inferno/plasma
src/reduce.js          PCA + k-means, compartilhado pela página e pelo worker (anexa a self)
src/real.js            embeddings ao vivo do modelo (Transformers.js): atlas + palavras personalizadas
src/upload.js          controlador de ingestão de arquivos (seletor + arrastar e soltar)
src/worker.js          análise CSV/TSV + redução de dimensionalidade fora da thread da UI
src/app.js             cena vtk.js; todos os dados entram via OBS.app.loadExternal(pos, colors, meta)
docs/assets/           hero do README, órbita animada, arte de seções escuras
.github/workflows/     CI (verificação de sintaxe) + deploy no GitHub Pages
```

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Controles

| Controle | O que faz |
|---|---|
| **Seus dados → Escolher CSV / TSV** | Envie e explore seus próprios embeddings ou texto |
| **Recarregar atlas de conceitos** | Reincorpora o vocabulário curado 12×12 |
| **Suas palavras → Incorporar** | Cole linhas e agrupe-as em 3D |
| **Coloração → por grupo** | Coloração categórica fornecida com os dados |
| **Coloração → distância da consulta** | Cor por distância a uma sonda móvel; escolha um mapa de cor |
| **Sonda X/Y/Z** | Mova o ponto de consulta pelo espaço |
| **Tamanho do ponto / Opacidade** | Ajuste o brilho |
| **Isosuperfície nebulosa** | Casca de densidade marching-cubes (+ nível iso) |
| **Órbita automática** | Rotação cinematográfica; mostra FPS ao vivo |

Mouse: arrastar para girar, rolar para zoom, botão direito + arrastar para mover (trackball vtk.js).

<p align="center">
  <img src="docs/assets/readme-divider.svg" alt="" width="100%"/>
</p>

## Desenvolvimento local

Sem build necessário — veja [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
npm start          # serve em http://localhost:3000
npm run check      # node --check em cada src/*.js (sem navegador)
```

## Roteiro

- Opção UMAP junto com PCA para estrutura não linear.
- Ingestão Parquet e UI de mapeamento de colunas para esquemas arbitrários.
- Exportação glTF de uma cena capturada; URL compartilhável com câmera/sonda embutidas.
- Sequências de embeddings por checkpoint como linha do tempo real de reprodução de treinamento.

## Colaboradores

- **Angela Hudson** ([DaCameraGirl](https://github.com/DaCameraGirl)) — direção de produto, testes, posicionamento no hub
- **Claude** — app principal, cena vtk.js, modo de embeddings reais, pipeline de upload, workflow no GitHub

## Licença

© 2026 Angela Hudson (DaCameraGirl). Todos os direitos reservados. Veja [LICENSE](LICENSE).