<p align="center">
  <img src="docs/assets/i18n/ja/readme-hero.svg" alt="Latent Space Observatory — 3D で埋め込み空間を飛び回る" width="100%"/>
</p>

# 潜在空間オブザーバトリー

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

<p align="center">
  <a href="https://dacameragirl.github.io/latent-observatory/"><img src="https://img.shields.io/badge/🌐_ライブアプリ-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="ライブアプリ"/></a>
  <a href="https://dacameragirl.github.io/links/"><img src="https://img.shields.io/badge/🔗_プロジェクトハブ-131a26?style=for-the-badge&labelColor=0f131a" alt="プロジェクトハブ"/></a>
  <a href="https://dacameragirl.github.io/solar-planets/"><img src="https://img.shields.io/badge/🪐_ソーラープラネッツ-131a26?style=for-the-badge&labelColor=0f131a" alt="ソーラープラネッツ"/></a>
  <img src="https://img.shields.io/badge/vtk.js-36.2-131a26?style=for-the-badge&labelColor=0f131a" alt="vtk.js"/>
  <img src="https://img.shields.io/badge/Transformers.js-2.17-131a26?style=for-the-badge&labelColor=0f131a" alt="Transformers.js"/>
  <img src="https://img.shields.io/badge/all--MiniLM--L6--v2-live-0f131a?style=for-the-badge&labelColor=05060d" alt="all-MiniLM-L6-v2"/>
  <img src="https://img.shields.io/badge/ビルド不要-4fd6e0?style=for-the-badge&labelColor=0f131a" alt="ビルド不要"/>
</p>

<p align="center">
  <img src="docs/assets/i18n/ja/embedding-orbit.svg" alt="アニメーション潜在空間 — 概念クラスタ、クエリプローブ、自動オービット" width="560"/>
</p>

**実際の埋め込み空間を 3D で探索 — 独自のベクトルをアップロードするか、ブラウザで動作するモデルでテキストをライブ埋め込み。**

AI 研究は膨大な高次元データ — 埋め込み、アクティベーション、アテンションマップ — を生成しますが、ほとんどの人は平面の 2D プロットでしか見ていません。このツールは埋め込み空間をナビゲート可能な 3D 世界として描画し、ParaView と同じツールキットで構築されています。起動時に **ライブ** `all-MiniLM-L6-v2` コンセプトアトラスを読み込みます（初回 ~25 MB）。独自の単語の埋め込みやファイルのアップロードも可能です。

<p align="center">
  <img src="docs/assets/i18n/ja/readme-status.svg" alt="ブラウザでのライブ MiniLM 埋め込み" width="100%"/>
</p>

<p align="center">
  <img src="docs/assets/i18n/ja/readme-divider.svg" alt="" width="100%"/>
</p>

## リポジトリとライブアプリ

