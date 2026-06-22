import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';

/** 地図の初期表示位置。 */
const INITIAL_CENTER: [number, number] = [138.48936, 35.00936];
const INITIAL_ZOOM = 12.7;

/**
 * MapLibre の地図インスタンスを生成し、各種コントロールを追加して返す。
 * 出典表記（AttributionControl）は標高ソースに応じて切り替えるため、
 * ここでは無効化し {@link createAttribution} 側で管理する。
 */
export function createMap(): maplibregl.Map {
  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);

  const map = new maplibregl.Map({
    container: 'map',
    style: `${import.meta.env.BASE_URL}std.json`,
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
    maxPitch: 85,
    hash: true,
    attributionControl: false,
  });

  map.addControl(new maplibregl.NavigationControl());
  map.addControl(new maplibregl.FullscreenControl());
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: false },
      fitBoundsOptions: { maxZoom: 18 },
      trackUserLocation: true,
      showUserLocation: true,
    }),
  );
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 200, unit: 'metric' }));
  map.addControl(new maplibregl.TerrainControl({ source: 'elevation', exaggeration: 1 }));

  return map;
}

/** 空（大気）の表現を設定する。`map.on('load')` 後に呼ぶこと。 */
export function applySky(map: maplibregl.Map): void {
  map.setSky({
    'sky-color': '#199EF3',
    'sky-horizon-blend': 0.7,
    'horizon-color': '#f0f8ff',
    'horizon-fog-blend': 0.8,
    'fog-color': '#2c7fb8',
    'fog-ground-blend': 0.9,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 12, 0],
  });
}
