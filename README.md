# 海面上昇シミュレーション on MapLibre GL JS

標高タイル（Terrain-RGB）を用いて、指定した海面高さ以下の地域を青く塗りつぶす海面上昇シミュレーターです。MapLibre GL JS の `color-relief` レイヤーと 3D 地形表示を組み合わせています。

> ⚠️ 本シミュレータは地形データで一定の高さ以下の場所を青く塗りつぶすだけのものであり、ハザードマップとは異なります。堤防等による防災対策や土砂の堆積等は考慮されていません。実際の洪水や津波発生時の危険性は各自治体が公表するハザードマップでご確認ください。

## Public Website

https://shiwaku.github.io/japan-sea-level-rise-map-on-maplibre/

## 機能

- 海面高さスライダー（0〜50m）による浸水域のリアルタイム表示
- 標高タイルソースの切り替え（地理院 / 産総研）
- 3D 地形表示（TerrainControl）と空（大気）表現
- 現在地表示・全画面・スケール・ナビゲーションコントロール

## 開発

Vite + TypeScript で構成しています。

```bash
npm install      # 依存のインストール
npm run dev      # 開発サーバー（http://localhost:5173/japan-sea-level-rise-map-on-maplibre/）
npm run build    # 型チェック（tsc）＋本番ビルド（dist/ に出力）
npm run preview  # ビルド成果物のローカルプレビュー
npm run lint     # ESLint
npm run format   # Prettier で整形
```

### 構成

- `index.html` … エントリ（UIの骨組みのみ。標高ソースの選択肢は実行時に生成）
- `src/` … TypeScript ソース
  - `main.ts` … 起動処理（地図生成 → レイヤー追加 → UI接続）
  - `config/elevation-sources.ts` … 標高タイルソース（URL・出典）の定義
  - `map/create-map.ts` … 地図インスタンスとコントロールの生成、空の設定
  - `layers/sea-level.ts` … 標高ソース・海面塗りつぶしレイヤー・地形の追加と更新
  - `ui/attribution.ts` … ソースに応じた出典表記の差し替え
  - `ui/control-panel.ts` … スライダー・ソース選択・免責事項の接続
  - `style.css` … スタイル
- `public/` … 静的アセット（`std.json`）

### デプロイ

`main` ブランチへの push で GitHub Actions（`.github/workflows/deploy.yml`）が `npm run build` を実行し、GitHub Pages に公開します。GitHub リポジトリの Settings → Pages で「Source」を **GitHub Actions** に設定してください。
公開URLは `https://shiwaku.github.io/japan-sea-level-rise-map-on-maplibre/` で、`vite.config.ts` の `base` がこのパスに対応しています。

## データ出典・ライセンス

### 標高データ

- 国土地理院 標高タイル（DEM10B / Terrain-RGB）
  - 出典：[国土地理院 標高タイル](https://maps.gsi.go.jp/development/ichiran.html#dem)
  - ライセンス：[国土地理院コンテンツ利用規約](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html)に従い、出典明示により、転載も含め使用可
- 産業技術総合研究所 シームレス標高タイル（統合DEM）
  - 出典：https://tiles.gsj.jp/tiles/elev/tiles.html
  - ライセンス：「[産総研地質調査総合センターウェブサイト利用規約](https://www.gsj.jp/license/license.html)」に従い、商用を含む自由な二次利用が可能です。この規約はCC BY 4.0と互換です。

### 背景地図

- 国土地理院 最適化ベクトルタイル
  - 出典：https://github.com/gsi-cyberjapan/optimal_bvmap
  - ライセンス：[国土地理院コンテンツ利用規約](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html)に従い、出典明示により、転載も含め使用可
- 国土地理院 地理院タイル（陰影起伏図）
  - 出典：https://maps.gsi.go.jp/development/ichiran.html#hillshademap
  - ライセンス：[国土地理院コンテンツ利用規約](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html)に従い、出典明示により、転載も含め使用可

## ライセンス

[MIT License](LICENSE)