| 内容 | URL |
|---|---|
| **ライブアプリ** | [dacameragirl.github.io/latent-observatory](https://dacameragirl.github.io/latent-observatory/) |
| **GitHub リポジトリ** | [github.com/DaCameraGirl/latent-observatory](https://github.com/DaCameraGirl/latent-observatory) |
| **プロジェクトハブ** | [dacameragirl.github.io/links](https://dacameragirl.github.io/links/)（AI ツール） |
| **ソーラープラネッツ** | [dacameragirl.github.io/solar-planets](https://dacameragirl.github.io/solar-planets/)（太陽系スピンオフ） |

<p align="center">
  <img src="docs/assets/i18n/ja/readme-divider.svg" alt="" width="100%"/>
</p>

## 3 つの実データパス

| パス | あなたの操作 | アプリの処理 |
|---|---|---|
| **概念アトラス** | アプリを開く | MiniLM を読み込み、キュレーション語彙を埋め込み、PCA → 3D、カテゴリで色分け |
| **あなたの言葉** | 行を貼り付け | ライブ埋め込み、PCA 投影で意味によるクラスタリング（k-means） |
| **あなたのファイル** | CSV/TSV をアップロード | **バックグラウンド worker** で解析・次元削減・クラスタリング後に描画 |

ファイルパスがこれをツールにし、おもちゃではなくしています。

### アップロード形式

ウィンドウにファイルをドロップするか **CSV / TSV を選択** を使用。worker が自動検出します：

- **`x,y,z` 列** → 3D 座標として直接使用。
- **多数の数値列** → 各行がベクトル、**PCA** で 3D に削減。
- **`text` 列** → モデルでライブ埋め込み後に削減。

オプションの **`label`/`category` 列** でカテゴリ別に色分け。なければ投影で発見されたクラスタで色分け。サンプルファイルは [`examples/sample_embeddings.csv`](examples/sample_embeddings.csv)。最大 20,000 行を描画（ライブテキスト埋め込みは 1,000 行）。HUD にファイル名、点数、検出内容を表示。

## ハイライト

| 機能 | 説明 |
|---|---|
| **あなたのファイル** | 座標・ベクトル・テキストの CSV/TSV をアップロード。バックグラウンド worker で削減 |
| **概念アトラス** | 12 のキュレーションカテゴリ — MiniLM が 3D で意味をどうクラスタするかを確認 |
| **あなたの言葉** | 行を貼り付け、ライブ埋め込み、PCA 投影で k-means 自動クラスタリング |
| **クエリプローブ** | 空間内の点をスイープ。viridis / inferno / plasma で距離による色分け |
| **ネビュラ等値面** | splat 密度場上のオプション marching-cubes シェル |
| **100% クライアント側** | 静的 HTML/CSS/JS、固定 CDN の vtk.js、Transformers.js 動的インポート |

<p align="center">
  <img src="docs/assets/i18n/ja/readme-divider.svg" alt="" width="100%"/>
</p>

## なぜ vtk.js か（ParaView との関係）

ParaView は **VTK**（Visualization Toolkit、Kitware 製）上に構築されています。**vtk.js** は Kitware による同ツールキットの WebGL 移植版 — ParaView Glance がブラウザ描画に使用しています。科学的フィールド、等値面、スカラー色分けといった本物の ParaView DNA を保ちながら、デスクトップインストールは不要です。

## アーキテクチャ

```text
index.html             UI シェル + コントロールパネル。vtk.js（固定）読み込み後にアプリモジュール
styles/observatory.css ディープスペースのグラスモーフィズム UI
src/palette.js         カテゴリ色 + viridis/inferno/plasma カラーマップ
src/reduce.js          PCA + k-means、ページと worker で共有（self にアタッチ）
src/real.js            ライブモデル埋め込み（Transformers.js）：アトラス + カスタム語
src/upload.js          ファイル取り込みコントローラ（ファイル選択 + ドラッグ＆ドロップ）
src/worker.js          CSV/TSV 解析 + UI スレッド外での次元削減
src/app.js             vtk.js シーン。全データは OBS.app.loadExternal(pos, colors, meta) 経由
docs/assets/           README ヒーロー、アニメーション軌道、ダークセクションアート
.github/workflows/     CI（構文チェック）+ GitHub Pages デプロイ
```

<p align="center">
  <img src="docs/assets/i18n/ja/readme-divider.svg" alt="" width="100%"/>
</p>

## コントロール

| コントロール | 説明 |
|---|---|
| **あなたのデータ → CSV / TSV を選択** | 独自の埋め込みやテキストをアップロードして探索 |
| **概念アトラスを再読み込み** | キュレーション 12×12 語彙を再埋め込み |
| **あなたの言葉 → 埋め込み** | 行を貼り付けて 3D でクラスタリング |
| **色分け → グループ別** | データ付属のカテゴリ色分け |
| **色分け → クエリ距離** | 移動可能なプローブへの距離で色分け。カラーマップを選択 |
| **プローブ X/Y/Z** | クエリ点を空間内で移動 |
| **点サイズ / 不透明度** | グローを調整 |
| **ネビュラ等値面** | marching-cubes 密度シェル（+ iso レベル） |
| **自動オービット** | シネマティック回転。ライブ FPS を表示 |

マウス：ドラッグで回転、スクロールでズーム、右ドラッグでパン（vtk.js トラックボール）。

<p align="center">
  <img src="docs/assets/i18n/ja/readme-divider.svg" alt="" width="100%"/>
</p>

## ローカル開発

ビルド不要 — [CONTRIBUTING.md](CONTRIBUTING.md) を参照。

```bash
npm start          # http://localhost:3000 で配信
npm run check      # 各 src/*.js に node --check（ブラウザ不要）
```

## ロードマップ

- 非線形構造のため PCA に加えて UMAP オプション。
- Parquet 取り込みと任意スキーマ用の列マッピング UI。
- キャプチャシーンの glTF エクスポート。カメラ/プローブ状態埋め込みの共有可能 URL。
- チェックポイントごとの埋め込みシーケンスを実際の学習再生タイムラインとして。

## コントリビューター

- **Angela Hudson** ([DaCameraGirl](https://github.com/DaCameraGirl)) — プロダクト方向性、テスト、ハブ配置
- **Claude** — コアアプリ、vtk.js シーン、実埋め込みモード、アップロードパイプライン、GitHub ワークフロー

## ライセンス

© 2026 Angela Hudson (DaCameraGirl)。無断転載を禁じます。[LICENSE](LICENSE) を参照。