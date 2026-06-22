import maplibregl from 'maplibre-gl';
import type { ExpressionSpecification } from 'maplibre-gl';

/** 標高 raster-dem ソースの ID。 */
export const ELEVATION_SOURCE_ID = 'elevation';
/** 海面塗りつぶしレイヤーの ID。 */
export const SEA_LEVEL_LAYER_ID = 'sea-level';

/**
 * 指定した海面高さ `height`（m）以下を青く、それより上を透明にする
 * color-relief 用の色式を生成する。
 */
function seaLevelColor(height: number): ExpressionSpecification {
  return [
    'interpolate',
    ['linear'],
    ['elevation'],
    height,
    'rgba(0,0,152,0.5)',
    height + 0.01,
    'rgba(255,255,255,0)',
  ];
}

/**
 * 標高ソース・海面レイヤー・地形（terrain）を地図に追加する。
 * `map.on('load')` 後に一度だけ呼ぶ。
 */
export function addSeaLevelLayer(map: maplibregl.Map, tileUrl: string): void {
  map.addSource(ELEVATION_SOURCE_ID, {
    type: 'raster-dem',
    tiles: [tileUrl],
    tileSize: 256,
  });

  map.addLayer({
    id: SEA_LEVEL_LAYER_ID,
    type: 'color-relief',
    source: ELEVATION_SOURCE_ID,
    paint: {
      'color-relief-color': seaLevelColor(0),
      'color-relief-opacity': 1,
    },
  });

  map.setTerrain({ source: ELEVATION_SOURCE_ID, exaggeration: 1 });
}

/** 海面高さ（m）を更新する。 */
export function setSeaLevel(map: maplibregl.Map, height: number): void {
  map.setPaintProperty(SEA_LEVEL_LAYER_ID, 'color-relief-color', seaLevelColor(height));
}

/** 標高タイルソースの URL を差し替え、地形を再設定する。 */
export function setElevationTiles(map: maplibregl.Map, tileUrl: string): void {
  const source = map.getSource(ELEVATION_SOURCE_ID);
  if (source instanceof maplibregl.RasterDEMTileSource) {
    source.setTiles([tileUrl]);
  }
  map.setTerrain({ source: ELEVATION_SOURCE_ID, exaggeration: 1 });
}
