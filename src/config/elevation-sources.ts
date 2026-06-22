/** 標高（Terrain-RGB）タイルソースの定義。 */
export interface ElevationSource {
  /** 一意な識別子。 */
  id: string;
  /** UI のセレクタに表示するラベル。 */
  label: string;
  /** raster-dem タイルの URL テンプレート。 */
  url: string;
  /** このソースを使用しているときに表示する出典表記（HTML）。 */
  attribution: string;
}

/** 利用可能な標高タイルソース。先頭が初期値。 */
export const elevationSources: ElevationSource[] = [
  {
    id: 'gsi',
    label: '地理院 標高タイル (DEM10B)',
    url: 'https://xs489works.xsrv.jp/raster-tiles/gsi/gsi-dem-terrain-rgb/{z}/{x}/{y}.png',
    attribution:
      "<a href='https://maps.gsi.go.jp/development/ichiran.html#dem' target='_blank'>国土地理院 標高タイル</a>",
  },
  {
    id: 'gsj',
    label: '産総研 シームレス標高タイル (統合DEM)',
    url: 'https://gbank.gsj.jp/seamless/elev/terrainRGB257/mixed/{z}/{y}/{x}.png',
    attribution:
      "<a href='https://tiles.gsj.jp/tiles/elev/tiles.html#h_mixed' target='_blank'>産業技術総合研究所 シームレス標高タイル</a>",
  },
];

/** 出典表記の前に常に付けるリンク（X / GitHub）。 */
export const DEFAULT_LINKS =
  '（<a href="https://twitter.com/shi__works" target="_blank">X(旧Twitter)</a> | ' +
  '<a href="https://github.com/shiwaku/japan-sea-level-rise-map-on-maplibre" target="_blank">GitHub</a>）|';
